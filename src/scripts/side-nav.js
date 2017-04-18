  //import smoothScroll from the global scope
  // Side Nav
(function (smoothScroll) {

    // 2. process every sideNav link
    // and add scrolling func to it
    function getLink(navItem) {
    //get the link
    var link = navItem.href;
    // find the position of # in link
    var pos = link.indexOf('#');
    // get the id
    var link = link.slice(pos + 1);

    // add a handler for click
    navItem.addEventListener('click', function(){
        // get the element with target id
        var section = document.getElementById(link);
        // scroll
        smoothScroll(
            section,
            625,
            'easeInOutQuint',
            function() {console.log('Just finished scrolling to ' + window.pageYOffset + 'px')}
        );
        });
    }
    // 1. loop through every item in side-nav
    //get each sideNav item
    var sideNav = document.querySelectorAll('.m-side-nav__item');
    for(i=0; i < sideNav.length; i++) {
    // we refactoring this into a function so every element gets its own unique scope    
    getLink(sideNav[i]);
    }
})(smoothScroll); 