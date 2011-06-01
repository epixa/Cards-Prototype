<?php

define('ROOT_PATH', dirname(dirname(__FILE__)));

try {
    if (!isset($_GET['action'])) {
        throw new LogicException('No action specified');
    }

    $action = str_replace(' ', '', $_GET['action']);
    if (strpos($action, '..') !== false) {
        throw new LogicException('Cannot use parent directory traversal');
    }

    $actionPath = ROOT_PATH . '/src/actions/json/' . $action . '.php';
    if (!file_exists($actionPath)) {
        throw new LogicException('Invalid action');
    }

    require ROOT_PATH . '/src/bootstrap.php';

    $data = array('status' => 'success');
    require $actionPath;
} catch (Exception $e) {
    $data = array(
        'status' => 'error',
        'exception' => array(
            'message' => $e->getMessage(),
            'file' => $e->getFile(),
            'code' => $e->getCode(),
            'line' => $e->getLine(),
            'trace' => $e->getTraceAsString()
        ),
        'params' => $_POST + $_GET
    );
}

echo json_encode($data);