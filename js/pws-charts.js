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