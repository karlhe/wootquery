(function(){
    // I am honestly not sure what defining these variables accomplish
    var _$ = window.$;
    var _wootQuery = window.wootQuery;
    
    // Hook the global varables $ and wootQuery to local wootQuery
    var wootQuery = window.$ = window.wootQuery = function(selector,context) {
        // Return a new wootQuery object
        return new wootQuery.fn.init(selector);
    }
    
    // Define methods for the wootQuery prototype
    wootQuery.fn = wootQuery.prototype = {
        // Establish the state of the wootQuery instance
        init: function(selector) {
            selector = selector || document;
            
            text = /[\w-]+/;
            tagElement = /^[A-Za-z]+$/;
            idElement = /^#[\w-]+$/;
            classElement = /^\.[\w-]+$/;
            
            // Check if given DOM node
            if(selector.nodeType) {
                this.elements = [selector]
            // Check if given ID
            } else if(selector.match(idElement)) {
                elementName = selector.match(text)[0];
                this.elements = [document.getElementById(elementName)];
            // Check if given class
            } else if(selector.match(classElement)) {
                alert("Class selectors not yet supported.");
            // Check if given HTML tag
            } else if(selector.match(tagElement)) {
                alert("Tag selectors not yet supported.");
            // TODO: Implement complex selectors, e.g. "#foo > .bar"
            } else {
                alert("Selector not recognized: %s",selector);
            }
            
            return this;
        },
        
        // Just for fun
        capture: function() {
            alert("All your base, are belong to us!");
        },
        
        // Returns the innerHTML of the first DOM element
        html: function() {
            return this.elements[0].innerHTML;
        },
        
        
    }
    // Allow access to wootQuery.prototype methods
    wootQuery.fn.init.prototype = wootQuery.fn;
})();