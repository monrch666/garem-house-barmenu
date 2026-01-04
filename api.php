<?php
header('Content-Type: application/json; charset=utf-8');

$MENU_FILE = __DIR__ . '/data/menu.json';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!file_exists($MENU_FILE)) {
        echo json_encode(new stdClass());
        exit;
    }

    echo file_get_contents($MENU_FILE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');

    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Empty body']);
        exit;
    }

    json_decode($input);
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON']);
        exit;
    }

    file_put_contents($MENU_FILE, $input, LOCK_EX);
    echo json_encode(['success' => true]);
    exit;
}

http_response_code(405);
