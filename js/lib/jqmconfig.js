
document.firstPage = true;
$(document).bind("mobileinit", function () {
    $.mobile.ajaxEnabled = false;
    $.mobile.linkBindingEnabled = false;
    $.mobile.hashListeningEnabled = false;
    $.mobile.pushStateEnabled = false;
    $.mobile.defaultPageTransition = 'fade';
    $('div[data-role="page"]').on('pagehide', 
         function (event, ui) {
           $(event.currentTarget).remove();
   });
});
