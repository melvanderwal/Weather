// If the padtop url parameter was provided, apply a margin to the top of the page so when 
// embedded in the MelStuff page it starts below the header
var urlParams = new URLSearchParams(window.location.search);
if (urlParams.has("padtop"))
    document.body.style.paddingTop = urlParams.get("padtop") + "px";

// Use different icons at different times of day
var now = new Date();
var sunrise = new Date(sunriseSunset.sunriseLocal);
var sunset = new Date(sunriseSunset.sunsetLocal);
var isNight = now <= sunrise && now >= sunset;
var isDawn = !isNight && ((now - sunrise) / 3600000) < 1.5;
var isDusk = !isNight && ((sunset - now) / 3600000) < 1.5;
