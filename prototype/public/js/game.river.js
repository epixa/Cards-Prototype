game.river = game.river || {};

(function($){
    game.river.Game = function(game, baseUrl) {
        var self = this;

        self.game = game;
        self.baseUrl = baseUrl;
        self.initialized = false;

        self.getActionUrl = function(action){
            return self.baseUrl + '&game-action=' + action;
        };

        self.populate = function(game){
            self.initialized = true;

            var lastPlayer = self.game.state.currentPlayerId;
            
            self.game = game;

            if (lastPlayer != self.game.state.currentPlayerId) {
                var currentPlayer = self.getCurrentPlayer();
                if (currentPlayer) {
                    var x;
                    for (x in self.game.players) {
                        if (self.game.players[x].container) {
                            self.game.players[x].container.removeClass('current');
                        }
                    }

                    if (currentPlayer.container) {
                        currentPlayer.container.addClass('current');
                    }

                    if (self.game.playerId == currentPlayer.id) {
                        // you are the current player
                        console.log('hey, you are the current player');
                    }
                } else {
                    alert('Apparently the round ended');
                    window.location.href = '/';
                }
            }
        };

        self.getCurrentPlayer = function(){
            if (self.game.state.currentPlayerId) {
                return self.game.players[self.game.state.currentPlayerId];
            }
            return null;
        };

        self.deal = function(){
            $.post(self.getActionUrl('deal'), function(data){
                self.game.populate(data.game);
            }, 'json');
        };

        $(document).bind('game.Game.postPopulate', function(event, game){
            self.populate(game);
        });
    };
})(jQuery);