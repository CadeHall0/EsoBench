// Table sorting and manipulation utilities
class TableUtils {
    constructor() {
        this.currentSort = { column: 'score', direction: 'desc' };
    }

    sortData(data, column, direction = 'desc') {
        const models = Object.entries(data);
        
        models.sort((a, b) => {
            let aVal, bVal;
            
            switch(column) {
                case 'score':
                    aVal = a[1]['Clean Score'];
                    bVal = b[1]['Clean Score'];
                    break;
                case 'error':
                    aVal = a[1]['Error Percent'];
                    bVal = b[1]['Error Percent'];
                    break;
                case 'solved':
                    aVal = a[1]['Percent Solved'];
                    bVal = b[1]['Percent Solved'];
                    break;
            }
            
            return direction === 'asc' ? aVal - bVal : bVal - aVal;
        });
        
        return models;
    }

    getRankWithTies(sortedModels, index, column) {
        if (index === 0) return 1;
        
        let currentValue = this.getValueByColumn(sortedModels[index][1], column);
        let rank = 1;
        
        for (let i = 0; i < index; i++) {
            let compareValue = this.getValueByColumn(sortedModels[i][1], column);
            if (compareValue !== currentValue) {
                rank = i + 2;
            } else {
                break;
            }
        }
        
        return rank;
    }

    getValueByColumn(modelData, column) {
        switch(column) {
            case 'score': return modelData['Clean Score'];
            case 'error': return modelData['Error Percent'];
            case 'solved': return modelData['Percent Solved'];
        }
    }
}
