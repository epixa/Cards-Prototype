window.game = window.game | {};

(function($){
    game = {
        decks : {
            'standard' : {
                suits : [
                    'C', 'D', 'H', 'S'
                ],
                values : [
                    2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'
                ]
            }
        },

        roomFactory : function(roomContainer, tableContainer, playersContainer){
            var room = new game.Room(roomContainer);

            room.setTable(new game.Table(tableContainer));

            playersContainer.each(function(){
                room.addPlayer(new game.Player($(this)));
            });

            return room;
        },

        cardFactory : function(value, suit)
        {
            var container = $('<span/>');

            container.attr('id', 'card-' + suit + '-' + value);
            container.html(suit + '-' + value);

            return new game.Card(container, suit, value);
        }
    };

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

    game.Table =  function(container) {
        var self = this;

        self.cards = {};

        self.addCard = function(card){
            self.cards[card.id] = card;
        };
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

            console.log(self.data.id + ' ' + self.data.lastActivity);

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

    game.Card = function(container, suit, value) {
        var self = this;

        self.suit = suit;
        self.value = value;
        self.hidden = false;

        self.flip = function(){
            if (self.hidden) {
                self.show();
            } else {
                self.hide();
            }
        };

        self.show = function(){
            self.hidden = false;
            container.show();
        };

        self.hide = function(){
            self.hidden = true;
            container.hide();
        };
    };
})(jQuery);