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
    
    // Given a parent node and a selector (and optional selection type), returns DOM elements
    simpleExpr = /^([#\.])?([\w-]+)(:[\w-]+)?$/;
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
        
        // Select only the first element found
        if(expr[3] == ':first') {
            elementList = [elementList[0]];
        
        // Select only the last element found
        } else if(expr[3] == ':last') {
            elementList = [elementList[elementList.length-1]];
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
    
    // Define methods for the wootQuery prototype
    wootQuery.fn = wootQuery.prototype = {
        // Establish the state of the wootQuery instance
        
        init: function(selector) {
            selector = selector || document;
                        
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
            this.selector = selector;
            return this;
        },
        
        // Just for fun
        capture: function() {
            alert("All your base, are belong to us!");
        },
        
        //for checking if an object is a wootQuery object
        isWootQuery: true,
        
        get: function(index) {
            // Returns element at "index" of "elements"
            if(typeof(index) == 'number') {
                return this.elements[index];
                
            // Returns all elements
            } else {
                return this.elements;
            }
        },
        
        //returns the number of elements in the wootQuery object
        size: function() {
            return this.elements.length;
        },
        
        selector: this.selector,
        
        find: function(expr) {
            newElements = [];
            this.elements.map(function(element) {
                newElements = newElements.concat(fetchElement(element,expr));
            });
            this.elements = newElements;
            return this;
        },
        
        // An iterator function for the matched elements
        each: function(callback) {
            this.elements.map(function(element) {
                callback(element);
            });
            return this;
        },
        
        //for checking if an object is a wootQuery object
        isWootQuery: true,
        
        // Executes fn when page is done loading
        // TODO: Research DOM-readiness checking, jQuery uses a better method than window.onload
        ready: function(fn) {
            window.onload = function() { fn(); }
            return this;
        },
        
        html: function(val) {
            //set the innerHTML contents of every matched element
            if(val != null) {
                this.elements.map(function(element) {
                    element.innerHTML = val;
                });
                return this;
            
            // Returns the innerHTML of the first matched element
            } else {
                if(this.elements[0]) {
                    return this.elements[0].innerHTML;
                } else {
                    return null;
                }
            }
        },
        
        // Appends content to innerHTML of matched elements
        // content can be either a wootQuery object, dom element, or html string
        append: function(content) {
            if (typeof content == "object") {
                if (content.isWootQuery) {
                    //content is a wootQuery object. append all of content's elements to the matched elements
                    var contentArr = [];
                    content.elements.map(function(element) {
                        contentArr.push(dom2html(element));
                    });
                    content = contentArr.join(" ");                
                } else {
                    //content is a dom element. convert it to a string
                    content = dom2html(content);
                }
            } 
            this.elements.map(function(element) {
                element.innerHTML = element.innerHTML + content;
            });
            return this;
        },
        
        // Prepends content to innerHTML of matched elements
        // content can be either a wootQuery object, dom element, or html string
        prepend: function(content) {
            if (typeof content == "object") {
                if (content.isWootQuery) {
                    //content is a wootQuery object. append all of content's elements to the matched elements
                    var contentArr = [];
                    content.elements.map(function(element) {
                        contentArr.push(dom2html(element));
                    });
                    content = contentArr.join(" ");                
                } else {
                    //content is a dom element. convert it to a string
                    content = dom2html(content);
                }
            }            
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
        
        attr: function(name, value) {
            // Set a single property to a value on all the matched elements
            if(value != null) {
                this.elements.map(function(element) {
                    element.setAttribute(name, value);
                });
                return this;
            
            // Return the given attribute of the first matched element
            } else {
                if (this.elements[0]) {
                    return this.elements[0].getAttribute(name);            
                } else {
                    return null;
                }
            }
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
                if (this.elements[0]) {
                    return this.elements[0].style[name];            
                } else {
                    return null;
                }
                
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
        
        //reduce the set of matched elements to be the nth matched element
        eq: function(n) {
            matchedElement = [];
            for (index in this.elements) {
                if (index == n) {
                    matchedElement.push(this.elements[index]);
                }
            }
            this.elements = matchedElement;
            return this;
        },
                
        //selects a subset of the matched elements, specified by the start and end indices of the set of matched elements
        slice: function(start, end) {
            matchedElements = [];
            if (end) {
                for (index in this.elements) {
                    if (index >= start && index <= end) {
                        matchedElements.push(this.elements[index]);
                    }
                }
            } else {
                for (index in this.elements) {
                    if (index >= start) {
                        matchedElements.push(this.elements[index]);
                    }
                }
            }
            this.elements = matchedElements;
            return this;
        },
        
        //remove elements matching the selector from the list of matched elements
        not: function(selector) {
            matchedElements = []
            wootQuery2 = new wootQuery.fn.init(selector);
            for (index in this.elements) {
                if (wootQuery2.elements.indexOf(this.elements[index]) == -1) {
                    matchedElements.push(this.elements[index]);
                }
            }
            this.elements = matchedElements;
            return this;
        },
        
        //keeps only elements from the set of matched elements that match the given argument 
        //the argument can either be a selector or function
        //if argument is function, keeps elements for which the function returns true
        filter: function(arg) {
            matchedElements = [];
            if (typeof arg == "string") {
                //argument is a selector
                wootQuery2 = new wootQuery.fn.init(arg);
                for (index in this.elements) {
                    if (wootQuery2.elements.indexOf(this.elements[index]) != -1) {
                        matchedElements.push(this.elements[index]);
                    }
                }
            } else {
                //argument is a function
                for (index in this.elements) {
                    if (arg(this.elements[index])) {
                        matchedElements.push(this.elements[index]);
                    }
                }
            }
            this.elements = matchedElements;
            return this;
        },
        
        //checks if at least one of the matched elements matches the given selector. returns true or false
        is: function(selector) {
            wootQuery2 = new wootQuery.fn.init(selector);
            for (index in this.elements) {
                if (wootQuery2.elements.indexOf(this.elements[index]) != -1) {
                    return true;
                }
            }
            return false;
        },
        
        //add more elements, matched by the selector, to the set of matched elements
        add: function(selector) {
            wootQuery2 = new wootQuery.fn.init(selector);
            this.elements = this.elements.concat(wootQuery2.elements);
            return this;
        },
        
        //get the set of elements containing all of the children of the set of matched elements
        children: function() {
            childElements = [];
            this.elements.map(function(element) {
                for (index in element.children) {
                    childElements.push(element.children[index]);
                }
            });
            this.elements = childElements;
            return this;
        }, 
        
        //get the set of the parent elements of each of the matched elements
        parent: function() {
            parentElements = [];
            this.elements.map(function(element) {
                if (element.parentNode) {
                    parentElements.push(element.parentNode);
                }
            });
            this.elements = parentElements;
            return this;
        },
        
        //get the set of next siblings of each of the matched elements
        next: function() {
            siblingElements = [];
            this.elements.map(function(element) {
                var nxtSibling = element.nextSibling;
                while (nxtSibling) {
                    if (nxtSibling.nodeType == 1) {
                        siblingElements.push(nxtSibling);
                        break;
                    } else {
                        nxtSibling = nxtSibling.nextSibling;
                    }
                }
            });
            this.elements = siblingElements;
            return this;
        },
        
        //get the set of previous siblings of each of the matched elements
        prev: function() {
            siblingElements = [];
            this.elements.map(function(element) {
                var prevSibling = element.previousSibling;
                while (prevSibling) {
                    if (prevSibling.nodeType == 1) {
                        siblingElements.push(prevSibling);
                        break;
                    } else {
                        prevSibling = prevSibling.previousSibling;
                    }
                }
            });
            this.elements = siblingElements;
            return this;            
        },
        
        siblings: function() {
        
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
                    // I'm not sure about browser compatibility of this:
                    evt = document.createEvent('MouseEvents'); 
                    evt.initMouseEvent(
                    'click',
                    true,     // Click events bubble
                    true,     // and they can be cancelled
                    document.defaultView,  // Use the default view
                    1,        // Just a single click
                    0,        // Don't bother with co-ordinates
                    0,
                    0,
                    0,
                    false,    // Don't apply any key modifiers
                    false,
                    false,
                    false,
                    0,        // 0 - left, 1 - middle, 2 - right
                    null);    // Click events don't have any targets other than
                             // the recipient of the click
                    element.dispatchEvent(evt);
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
                    // TODO: No idea how to do this
                }
            });
            return this;
        },
        
        /*  Note for mouseover,mouseout,hover:
        *   This does not quite work correctly when there are nested elements.
        *   From what I can tell, this has something to do with event bubbling,
        *   However I do not know how to fix this as of the moment.
        */
        
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
        },

    }
    // Allow access to wootQuery.prototype methods
    wootQuery.fn.init.prototype = wootQuery.fn;
})();