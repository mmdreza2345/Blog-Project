<?php
declare(strict_types=1);

function openSession(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    session_name('block_session');
    session_start([
        'use_only_cookies' => 1,
        'use_strict_mode' => 1,
        'cookie_path' => '/api',
        'cookie_httponly' => 1,
        'cookie_samesite' => 'Lax',
        'cookie_secure' => getenv('COOKIE_SECURE') === '1',
    ]);
}

function endSession(): void
{
    openSession();
    $_SESSION = [];
    setcookie(session_name(), '', [
        'expires' => time() - 3600,
        'path' => '/api',
        'httponly' => true,
        'samesite' => 'Lax',
        'secure' => getenv('COOKIE_SECURE') === '1',
    ]);
    session_destroy();
}

function profile(int $id): array
{
    return query(
        'SELECT id, name, email, username, bio, website, location, avatar, joined_at AS joinedAt
         FROM users WHERE id = ?', [$id]
    )->fetch();
}

function currentId(bool $required = true): ?int
{
    if (isset($_COOKIE['block_session'])) {
        openSession();
        if (isset($_SESSION['id'], $_SESSION['version'])) {
            $version = query('SELECT session_version FROM users WHERE id = ?', [$_SESSION['id']])->fetchColumn();
            if ($version !== false && (int)$version === $_SESSION['version']) {
                return $_SESSION['id'];
            }
            endSession();
        }
    }
    if ($required) {
        fail(401, 'Please sign in to continue.');
    }
    return null;
}

function newPassword(array $input, string $key): string
{
    $password = $input[$key] ?? null;
    if (!is_string($password) || preg_match_all('/./us', $password) < 8 ||
        strlen($password) > 72 || str_contains($password, "\0") || trim($password) === '') {
        fail(422, 'Use at least 8 characters and at most 72 bytes for your password.');
    }
    return password_hash($password, PASSWORD_DEFAULT);
}

function register(array $input): never
{
    $name = field($input, 'name', 100);
    $email = emailField($input);
    $hash = newPassword($input, 'password');
    query('INSERT INTO users (name, email, password_hash, joined_at) VALUES (?, ?, ?, CURRENT_DATE)',
        [$name, $email, $hash]);
    reply(['ok' => true], 201);
}

function login(array $input): never
{
    $email = emailField($input);
    $user = query('SELECT id, password_hash, session_version FROM users WHERE email = ?', [$email])->fetch();
    $password = $input['password'] ?? '';
    if (!$user || !is_string($password) || strlen($password) > 72 || str_contains($password, "\0") ||
        !password_verify($password, $user['password_hash'])) {
        fail(401, 'The email or password is incorrect.');
    }
    openSession();
    session_regenerate_id(true);
    $_SESSION = ['id' => (int)$user['id'], 'version' => (int)$user['session_version']];
    reply(profile($_SESSION['id']));
}

function updateProfile(int $id, array $input): never
{
    $website = field($input, 'website', 500, false);
    if ($website !== '' && (!filter_var($website, FILTER_VALIDATE_URL) ||
        !in_array(parse_url($website, PHP_URL_SCHEME), ['http', 'https'], true))) {
        fail(422, 'Enter a valid website URL including https://.');
    }
    query('UPDATE users SET name=?, email=?, username=?, bio=?, website=?, location=?, avatar=? WHERE id=?', [
        field($input, 'name', 100), emailField($input), field($input, 'username', 80, false),
        field($input, 'bio', 1000, false), $website, field($input, 'location', 120, false),
        imageField($input, 'avatar'), $id,
    ]);
    reply(profile($id));
}

function changePassword(int $id, array $input): never
{
    $oldHash = query('SELECT password_hash FROM users WHERE id=?', [$id])->fetchColumn();
    $current = $input['currentPassword'] ?? '';
    if (!is_string($current) || strlen($current) > 72 || str_contains($current, "\0") ||
        !password_verify($current, $oldHash)) {
        fail(422, 'The current password is incorrect.');
    }
    $hash = newPassword($input, 'newPassword');
    $version = $_SESSION['version'];
    $result = query('UPDATE users SET password_hash=?, session_version=session_version+1
                     WHERE id=? AND session_version=?', [$hash, $id, $version]);
    if (!$result->rowCount()) {
        fail(409, 'Your account changed. Sign in again.');
    }
    session_regenerate_id(true);
    $_SESSION['version'] = $version + 1;
    reply(['ok' => true]);
}
