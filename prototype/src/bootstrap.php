<?php

session_start();

$gameFile = dirname(dirname(__FILE__)) . '/data/game';
if (!file_exists($gameFile)) {
    touch($gameFile);
}

$encodedGame = file_get_contents($gameFile);
if ($encodedGame === false) {
    throw new LogicException('Failed to load game data');
}

if (!empty($encodedGame)) {
    $game = json_decode($encodedGame);
    if ($game === null) {
        $debugParams = array('game-data' => $encodedGame);
        unlink($gameFile);
        throw new LogicException('Game data could not be decoded');
    }
} else {
    $game = null;
}