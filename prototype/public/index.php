<?php

define('ROOT_PATH', dirname(dirname(__FILE__)));

try {
    if (!isset($_GET['action'])) {
        $action = 'default';
    } else {
        $action = str_replace(' ', '', $_GET['action']);
        if (strpos($action, '..') !== false) {
            throw new LogicException('Cannot use parent directory traversal');
        }
    }

    $actionPath = ROOT_PATH . '/src/actions/html/' . $action . '.php';
    if (!file_exists($actionPath)) {
        throw new LogicException('Invalid action');
    }

    require ROOT_PATH . '/src/bootstrap.php';

    $template = require $actionPath;
} catch (Exception $e) {
    $template = require ROOT_PATH . '/src/actions/html/error.php';
}

require ROOT_PATH . '/templates/' . $template . '.phtml';