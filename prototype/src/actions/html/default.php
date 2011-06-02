<?php

if (empty($_SESSION['identity'])) {
    header('Location: /?action=auth');
    exit;
}

return 'default';