<?php

if (!$game) {
    throw new RuntimeException('No game started');
}

require ROOT_PATH . '/src/snippets/update-game.php';

require ROOT_PATH . '/src/snippets/custom/init.php';

$data['game'] = $game;