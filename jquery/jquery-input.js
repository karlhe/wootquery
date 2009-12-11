$(document).ready(function(){
    $("a").click(function(event){
        $(this).append("!");
        event.preventDefault();
    });
    $("#codify").click(function(event){
        $(".code").toggleClass("highlight");
        // $(this).replaceWith("Welcome to the Show!");
    });
});