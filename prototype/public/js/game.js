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
        self.pollingDuration = pollingDuration || 5000;

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
                    $(document).trigger('game.Manager.gameStopped', [self.game]);
                    return false;
                }

                console.log(data.game);

                for (var x in data.game.players) {
                    var player = data.game.players[x];

                    if (!self.game.hasPlayer(player.id)) {
                        self.game.addPlayer(player);
                    } else {
                        self.game.getPlayer(player.id).populate(player);
                    }
                }

                for (var id in self.game.players) {
                    if (!(id in data.game.players)) {
                        self.game.removePlayer(id);
                    }
                }

                $(document).trigger('game.Manager.postPollGame', [self.game]);

                return true;
            });
        };

        /**
         * Polls for when a game is started at the given url
         *
         * If game data is retrieved, polling finishes and an appropriate event is triggered.
         *
         * @param url
         */
        self.pollGameStarted = function(url){
            self.poll(url, function(data){
                if (data.game) {
                    $(document).trigger('game.Manager.gameStarted', [data.game]);
                    return false;
                }

                return true;
            });
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
        self.totalPlayers = 0;

        /**
         * Populates the current game state
         *
         * The structure of the game state is unique to the current type of game.
         * For that reason, game state can only be set here; it must be accessed
         * and manipulated by the javascript defined by the game itself.
         * 
         * @param data
         */
        self.updateGameState = function(data){
            self.state = data.state;
            console.log(self.state);
        };

        /**
         * Populates the current game details
         *
         * The structure of game details are universal and thus can be parsed and stored
         * in a common format regardless of what game is being played.
         *
         * @param data
         */
        self.updateGameDetails = function(data){
            self.details = data.details;
            console.log(self.details);
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
            var player = new game.Player(data);
            self.players[data.id] = player;

            self.totalPlayers++;

            $(document).trigger('game.Game.postAddPlayer', [player]);
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

            $(document).trigger('game.Game.preRemovePlayer', [player]);

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
            lastActivity : null
        };
        self.container = null;

        /**
         * Sets the jquery container for this player
         * 
         * @param container
         */
        self.setContainer = function(container){
            self.container = container;
            $(document).trigger('game.Player.postSetContainer', [self]);
        };

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

            $(document).trigger('game.Player.postPopulate', [self]);
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

        if (container) {
            self.setContainer(container);
        }
    };
})(jQuery);