<?php

$currentMicrotime = microtime(true);

$_SESSION['identity']->lastActivity = $currentMicrotime;
$_SESSION['identity']->isActive = true;
if ($game) {
    $game->players->{$_SESSION['identity']->id} = $_SESSION['identity'];

    $game->details->totalPlayers = 0;
    foreach ($game->players as $id => $player) {
        $game->details->totalPlayers++;

        $difference = $currentMicrotime - $player->lastActivity;

        if ($difference > 15) {
            unset($game->players->$id);
            $game->details->totalPlayers--;
        } else if ($difference > 5) {
            $player->isActive = false;
        }
    }

    file_put_contents($gameFile, json_encode($game));
}