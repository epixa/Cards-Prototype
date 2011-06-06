<?php

$game = new stdClass();

$game->details = new stdClass();
$game->details->name = 'Up and Down the River';
$game->details->code = 'river';

$game->players = new stdClass();

$game->state = new stdClass();

$result = file_put_contents($gameFile, json_encode($game));
if ($result === false) {
    throw new LogicException('Failed to write game data to file');
}

$data['details'] = $game->details;

/*
array(
    'details' => array(
        'name' => 'Up and down the river',
        'code' => 'river'
    ),
    'resources' => array(
        'player' => '<li class="player">Player Name</li>'
    ),
    'state' => array(
        'river' => array(
            array('S-3', 'D-J', 'D-9', 'H-10'),
            array('H-4', 'C-4', 'H-9', 'C-A')
        )
    ),
    'players' => array(
        1 => array(
            'name' => 'Court',
            'state' => array(
                'hand' => array('S-2', 'D-2', 'C-J', 'C-Q'),
                'guesses' => array('red', 'higher', 'outside', 'spade')
            )
        )
    )
);
*/