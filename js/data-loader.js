// Debug version of data-loader.js
class DataLoader {
    constructor() {
        console.log("DataLoader constructor called");
        this.benchmarkData = {};
        this.companyIcons = {
            'open-ai': 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@v9/icons/openai.svg',
            'anthropic': 'https://cdn.brandfetch.io/idmJWF3N06/theme/dark/symbol.svg',
            'google': 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg',
            'xai': 'https://cdn.brandfetch.io/iddjpnb3_W/theme/dark/logo.svg'
        };
        this.companyNames = {
            'open-ai': 'OpenAI',
            'anthropic': 'Anthropic',
            'google': 'Google',
            'xai': 'xAI'
        };
    }

    async loadBenchmarkData() {
        console.log("loadBenchmarkData called");
        try {
            console.log("Fetching data/All_Results.json");
            const response = await fetch('data/All_Results.json');
            console.log("Fetch response:", response);
            console.log("Response status:", response.status);
            console.log("Response ok:", response.ok);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            console.log("Parsing JSON...");
            this.benchmarkData = await response.json();
            console.log("JSON parsed successfully");
            console.log("Benchmark data keys:", Object.keys(this.benchmarkData));
            console.log("First few entries:", Object.entries(this.benchmarkData).slice(0, 2));
            
            return this.benchmarkData;
        } catch (error) {
            console.error('Error loading benchmark data:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack
            });
            throw error;
        }
    }

    getCompanyIcon(provider) {
        console.log("getCompanyIcon called with:", provider);
        if (!provider) {
            console.log("No provider, returning null");
            return null;
        }
        const providerKey = provider.toLowerCase().replace(/[^a-z0-9-]/g, '');
        console.log("Provider key:", providerKey);
        const icon = this.companyIcons[providerKey] || null;
        console.log("Returning icon:", icon);
        return icon;
    }

    getCompanyName(provider) {
        console.log("getCompanyName called with:", provider);
        if (!provider) {
            console.log("No provider, returning 'Unknown'");
            return 'Unknown';
        }
        const providerKey = provider.toLowerCase().replace(/[^a-z0-9-]/g, '');
        const name = this.companyNames[providerKey] || provider;
        console.log("Returning company name:", name);
        return name;
    }
}
