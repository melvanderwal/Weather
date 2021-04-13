function getCurrentConditions() {
    updateSunriseSunset();
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
    let sunrise = parentNode.querySelector("#sunrise");
    let sunset = parentNode.querySelector("#sunset");
    let minTemp = parentNode.querySelector("#minTemp");
    let maxTemp = parentNode.querySelector("#maxTemp");
    let pressureMinMax = parentNode.querySelector("#pressureMinMax");

    let url = "https://api.weather.com/v2/pws/observations/current?stationId=IBRISBAN393&format=json&units=m&numericPrecision=decimal&apiKey=50a881117c2f4300a881117c2f230053";
    let summaryUrl = "https://script.google.com/macros/s/AKfycbzkef0L1D0efPByQfJnwoznyQ2s2FZbNtM501alTQ8un6fc2oeq/exec?todaySummary=1";
    fetch(url, { method: 'GET' })
        .then(response => response.json())
        .then(observationsJson => {
            fetch(summaryUrl, { method: 'GET' })
                .then(response => response.json())
                .then(summaryJson => {
                    updateCurrentConditions(observationsJson, summaryJson);
                })
                .catch(function (error) {
                    console.log(error);
                    lastUpdated.dataset.value = "An error occurred";
                });
        })
        .catch(function (error) {
            console.log(error);
            lastUpdated.dataset.value = "An error occurred";
        });

    function updateCurrentConditions(observationsJson, summaryData) {
        let data = observationsJson.observations[0];

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
        sunrise.textContent = sunriseSunset.sunriseTime;
        sunset.textContent = sunriseSunset.sunsetTime;
        minTemp.textContent = Math.min(summaryData.minTemperature, data.metric.temp) + "°";
        maxTemp.textContent = Math.max(summaryData.maxTemperature, data.metric.temp) + "°";
        pressureMinMax.textContent = parseInt(summaryData.minPressure) + "-" + parseInt(summaryData.maxPressure) + "hPa";

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
    }
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
        iconClass = windSpeed == 0 ? "fas fa-ban" : "fad fa-location-arrow";
        color = "rgb(20,100,100)";
    }
    else if (measurement == "humidex") {
        element = document.querySelector("#feelsLikeIcon");
        if (value < 10) iconClass = "fas fa-grimace";
        else if (value < 29) iconClass = "fas fa-smile";
        else if (value < 35) iconClass = "fas fa-meh";
        else if (value < 40) iconClass = "fas fa-flushed";
        else if (value < 45) iconClass = "fas fa-grin-beam-sweat";
        else iconClass = "fas fa-dizzy";
        color = getColor("humidex", value);
    }
    else if (measurement == "uv") {
        element = document.querySelector("#uvIcon");
        if (sunriseSunset.isNight) iconClass = "far fa-moon";
        else if (sunriseSunset.isDawn) iconClass = "fad fa-sunrise";
        else if (sunriseSunset.isDusk) iconClass = "fad fa-sunset";
        else if (value < 3) iconClass = "fad fa-cloud";
        else if (value < 6) iconClass = "fad fa-cloud-sun";
        else iconClass = "fad fa-sun";
        color = getColor("uv", value);
    }
    else if (measurement == "precipRate") {
        element = document.querySelector("#rainRateIcon");
        if (value == 0) iconClass = "fad fa-tint-slash";
        else if (value < 2) iconClass = sunriseSunset.isNight ? "fad fa-cloud-moon-rain" : "fad fa-cloud-sun-rain";
        else if (value < 4) iconClass = "fad fa-cloud-drizzle";
        else if (value < 10) iconClass = "fad fa-cloud-showers";
        else iconClass = "fad fa-cloud-showers-heavy";
        color = getColor("precipRate", value);
    }
    else if (measurement == "temp") {
        element = document.querySelector("#temperatureIcon");
        if (value < 5) iconClass = "fad fa-temperature-frigid";
        else if (value < 10) iconClass = "fad fa-thermometer-empty thermometer";
        else if (value < 20) iconClass = "fad fa-temperature-low thermometer";
        else if (value < 30) iconClass = "fad fa-thermometer-half thermometer";
        else if (value < 35) iconClass = "fad fa-temperature-high thermometer";
        else iconClass = "fad fa-temperature-hot thermometer";
        color = getColor("temp", value);
    }
    else if (measurement == "pressure") {
        element = document.querySelector("#pressureIcon");
        if (value < 1000) iconClass = "fad fa-signal-1";
        else if (value < 1005) iconClass = "fad fa-signal-2";
        else if (value < 1010) iconClass = "fad fa-signal-3";
        else if (value < 1020) iconClass = "fad fa-signal-4";
        else iconClass = "fad fa-signal";
        color = getColor("pressure", value)
    }
    else if (measurement == "dewpt") {
        element = document.querySelector("#dewPointIcon");
        iconClass = "fad fa-dewpoint";
        color = getColor("dewpt", value)
    }
    else if (measurement == "humidity") {
        element = document.querySelector("#humidityIcon");
        iconClass = "fas fa-humidity";
        color = getColor("humidity", value);
    }

    element.className = "weatherIcon darkHalo " + iconClass;
    element.style.color = color;
}

function getColor(measurement, value) {
    if (measurement == "precipRate") return scaleColor(scaleNumber(value, 0, 50), [169, 194, 219], [0, 105, 219]);
    if (measurement == "precipTotal") return scaleColor(scaleNumber(value, 0, 25), [169, 194, 219], [0, 105, 219]);
    if (measurement == "humidity") return scaleColor(scaleNumber(value, 50, 100), [169, 194, 219], [0, 105, 219]);
    if (measurement == "dewpt") return scaleColor(scaleNumber(value, 0, 5), [0, 105, 219], [169, 194, 219]);
    if (measurement == "uv") return scaleColor(scaleNumber(value, 1, 10), [77, 255, 0], [255, 0, 0]);
    if (measurement == "uvIcon") return scaleColor(scaleNumber(value, 1, 10), [0, 0, 0], [255, 0, 0]);

    if (measurement == "temp")
        return (value < 24) ?
            scaleColor(scaleNumber(value, 0, 24), [0, 105, 219], [0, 255, 0]) :
            scaleColor(scaleNumber(value, 24, 35), [0, 255, 0], [255, 0, 0]);

    if (measurement == "humidex")
        return (value < 10) ?
            "rgb(0,0,255)" :
            scaleColor(scaleNumber(value, 25, 40), [0, 255, 0], [255, 0, 0]);


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

// Load the current conditions
getCurrentConditions();