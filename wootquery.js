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
                elementName = selector.match(text)[0];
                classExp = new RegExp("\\b"+elementName+"\\b");
                nodeList = document.getElementsByClassName(elementName);
                elementList = []
                for(var i=0; i<nodeList.length; i++) {
                    elementList.push(nodeList[i]);
                }
                this.elements = elementList;
            // Check if given HTML tag
            } else if(selector.match(tagElement)) {
                elementName = selector.match(text)[0];
                nodeList = document.getElementsByTagName(elementName);
                elementList = []
                for(var i=0; i<nodeList.length; i++) {
                    elementList.push(nodeList[i]);
                }
                this.elements = elementList;
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
        
        // Returns the innerHTML of the first matched element
        html: function() {
            return this.elements[0].innerHTML;
        },
        
        // Appends content to innerHTML of matched elements
        append: function(content) {
            this.elements.map(function(element) {
                element.innerHTML = element.innerHTML + content;
            });
        },
        
        // Prepends content to innerHTML of matched elements
        prepend: function(content) {
            this.elements.map(function(element) {
                element.innerHTML = content + element.innerHTML;
            });
        },
        
        //classNames is a string specifying the class(es) separated by spaces to be added as an attribute to the node
        addClass: function(classNames) {
            this.elements.map(function(element) {
                var getClass = element.getAttribute("class");
                if (getClass == "" || getClass == null) {
                    element.setAttribute("class", classNames);
                } else {
                    element.setAttribute("class", getClass + ' ' + classNames);
                }
            });
        },
        
        //see if className is a class attribute
        //returns true if the specified class is present in at least one of the matched elements
        hasClass: function(className) {
            var bool = false;
            this.elements.map(function(element) {
                var getClass = element.getAttribute("class");
                if (getClass != "" && getClass != null ) {
                    var splitClass = getClass.split(" ");
                    if (splitClass.indexOf(className) != -1) {
                        //class is found
                        bool = true;
                    }
                }
            });
            return bool;
        },
        
        //removes the specified classes from the matched elements
        //removes all classes if no argument given
        removeClass: function(classNames) {
            if (classNames == null) {
                //remove all classes
                this.elements.map(function(element) {
                    element.setAttribute("class", "");
                });
            } else {
                var classNamesSplit = classNames.split(" ");
                this.elements.map(function(element) {
                    var getClass = element.getAttribute("class");
                    if (getClass != "" && getClass != null) {
                        var splitClass = getClass.split(" ");
                        var newClass = [];
                        var i = 0;
                        for (i=0; i<splitClass.length; i++) {
                            //only add in classes not specified by the argument
                            if (classNamesSplit.indexOf(splitClass[i]) == -1) {
                            newClass.push(splitClass[i]);
                            }
                        }
                        //set the class to be the new class list that doesn't include the argument classes
                        element.setAttribute("class", newClass.join(" "));
                    }
                });            
            }
        },
        
        //return the given attribute of the first matched element
        attr: function(name) {
            return this.elements[0].getAttribute(name);
        },
        
        //set a single property to a value on all the matched elements
        setAttr: function(key, value) {
            this.elements.map(function(element) {
                element.setAttribute(key, value);
            });
        },
        
        
    }
    // Allow access to wootQuery.prototype methods
    wootQuery.fn.init.prototype = wootQuery.fn;
})();