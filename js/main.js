// Main application logic
class EsolangBenchmark {
    constructor() {
        this.dataLoader = new DataLoader();
        this.tableUtils = new TableUtils();
        this.chartUtils = new ChartUtils();
        this.init();
    }

    async init() {
        this.setupTabListeners();
        await this.loadAndDisplayData();
        this.setupSortListeners();
        const benchmarkData = this.dataLoader.benchmarkData;
        this.chartUtils.createBarChart(benchmarkData, 'performance-chart');
        //this.chartUtils.createScatterPlot(benchmarkData, 'meanscatter');
    }

    setupTabListeners() {
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.scrollTo(e.target.dataset.tab);
            });
        });
    }

    setupSortListeners() {
        document.querySelectorAll('.sortable').forEach(header => {
            header.addEventListener('click', (e) => {
                this.sortTable(e.target.dataset.column);
            });
        });
    }

    scrollTo(tabName) {
        document.getElementById(tabName).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        document.querySelectorAll('.nav-tab').forEach(tab => 
            tab.classList.remove('active'));
        
        document.getElementById(tabName).classList.add('active');
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    }

    async loadAndDisplayData() {
        try {
            document.getElementById('loading').style.display = 'block';
            
            const data = await this.dataLoader.loadBenchmarkData();
            
            if (Object.keys(data).length === 0) {
                throw new Error("No data found in JSON file");
            }
            
            this.displayLeaderboard();
            document.getElementById('loading').style.display = 'none';
            
        } catch (error) {
            this.showError(error.message);
        }
    }

    sortTable(column) {
        if (this.tableUtils.currentSort.column === column) {
            this.tableUtils.currentSort.direction = 
                this.tableUtils.currentSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            this.tableUtils.currentSort.column = column;
            this.tableUtils.currentSort.direction = 'desc';
        }
        
        this.updateSortHeaders();
        this.displayLeaderboard();
    }

    updateSortHeaders() {
        document.querySelectorAll('.leaderboard-table th').forEach(th => {
            th.classList.remove('sort-asc', 'sort-desc');
        });
        
        const activeHeader = document.querySelector(`[data-column="${this.tableUtils.currentSort.column}"]`);
        if (activeHeader) {
            activeHeader.classList.add(this.tableUtils.currentSort.direction === 'asc' ? 'sort-asc' : 'sort-desc');
        }
    }

    displayLeaderboard() {
        const benchmarkData = this.dataLoader.benchmarkData;

        if (!benchmarkData || Object.keys(benchmarkData).length === 0) {
            this.showError("No benchmark data available");
            return;
        }
        
        const sortedModels = this.tableUtils.sortData(
            benchmarkData,
            this.tableUtils.currentSort.column,
            this.tableUtils.currentSort.direction
        );
        
        const tbody = document.getElementById('leaderboard-body');
        if (!tbody) {
            console.error("Could not find leaderboard-body element");
            return;
        }
        
        tbody.innerHTML = '';
        
        sortedModels.forEach(([modelName, modelData], index) => {
            const row = this.createTableRow(modelName, modelData, sortedModels, index);
            tbody.appendChild(row);
        });
        
        document.getElementById('leaderboard-table').style.display = 'table';
    }

    createTableRow(modelName, modelData, sortedModels, index) {
        const rowColor = getComputedStyle(document.documentElement).getPropertyValue('--background').trim();

        const row = document.createElement('tr');
        if (index%2 == 1)
            row.style.background = rowColor;
        var rank = this.tableUtils.getRankWithTies(sortedModels, index, this.tableUtils.currentSort.column);
        
        const provider = modelData.provider || modelData.Provider || 'Unknown';
        const companyIcon = this.dataLoader.getCompanyIcon(provider);
        const companyName = this.dataLoader.getCompanyName(provider);
        
        // Create model cell with icon
        const modelCell = document.createElement('td');
        modelCell.classList.add('model-cell');
        
        if (companyIcon) {
            const icon = document.createElement('img');
            icon.src = companyIcon;
            icon.alt = provider;
            icon.classList.add('company-icon');
            icon.onerror = () => {
                const placeholder = document.createElement('div');
                placeholder.classList.add('icon-placeholder');
                icon.parentNode.replaceChild(placeholder, icon);
            };
            modelCell.appendChild(icon);
        } 
        
        const modelNameElement = document.createElement('span');
        modelNameElement.textContent = modelName;
        modelCell.appendChild(modelNameElement);
        
        // Create mini heatmap for Performance column
        const heatmapCell = document.createElement('td');
        const heatmap = this.chartUtils.createMiniHeatmap(modelData);
        heatmapCell.style.textAlign = 'right';

        heatmapCell.appendChild(heatmap);
        
        // Build the row
        const rankCell = document.createElement('td');
        rankCell.classList.add('rank-cell');
        rankCell.textContent = rank;
        rankCell.style.textAlign = 'center';
        rankCell.style.fontWeight = 'bold';
        rankCell.style.fontSize = '1.1em';
        
        const companyCell = document.createElement('td');
        companyCell.textContent = companyName;
        companyCell.style.textAlign = 'center';
        
        const scoreCell = document.createElement('td');
        scoreCell.classList.add('score-cell');
        scoreCell.textContent = modelData['Clean Score'].toFixed(1);
        scoreCell.style.textAlign = 'center';
        scoreCell.style.fontWeight = '700';
        
        const solvedCell = document.createElement('td');
        solvedCell.classList.add('score-cell');
        solvedCell.textContent = modelData['Percent Solved'].toFixed(1) + '%';
        solvedCell.style.textAlign = 'center';
        
        // Append all cells
        row.appendChild(rankCell);
        row.appendChild(modelCell);
        row.appendChild(companyCell);
        row.appendChild(scoreCell);
        row.appendChild(solvedCell);
        row.appendChild(heatmapCell);
        
        return row;
    }

    showError(message) {
        document.getElementById('loading').style.display = 'none';
        const errorDiv = document.getElementById('error');
        errorDiv.textContent = `Error loading benchmark data: ${message}`;
        errorDiv.style.display = 'block';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EsolangBenchmark();
});
