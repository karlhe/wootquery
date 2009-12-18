(function(){
    // I am honestly not sure what defining these variables accomplishes
    var _$ = window.$;
    var _wootQuery = window.wootQuery;
    
    // Hook the global varables $ and wootQuery to local wootQuery
    var wootQuery = window.$ = window.wootQuery = function(selector,context) {
        // Return a new wootQuery object
        return new wootQuery.fn.init(selector);
    }
    
    //convert html string to dom
    function html2dom(html) {
        var div = document.createElement("div");
        div.innerHTML = html;
        var domContent = div.firstChild;
        return domContent;
    }
    
    //convert dom to html string
    function dom2html(dom) {
        var div = document.createElement("div");
        div.appendChild(dom);
        return div.innerHTML;
    }
    
    // Define methods for the wootQuery prototype
    wootQuery.fn = wootQuery.prototype = {
        // Establish the state of the wootQuery instance
        init: function(selector) {
            selector = selector || document;
            
            simpleExpr = /^([#\.])?([\w-]+)$/;
            
            function fetchElement(node,selector,type) {
                elementList = [];
                expr = selector.match(simpleExpr);
                
                // Check if given ID
                if(expr[1] == '#') {
                    elementName = expr[2];
                    elementList.push(node.getElementById(elementName));
                // Check if given class
                } else if(expr[1] == '.') {
                    elementName = expr[2];
                    classExp = new RegExp("\\b"+elementName+"\\b");
                    nodeList = node.getElementsByClassName(elementName);
                    for(var i=0; i<nodeList.length; i++) {
                        elementList.push(nodeList[i]);
                    }
                // Check if given HTML tag
                } else if(expr[1] == null) {
                    elementName = expr[2];
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
            //this.selector = selector;
            return this;
        },
        
        // Just for fun
        capture: function() {
            alert("All your base, are belong to us!");
        },
        
        // Executes fn when page is done loading
        // TODO: Research DOM-readiness checking, jQuery uses a better method than window.onload
        ready: function(fn) {
            window.onload = function() { fn(); }
            return this;
        },
        
        // Returns the innerHTML of the first matched element
        html: function() {
            return this.elements[0].innerHTML;
        },
        
        //set the innerHTML contents of every matched element
        setHTML: function(val) {
            this.elements.map(function(element) {
                element.innerHTML = val;
            });
            return this;
        },
        
        // Appends content to innerHTML of matched elements
        append: function(content) {
            this.elements.map(function(element) {
                element.innerHTML = element.innerHTML + content;
            });
            return this;
        },
        
        // Prepends content to innerHTML of matched elements
        prepend: function(content) {
            this.elements.map(function(element) {
                element.innerHTML = content + element.innerHTML;
            });
            return this;
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
            return this;
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
            return this;
        },
        
        //for each matched element, add the specified class if not present; remove class if it is. 
        toggleClass: function(className) {
            this.elements.map(function(element) {
                var getClass = element.getAttribute("class");
                if (getClass == "" || getClass == null) {
                    //class attribute doesn't exist. add one in with the specified class
                    element.setAttribute("class", className);
                } else {
                    var splitClass = getClass.split(" ");
                    if (splitClass.indexOf(className) == -1) {
                        //specified class not found. append it to the list of classes
                        element.setAttribute("class", getClass + ' ' + className);
                    } else {
                        //class is found. remove it.
                        var newClass = [];
                        for (index in splitClass) {
                            //only add in classes not specified by the argument
                            if (splitClass[index] != className) {
                                newClass.push(splitClass[index]);
                            }
                        }
                        element.setAttribute("class", newClass.join(" "));
                    }
                }
            });
            return this;
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
            return this;
        },
        
        //remove an attribute from each of the matched elements
        removeAttr: function(name) {
            this.elements.map(function(element) {
                element.removeAttribute(name);
            });
            return this;
        },
        
        // Set CSS styling of an element
        css: function(name,value) {        
            // Set a style
            if(value) {
                this.elements.map(function(element) {
                    element.style[name] = value;
                });
                return this;
            
            // Display a style for the first element
            } else if(typeof(name) == 'string') {
                return this.elements[0].style[name];
            
            // Merge key/value pairs
            } else {
                // This loops through all has keys of "name", which is actually a hash
                for(var key in name) {
                    this.elements.map(function(element) {
                        element.style[key] = name[key];
                    });
                }
                return this;
            }
        },
        
        //insert content after each of the matched elements
        //content is a html string
        after: function(content) {
            domContent = html2dom(content);
            this.elements.map(function(element) {
                element.parentNode.insertBefore(domContent, element.nextSibling);
            });
            return this;
        },
        
        //insert content before each of the matched elements
        //content is a html string
        before: function(content) {
            domContent = html2dom(content);
            this.elements.map(function(element) {
                element.parentNode.insertBefore(domContent, element);
            });  
            return this;
        },
                            
        //wrap each matched element with the specified content
        //content can either be an html string or dom element
        wrap: function(content) {
            if (typeof content == "string") {
                //input is a html string
                domContent = html2dom(content);
            } else {
                //input is a dom element
                domContent = content;
            }
            this.elements.map(function(element) {
                element.parentNode.replaceChild(domContent,element);
                domContent.appendChild(element);
            });
            return this;
        },
        
        //wrap the inner contents of each matched element with an html string or dom element
        wrapInner: function(content) {
            if (typeof content == "string") {
                //input is an html string
                domContent = html2dom(content);
            } else {
                //input is a dom element
                domContent = content;
            }
            this.elements.map(function(element) {
                domContent.innerHTML = element.innerHTML;
                domContentHTML = dom2html(domContent);
                element.innerHTML = domContentHTML;
            }); 
            return this;
        },
        
        //replaces all matched elements with specified html or dom elements
        //returns wootQuery object that was replaced, which has been removed from the dom                                           
        replaceWith: function(content) {
            if (typeof content == "string") {
                //input is an html string
                domContent = html2dom(content);
            } else {
                //input is a dom element
                domContent = content;
            }
            this.elements.map(function(element) {
                element.parentNode.replaceChild(domContent, element);
            });
            return this;
        },
        
        //remove child nodes of each of the matched elements
        empty: function() {
            var div = document.createElement("div");
            this.elements.map(function(element) {
                element.innerHTML = div.innerHTML;
            });
            return this;            
        },
        
        //removes all matched elements from the DOM
        //does not remove elements from the returned wootQuery object, so we can use these matched elements further
        remove: function() {                                                    
            this.elements.map(function(element) {
                element.parentNode.removeChild(element);
            });
            return this;
        },
        
        //clone the matched elements and select them
        //note that the cloned elements don't have their parentNodes saved
        clone: function() {
            clonedElements = [];
            this.elements.map(function(element) {
                clonedElements.push(element.cloneNode(true));
            });
            this.elements = clonedElements;
            return this;
        },
        
        /************************************
            EVENT HANDLERS
        ************************************/
        
        click: function(fn) {
            this.elements.map(function(element) {
                // Executes a function when element is clicked
                if(fn) {
                    element.addEventListener('click',fn,false);
                    
                // Triggers the click function of an element
                } else {
                    // TODO: No idea how to do this.
                }
            });
            return this;
        },

        dblclick: function(fn) {
            this.elements.map(function(element) {
                // Executes a function when element is double-clicked
                if(fn) {
                    element.addEventListener('dblclick',fn,false);
                    
                // Triggers the dblclick function of an element
                } else {
                    // TODO: No idea how to do this.
                }
            });
            return this;
        },
        
        // Executes a function when mouse moves over an element
        mouseover: function(fn) {
            this.elements.map(function(element) {
                element.addEventListener('mouseover',fn,false);
            });
            return this;
        },
        
        // Executes a function when mouse moves out of an element
        mouseout: function(fn) {
            this.elements.map(function(element) {
                element.addEventListener('mouseout',fn,false);
            });
            return this;
        },
        
        // Combination of mouseover and mouseout
        hover: function(over,out) {
            this.mouseover(over);
            this.mouseout(out);
            return this;
        }

    }
    // Allow access to wootQuery.prototype methods
    wootQuery.fn.init.prototype = wootQuery.fn;
})();