// This code should be executed when the DOM is ready
$(document).ready(function() {
    woot = $('#woot').clone().get(0);
    $('#clone').replaceWith(woot);
    $('p').append("ain't it?");
    $('p').css('background','#fcc');    // Set BG color of <p> to #fcc
    bg = $('p').css('background');      // Store current background color of <p> into variable bg
    $('div:first').append(" Background of next line: " + bg);                  
    // This looks almost the same as normal CSS, but not quite. Note conventions.
    styles = {
        background: '#ccc',
        fontFamily: 'Consolas,"Courier New",Courier,monospace',
    }
    $('div').css(styles);               // Merge the styles hash into the styles of <div>
    
    $('div').click(function() {
        $('p').append("?");
    });
    $('div').click();
    
    $('p').dblclick(function() {
        $('p').append("!");
    });
    $('p').dblclick();
    
    $('div').hover(
        function() {
            $(this).css('fontWeight','bold');
        }, function() {
            $(this).css('fontWeight','normal');
        }
    );
});