// Chart and visualization utilities
class ChartUtils {
    getScoreColor(score) {
        if (score <= 50) {
            const ratio = score / 50;
            const red = Math.round(220 * (1 - ratio) + 255 * ratio);
            const green = Math.round(53 * (1 - ratio) + 235 * ratio);
            const blue = Math.round(47 * (1 - ratio) + 59 * ratio);
            return `rgb(${red}, ${green}, ${blue})`;
        } else {
            const ratio = (score - 50) / 50;
            const red = Math.round(255 * (1 - ratio) + 34 * ratio);
            const green = Math.round(235 * (1 - ratio) + 197 * ratio);
            const blue = Math.round(59 * (1 - ratio) + 94 * ratio);
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
                cell.title = `Task ${task}, Attempt ${attempt + 1}: ${score}`;
                
                heatmap.appendChild(cell);
            }
        }
        
        return heatmap;
    }

    createBarChart(data, canvasId) {
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
                    backgroundColor: '#2299ea',
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
                            color: '#e0e0e0',
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
