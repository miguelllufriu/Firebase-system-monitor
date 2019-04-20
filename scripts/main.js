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
    
    addDataStreaming(cpuUsageChart, null, data.cpuUsageUpdate.use)
})

const cpuUsageChart = new Chart(cpuUsageCanvas, {
    type: 'line',
    label: '',
    data: {
        datasets: [{
            label: 'CPU',
            data: []
        }]
    },
    options: {
        legend: {
            display: true,
            labels: {
                fontColor: 'rgb(50, 200, 50)',
                boxWidth: 0
            },
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    max: 100,
                },
                gridLines: {
                    steps: 10,
                    stepValue: 1,
                    display: false
                 }
            }],
            xAxes: [{
                gridLines: {
                    display: false,
                 },
                 type: 'realtime',
                 realtime:{
                        duration: 20000,
                        refresh: 1000,
                        delay: 2000
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

function addDataStreaming(chart, label, data) {
    chart.data.labels.push('');
    chart.data.datasets.forEach((dataset) => {
        dataset.label = 'Actual: ' + data
        dataset.data.push({x:Date.now(), y: data});     
    });
    chart.update({preservation: true});
}