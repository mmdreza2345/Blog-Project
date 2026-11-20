<?php
declare(strict_types=1);

function reply(mixed $value, int $status = 200): never
{
    http_response_code($status);
    echo json_encode($value, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE);
    exit;
}

function fail(int $status, string $message): never
{
    reply(['error' => $message], $status);
}

function readJson(): array
{
    $type = explode(';', $_SERVER['CONTENT_TYPE'] ?? '')[0];
    if (strtolower(trim($type)) !== 'application/json') {
        fail(415, 'Send the form as JSON.');
    }
    $raw = file_get_contents('php://input', false, null, 0, 524289);
    if (strlen($raw) > 524288) {
        fail(413, 'The form is too large.');
    }
    try {
        $value = json_decode($raw, false, 16, JSON_THROW_ON_ERROR);
    } catch (JsonException) {
        fail(400, 'Invalid JSON.');
    }
    if (!$value instanceof stdClass) {
        fail(400, 'Expected a JSON object.');
    }
    return (array) $value;
}

function field(array $input, string $key, int $max, bool $required = true): string
{
    $value = $input[$key] ?? '';
    if (!is_string($value)) {
        fail(422, "Invalid $key.");
    }
    $value = trim($value);
    if (($required && $value === '') || preg_match_all('/./us', $value) > $max) {
        fail(422, "Check the $key field (maximum $max characters).");
    }
    return $value;
}

function emailField(array $input): string
{
    $email = strtolower(field($input, 'email', 254));
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        fail(422, 'Enter a valid email address.');
    }
    return $email;
}

function imageField(array $input, string $key): string
{
    $url = field($input, $key, 2048, false);
    if ($url === '' || preg_match('~^/images/[\w ()-]+\.(?:png|webp|jpe?g|gif)$~iD', $url)) {
        return $url;
    }
    if (!filter_var($url, FILTER_VALIDATE_URL) || strtolower(parse_url($url, PHP_URL_SCHEME) ?? '') !== 'https') {
        fail(422, 'Use an HTTPS image URL or a file under /images/.');
    }
    return $url;
}
