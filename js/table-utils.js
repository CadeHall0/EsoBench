// Table sorting and manipulation utilities
class TableUtils {
    constructor() {
        this.currentSort = { column: 'score', direction: 'desc' };
    }

    sortData(data, column, direction = 'desc') {
        const models = Object.entries(data);
        
        models.sort((a, b) => {
            let aPrimary, bPrimary, aSecondary, bSecondary;
            
            // Get primary sort values
            switch(column) {
                case 'score':
                    aPrimary = a[1]['Clean Score'];
                    bPrimary = b[1]['Clean Score'];
                    // Use Percent Solved as tiebreaker
                    aSecondary = a[1]['Percent Solved'];
                    bSecondary = b[1]['Percent Solved'];
                    break;
                case 'solved':
                    aPrimary = a[1]['Percent Solved'];
                    bPrimary = b[1]['Percent Solved'];
                    // Use Clean Score as tiebreaker
                    aSecondary = a[1]['Clean Score'];
                    bSecondary = b[1]['Clean Score'];
                    break;
            }
            
            // Primary comparison
            const primaryComparison = direction === 'asc' ? aPrimary - bPrimary : bPrimary - aPrimary;
            
            // If primary values are equal, use secondary comparison (always descending for tiebreaker)
            if (primaryComparison === 0) {
                return bSecondary - aSecondary;
            }
            
            return primaryComparison;
        });
        
        return models;
    }

    getRankWithTies(sortedModels, index, column) {
        if (index === 0) return 1;
        
        let currentValue = this.getValueByColumn(sortedModels[index][1], column);
        let rank = 1;
        
        // Count how many models have better primary values
        for (let i = 0; i < index; i++) {
            let compareValue = this.getValueByColumn(sortedModels[i][1], column);
            if (compareValue !== currentValue) {
                rank++;
            }
        }
        
        return rank;
    }

    getValueByColumn(modelData, column) {
        switch(column) {
            case 'score': return modelData['Clean Score'];
            case 'solved': return modelData['Percent Solved'];
        }
    }
}