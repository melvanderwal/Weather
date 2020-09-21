// If the padtop url parameter was provided, apply a margin to the top of the page so when 
// embedded in the MelStuff page it starts below the header
var urlParams = new URLSearchParams(window.location.search);
if (urlParams.has("padtop"))
    document.body.style.paddingTop = urlParams.get("padtop") + "px";


// Add the forecast to the page
["ipswich", "kenmore"].forEach(town => {
    let townDiv = document.getElementById(town);

    forecast[town].forEach(day => {
        let templateNode = document.getElementById("forecastDayTemplate").cloneNode(true);
        let dayDiv = document.createElement("div");
        dayDiv.innerHTML = templateNode.innerHTML;

        dayDiv.getElementsByClassName("forecastDay")[0].textContent = day.day;
        dayDiv.getElementsByClassName("forecastImage")[0].setAttribute("src", "res/" + day.image + ".png");
        if (day.min) dayDiv.getElementsByClassName("forecastMin")[0].textContent = day.min + "°";
        if (day.max) dayDiv.getElementsByClassName("forecastMax")[0].textContent = day.max + "°";
        if (day.rain) dayDiv.getElementsByClassName("forecastPrecipMm")[0].textContent = day.rain;
        if (day.precipPercent) dayDiv.getElementsByClassName("forecastPrecipPct")[0].textContent = day.precipPercent + "%";
        dayDiv.getElementsByClassName("forecastSummary")[0].textContent = day.summary;
        dayDiv.onpointerdown = function() { document.getElementById(town + "ForecastDescription").textContent = day.day + ": " + day.description; }
        townDiv.appendChild(dayDiv);
    });
});

// Opens a fullscreen iframe with the link stored on the calling button's data-link attribute
function setFullScreenElement(callingElement) {
    if (!callingElement) return;
    const link = callingElement.srcElement.dataset.link;
    if (!link) return;
    document.getElementById("fullscreenFrame").setAttribute("src", link);
    document.getElementById("fullscreenFrame").requestFullscreen();
}

// Clears the src of the fullscreen iframe when leaving fullscreen
document.onfullscreenchange = function (event) {
    if (!document.fullscreenElement)
        document.getElementById("fullscreenFrame").setAttribute("src", "");
}

// Adds a row with the provided charts to the document
function addRow(chartSet) {
    var row = document.createElement("div");
    row.classList.add("row");
    chartSet.charts.forEach(chart => {
        row.appendChild(chartFrame(chart[0], chart[1], chartSet.height));
    });
    document.getElementById("outerContent").appendChild(row);
}

var loadCount = 0;
var chartCount = 0;
function chartFrame(className, chartOid, height) {

    let link = "https://docs.google.com/spreadsheets/u/0/d/e/2CAIWO3eme_Nua8MpNjEEzFQTtHWDJLQYX82dP1cwA_Mam93-Dbo763wPfn9j1UQrg5KFNSzRq2GjqLIoBdQ/gviz/chartiframe?autosize=true&oid=" + chartOid;

    // Create IFrame
    let frame = document.createElement("iframe");
    frame.classList.add(className);
    frame.setAttribute("frameborder", "0");
    frame.setAttribute("src", link);
    frame.style.height = height + "px";

    // After all the charts have loaded, hide the startup animation
    frame.onload = function () {
        loadCount += 1;
        if (loadCount == chartCount)
            document.getElementById("kickstart").style.display = "none";
    };

    // Create a button that opens the chart in fullscreen mode
    let popoutBtn = document.createElement("span");
    popoutBtn.className = "popoutIcon fas fa-external-link-square-alt";
    popoutBtn.dataset.link = link;
    popoutBtn.addEventListener("click", setFullScreenElement);

    // Put the frame and button into a div
    let container = document.createElement("div");
    container.className = "frameContainer";
    container.appendChild(popoutBtn);
    container.appendChild(frame);

    return container;
}


let charts = [
    { "height": 150, "charts": [["chart", 1178812911]] },
    { "height": 300, "charts": [["chart", 1343807972]] },
    { "height": 250, "charts": [["chart", 2002231473], ["chart", 1524167861]] },
    { "height": 350, "charts": [["chart", 469278234]] },
    { "height": 250, "charts": [["chart", 1514251050], ["chart", 1598170161]] },
    { "height": 350, "charts": [["chart", 1036758008]] },
    { "height": 350, "charts": [["chart", 104556950]] },
    { "height": 250, "charts": [["chart", 992399964]] },
    { "height": 250, "charts": [["chart", 1511096733]] }
]

charts.forEach(chartSet => {
    chartCount += chartSet.charts.length;
    addRow(chartSet);
});

