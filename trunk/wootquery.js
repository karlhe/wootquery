(function(){
    var _$ = window.$;
    var _wootQuery = window.wootQuery;
    var wootQuery = window.$ = window.wootQuery = function(selector,context){
        alert("All your base are belong to us!");
    }
})();