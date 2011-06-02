<?php

$game = new stdClass();
$game->name = 'Up and Down the River';
$game->code = 'river';
$game->totalPlayers = 0;
$game->players = new stdClass();

$result = file_put_contents($gameFile, json_encode($game));
if ($result === false) {
    throw new LogicException('Failed to write game data to file');
}

$data['game'] = $game;