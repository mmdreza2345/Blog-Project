<?php
declare(strict_types=1);

require __DIR__ . '/../lib/http.php';
require __DIR__ . '/../lib/db.php';
require __DIR__ . '/../lib/accounts.php';
require __DIR__ . '/../lib/articles.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

$method = $_SERVER['REQUEST_METHOD'];
$path = rtrim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');
if ($method !== 'GET' && ($_SERVER['HTTP_X_BLOG_REQUEST'] ?? '') !== '1') {
    fail(403, 'Use the blog application to submit changes.');
}

try {
    switch ("$method $path") {
        case 'GET /api/session':
            $id = currentId(false);
            reply(['user' => $id === null ? null : profile($id)]);
        case 'POST /api/auth/register':
            register(readJson());
        case 'POST /api/auth/login':
            login(readJson());
        case 'POST /api/auth/logout':
            endSession();
            reply(['ok' => true]);
        case 'GET /api/me':
            reply(profile(currentId()));
        case 'PUT /api/me':
            updateProfile(currentId(), readJson());
        case 'PUT /api/me/password':
            changePassword(currentId(), readJson());
        case 'GET /api/categories':
            reply(query("SELECT c.id, c.name, c.image, COUNT(a.id) AS count FROM categories c
                LEFT JOIN articles a ON a.category_id=c.id AND a.status='Published'
                GROUP BY c.id, c.name, c.image ORDER BY c.id")->fetchAll());
        case 'GET /api/blogs':
            articleList();
        case 'GET /api/me/blogs':
            articleList(currentId());
        case 'POST /api/me/blogs':
            saveArticle(currentId(), null, readJson());
        case 'POST /api/contact':
            $input = readJson();
            query('INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
                [field($input, 'name', 100), emailField($input), field($input, 'subject', 200),
                 field($input, 'message', 8000)]);
            reply(['ok' => true], 201);
    }

    if (preg_match('~^/api/me/blogs/([1-9]\d*)$~D', $path, $match)) {
        $id = (int)$match[1];
        $owner = currentId();
        switch ($method) {
            case 'GET':
                reply(getArticle($id, $owner));
            case 'PUT':
                saveArticle($owner, $id, readJson());
            case 'DELETE':
                if (!query('DELETE FROM articles WHERE id=? AND author_id=?', [$id, $owner])->rowCount()) {
                    fail(404, 'Article not found.');
                }
                reply(['ok' => true]);
        }
    }
    if ($method === 'GET' && preg_match('~^/api/blogs/([1-9]\d*)$~D', $path, $match)) {
        reply(getArticle((int)$match[1]));
    }
    if (preg_match('~^/api/blogs/([1-9]\d*)/comments$~D', $path, $match)) {
        if ($method === 'GET') {
            listComments((int)$match[1]);
        }
        if ($method === 'POST') {
            addComment((int)$match[1], currentId(), readJson());
        }
    }
    fail(404, 'Page not found.');
} catch (PDOException $e) {
    if (($e->errorInfo[1] ?? null) === 1062) {
        fail(409, 'That email address is already registered.');
    }
    error_log('Blog database error: ' . $e->getCode());
    fail(503, 'The database is unavailable. Please try again.');
} catch (Throwable $e) {
    error_log('Blog error: ' . get_class($e) . ' at ' . basename($e->getFile()) . ':' . $e->getLine());
    fail(500, 'Unable to complete this request.');
}
