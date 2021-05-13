var sunriseSunset;
function setForecast() {
    let containerDiv = document.getElementById("forecastDays");
    containerDiv.innerHTML = "";
    let descriptionSpan = document.getElementById("forecastDescription");
    descriptionSpan.innerHTML = "";

    // Get forecast from WillyWeather via Google Apps Script
    //let url = "https://api.willyweather.com.au/v2/NTQwZjI1MzIwMTY1YzNiYTI5NjE4Ym/locations/8055/weather.json?forecasts=weather,rainfall,sunrisesunset&regionPrecis=true";
    let url = "https://script.google.com/macros/s/AKfycbwm2L2FufJZH6BzJlpvxoDeSW6qRJ3OVW7o_bB8oTG9UHvC6GxBeZVMYfu8erMaRT6LnA/exec?action=forecast";
    fetch(url, { method: 'GET' })
        .then(response => response.json())
        .then(forecastJson => {
            let dayIdx = 0;
            //console.log(forecastJson);
            forecastJson.forecasts.weather.days.forEach(weather => {
                // Get data from JSON
                weather = weather.entries[0];
                let precis = forecastJson.regionPrecis.days[dayIdx].entries[0];
                let rainfall = forecastJson.forecasts.rainfall.days[dayIdx].entries[0];

                if (dayIdx == 0) {
                    sunriseSunset = forecastJson.forecasts.sunrisesunset.days[dayIdx].entries[0];
                    updateSunriseSunset();
                }

                if (!rainfall.startRange && !rainfall.endRange)
                    rainfall.label = null;
                else
                    rainfall.label = (!rainfall.startRange ? "" : rainfall.startRange) + (!rainfall.rangeDivide ? "" : rainfall.rangeDivide) + (!rainfall.endRange ? "" : rainfall.endRange) + "mm";
                let dayName = new Date(weather.dateTime).toLocaleString("default", { weekday: "long" })

                // Populate div with that day's forecast info
                let templateNode = document.getElementById("forecastDayTemplate").cloneNode(true);
                let dayDiv = document.createElement("div");
                dayDiv.innerHTML = templateNode.innerHTML;

                let iconInfo = forecastIcon(weather.precisCode, weather.night);
                dayDiv.getElementsByClassName("forecastDay")[0].textContent = dayIdx == 0 ? "Today" : dayName;
                dayDiv.getElementsByClassName("forecastIcon")[0].className = "forecastIcon " + iconInfo[0];
                dayDiv.getElementsByClassName("forecastIcon")[0].style.color = iconInfo[1];
                if (weather.min) dayDiv.getElementsByClassName("forecastMin")[0].textContent = weather.min + "°";
                if (weather.max) dayDiv.getElementsByClassName("forecastMax")[0].textContent = weather.max + "°";
                if (rainfall.label) dayDiv.getElementsByClassName("forecastPrecipMm")[0].textContent = rainfall.label;
                if (!rainfall.label) dayDiv.getElementsByClassName("forecastNoPrecip")[0].style.display = "block";
                if (rainfall.probability) dayDiv.getElementsByClassName("forecastPrecipPct")[0].textContent = rainfall.probability + "%";
                dayDiv.getElementsByClassName("forecastSummary")[0].textContent = weather.precis;
                dayDiv.getElementsByClassName("forecastDayContainer")[0].title = precis.precis;

                // Add a click event to show the forecast description when user clicks on a day
                dayDiv.onpointerdown = function () {
                    descriptionSpan.textContent = precis.precis;
                    let borderDays = containerDiv.getElementsByClassName("forecastDayContainer");
                    for (let index = 0; index < borderDays.length; index++) {
                        borderDays[index].style = "border-style: none;";
                    }
                    dayDiv.getElementsByClassName("forecastDayContainer")[0].style = "border-style: dotted;";
                }

                // Append the div, and select it if it's today's forecast
                containerDiv.appendChild(dayDiv);
                if (dayIdx == 0) dayDiv.dispatchEvent(new Event('pointerdown'));
                dayIdx += 1;
            })
        })
        .catch(function (error) {
            console.log(error);
            lastUpdated.dataset.value = "An error occurred";
        });
}

