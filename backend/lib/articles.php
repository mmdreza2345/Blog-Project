<?php
declare(strict_types=1);

const ARTICLE_SELECT = "SELECT a.id, a.title, a.content, a.excerpt, a.image, a.status, a.views, a.likes,
    DATE(a.published_at) AS publishedAt, u.id AS authorId, u.name AS author, u.avatar, c.name AS category,
    (SELECT COUNT(*) FROM comments m WHERE m.article_id=a.id) AS comments
    FROM articles a JOIN users u ON u.id=a.author_id JOIN categories c ON c.id=a.category_id";

function articleData(array $article): array
{
    $words = preg_split('/\s+/u', trim($article['content']), -1, PREG_SPLIT_NO_EMPTY);
    $article['readingTime'] = max(1, (int)ceil(count($words) / 200)) . ' min read';
    return $article;
}

function articleList(?int $owner = null): never
{
    $rows = $owner === null
        ? query(ARTICLE_SELECT . " WHERE a.status='Published' ORDER BY a.published_at DESC, a.id DESC")
        : query(ARTICLE_SELECT . ' WHERE a.author_id=? ORDER BY a.created_at DESC, a.id DESC', [$owner]);
    reply(array_map('articleData', $rows->fetchAll()));
}

function getArticle(int $id, ?int $owner = null): array
{
    $row = $owner === null
        ? query(ARTICLE_SELECT . " WHERE a.id=? AND a.status='Published'", [$id])->fetch()
        : query(ARTICLE_SELECT . ' WHERE a.id=? AND a.author_id=?', [$id, $owner])->fetch();
    if (!$row) {
        fail(404, 'Article not found.');
    }
    return articleData($row);
}

function saveArticle(int $owner, ?int $id, array $input): never
{
    if ($id !== null) {
        getArticle($id, $owner);
    }
    $title = field($input, 'title', 240);
    $content = field($input, 'content', 40000);
    $status = $input['status'] ?? 'Published';
    if (!in_array($status, ['Published', 'Draft'], true)) {
        fail(422, 'Choose Draft or Published.');
    }
    $category = query('SELECT id, image FROM categories WHERE name=?', [field($input, 'category', 80)])->fetch();
    if (!$category) {
        fail(422, 'Choose an existing category.');
    }
    $image = imageField($input, 'image') ?: $category['image'];
    $plain = preg_replace('/\s+/u', ' ', $content);
    preg_match('/^.{1,160}/us', $plain, $first);
    $excerpt = $first[0] . ($first[0] === $plain ? '' : '…');
    $values = [$title, $content, $excerpt, $image, $category['id'], $status];
    if ($id === null) {
        query("INSERT INTO articles (title, content, excerpt, image, category_id, status, author_id, published_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, IF(?='Published', NOW(), NULL))",
               [...$values, $owner, $status]);
        reply(getArticle((int)db()->lastInsertId(), $owner), 201);
    }
    query("UPDATE articles SET title=?, content=?, excerpt=?, image=?, category_id=?, status=?,
           published_at=IF(?='Published', COALESCE(published_at, NOW()), NULL)
           WHERE id=? AND author_id=?", [...$values, $status, $id, $owner]);
    reply(getArticle($id, $owner));
}

function listComments(int $id): never
{
    getArticle($id);
    reply(query('SELECT m.id, u.name AS author, m.body FROM comments m
        JOIN users u ON u.id=m.user_id WHERE m.article_id=? ORDER BY m.id', [$id])->fetchAll());
}

function addComment(int $id, int $user, array $input): never
{
    $body = field($input, 'body', 2000);
    $insert = query("INSERT INTO comments (article_id, user_id, body)
        SELECT id, ?, ? FROM articles WHERE id=? AND status='Published'", [$user, $body, $id]);
    if (!$insert->rowCount()) {
        fail(404, 'Article not found.');
    }
    reply(['id' => (int)db()->lastInsertId(), 'author' => profile($user)['name'], 'body' => $body], 201);
}
