(function(){
    var _$ = window.$;
    var _wootQuery = window.wootQuery;
    var wootQuery = window.$ = window.wootQuery = function(selector,context){
        // Return a new wootQuery object
        return new wootQuery.fn.init(selector);
    }
    wootQuery.fn = wootQuery.prototype = {
        // Establish the state of the wootQuery instance
        init: function(selector) {
            this.selector = selector || document;
            return this;
        },
        // Just for fun
        capture: function() {
            alert("All your base, are belong to us!");
        },
    }
    // Allow access to wootQuery.prototype methods
    wootQuery.fn.init.prototype = wootQuery.fn;
})();