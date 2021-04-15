// If the padtop url parameter was provided, apply a margin to the top of the page so when 
// embedded in the MelStuff page it starts below the header
var urlParams = new URLSearchParams(window.location.search);
if (urlParams.has("padtop"))
    document.body.style.paddingTop = urlParams.get("padtop") + "px";



