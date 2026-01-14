<?php
declare(strict_types=1);

// ===============================
// SECURITY HELPER FUNCTIONS
// For PHP 8+
// ===============================

// --- CONFIG ---
define('RATE_LIMIT_DIR', __DIR__ . '/tmp_rate');
define('CSRF_TOKEN_KEY', '_csrf_token');
define('ENCRYPTION_KEY', 'change_this_to_secure_env_key');

// --- SESSION SECURITY ---
function secure_session_start(): void {
    if (session_status() !== PHP_SESSION_ACTIVE) {
        $secure = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
        session_set_cookie_params([
            'lifetime' => 0,
            'path' => '/',
            'domain' => $_SERVER['HTTP_HOST'] ?? '',
            'secure' => $secure,
            'httponly' => true,
            'samesite' => 'Lax'
        ]);
        session_start();

        // Prevent session fixation
        if (!isset($_SESSION['_created'])) {
            session_regenerate_id(true);
            $_SESSION['_created'] = time();
        } elseif (time() - $_SESSION['_created'] > 900) { // 15 min
            session_regenerate_id(true);
            $_SESSION['_created'] = time();
        }
    }
}

// --- PASSWORDS ---
function hash_password(string $plain): string {
    return password_hash($plain, PASSWORD_DEFAULT);
}

function verify_password(string $plain, string $hash): bool {
    return password_verify($plain, $hash);
}

// --- RANDOM TOKEN ---
function random_token(int $length = 32): string {
    return bin2hex(random_bytes($length));
}

// --- CSRF PROTECTION ---
function csrf_token(): string {
    secure_session_start();
    if (empty($_SESSION[CSRF_TOKEN_KEY])) {
        $_SESSION[CSRF_TOKEN_KEY] = random_token(16);
    }
    return $_SESSION[CSRF_TOKEN_KEY];
}

function csrf_field(): string {
    return '<input type="hidden" name="csrf_token" value="' . e(csrf_token()) . '">';
}

function csrf_verify(?string $token): bool {
    secure_session_start();
    return isset($_SESSION[CSRF_TOKEN_KEY]) && hash_equals($_SESSION[CSRF_TOKEN_KEY], (string)$token);
}

// --- SANITIZATION ---
function sanitize(string $data): string {
    return filter_var(trim($data), FILTER_UNSAFE_RAW, FILTER_FLAG_STRIP_LOW | FILTER_FLAG_STRIP_HIGH);
}

function validate_email(string $email): bool {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

// --- SAFE OUTPUT ---
function e(string $text): string {
    return htmlspecialchars($text, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

// --- PDO SECURE QUERY ---
function pdo_connect(array $config): PDO {
    $pdo = new PDO(
        $config['dsn'],
        $config['user'] ?? '',
        $config['pass'] ?? '',
        $config['opts'] ?? [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
    return $pdo;
}

// --- RATE LIMIT ---
function rate_limit(string $key, int $limit = 10, int $seconds = 60): bool {
    if (!is_dir(RATE_LIMIT_DIR)) {
        mkdir(RATE_LIMIT_DIR, 0700, true);
    }

    $file = RATE_LIMIT_DIR . '/' . sha1($key) . '.json';
    $now = time();
    $requests = [];

    if (file_exists($file)) {
        $data = json_decode((string)file_get_contents($file), true);
        $requests = is_array($data['requests'] ?? []) ? $data['requests'] : [];
        $requests = array_filter($requests, fn($t) => $t + $seconds >= $now);
    }

    if (count($requests) >= $limit) {
        return false; // rate limit reached
    }

    $requests[] = $now;
    file_put_contents($file, json_encode(['requests' => $requests]), LOCK_EX);
    return true;
}

// --- FILE UPLOAD CHECK ---
function is_valid_upload(array $file, array $allowedMime = ['image/jpeg', 'image/png'], int $maxSize = 5_000_000): bool {
    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        return false;
    }

    if (($file['size'] ?? 0) > $maxSize) {
        return false;
    }

    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
    return in_array($mime, $allowedMime, true);
}

// --- ENCRYPTION / DECRYPTION ---
function encrypt_data(string $plain, string $key = ENCRYPTION_KEY): string {
    $iv = random_bytes(openssl_cipher_iv_length('aes-256-cbc'));
    $cipher = openssl_encrypt($plain, 'aes-256-cbc', $key, OPENSSL_RAW_DATA, $iv);
    return base64_encode($iv . $cipher);
}

function decrypt_data(string $encoded, string $key = ENCRYPTION_KEY): ?string {
    $raw = base64_decode($encoded, true);
    if ($raw === false) return null;
    $ivLen = openssl_cipher_iv_length('aes-256-cbc');
    $iv = substr($raw, 0, $ivLen);
    $cipher = substr($raw, $ivLen);
    return openssl_decrypt($cipher, 'aes-256-cbc', $key, OPENSSL_RAW_DATA, $iv) ?: null;
}



/*Function using leaflet js to determine the location*/
function getLatLong($city, $province, $country = "Philippines") {
    $search = urlencode("$city, $province, $country");
    $url = "https://nominatim.openstreetmap.org/search?q={$search}&format=json&limit=1";
    $options = [
        "http" => [
            "header" => "User-Agent: BranchRegistrationSystem/1.0\r\n"
        ]
    ];

    $context  = stream_context_create($options);
    $response = file_get_contents($url, false, $context);
    $data     = json_decode($response, true);

    if (!empty($data)) {
        return [
            'lat'  => $data[0]['lat'],
            'long' => $data[0]['lon']
        ];
    }

    return null;
}
