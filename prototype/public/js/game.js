window.game = window.game || {};

(function($){
    game.Room = function(url) {
        var self = this;

        self.table = null;
        self.players = {};
        self.game = null;
        self.url = url;
        self.pollingDuration = 5000;

        self.beginPolling = function(){
            self.loadGameData();
        };

        self.loadGameData = function(){
            $.getJSON(self.url, self.loadGameDataCallback);
        };

        self.loadGameDataCallback = function(data){
            console.log(data);
            setTimeout(self.loadGameData, self.pollingDuration);
        };

        self.hasPlayer = function(id){
            return self.players[id] !== undefined;
        };

        self.addPlayer = function(data, container){
            self.players[data.id] = new game.Player(data, container);
        };

        self.getPlayer = function(id){
            if (!self.hasPlayer(id)) {
                throw new Error('Player ' + id + 'does not exist');
            }
            
            return self.players[id];
        };

        self.removePlayer = function(id){
            var player = self.getPlayer(id);
            player.container.remove();
            delete self.players[id];
        }
    };

    game.Player = function(data, container) {
        var self = this;

        self.data = {
            id : null,
            name : null,
            isActive : null,
            lastActivity : null
        };
        self.container = container;

        self.populate = function(data, callback){
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

        self.isActive = function(){
            return self.data.isActive == true;
        };

        self.populate(data);
    };
})(jQuery);