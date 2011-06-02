<?php

$error = null;
$name = '';
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    try {
        if (!isset($_POST['name'])) {
            throw new InvalidArgumentException('Give us your name, jerk!');
        }

        $name = trim($_POST['name']);
        if ($name == '') {
            throw new InvalidArgumentException('Give us your name, jerk!');
        }

        if (strlen($name) > 25) {
            throw new InvalidArgumentException("Less than 25 characters please.");
        }

        $identity = new stdClass();
        $identity->id = sha1(uniqid() . time());
        $identity->name = $name;
        
        $_SESSION['identity'] = $identity;
        header('Location: /');
        exit;
    } catch (InvalidArgumentException $e) {
        $error = $e->getMessage();
    }
}

return 'auth';