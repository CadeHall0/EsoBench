// Data loading and processing
class DataLoader {
    constructor() {
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
        try {
            const response = await fetch('data/All_Results.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.benchmarkData = await response.json();
            return this.benchmarkData;
        } catch (error) {
            console.error('Error loading benchmark data:', error);
            throw error;
        }
    }

    getCompanyIcon(provider) {
        if (!provider) return null;
        const providerKey = provider.toLowerCase().replace(/[^a-z0-9-]/g, '');
        return this.companyIcons[providerKey] || null;
    }

    getCompanyName(provider) {
        if (!provider) return 'Unknown';
        const providerKey = provider.toLowerCase().replace(/[^a-z0-9-]/g, '');
        return this.companyNames[providerKey] || provider;
    }
}
