<?php

if (empty($_SESSION['identity'])) {
    header('Location: /?action=auth');
    exit;
}

require ROOT_PATH . '/src/snippets/update-game.php';

if ($game) {
    $totalPlayers = $game->details->totalPlayers;
}

return 'default';