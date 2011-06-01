(function($){
    $.bind('ajax.error', function(data){
        alert('An error has occurred.  Check your javascript log for details.');
        console.log(data);
    });
})(jQuery);