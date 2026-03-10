<?php
/**
 * Boomy Marketing — Lead Form Handler
 * SMTP config: fill in smtp_config.php before going live
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://boomymarketing.com');
header('Access-Control-Allow-Methods: POST');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// ── Sanitize inputs ─────────────────────────────────────────────────
$name    = trim(strip_tags($_POST['name']    ?? ''));
$email   = trim(strip_tags($_POST['email']   ?? ''));
$phone   = trim(strip_tags($_POST['phone']   ?? ''));
$message = trim(strip_tags($_POST['message'] ?? ''));
$service = trim(strip_tags($_POST['service'] ?? ''));
$city    = trim(strip_tags($_POST['city']    ?? ''));

if (empty($name) || empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Name and valid email required']);
    exit;
}

// ── Config ──────────────────────────────────────────────────────────
$to      = 'boomymarketing.com@gmail.com';
$subject = 'NEW BOOMY LEAD' . ($service ? " — {$service}" : '') . ($city ? " in {$city}" : '');

$body  = "NEW LEAD from Boomy Marketing\n";
$body .= str_repeat('=', 40) . "\n\n";
$body .= "Name:    {$name}\n";
$body .= "Email:   {$email}\n";
$body .= "Phone:   " . ($phone ?: '—') . "\n";
$body .= "Service: " . ($service ?: '—') . "\n";
$body .= "City:    " . ($city ?: '—') . "\n\n";
$body .= "Message:\n{$message}\n\n";
$body .= str_repeat('=', 40) . "\n";
$body .= "Sent from: boomymarketing.com/local/{$city}/{$service}\n";
$body .= "Time: " . date('Y-m-d H:i:s T') . "\n";

// ── SMTP (configure after domain setup) ─────────────────────────────
if (file_exists(__DIR__ . '/smtp_config.php')) {
    require __DIR__ . '/smtp_config.php';
    $sent = smtp_send($to, $subject, $body, $name, $email);
} else {
    // Fallback: PHP mail() — works on most shared hosts
    $headers  = "From: Boomy Lead <noreply@boomymarketing.com>\r\n";
    $headers .= "Reply-To: {$name} <{$email}>\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
    $sent = mail($to, $subject, $body, $headers);
}

if ($sent) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Mail send failed']);
}
