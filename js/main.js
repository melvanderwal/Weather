// If the padtop url parameter was provided, apply a margin to the top of the page so when 
// embedded in the MelStuff page it starts below the header
var urlParams = new URLSearchParams(window.location.search);
if (urlParams.has("padtop"))
    document.body.style.paddingTop = urlParams.get("padtop") + "px";

// Use different icons at different times of day
function updateSunriseSunset() {
    let now = new Date();
    let sunrise = new Date(sunriseSunset.sunriseLocal);
    let sunset = new Date(sunriseSunset.sunsetLocal);
    let hoursSinceSunrise = (now - sunrise) / 3600000;
    hoursSinceSunrise = hoursSinceSunrise < 0 ? 24 + hoursSinceSunrise : hoursSinceSunrise;
    let hoursUntilSunset = (sunset - now) / 3600000;
    hoursUntilSunset = hoursUntilSunset < 0 ? 24 + hoursUntilSunset : hoursUntilSunset;
    let isNight = now <= sunrise || now >= sunset;

    sunriseSunset.hoursSinceSunrise = hoursSinceSunrise;
    sunriseSunset.hoursUntilSunset = hoursUntilSunset;
    sunriseSunset.isNight = isNight;
    sunriseSunset.isDawn = !isNight && hoursSinceSunrise < 1.5;
    sunriseSunset.isDusk = !isNight && hoursUntilSunset < 1.5;
    sunriseSunset.sunriseTime = new Date(sunriseSunset.sunriseLocal).toLocaleTimeString(navigator.language, { timeStyle: "short" });
    sunriseSunset.sunsetTime = new Date(sunriseSunset.sunsetLocal).toLocaleTimeString(navigator.language, { timeStyle: "short" });
console.log(sunriseSunset);
}