function forecastIcon(image, night) {
    if (night == false) {
        if (image == "fine") return ["fad fa-sun", "#ffff00"];
        else if (image == "mostly-fine") return ["fad fa-sun", "#ffff00"];

        else if (image == "high-cloud") return ["fad fa-cloud-sun", "#ffffff"];
        else if (image == "partly-cloudy") return ["fad fa-cloud-sun", "#ffffff"];
        else if (image == "mostly-cloudy") return ["fad fa-clouds", "#e0e0e0"];
        else if (image == "cloudy") return ["fad fa-clouds", "#e0e0e0"];
        else if (image == "overcast") return ["fad fa-clouds", "#e0e0e0"];

        else if (image == "shower-or-two") return ["fad fa-cloud-sun-rain", "#ffffff"];
        else if (image == "chance-shower-fine") return ["fad fa-cloud-sun-rain", "#ffffff"];
        else if (image == "chance-shower-cloud") return ["fad fa-cloud-sun-rain", "#ffffff"];
        else if (image == "drizzle") return ["fad fa-cloud-drizzle", "#8d8d8d"];
        else if (image == "few-showers") return ["fad fa-cloud-drizzle", "#8d8d8d"];
        else if (image == "showers-rain") return ["fad fa-cloud-showers-heavy", "#727272"];
        else if (image == "heavy-showers-rain") return ["fad fa-cloud-rain", "#575757"];

        else if (image == "chance-thunderstorm-fine") return ["fad fa-thunderstorm", "#7d7d7d"];
        else if (image == "chance-thunderstorm-cloud") return ["fad fa-thunderstorm", "#7d7d7d"];
        else if (image == "chance-thunderstorm-showers") return ["fad fa-thunderstorm", "#7d7d7d"];
        else if (image == "thunderstorm") return ["fad fa-thunderstorm", "#7d7d7d"];

        else if (image == "chance-snow-fine") return ["fad fa-snowman", "#ff0000"];
        else if (image == "chance-snow-cloud") return ["fad fa-snowman", "#ff0000"];
        else if (image == "snow-and-rain") return ["fad fa-snowman", "#ff0000"];
        else if (image == "light-snow") return ["fad fa-snowman", "#ff0000"];
        else if (image == "snow") return ["fad fa-snowman", "#ff0000"];
        else if (image == "heavy-snow") return ["fad fa-snowman", "#ff0000"];

        else if (image == "wind") return ["fad fa-wind", "#b2b2b2"];
        else if (image == "frost") return ["fad fa-snowflake", "#ffffff"];
        else if (image == "fog") return ["fad fa-fog", "#bfbfbf"];
        else if (image == "hail") return ["fad fa-thunderstorm", "#7d7d7d"];
        else if (image == "dust") return ["fad fa-sun-dust", "#ff8040"];
    }
    else {
        if (image == "fine") return ["fad fa-moon-stars", "#ffff9d"];
        else if (image == "mostly-fine") return ["fad fa-moon-stars", "#ffff9d"];

        else if (image == "high-cloud") return ["fad fa-cloud-moon", "#ffffff"];
        else if (image == "partly-cloudy") return ["fad fa-cloud-moon", "#ffffff"];
        else if (image == "mostly-cloudy") return ["fad fa-cloud-moon", "#ffffff"];
        else if (image == "cloudy") return ["fad fa-cloud-moon", "#ffffff"];
        else if (image == "overcast") return ["fad fa-cloud-moon", "#ffffff"];

        else if (image == "shower-or-two") return ["fad fa-cloud-moon-rain", "#ffffff"];
        else if (image == "chance-shower-fine") return ["fad fa-cloud-moon-rain", "#ffffff"];
        else if (image == "chance-shower-cloud") return ["fad fa-cloud-moon-rain", "#ffffff"];
        else if (image == "drizzle") return ["fad fa-cloud-moon-rain", "#ffffff"];
        else if (image == "few-showers") return ["fad fa-cloud-moon-rain", "#ffffff"];
        else if (image == "showers-rain") return ["fad fa-cloud-moon-rain", "#ffffff"];
        else if (image == "heavy-showers-rain") return ["fad fa-cloud-moon-rain", "#ffffff"];

        else if (image == "chance-thunderstorm-fine") return ["fad fa-thunderstorm", "#7d7d7d"];
        else if (image == "chance-thunderstorm-cloud") return ["fad fa-thunderstorm", "#7d7d7d"];
        else if (image == "chance-thunderstorm-showers") return ["fad fa-thunderstorm", "#7d7d7d"];
        else if (image == "thunderstorm") return ["fad fa-thunderstorm", "#7d7d7d"];

        else if (image == "chance-snow-fine") return ["fad fa-snowman", "#ff0000"];
        else if (image == "chance-snow-cloud") return ["fad fa-snowman", "#ff0000"];
        else if (image == "snow-and-rain") return ["fad fa-snowman", "#ff0000"];
        else if (image == "light-snow") return ["fad fa-snowman", "#ff0000"];
        else if (image == "snow") return ["fad fa-snowman", "#ff0000"];
        else if (image == "heavy-snow") return ["fad fa-snowman", "#ff0000"];

        else if (image == "wind") return ["fad fa-wind", "#b2b2b2"];
        else if (image == "frost") return ["fad fa-snowflake", "#ffffff"];
        else if (image == "fog") return ["fad fa-fog", "#bfbfbf"];
        else if (image == "hail") return ["fad fa-thunderstorm", "#7d7d7d"];
        else if (image == "dust") return ["fad fa-sun-dust", "#ff8040"];
    }
}

function updateSunriseSunset() {
    let now = new Date();
    let sunrise = new Date(sunriseSunset.riseDateTime);
    let sunset = new Date(sunriseSunset.setDateTime);
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
    sunriseSunset.sunriseTime = new Date(sunriseSunset.riseDateTime).toLocaleTimeString(navigator.language, { timeStyle: "short" }).replace("am","").replace("pm","").replace(" ","");
    sunriseSunset.sunsetTime = new Date(sunriseSunset.setDateTime).toLocaleTimeString(navigator.language, { timeStyle: "short" }).replace("am","").replace("pm","")
    sunriseSunset.firstLightTime = new Date(sunriseSunset.firstLightDateTime).toLocaleTimeString(navigator.language, { timeStyle: "short" }).replace("am","").replace("pm","")
    sunriseSunset.lastLightTime = new Date(sunriseSunset.lastLightDateTime).toLocaleTimeString(navigator.language, { timeStyle: "short" }).replace("am","").replace("pm","")
    console.log(sunriseSunset);
}
setForecast();