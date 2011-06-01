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

    game.Room = function(container) {
        var self = this;

        self.table = null;
        self.players = {};
        self.currentGame = null;

        self.setTable = function(table){
            self.table = table;
        };

        self.addPlayer = function(player){
            self.players[player.id] = player;
        };

        self.startGame = function(game){
            console.log('here');
            self.currentGame = game;
        };
    };

    game.Table =  function(container) {
        var self = this;

        self.cards = {};

        self.addCard = function(card){
            self.cards[card.id] = card;
        };
    };

    game.Player = function(container) {
        var self = this;

        self.id = container.attr('id').substr(7);
        self.cards = {};

        self.addCard = function(card){
            self.cards[card.id] = card;
        };
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