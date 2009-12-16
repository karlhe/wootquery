$(document).ready(function() {
    $('p').append("ain't it?");
    $('p').css('background','#fcc');
    bg = $('p').css('background');
    $('p').append(bg);
    styles = {
        background: '#ccc',
        fontFamily: 'Consolas,"Courier New",Courier,monospace',
    }
    $('div').css(styles);
});