// Main application logic
class EsolangBenchmark {
    constructor() {
        this.dataLoader = new DataLoader();
        this.tableUtils = new TableUtils();
        this.chartUtils = new ChartUtils();
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadAndDisplayData();
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.showTab(e.target.dataset.tab));
        });

        // Table sorting
        document.querySelectorAll('.sortable').forEach(header => {
            header.addEventListener('click', (e) => this.sortTable(e.target.dataset.column));
        });
    }

    showTab(tabName) {
        document.querySelectorAll('.tab-content').forEach(content => 
            content.classList.remove('active'));
        document.querySelectorAll('.nav-tab').forEach(tab => 
            tab.classList.remove('active'));
        
        document.getElementById(tabName).classList.add('active');
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    }

    async loadAndDisplayData() {
        try {
            document.getElementById('loading').style.display = 'block';
            await this.dataLoader.loadBenchmarkData();
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

    displayLeaderboard() {
        const sortedModels = this.tableUtils.sortData(
            this.dataLoader.benchmarkData,
            this.tableUtils.currentSort.column,
            this.tableUtils.currentSort.direction
        );
        
        const tbody = document.getElementById('leaderboard-body');
        tbody.innerHTML = '';
        
        sortedModels.forEach(([modelName, modelData], index) => {
            const row = this.createTableRow(modelName, modelData, sortedModels, index);
            tbody.appendChild(row);
        });
        
        document.getElementById('leaderboard-table').style.display = 'table';
    }

    createTableRow(modelName, modelData, sortedModels, index) {
        const row = document.createElement('tr');
        const rank = this.tableUtils.getRankWithTies(sortedModels, index, this.tableUtils.currentSort.column);
        
        // Build row content...
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
