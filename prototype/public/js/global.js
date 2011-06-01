(function($){
    $(document).bind('ajax.error', function(event, data){
        alert('An error has occurred.  Check your javascript log for details.');
        console.log(data);
    });
})(jQuery);