function getCurrentConditions() {
    let parentNode = document.querySelector("#conditionsData");
    let lastUpdated = parentNode.querySelector("#lastUpdated");
    let currentTemp = parentNode.querySelector("#currentTemp");
    let feelsLikeTemp = parentNode.querySelector("#feelsLikeTemp");
    let humidity = parentNode.querySelector("#humidity");
    let uvIndex = parentNode.querySelector("#uvIndex");
    let windDir = parentNode.querySelector("#windDir");
    let windSpeed = parentNode.querySelector("#windSpeed");
    let windGust = parentNode.querySelector("#windGust");
    let precipRate = parentNode.querySelector("#precipRate");
    let precipTotal = parentNode.querySelector("#precipTotal");
    let pressure = parentNode.querySelector("#pressure");
    let dewPoint = parentNode.querySelector("#dewPoint");



    let url = "https://api.weather.com/v2/pws/observations/current?stationId=IBRISBAN393&format=json&units=m&numericPrecision=decimal&apiKey=759a03e6e0844b2c9a03e6e0843b2ce7";
    fetch(url, { method: 'GET' })
        .then(response => response.json())
        .then(json => {
            let data = json.observations[0];

            // Set text display values
            lastUpdated.dataset.value = data.obsTimeLocal;
            currentTemp.dataset.value = data.metric.temp + "°";
            feelsLikeTemp.dataset.value = humidex(data.metric.temp, data.humidity) + "°";
            humidity.dataset.value = data.humidity + "%";
            uvIndex.dataset.value = data.uv;
            windDir.dataset.value = data.metric.windSpeed == 0 ? "" : data.winddir + "°";
            windSpeed.dataset.value = data.metric.windSpeed + "km/h";
            windGust.dataset.value = data.metric.windGust + "km/h";
            precipRate.dataset.value = data.metric.precipRate == 0 ? "" : data.metric.precipRate + "mm/hr";
            precipTotal.dataset.value = data.metric.precipTotal + "mm";
            pressure.dataset.value = data.metric.pressure + "hPa";
            dewPoint.dataset.value = data.metric.dewpt + "°";

            // Set text color
            lastUpdated.style.color = "#999999";
            currentTemp.style.color = getColor("temp", data.metric.temp);
            feelsLikeTemp.style.color = getColor("humidex", humidex(data.metric.temp, data.humidity));
            dewPoint.style.color = getColor("dewpt", data.metric.temp - data.metric.dewpt);
            precipRate.style.color = getColor("precipRate", data.metric.precipRate);
            precipTotal.style.color = getColor("precipTotal", data.metric.precipTotal);
            uvIndex.style.color = getColor("uv", data.uv);
            humidity.style.color = getColor("humidity", data.humidity);
            pressure.style.color = getColor("pressure", data.metric.pressure);
            windDir.style.color = "rgb(20,100,100)";
            windSpeed.style.color = "rgb(20,100,100)";
            windGust.style.color = "rgb(20,100,100)";

            // Set icon properties
            setIcon("humidex", humidex(data.metric.temp, data.humidity));
            setIcon("winddir", [data.winddir, data.metric.windSpeed]);
            setIcon("uv", data.uv);
            setIcon("humidity", data.humidity);
            setIcon("precipRate", data.metric.precipRate);
            setIcon("temp", data.metric.temp);
            setIcon("dewpt", data.metric.temp - data.metric.dewpt);
            setIcon("pressure", data.metric.pressure);

        })
        .catch(function (error) {
            lastUpdated.dataset.value = "An error occurred";
        });
}


