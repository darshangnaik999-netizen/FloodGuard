// ==========================================
// FLOODGUARD AI
// Complete JavaScript
// ==========================================


// ==========================================
// FLOOD DATA
// ==========================================

let floodData = {

    labels: [],

    rainfall: [],

    waterLevel: []

};


let floodChart;


// ==========================================
// UPDATE FLOOD DATA
// ==========================================

function updateFloodData() {

    // Simulated rainfall
    let rainfall =
        Math.floor(Math.random() * 151);


    // Simulated water level
    let waterLevel =
        Math.floor(Math.random() * 101);


    let risk;


    // Calculate risk

    if (
        rainfall < 50 &&
        waterLevel < 40
    ) {

        risk = "SAFE";

    }

    else if (
        rainfall < 100 &&
        waterLevel < 70
    ) {

        risk = "WARNING";

    }

    else {

        risk = "DANGER";

    }


    // Display values

    document.getElementById("rainfall")
        .innerHTML =
        rainfall + " mm";


    document.getElementById("waterLevel")
        .innerHTML =
        waterLevel + " cm";


    document.getElementById("risk")
        .innerHTML =
        risk;


    // Update chart

    updateChart(
        rainfall,
        waterLevel
    );


    // Danger alert

    if (risk === "DANGER") {

        alert(
            "🚨 FLOOD DANGER ALERT!\n\n" +
            "Rainfall: " + rainfall + " mm\n" +
            "Water Level: " + waterLevel + " cm\n\n" +
            "Please move to a safe location."
        );

    }

}


// ==========================================
// CREATE CHART
// ==========================================

function createFloodChart() {

    let canvas =
        document.getElementById("floodChart");


    if (!canvas) {

        return;

    }


    let ctx =
        canvas.getContext("2d");


    floodChart =
        new Chart(ctx, {

            type: "line",

            data: {

                labels:
                    floodData.labels,

                datasets: [

                    {

                        label:
                            "Rainfall (mm)",

                        data:
                            floodData.rainfall,

                        tension: 0.3

                    },

                    {

                        label:
                            "Water Level (cm)",

                        data:
                            floodData.waterLevel,

                        tension: 0.3

                    }

                ]

            },


            options: {

                responsive: true,

                maintainAspectRatio: true,

                scales: {

                    y: {

                        beginAtZero: true

                    }

                }

            }

        });

}


// ==========================================
// UPDATE CHART
// ==========================================

function updateChart(
    rainfall,
    waterLevel
) {

    if (!floodChart) {

        return;

    }


    let time =
        new Date()
        .toLocaleTimeString();


    floodData.labels.push(time);

    floodData.rainfall.push(rainfall);

    floodData.waterLevel.push(waterLevel);


    // Keep only latest 10 readings

    if (
        floodData.labels.length > 10
    ) {

        floodData.labels.shift();

        floodData.rainfall.shift();

        floodData.waterLevel.shift();

    }


    floodChart.update();

}


// ==========================================
// MAP
// ==========================================

let map;


// Initialize map

function initializeMap() {

    map =
        L.map("map")
        .setView(
            [14.2800, 74.4500],
            12
        );


    // OpenStreetMap

    L.tileLayer(

        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

        {

            attribution:
                "&copy; OpenStreetMap contributors"

        }

    ).addTo(map);


    // Danger zone

    let danger =
        L.circle(

            [14.2800, 74.4500],

            {

                radius: 1500,

                color: "red",

                fillColor: "red",

                fillOpacity: 0.3

            }

        ).addTo(map);


    danger.bindPopup(
        "🚨 High Flood Risk Area"
    );


    // Warning zone

    let warning =
        L.circle(

            [14.3000, 74.4700],

            {

                radius: 1200,

                color: "orange",

                fillColor: "orange",

                fillOpacity: 0.3

            }

        ).addTo(map);


    warning.bindPopup(
        "⚠️ Moderate Flood Risk Area"
    );


    // Safe zone

    let safe =
        L.circle(

            [14.2600, 74.4300],

            {

                radius: 1000,

                color: "green",

                fillColor: "green",

                fillOpacity: 0.2

            }

        ).addTo(map);


    safe.bindPopup(
        "✅ Low Flood Risk Area"
    );

}


// ==========================================
// DETECT USER LOCATION
// ==========================================

function locateUser() {

    if (
        !navigator.geolocation
    ) {

        alert(
            "❌ Location is not supported by your browser."
        );

        return;

    }


    navigator.geolocation.getCurrentPosition(

        function(position) {

            let latitude =
                position.coords.latitude;


            let longitude =
                position.coords.longitude;


            // Move map

            map.setView(

                [
                    latitude,
                    longitude
                ],

                15

            );


            // Add marker

            let userMarker =
                L.marker(

                    [
                        latitude,
                        longitude
                    ]

                ).addTo(map);


            userMarker
                .bindPopup(
                    "📍 You are here"
                )
                .openPopup();


            // Accuracy circle

            L.circle(

                [
                    latitude,
                    longitude
                ],

                {

                    radius:
                        position.coords.accuracy

                }

            ).addTo(map);

        },


        function() {

            alert(

                "❌ Unable to detect location.\n\n" +
                "Please allow location permission."

            );

        }

    );

}


// ==========================================
// CITIZEN REPORT LOCATION
// ==========================================

function getReportLocation() {

    if (
        !navigator.geolocation
    ) {

        alert(
            "Location is not supported by your browser."
        );

        return;

    }


    navigator.geolocation.getCurrentPosition(

        function(position) {

            let latitude =
                position.coords.latitude;


            let longitude =
                position.coords.longitude;


            document.getElementById(
                "reportLocation"
            ).value =

                latitude +
                ", " +
                longitude;

        },


        function() {

            alert(

                "❌ Unable to get your location.\n\n" +
                "Please allow location permission."

            );

        }

    );

}


