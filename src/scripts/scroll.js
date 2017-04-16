// /**
//  *
//  * @param {(number|HTMLElement)} destination - Destination to scroll to (DOM element or number)
//  * @param {number} duration - Duration of scrolling animation
//  * @param {string} easing - Timing function name (Allowed values: 'linear', 'easeInQuad', 'easeOutQuad', 'easeInOutQuad', 'easeInCubic', 'easeOutCubic', 'easeInOutCubic', 'easeInQuart', 'easeOutQuart', 'easeInOutQuart', 'easeInQuint', 'easeOutQuint', 'easeInOutQuint')
//  * @param {function} callback - Optional callback invoked after animation
//  */

// SORUCES
//=========

// 1. [stackoverflow](http://stackoverflow.com/questions/10063380/javascript-smooth-scroll-without-the-use-of-jquery)
// 2. [codepen -- current solution](http://codepen.io/anon/pen/vmOpLX?editors=1010)
// 3. using jQuery Animation

    function smoothScroll(destination, duration, easing, callback) {
    
        duration = duration || 200;
        easing = easing || 'linear';


        // Predefine list of available timing functions
        // If you need more, tween js is full of great examples
        // https://github.com/tweenjs/tween.js/blob/master/src/Tween.js#L421-L737
        var easings = {
            linear(t) {
                return t;
            },
            easeInOutQuint(t) {
                return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
            }
        };


        // Store initial position of a window and time
        // If performance is not available in your browser
        // It will fallback to new Date().getTime() - thanks IE < 10
        var start = window.pageYOffset;
        var startTime = 'now' in window.performance ? performance.now() : new Date().getTime();
        // var startTime = typeof(window.performance['now']) == 'function' ? performance.now() : new Date().getTime();


        // Take height of window and document to sesolve max scrollable value
        // Prevent requestAnimationFrame() from scrolling below maximum scollable value
        // Resolve destination type (node or number)
        var documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
        var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
        var destinationOffset = typeof destination === 'number' ? destination : destination.offsetTop;
        var destinationOffsetToScroll = Math.round(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset);


        // If requestAnimationFrame is not supported
        // Move window to destination position and trigger callback function
        if ('requestAnimationFrame' in window === false) {
            window.scroll(0, destinationOffsetToScroll);
            if (callback) {
                callback();
            }
            return;
        }


        // function resolves position of a window and moves to exact amount of pixels
        // Resolved by calculating delta and timing function choosen by user
        function scroll() {
            var now = 'now' in window.performance ? performance.now() : new Date().getTime();
            var time = Math.min(1, ((now - startTime) / duration));
            var timeFunction = easings[easing](time);
            window.scroll(0, Math.ceil((timeFunction * (destinationOffsetToScroll - start)) + start));

            // Stop requesting animation when window reached its destination
            // And run a callback function
            if (window.pageYOffset === destinationOffsetToScroll) {
            if (callback) {
                callback();
            }
            return;
            }

            // If window still needs to scroll to reach destination
            // Request another scroll invokation
            requestAnimationFrame(scroll);
        }


        // Invoke scroll and sequential requestAnimationFrame
        scroll();
    }