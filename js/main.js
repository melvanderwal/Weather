// If the padtop url parameter was provided, apply a margin to the top of the page so when 
// embedded in the MelStuff page it starts below the header
var urlParams = new URLSearchParams(window.location.search);
if (urlParams.has("padtop"))
    document.body.style.paddingTop = urlParams.get("padtop") + "px";


// Current Google Apps script deployment IDs
var gasMelStuffId = "AKfycbwm2L2FufJZH6BzJlpvxoDeSW6qRJ3OVW7o_bB8oTG9UHvC6GxBeZVMYfu8erMaRT6LnA";
var gasWeatherUndergroundID = "AKfycbxv3nvi-tbiUFPl-rc8QRF7iX8TrX0_54nbos5OJEN14nT_W4ne95d-Y7p4KWZFgkyzmA";