window.game = window.game || {};

(function($){
    /**
     * The game room itself
     * 
     * @param url The url at which game data can be retrieved
     */
    game.Room = function(url) {
        var self = this;

        self.players = {};
        self.url = url;
        self.pollingDuration = 5000;

        /**
         * Begins polling the backend for game data
         */
        self.beginPolling = function(){
            self.loadGameData();
        };

        /**
         * Executes an ajax request for game data
         *
         * The room's loadGameDataCallback function is called on success.
         */
        self.loadGameData = function(){
            $.getJSON(self.url, self.loadGameDataCallback);
        };

        /**
         * Populates the game data and initiates the process to poll for data again
         * in the milliseconds defined by the room's pollingDuration property.
         * 
         * @param data The game data
         */
        self.loadGameDataCallback = function(data){
            console.log(data.game);
            setTimeout(self.loadGameData, self.pollingDuration);
        };

        /**
         * Determines if the room has a player identified by the given id
         * 
         * @param  id
         * @return boolean
         */
        self.hasPlayer = function(id){
            return self.players[id] !== undefined;
        };

        /**
         * Adds a player with the given data to the room
         *
         * In addition, the player is associated with the given jQuery DOM element.
         *
         * @param data      The player's data
         * @param container The jquery DOM element
         */
        self.addPlayer = function(data, container){
            self.players[data.id] = new game.Player(data, container);
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
         * Removes the player identified by the given id from the room
         *
         * The player's DOM container is also removed.
         *
         * @param id
         */
        self.removePlayer = function(id){
            var player = self.getPlayer(id);
            player.container.remove();
            delete self.players[id];
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

            self.container.attr('id', 'player-' + self.data.id);
            self.container.html(self.data.name);

            self.container.removeClass('inactive');
            if (!self.isActive()) {
                self.container.addClass('inactive');
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