// ==========================================
// SUBMIT FLOOD REPORT
// ==========================================

document
    .getElementById("floodReportForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            let location =
                document.getElementById(
                    "reportLocation"
                ).value;


            let severity =
                document.getElementById(
                    "severity"
                ).value;


            let description =
                document.getElementById(
                    "reportDescription"
                ).value;


            let photoInput =
                document.getElementById(
                    "reportPhoto"
                );


            let photo = "";


            if (
                photoInput.files.length > 0
            ) {

                photo =
                    photoInput.files[0].name;

            }


            // Create report

            let report = {

                id: Date.now(),

                location:
                    location,

                severity:
                    severity,

                description:
                    description,

                photo:
                    photo,

                status:
                    "Pending",

                date:
                    new Date()
                    .toLocaleString()

            };


            // Get old reports

            let reports =
                JSON.parse(
                    localStorage.getItem(
                        "floodReports"
                    )
                ) || [];


            // Add new report

            reports.push(report);


            // Save

            localStorage.setItem(

                "floodReports",

                JSON.stringify(reports)

            );


            // Message

            document.getElementById(
                "reportMessage"
            ).innerHTML =

                "✅ Flood report submitted successfully!";


            document.getElementById(
                "reportMessage"
            ).style.color = "green";


            // Reset form

            document.getElementById(
                "floodReportForm"
            ).reset();


            // If admin is logged in,
            // update dashboard

            let dashboard =
                document.getElementById(
                    "adminDashboard"
                );


            if (
                dashboard.style.display !== "none"
            ) {

                displayReports();

            }

        }
    );


// ==========================================
// ADMIN LOGIN
// ==========================================

const ADMIN_USERNAME =
    "admin";


const ADMIN_PASSWORD =
    "FloodGuard123";


function adminLogin() {

    let username =
        document.getElementById(
            "adminUsername"
        ).value.trim();


    let password =
        document.getElementById(
            "adminPassword"
        ).value;


    let message =
        document.getElementById(
            "loginMessage"
        );


    if (

        username === ADMIN_USERNAME &&

        password === ADMIN_PASSWORD

    ) {

        // Show dashboard

        document.getElementById(
            "adminDashboard"
        ).style.display = "block";


        message.innerHTML =
            "✅ Login successful!";


        message.style.color =
            "green";


        // Display reports

        displayReports();


    }

    else {

        message.innerHTML =
            "❌ Wrong username or password.";


        message.style.color =
            "red";

    }

}


// ==========================================
// ADMIN LOGOUT
// ==========================================

function adminLogout() {

    document.getElementById(
        "adminDashboard"
    ).style.display = "none";


    document.getElementById(
        "adminUsername"
    ).value = "";


    document.getElementById(
        "adminPassword"
    ).value = "";


    document.getElementById(
        "loginMessage"
    ).innerHTML = "";

}


// ==========================================
// DISPLAY REPORTS
// ==========================================

function displayReports() {

    let reports =
        JSON.parse(
            localStorage.getItem(
                "floodReports"
            )
        ) || [];


    let container =
        document.getElementById(
            "reportsContainer"
        );


    if (
        reports.length === 0
    ) {

        container.innerHTML =
            "<p>No flood reports available.</p>";

        return;

    }


    container.innerHTML = "";


    reports.forEach(
        function(report) {

            let card =
                document.createElement(
                    "div"
                );


            card.className =
                "report-card";


            card.innerHTML = `

                <h3>
                    🚨 Flood Report #${report.id}
                </h3>

                <p>
                    <strong>📍 Location:</strong>
                    ${report.location}
                </p>

                <p>
                    <strong>⚠️ Severity:</strong>
                    ${report.severity}
                </p>

                <p>
                    <strong>📝 Description:</strong>
                    ${report.description}
                </p>

                <p>
                    <strong>📷 Photo:</strong>
                    ${report.photo || "No photo uploaded"}
                </p>

                <p>
                    <strong>🕒 Reported:</strong>
                    ${report.date}
                </p>

                <p class="status ${
                    report.status === "Resolved"
                    ? "status-resolved"
                    : "status-pending"
                }">

                    Status: ${report.status}

                </p>

                <button
                    onclick="resolveReport(${report.id})"
                >
                    ✅ Mark Resolved
                </button>

                <button
                    onclick="deleteReport(${report.id})"
                >
                    🗑️ Delete
                </button>

            `;


            container.appendChild(
                card
            );

        }
    );

}


// ==========================================
// RESOLVE REPORT
// ==========================================

function resolveReport(id) {

    let reports =
        JSON.parse(
            localStorage.getItem(
                "floodReports"
            )
        ) || [];


    reports =
        reports.map(
            function(report) {

                if (
                    report.id === id
                ) {

                    report.status =
                        "Resolved";

                }


                return report;

            }
        );


    localStorage.setItem(

        "floodReports",

        JSON.stringify(reports)

    );


    displayReports();

}


// ==========================================
// DELETE REPORT
// ==========================================

function deleteReport(id) {

    let reports =
        JSON.parse(
            localStorage.getItem(
                "floodReports"
            )
        ) || [];


    reports =
        reports.filter(
            function(report) {

                return report.id !== id;

            }
        );


    localStorage.setItem(

        "floodReports",

        JSON.stringify(reports)

    );


    displayReports();

}


// ==========================================
// START APPLICATION
// ==========================================

window.addEventListener(
    "DOMContentLoaded",
    function() {

        createFloodChart();

        initializeMap();

    }
);