// Chart and visualization utilities
class ChartUtils {
    getRGBValues(cssVar) {
        const color = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
        const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        return match ? [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])] : null;
    }

    getScoreColor(score) {
        const [lowR, lowG, lowB] = this.getRGBValues('--gradient-low');
        const [lmR, lmG, lmB] = this.getRGBValues('--gradient-low-mid');
        const [midR, midG, midB] = this.getRGBValues('--gradient-mid');
        const [mhR, mhG, mhB] = this.getRGBValues('--gradient-mid-high');
        const [highR, highG, highB] = this.getRGBValues('--gradient-high');

        var scaledScore = ((score-50)**3)/2500+50;
        scaledScore = score;

        if (scaledScore <= 15) {
            const ratio = scaledScore / 15;
            const red = Math.round(lowR * (1 - ratio) + lmR * ratio);
            const green = Math.round(lowG * (1 - ratio) + lmG * ratio);
            const blue = Math.round(lowB * (1 - ratio) + lmB * ratio);
            return `rgb(${red}, ${green}, ${blue})`;
        } else if (scaledScore <= 50){
            const ratio = (scaledScore - 15) / 35;
            const red = Math.round(lmR * (1 - ratio) + midR * ratio);
            const green = Math.round(lmG * (1 - ratio) + midG * ratio);
            const blue = Math.round(lmB * (1 - ratio) + midB * ratio);
            return `rgb(${red}, ${green}, ${blue})`;
        } else if (scaledScore <= 85){
            const ratio = (scaledScore - 50) / 35;
            const red = Math.round(midR * (1 - ratio) + mhR * ratio);
            const green = Math.round(midG * (1 - ratio) + mhG * ratio);
            const blue = Math.round(midB * (1 - ratio) + mhB * ratio);
            return `rgb(${red}, ${green}, ${blue})`;
        } else{
            const ratio = (scaledScore - 85) / 10;
            const red = Math.round(mhR * (1 - ratio) + highR * ratio);
            const green = Math.round(mhG * (1 - ratio) + highG * ratio);
            const blue = Math.round(mhB * (1 - ratio) + highB * ratio);
            return `rgb(${red}, ${green}, ${blue})`;
        }
    }

    createMiniHeatmap(modelData) {
        const heatmap = document.createElement('div');
        heatmap.classList.add('mini-heatmap');
        
        for (let attempt = 0; attempt < 5; attempt++) {
            for (let task = 1; task <= 6; task++) {
                const cell = document.createElement('div');
                cell.classList.add('mini-heatmap-cell');
                
                const taskScores = modelData[`Task ${task}`] || [0, 0, 0, 0, 0];
                const score = taskScores[attempt] || 0;
                
                cell.style.backgroundColor = this.getScoreColor(score);
                cell.setAttribute('data-tooltip', `Task ${task}, Attempt ${attempt + 1}: ${score}`);
                
                heatmap.appendChild(cell);
            }
        }
        
        return heatmap;
    }

    createScatterPlot(data, canvasId) {
        const pointColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
        const gridColor = getComputedStyle(document.documentElement).getPropertyValue('--bgtint').trim();

        const ctx = document.getElementById(canvasId).getContext('2d');

        // Process data to calculate means for Task 1 and Task 2
        const scatterData = Object.entries(data).map(([name, modelData]) => {
            const task1Mean = modelData['Task 1'].reduce((sum, val) => sum + val, 0) / modelData['Task 1'].length;
            const task2Mean = modelData['Task 2'].reduce((sum, val) => sum + val, 0) / modelData['Task 2'].length;
            
            return {
                x: task1Mean,
                y: task2Mean,
                label: name
            };
        });

        new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Models',
                    data: scatterData,
                    backgroundColor: pointColor,
                    borderColor: pointColor,
                    borderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: 'Task 1 Mean Score'
                        },
                        grid: {
                            display: true,
                            color: gridColor,
                            lineWidth: 1
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Task 2 Mean Score'
                        },
                        grid: {
                            display: true,
                            color: gridColor,
                            lineWidth: 1
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            title: function(context) {
                                return context[0].raw.label;
                            },
                            label: function(context) {
                                return [
                                    `Task 1 Mean: ${context.parsed.x.toFixed(1)}`,
                                    `Task 2 Mean: ${context.parsed.y.toFixed(1)}`
                                ];
                            }
                        }
                    }
                }
            }
        });
    }

    createBarChart(data, canvasId) {
        const barColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
        const gridColor = getComputedStyle(document.documentElement).getPropertyValue('--bgtint').trim();

        const ctx = document.getElementById(canvasId).getContext('2d');
    
        // Get top 10 models
        const sortedData = Object.entries(data)
            .sort((a, b) => b[1]['Clean Score'] - a[1]['Clean Score'])
            .slice(0, 20);
    
        const labels = sortedData.map(([name]) => name);
        const scores = sortedData.map(([, data]) => data['Clean Score']);
    
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Score',
                    data: scores,
                    backgroundColor: barColor,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            display: true,
                            color: gridColor,
                            lineWidth: 1,
                            drawBorder: true,
                            drawOnChartArea: true,
                            drawTicks: true,
                        }
                    },
                    x: {
                        grid: {
                            display: false,
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}
