<?php

session_start();

$gameFile = dirname(dirname(__FILE__)) . '/data/game';
if (!file_exists($gameFile)) {
    touch($gameFile);
}

$game = file_get_contents($gameFile);
if ($game === false) {
    throw new LogicException('Failed to load game data');
}

if (!empty($game)) {
    $game = json_decode($game);
    if ($game === null) {
        throw new LogicException('Game data could not be decoded');
    }
} else {
    $game = null;
}