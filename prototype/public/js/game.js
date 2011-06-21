window.game = window.game || {};

(function($){
    /**
     * The game manager
     *
     * This is responsible for updating the game data and managing the state of the game.
     *
     * @param game
     * @param pollingDuration
     */
    game.Manager = function(game, pollingDuration) {
        var self = this;

        self.game = game;
        self.playerId = null;
        self.pollingDuration = pollingDuration || 5000;

        /**
         * Loads all of the game data and executes the given callback on success
         * 
         * @param callback
         */
        self.loadGame = function(callback){
            $.getJSON('/ajax.php?action=init-game', function(data){
                if (data.status == 'error') {
                    $(document).trigger('ajax.error', [data]);
                } else if (data.status == 'success') {
                    self.game.populate(data.game);

                    if (callback) {
                        callback();
                    }
                }
            });
        };

        /**
         * Begins the polling sequence for game data
         *
         * Game data is assumed to have already been loaded, so first poll occurs after
         * a duration equal to pollingDuration property.
         *
         * @param url
         */
        self.beginGamePolling = function(){
            setTimeout(self.pollGame, self.pollingDuration, '/ajax.php?action=get-game');
        };

        /**
         * Polls for data at the given url
         *
         * On success, the given callback is executed.  Polling occurs at an interval determined by
         * the pollingDuration property.
         * 
         * @param url
         * @param callback
         */
        self.poll = function(url, callback){
            $.getJSON(url, function(data){
                if (data.status == 'error') {
                    $(document).trigger('ajax.error', [data]);
                } else if (data.status == 'success') {
                    console.log(data);
                    var continuePolling = callback(data);

                    if (continuePolling) {
                        setTimeout(self.poll, self.pollingDuration, url, callback);
                    }
                }
            });
        };

        /**
         * Polls for all data for a game at the given url
         *
         * When game data is retrieved, the players and game state are updated.
         *
         * @param url
         */
        self.pollGame = function(url){
            self.poll(url, function(data){
                if (!data.game) {
                    alert('Someone has stopped the current game.');
                    window.location.href = '/';
                    return false;
                }

                self.game.populate(data.game);

                return true;
            });
        };

        /**
         * Polls for when a game is started
         *
         * If game data is retrieved, polling finishes and the user is redirected.
         */
        self.pollGameStarted = function(){
            self.poll('/ajax.php?action=get-game', function(data){
                if (data.game) {
                    alert("Someone has started a new game:\n" + data.game.details.name);
                    window.location.href = '/';
                    return false;
                }

                return true;
            });
        };

        /**
         * Starts the game and redirects the user on success
         */
        self.startGame = function(){
            $.post('/ajax.php?action=start-game', function(data){
                if (data.status == 'error') {
                    $(document).trigger('ajax.error', [data]);
                } else if (data.status == 'success') {
                    window.location.href = '/';
                }
            }, 'json');
        };

        /**
         * Stops the game and redirects the user on success
         */
        self.stopGame = function(){
            $.post('/ajax.php?action=stop-game', function(data){
                if (data.status == 'error') {
                    $(document).trigger('ajax.error', [data]);
                } else if (data.status == 'success') {
                    window.location.href = '/';
                }
            }, 'json');
        };
    };

    /**
     * The game itself
     *
     * This is responsible for storing the game data as well as preserving data integrity for
     * the frontend, but it does not care nor shall it ever know where the data is coming from.
     */
    game.Game = function() {
        var self = this;

        self.players = {};
        self.state = {};
        self.details = {};
        self.resources = {};
        self.totalPlayers = 0;
        self.playersContainer = null;
        self.basePlayer = null;

        /**
         * Populates all of the game properties from the given data
         * 
         * @param game
         */
        self.populate = function(game){
            for (var x in game.players) {
                var player = game.players[x];

                if (!self.hasPlayer(player.id)) {
                    self.addPlayer(player);
                } else {
                    self.getPlayer(player.id).populate(player);
                }
            }

            for (var id in self.players) {
                if (!(id in game.players)) {
                    self.removePlayer(id);
                }
            }

            self.state = game.state;
            self.details = game.details;

            if (game.resources) {
                self.resources = game.resources;
            }

            $(document).trigger('game.Game.postPopulate', [self]);
        };

        /**
         * Determines if the game has a player identified by the given id
         * 
         * @param  id
         * @return boolean
         */
        self.hasPlayer = function(id){
            return self.players[id] !== undefined;
        };

        /**
         * Adds a player with the given data to the game
         *
         * @param data The player's data
         */
        self.addPlayer = function(data){
            var container = self.basePlayer.clone();
            var player = new game.Player(data, container);

            player.container.attr('id', 'player-' + player.data.id);
            player.container.html(player.data.name);

            self.playersContainer.append(container);

            self.players[player.data.id] = player;

            self.totalPlayers++;
        };

        /**
         * Gets the player that is identified by the given id
         * 
         * @param  id
         * @return game.Player
         */
        self.getPlayer = function(id){
            if (!self.hasPlayer(id)) {
                throw new Error('Player ' + id + 'does not exist');
            }
            
            return self.players[id];
        };

        /**
         * Removes the player identified by the given id from the game
         *
         * The player's DOM container is also removed, if it exists.
         *
         * @param id
         */
        self.removePlayer = function(id){
            var player = self.getPlayer(id);

            if (player.container) {
                player.container.remove();
            }

            delete self.players[id];

            self.totalPlayers--;
        }
    };

    /**
     * A player in the game
     * 
     * @param data      The data associated with the player
     * @param container The html container for rendering the player
     */
    game.Player = function(data, container) {
        var self = this;

        self.data = {
            id : null,
            name : null,
            isActive : null,
            lastActivity : null,
            state : {}
        };
        self.container = container;

        /**
         * Populates the player data
         *
         * Only properties that existed in the original data will be populated.
         * The container's appearance is also updated to reflect player state.
         *
         * @param data The new data to be associated with the player
         */
        self.populate = function(data){
            for (var key in self.data) {
                if (data[key] != undefined) {
                    self.data[key] = data[key];
                }
            }

            if (self.container) {
                self.container.removeClass('inactive');
                if (!self.isActive()) {
                    self.container.addClass('inactive');
                }
            }
        };

        /**
         * Determines if the player is active
         *
         * In theory, activity would be determined by polling the backend datasource.
         */
        self.isActive = function(){
            return self.data.isActive == true;
        };

        self.populate(data);
    };
})(jQuery);