var config = {
    apiKey: "AIzaSyBhHQtskONKLeKIdZuaCygwSr09ImgQBac",
    authDomain: "systemmonitor-2b015.firebaseapp.com",
    databaseURL: "https://systemmonitor-2b015.firebaseio.com",
    projectId: "systemmonitor-2b015",
    storageBucket: "systemmonitor-2b015.appspot.com",
    messagingSenderId: "153297484955"
 };

 firebase.initializeApp(config);

 
const hostnameTag = document.getElementById('hostname');
const cpuUsageCanvas = document.getElementById('cpuUsageCanvas').getContext('2d');

const database = firebase.database().ref().child("system-info");
database.on("value", snapshot => {
    const data = snapshot.val();
    hostnameTag.innerHTML = data.hostname;
    
    addData(cpuUsageChart, null, data.cpuUsageUpdate.use)
})

const cpuUsageChart = new Chart(cpuUsageCanvas, {
    type: 'line',
    label: '',
    data: {
        datasets: [{
            label: 'Uso de CPU',
            data: []
        }]
    },
    options: {
        tension: 0,
        legend: {
            display: false
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    max: 100,
                },
                gridLines: {
                    steps: 10,
                    stepValue: 5,
                    display: false
                 }
            }],
            xAxes: [{
                gridLines: {
                    display: false,
                 }
            }],
        },
        elements: {
            point: {
                radius: 0
            }
        }
    }
});

function addData(chart, label, data) {
    chart.data.labels.push('');
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}