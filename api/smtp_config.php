<?php
/**
 * SMTP Configuration — Boomy Marketing
 * Fill in after domain + hosting setup
 *
 * Recommended: Gmail App Password OR SMTP from hosting provider
 */

define('SMTP_HOST',     'smtp.gmail.com');   // or your host SMTP
define('SMTP_PORT',     587);                // 587 = TLS, 465 = SSL
define('SMTP_USER',     '');                 // your email login
define('SMTP_PASS',     '');                 // App Password (Gmail) or SMTP password
define('SMTP_FROM',     'noreply@boomymarketing.com');
define('SMTP_FROM_NAME','Boomy Marketing');

/**
 * Simple SMTP sender — no dependencies required
 */
function smtp_send(string $to, string $subject, string $body, string $replyName = '', string $replyEmail = ''): bool {
    $sock = @fsockopen(SMTP_HOST, SMTP_PORT, $errno, $errstr, 10);
    if (!$sock) return false;

    $read = function() use ($sock) { return fgets($sock, 512); };
    $send = function(string $cmd) use ($sock) { fwrite($sock, $cmd . "\r\n"); };

    $read(); // 220 greeting
    $send('EHLO ' . gethostname());
    while ($line = $read()) { if (substr($line, 3, 1) === ' ') break; }

    $send('STARTTLS');
    $read();
    stream_socket_enable_crypto($sock, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);

    $send('EHLO ' . gethostname());
    while ($line = $read()) { if (substr($line, 3, 1) === ' ') break; }

    $send('AUTH LOGIN');
    $read();
    $send(base64_encode(SMTP_USER));
    $read();
    $send(base64_encode(SMTP_PASS));
    $r = $read();
    if (substr($r, 0, 3) !== '235') { fclose($sock); return false; }

    $send('MAIL FROM:<' . SMTP_FROM . '>');
    $read();
    $send('RCPT TO:<' . $to . '>');
    $read();
    $send('DATA');
    $read();

    $headers  = "From: " . SMTP_FROM_NAME . " <" . SMTP_FROM . ">\r\n";
    $headers .= "To: {$to}\r\n";
    $headers .= "Subject: {$subject}\r\n";
    if ($replyEmail) $headers .= "Reply-To: {$replyName} <{$replyEmail}>\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $headers .= "Date: " . date('r') . "\r\n";

    $send($headers . "\r\n" . $body . "\r\n.");
    $r = $read();
    $send('QUIT');
    fclose($sock);

    return substr($r, 0, 3) === '250';
}
