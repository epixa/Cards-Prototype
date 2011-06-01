<?php

$game = array(
    'name' => 'Up and Down the River',
    'code' => 'river',
    'players' => array()
);

$result = file_put_contents($gameFile, json_encode($game));
if ($result === false) {
    throw new LogicException('Failed to write game data to file');
}

$data['game'] = $game;