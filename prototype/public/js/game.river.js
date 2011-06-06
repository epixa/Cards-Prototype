game.river = game.river || {};

(function($){
    game.river.Game = function(game, baseUrl) {
        var self = this;

        self.game = game;
        self.baseUrl = baseUrl;

        self.getActionUrl = function(action){
            return self.baseUrl + '&game-action=' + action;
        };

        self.update = function(game){
            self.game = game;
            console.log(game);
        };

        self.deal = function(){
            $.post(self.getActionUrl('deal'), function(data){
                console.log(data);
            }, 'json');
        };

        $(document).bind('game.Game.postPopulate', function(event, game){
            self.update(game);
        });
    };
})(jQuery);