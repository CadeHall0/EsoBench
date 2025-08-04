// Debug version of main.js with extensive logging
class EsolangBenchmark {
    constructor() {
        console.log("EsolangBenchmark constructor called");
        this.dataLoader = new DataLoader();
        this.tableUtils = new TableUtils();
        this.chartUtils = new ChartUtils();
        this.init();
    }

    async init() {
        console.log("Initializing EsolangBenchmark");
        this.setupTabListeners();
        await this.loadAndDisplayData();
        this.setupSortListeners(); // Set up sorting after data is loaded
    }

    setupTabListeners() {
        console.log("Setting up tab listeners");
        
        // Tab switching only
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                console.log("Tab clicked:", e.target.dataset.tab);
                this.showTab(e.target.dataset.tab);
            });
        });
        
        console.log("Tab listeners set up complete");
    }

    setupSortListeners() {
        console.log("Setting up sort listeners");
        
        // Table sorting - only after data is loaded
        document.querySelectorAll('.sortable').forEach(header => {
            header.addEventListener('click', (e) => {
                console.log("Sort header clicked:", e.target.dataset.column);
                this.sortTable(e.target.dataset.column);
            });
        });
        
        console.log("Sort listeners set up complete");
    }

    showTab(tabName) {
        console.log("showTab called with:", tabName);
        
        document.querySelectorAll('.tab-content').forEach(content => 
            content.classList.remove('active'));
        document.querySelectorAll('.nav-tab').forEach(tab => 
            tab.classList.remove('active'));
        
        document.getElementById(tabName).classList.add('active');
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    }

    async loadAndDisplayData() {
        console.log("Starting data load");
        try {
            document.getElementById('loading').style.display = 'block';
            console.log("Loading element shown");
            
            const data = await this.dataLoader.loadBenchmarkData();
            console.log("Data loaded successfully:", data);
            console.log("Number of models:", Object.keys(data).length);
            
            if (Object.keys(data).length === 0) {
                throw new Error("No data found in JSON file");
            }
            
            this.displayLeaderboard();
            document.getElementById('loading').style.display = 'none';
            console.log("Leaderboard display complete");
            
        } catch (error) {
            console.error("Error in loadAndDisplayData:", error);
            this.showError(error.message);
        }
    }

    sortTable(column) {
        console.log("sortTable called with column:", column);
        
        if (this.tableUtils.currentSort.column === column) {
            this.tableUtils.currentSort.direction = 
                this.tableUtils.currentSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            this.tableUtils.currentSort.column = column;
            this.tableUtils.currentSort.direction = 'desc';
        }
        
        console.log("Current sort:", this.tableUtils.currentSort);
        this.updateSortHeaders();
        this.displayLeaderboard();
    }

    updateSortHeaders() {
        console.log("Updating sort headers");
        document.querySelectorAll('.leaderboard-table th').forEach(th => {
            th.classList.remove('sort-asc', 'sort-desc');
        });
        
        const activeHeader = document.querySelector(`[data-column="${this.tableUtils.currentSort.column}"]`);
        if (activeHeader) {
            activeHeader.classList.add(this.tableUtils.currentSort.direction === 'asc' ? 'sort-asc' : 'sort-desc');
        }
    }

    displayLeaderboard() {
        console.log("displayLeaderboard called");
        
        const benchmarkData = this.dataLoader.benchmarkData;
        console.log("Benchmark data:", benchmarkData);
        
        if (!benchmarkData || Object.keys(benchmarkData).length === 0) {
            console.error("No benchmark data available");
            this.showError("No benchmark data available");
            return;
        }
        
        const sortedModels = this.tableUtils.sortData(
            benchmarkData,
            this.tableUtils.currentSort.column,
            this.tableUtils.currentSort.direction
        );
        
        console.log("Sorted models:", sortedModels);
        console.log("Number of sorted models:", sortedModels.length);
        
        const tbody = document.getElementById('leaderboard-body');
        if (!tbody) {
            console.error("Could not find leaderboard-body element");
            return;
        }
        
        tbody.innerHTML = '';
        console.log("Cleared table body");
        
        sortedModels.forEach(([modelName, modelData], index) => {
            console.log(`Processing model ${index + 1}:`, modelName, modelData);
            
            const row = this.createTableRow(modelName, modelData, sortedModels, index);
            tbody.appendChild(row);
        });
        
        document.getElementById('leaderboard-table').style.display = 'table';
        console.log("Table made visible");
    }

    createTableRow(modelName, modelData, sortedModels, index) {
        console.log("Creating row for:", modelName);
        
        const row = document.createElement('tr');
        const rank = this.tableUtils.getRankWithTies(sortedModels, index, this.tableUtils.currentSort.column);
        
        const provider = modelData.provider || modelData.Provider || 'Unknown';
        console.log("Provider:", provider);
        
        const companyIcon = this.dataLoader.getCompanyIcon(provider);
        const companyName = this.dataLoader.getCompanyName(provider);
        
        console.log("Company icon:", companyIcon);
        console.log("Company name:", companyName);
        
        // Create model cell with icon
        const modelCell = document.createElement('td');
        modelCell.classList.add('model-cell');
        
        if (companyIcon) {
            const icon = document.createElement('img');
            icon.src = companyIcon;
            icon.alt = provider;
            icon.classList.add('company-icon');
            icon.onerror = () => {
                console.log("Icon failed to load for:", provider);
                const placeholder = document.createElement('div');
                placeholder.classList.add('icon-placeholder');
                icon.parentNode.replaceChild(placeholder, icon);
            };
            modelCell.appendChild(icon);
        } else {
            const placeholder = document.createElement('div');
            placeholder.classList.add('icon-placeholder');
            modelCell.appendChild(placeholder);
        }
        
        const modelNameElement = document.createElement('strong');
        modelNameElement.textContent = modelName;
        modelCell.appendChild(modelNameElement);
        
        // Create mini heatmap for Performance column
        const heatmapCell = document.createElement('td');
        const heatmap = this.chartUtils.createMiniHeatmap(modelData);
        heatmapCell.appendChild(heatmap);
        
        // Build the row
        const rankCell = document.createElement('td');
        rankCell.classList.add('rank-cell');
        rankCell.textContent = rank;
        
        const companyCell = document.createElement('td');
        companyCell.textContent = companyName;
        
        const scoreCell = document.createElement('td');
        scoreCell.classList.add('score-cell');
        scoreCell.textContent = modelData['Clean Score'].toFixed(1);
        
        const errorCell = document.createElement('td');
        errorCell.textContent = modelData['Error Percent'].toFixed(1) + '%';
        
        const solvedCell = document.createElement('td');
        solvedCell.classList.add('score-cell');
        solvedCell.textContent = modelData['Percent Solved'].toFixed(1) + '%';
        
        // Append all cells
        row.appendChild(rankCell);
        row.appendChild(modelCell);
        row.appendChild(companyCell);
        row.appendChild(scoreCell);
        row.appendChild(errorCell);
        row.appendChild(solvedCell);
        row.appendChild(heatmapCell);
        
        console.log("Row created successfully");
        return row;
    }

    showError(message) {
        console.log("showError called with:", message);
        document.getElementById('loading').style.display = 'none';
        const errorDiv = document.getElementById('error');
        errorDiv.textContent = `Error loading benchmark data: ${message}`;
        errorDiv.style.display = 'block';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded, initializing EsolangBenchmark");
    new EsolangBenchmark();
});