// Set current conditions weather icon properties
function setIcon(measurement, value) {
    let element;
    let iconClass;
    let color;


    if (measurement == "winddir") {
        let windDir = value[0];
        let windSpeed = value[1];
        element = document.querySelector("#windIcon");
        if (windSpeed > 0) element.style.transform = "rotate(" + (-45 + windDir) + "deg)";
        iconClass = windSpeed == 0 ? "ban" : "location-arrow";
        color = "rgb(20,100,100)";
    }
    else if (measurement == "humidex") {
        element = document.querySelector("#feelsLikeIcon");
        if (value < 10) {
            iconClass = "grimace";
            color = "rgb(0,0,255)";
        }
        else {
            if (value < 29) iconClass = "smile";
            else if (value < 35) iconClass = "meh";
            else if (value < 40) iconClass = "flushed";
            else if (value < 45) iconClass = "grin-beam-sweat";
            else iconClass = "dizzy";
            color = getColor("humidex", value);
        }
    }
    else if (measurement == "uv") {
        element = document.querySelector("#uvIcon");
        if (value < 1) iconClass = "moon";
        else if (value < 3) iconClass = "cloud";
        else if (value < 6) iconClass = "cloud-sun";
        else iconClass = "sun";
        color = getColor("uv", value);
    }
    else if (measurement == "precipRate") {
        element = document.querySelector("#rainRateIcon");
        if (value == 0) iconClass = "tint-slash";
        else if (value < 2) iconClass = "cloud-sun-rain";
        else iconClass = "cloud-showers-heavy";
        color = getColor("precipRate", value);
    }
    else if (measurement == "temp") {
        element = document.querySelector("#temperatureIcon");
        if (value < 10) iconClass = "thermometer-empty";
        else if (value < 18) iconClass = "thermometer-quarter";
        else if (value < 26) iconClass = "thermometer-half";
        else if (value < 34) iconClass = "thermometer-three-quarters";
        else iconClass = "thermometer-full";
        color = getColor("temp", value);
    }
    else if (measurement == "pressure") {
        element = document.querySelector("#pressureIcon");
        if (value < 1000) iconClass = "thermometer-empty";
        else if (value < 1005) iconClass = "thermometer-quarter";
        else if (value < 1010) iconClass = "thermometer-half";
        else if (value < 1020) iconClass = "thermometer-three-quarters";
        else iconClass = "thermometer-full";
        color = getColor("pressure", value)
    }
    else if (measurement == "dewpt") {
        element = document.querySelector("#dewPointIcon");
        iconClass = value <= 0 ? "tint" : "tint-slash";
        color = getColor("dewpt", value)
    }
    else if (measurement == "humidity") {
        element = document.querySelector("#humidityIcon");
        iconClass = "tint";
        color = getColor("humidity", value);
    }

    element.className = "weatherIcon darkHalo fas fa-" + iconClass;
    element.style.color = color;
}

function getColor(measurement, value) {
    if (measurement == "precipRate") return scaleColor(scaleNumber(value, 0, 50), [169, 194, 219], [0, 0, 255]);
    if (measurement == "precipTotal") return scaleColor(scaleNumber(value, 0, 25), [169, 194, 219], [0, 0, 255]);
    if (measurement == "humidity") return scaleColor(scaleNumber(value, 50, 100), [169, 194, 219], [0, 0, 255]);
    if (measurement == "dewpt") return scaleColor(scaleNumber(value, 0, 5), [0, 0, 255], [169, 194, 219]);
    if (measurement == "humidex") return scaleColor(scaleNumber(value, 25, 40), [0, 255, 0], [255, 0, 0]);
    if (measurement == "uv") return scaleColor(scaleNumber(value, 1, 10), [77, 255, 0], [255, 0, 0]);
    if (measurement == "uvIcon") return scaleColor(scaleNumber(value, 1, 10), [0, 0, 0], [255, 0, 0]);

    if (measurement == "temp")
        return (value < 24) ?
            scaleColor(scaleNumber(value, 0, 24), [0, 0, 255], [0, 255, 0]) :
            scaleColor(scaleNumber(value, 24, 35), [0, 255, 0], [255, 0, 0]);

    if (measurement == "pressure") {
        if (value < 1000) return "dimgray";
        else if (value < 1005) return "darkgray";
        else if (value < 1010) return "silver";
        else if (value < 1020) return "LemonChiffon";
        else return "gold";
    }
}

function scaleNumber(value, min, max) {
    if (value <= min) return 0;
    if (value >= max) return 1;
    return (value - min) / (max - min);
}


// Returns the color that is x% between one color and another
function scaleColor(percentage, rgbStart, rgbEnd) {
    let newRgb = [];
    for (let index = 0; index < 3; index++) {
        let startVal = rgbStart[index];
        let endVal = rgbEnd[index];
        let newVal = ((endVal - startVal) * percentage) + startVal;
        newRgb.push(newVal);
    }
    return "rgb(" + parseInt(newRgb[0]) + "," + parseInt(newRgb[1]) + "," + parseInt(newRgb[2]) + ")";
}

function humidex(temperature, humidity) {
    const kelvin = temperature + 273;
    const eTs = Math.pow(10, ((-2937.4 / kelvin) - 4.9283 * Math.log(kelvin) / Math.LN10 + 23.5471));
    const eTd = eTs * humidity / 100;
    let humidex = Math.round(temperature + ((eTd - 10) * 5 / 9));
    if (humidex < temperature) humidex = temperature;
    return humidex;
}

// Load the current conditions, and set up auto-refresh to only run if the browser tab is visible
getCurrentConditions();
var autoRefresh = setInterval(function () { getCurrentConditions(); }, 30000);;
document.addEventListener('visibilitychange', function () {
    if (document.hidden)
        clearInterval(autoRefresh);
    else
        autoRefresh = setInterval(function () { getCurrentConditions(); }, 30000);
});
