(function() {
    var didScroll;
    var lastScrollTop = 0;
    var delta = 80;
    var navbarHeight = $('.banner-container').outerHeight();
    console.log("navbarHeight: " + navbarHeight);

    $(window).scroll(function(event){
        didScroll = true;
    });

    setInterval(function() {
        if (didScroll) {
            hasScrolled();
            didScroll = false;
        }
    }, 250);

    function hasScrolled() {
        var st = $(this).scrollTop();

        // Make sure they scroll more than delta
        if(Math.abs(lastScrollTop - st) <= delta)
            return;

        console.log("st: " + st);
        
        if (st > lastScrollTop && st > navbarHeight - delta){
            $('.nav-down').removeClass('nav-down').addClass('nav-up');
        } else {
            if(st < navbarHeight) {
                $('.nav-up').removeClass('nav-up').addClass('nav-down');
            }
        }
        
        lastScrollTop = st;
    }
})();