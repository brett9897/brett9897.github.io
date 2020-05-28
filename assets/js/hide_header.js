(function() {
    var didScroll;
    var lastScrollTop = 0;
    var delta = 100;
    var navbarHeight = $('.banner-container').outerHeight();

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
        
        if (st > lastScrollTop){
            $('.nav-down').removeClass('nav-down').addClass('nav-up');
        } else {
            if(st < navbarHeight) {
                $('.nav-up').removeClass('nav-up').addClass('nav-down');
            }
        }
        
        lastScrollTop = st;
    }
})();