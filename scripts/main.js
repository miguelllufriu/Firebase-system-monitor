const config = {
    apiKey: "AIzaSyBhHQtskONKLeKIdZuaCygwSr09ImgQBac",
    authDomain: "systemmonitor-2b015.firebaseapp.com",
    databaseURL: "https://systemmonitor-2b015.firebaseio.com",
    projectId: "systemmonitor-2b015",
    storageBucket: "systemmonitor-2b015.appspot.com",
    messagingSenderId: "153297484955"
 };

firebase.initializeApp(config);

 
const hostnameTag = document.getElementById('hostname')
const topProcessList = document.getElementById('listTopProcess')
const usageChartCanvas = document.getElementById('usageChartCanvas').getContext('2d')
const memoryUsageCanvas = document.getElementById('memoryUsageCanvas').getContext('2d')

const database = firebase.database().ref().child("system-info")
database.on("value", snapshot => {
    const data = snapshot.val()
    
    hostnameTag.innerHTML = data.hostname
    
    updateTopList(data.toplist)
    addDataStreaming(usageChart, 0, data.cpuUsageUpdate.use)
    addDataStreaming(usageChart, 1, data.temperatureUpdate.temp)
    updateMemoryChart(memoryUsageChart, data.memoryUpdate)

})

const usageChart = new Chart(usageChartCanvas, {
    type: 'line',
    label: '',
    data: {
        datasets: [{
            label: '',
            data: []
        },
        {
            label: '',
            data:[]
        }
        ]
    },
    options: {
        maintainAspectRatio: false,
        legend: {
            display: true,
            labels: {
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
})

const memoryUsageChart = new Chart(memoryUsageCanvas, {
    type: 'doughnut',
    data: {
        datasets: [{
            data: [],
            backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f", "#3cca6f"]
        }],

        labels: ['Registrada ','En caché ', 'Libre ', 'Usada ']
    },
    options: {
        maintainAspectRatio: false,
    }
});

function addDataStreaming (chart, level, data) {
    chart.data.labels.push('')
    chart.data.datasets[level].data.push({x:Date.now(), y: data});
    chart.update({preservation: true})
}

function updateMemoryChart (chart, data) {
    chart.data.datasets[0].data = Object.values(data);
    chart.update({preservation: true})
}

function updateTopList (data) {
    topProcessList.innerHTML = data.map(process => {
        return `<li class="processItem">${process}</li>`
    }).join('')
}