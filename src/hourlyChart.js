async function buildChart(xs, ys) {
    document.querySelector(".chartAreaWrapper").innerHTML = '&nbsp;';
    document.querySelector(".chartAreaWrapper").innerHTML = '<canvas id="chart" height="150" width="400"></canvas>';
    var ctx = document.getElementById('chart').getContext('2d');
    
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xs,
            datasets: [{
                label: '24 hours temperature',
                data: ys,
                borderColor: '#b06ab3',
                borderWidth: 2,
                datalabels: {
                    color: 'white',
                    borderRadius: 4,
                    backgroundColor: '#b06ab3',
                    padding: 5,
                    font: {
                        weight: 'bold'
                      },
                }
            }],   
        },
        options: {
            layout: {
                padding: {
                    left: 0,
                    right: 15,
                    top: 20,
                    bottom: 0
                }
            },
            legend: {
                display: false
            },
            tooltips: {
                enabled: false
           },
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    display: false,
                    ticks: {
                        
                        beginAtZero: true
                    },
                    gridLines: {
                        display:false
                    } 
                }],
                xAxes: [{
                    gridLines: {
                        display: false
                    },
                    ticks: {
                        fontColor: "whitesmoke",
                        padding: 15
                    }
                }]
            }
        }
    });
}


export {buildChart}
