// Add the forecast to the page, start out with Ipswich
setForecastTown("ipswich");
function setForecastTown(town) {
    let containerDiv = document.getElementById("forecastDays");
    containerDiv.innerHTML = "";
    let descriptionSpan = document.getElementById("forecastDescription");
    descriptionSpan.innerHTML = "";

    document.getElementById("ipswichLabel").className = town == "ipswich" ? "forecastTownActive" : "forecastTownInactive";
    document.getElementById("kenmoreLabel").className = town == "kenmore" ? "forecastTownActive" : "forecastTownInactive";
    document.getElementById("warwickLabel").className = town == "warwick" ? "forecastTownActive" : "forecastTownInactive";

    let dayIdx = 0;
    forecast[town].forEach(day => {
        dayIdx += 1;
        let templateNode = document.getElementById("forecastDayTemplate").cloneNode(true);
        let dayDiv = document.createElement("div");
        dayDiv.innerHTML = templateNode.innerHTML;

        let iconInfo = forecastIcon(day.image);
        dayDiv.getElementsByClassName("forecastDay")[0].textContent = dayIdx == 1 ? "Today" : day.day;
        dayDiv.getElementsByClassName("forecastIcon")[0].className = "forecastIcon " + iconInfo[0];
        dayDiv.getElementsByClassName("forecastIcon")[0].style.color = iconInfo[1];
        if (day.min) dayDiv.getElementsByClassName("forecastMin")[0].textContent = day.min + "°";
        if (day.max) dayDiv.getElementsByClassName("forecastMax")[0].textContent = day.max + "°";
        if (day.rain) dayDiv.getElementsByClassName("forecastPrecipMm")[0].textContent = day.rain;
        if (day.precipPercent) dayDiv.getElementsByClassName("forecastPrecipPct")[0].textContent = day.precipPercent + "%";
        dayDiv.getElementsByClassName("forecastSummary")[0].textContent = day.summary.substring(0, day.summary.length - 1);
        dayDiv.getElementsByClassName("forecastDayContainer")[0].title = day.description;

        dayDiv.onpointerdown = function () { 
            descriptionSpan.textContent = day.description; 
            let borderDays = containerDiv.getElementsByClassName("forecastDayContainer");
            for (let index = 0; index < borderDays.length; index++) {
                borderDays[index].style = "border-style: none;";                
            }
            
            dayDiv.getElementsByClassName("forecastDayContainer")[0].style = "border-style: dotted;";
        }
        containerDiv.appendChild(dayDiv);
    });
}

function forecastIcon(image) {
    if (image == "sunny") return ["fad fa-sun", "#ffff00"];
    else if (image == "clear") return ["fad fa-moon-stars", "#ffff9d"];

    else if (image == "cloudy") return ["fad fa-clouds", "#e0e0e0"];
    else if (image == "partly-cloudy") return ["fad fa-cloud-sun", "#ffffff"];
    else if (image == "partly-cloudy-night") return ["fad fa-cloud-moon", "#ffffff"];

    else if (image == "light-showers") return ["fad fa-cloud-sun-rain", "#ffffff"];
    else if (image == "light-showers-night") return ["fad fa-cloud-moon-rain", "#ffffff"];
    else if (image == "showers") return ["fad fa-cloud-sun-rain", "#ffffff"];
    else if (image == "showers-night") return ["fad fa-cloud-moon-rain", "#ffffff"];
    else if (image == "heavy-showers") return ["fad fa-cloud-drizzle", "#8d8d8d"];
    else if (image == "light-rain") return ["fad fa-cloud-showers-heavy", "#727272"];
    else if (image == "rain") return ["fad fa-cloud-rain", "#575757"];

    else if (image == "storm") return ["fad fa-thunderstorm", "#7d7d7d"];
    else if (image == "wind") return ["fad fa-wind", "#b2b2b2"];
    else if (image == "cyclone") return ["fad fa-hurricane", "#77bbff"];

    else if (image == "fog") return ["fad fa-fog", "#bfbfbf"];
    else if (image == "fog-night") return ["fad fa-fog", "#bfbfbf"];
    else if (image == "haze") return ["fad fa-sun-haze", "#dadada"];
    else if (image == "haze-night") return ["fad fa-smog", "#a4a4a4"];
    else if (image == "dust") return ["fad fa-sun-dust", "#ff8040"];

    else if (image == "frost") return ["fad fa-snowflake", "#ffffff"];
    else if (image == "snow") return ["fad fa-snowman", "#ff0000"];
}
