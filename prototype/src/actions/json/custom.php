<?php

if (!isset($_GET['game-action'])) {
    throw new LogicException('No custom game action specified');
}

$action = str_replace(' ', '', $_GET['game-action']);
if (strpos($action, '..') !== false) {
    throw new LogicException('Cannot use parent directory traversal');
}

$actionPath = ROOT_PATH . '/src/actions/json/custom/' . $action . '.php';
if (!file_exists($actionPath)) {
    throw new LogicException('Invalid custom game action');
}

require ROOT_PATH . '/src/snippets/update-game.php';

require $actionPath;