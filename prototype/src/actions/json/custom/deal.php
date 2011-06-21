<?php

$deck = (array)$game->state->deck;

if ($game->details->totalPlayers > 11) {
    throw new RuntimeException('Too many players');
}

$totalPlayers = 0;
foreach ($game->players as $player) {
    $totalPlayers++;
    if ($totalPlayers == 1) {
        $game->state->currentPlayerId = $player->id;
    }
    
    $player->hand = array();
}

for ($x = 0; $x < 4; $x++) {
    foreach ($game->players as $player) {
        $totalCards = count($deck);

        $key = mt_rand(0, $totalCards - 1);
        $card = $deck[$key];
        array_splice($deck, $key, 1);

        $player->hand[] = $card;
    }
}

$game->state->river = array(
    'give' => array(),
    'take' => array()
);
$riverType = 'give';
for ($x = 0; $x < 8; $x++) {
    if ($x == 4) {
        $riverType = 'take';
    }
    
    $totalCards = count($deck);

    $key = mt_rand(0, $totalCards - 1);
    $card = $deck[$key];
    array_splice($deck, $key, 1);
    
    $game->state->river[$riverType][] = $card;
}

$game->state->deck = $deck;

$result = file_put_contents($gameFile, json_encode($game));
if ($result === false) {
    throw new LogicException('Failed to write custom game data to file');
}

$data['game'] = $game;