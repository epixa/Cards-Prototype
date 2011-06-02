<?php

if (empty($_SESSION['identity'])) {
    header('Location: /?action=auth');
    exit;
}

if ($game && !isset($game->players->{$_SESSION['identity']->id})) {
    $game->players->{$_SESSION['identity']->id} = $_SESSION['identity'];
    file_put_contents($gameFile, json_encode($game));
}

return 'default';