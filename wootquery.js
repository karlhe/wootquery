(function(){
    // I am honestly not sure what defining these variables accomplishes
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
            
            simpleExpr = /^[#\.]?[\w-]+$/;
            text = /[\w-]+/;
            tagElement = /^[A-Za-z]+$/;
            idElement = /^#[\w-]+$/;
            classElement = /^\.[\w-]+$/;
            
            function fetchElement(node,selector,type) {
                elementList = [];
                
                // Check if given ID
                if(selector.match(idElement)) {
                    elementName = selector.match(text)[0];
                    elementList.push(node.getElementById(elementName));
                // Check if given class
                } else if(selector.match(classElement)) {
                    elementName = selector.match(text)[0];
                    classExp = new RegExp("\\b"+elementName+"\\b");
                    nodeList = node.getElementsByClassName(elementName);
                    for(var i=0; i<nodeList.length; i++) {
                        elementList.push(nodeList[i]);
                    }
                // Check if given HTML tag
                } else if(selector.match(tagElement)) {
                    elementName = selector.match(text)[0];
                    nodeList = node.getElementsByTagName(elementName);
                    for(var i=0; i<nodeList.length; i++) {
                        elementList.push(nodeList[i]);
                    }
                }
                
                // Child selector
                if(type == '>') {
                    returnList = [];
                    while(elementList.length > 0) {
                        element = elementList.shift();
                        for(var i=0; i<node.childNodes.length; i++) {
                            if(node.childNodes[i] == element) {
                                returnList.push(element);
                                break;
                            }
                        }
                    }
                    return returnList;
                    
                // Ancestor selector
                } else {
                    return elementList;
                }
                
            }
            
            // Check if given DOM node
            if(selector.nodeType) {
                this.elements = [selector]
            // Check if a simple selector
            } else if(selector.match(simpleExpr)) {
                this.elements = fetchElement(document,selector);
            // This is a complex selector
            } else {
                selectorItems = selector.split(' ');
                currentNodes = [document];
                
                // Find elements for each step in the selector
                while(selectorItems.length > 0) {
                    currentSelector = selectorItems.shift();
                    nextNodes = [];
                    
                    // Apply for all elements currently selected
                    while(currentNodes.length > 0) {
                        currentNode = currentNodes.shift();
                        selectorType = '';
                        
                        // Set selection type and pop next node if selector present
                        if(!currentSelector.match(simpleExpr)) {
                            selectorType = currentSelector;
                            currentSelector = selectorItems.shift();
                        }
                        // currentNode should now actually be a node
                        // Fetch the selected elements for the current node
                        newNodes = fetchElement(currentNode,currentSelector,selectorType);
                        
                        // Verify uniqueness of elements
                        // TODO: Optimize this; does some redundant looping
                        while(newNodes.length > 0) {
                            newNode = newNodes.shift();
                            for(var i=0; i<nextNodes.length; i++) {
                                if(newNode == nextNodes[i]) {
                                    newNode = null;
                                    break;
                                }
                            }
                            if(newNode != null) {
                                nextNodes.push(newNode);
                            }
                        }
                    }
                    // Load the next set of nodes
                    currentNodes = nextNodes;
                }
                this.elements = currentNodes;
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
        
        // classNames is a string specifying the class(es) separated by spaces to be added as an attribute to the node
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
        
        // See if className is a class attribute
        // Returns true if the specified class is present in at least one of the matched elements
        hasClass: function(className) {
            var bool = false;
            this.elements.map(function(element) {
                var getClass = element.getAttribute("class");
                if (getClass != "" && getClass != null ) {
                    var splitClass = getClass.split(" ");
                    if (splitClass.indexOf(className) != -1) {
                        // Class is found
                        bool = true;
                    }
                }
            });
            return bool;
        },
        
        // Removes the specified classes from the matched elements
        // Removes all classes if no argument given
        removeClass: function(classNames) {
            if (classNames == null) {
                // Remove all classes
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
                            // Only add in classes not specified by the argument
                            if (classNamesSplit.indexOf(splitClass[i]) == -1) {
                            newClass.push(splitClass[i]);
                            }
                        }
                        // Set the class to be the new class list that doesn't include the argument classes
                        element.setAttribute("class", newClass.join(" "));
                    }
                });            
            }
        },
        
        // Return the given attribute of the first matched element
        attr: function(name) {
            return this.elements[0].getAttribute(name);
        },
        
        // Set a single property to a value on all the matched elements
        setAttr: function(key, value) {
            this.elements.map(function(element) {
                element.setAttribute(key, value);
            });
        },
        
        
    }
    // Allow access to wootQuery.prototype methods
    wootQuery.fn.init.prototype = wootQuery.fn;
})();