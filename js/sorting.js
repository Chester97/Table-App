import Utils from './utils.js';

class SortElements {

    constructor() {
        this.utils = Utils;
    }

    digits(sortingType, array, sortBy) {
        const ascending = sortingType.order === "ascending";
        sortingType.order = ascending ? "descending" : "ascending";
        const getField = (() => {
            switch (sortBy) {
                case "total":
                    return field => field.details.total;
                case "average":
                    return field => field.details.average;
                case "id":
                    return field => field.model.id;
                case "lastMonthIncomeSummary":
                    return field => field.details.lastMonthIncomeSummary;
            }
        })();
        array.sort((_a, _b) => {
            const a = getField(_a);
            const b = getField(_b);
            return ascending ? b - a : a - b;
        });
        return sortingType.order;
    }

    strings(sortingType, array, sortBy) {
        const ascending = sortingType.order === "ascending";
        sortingType.order = ascending ? "descending" : "ascending";
        array.sort((_a, _b) => {
            const a = _a.model[sortBy].toLowerCase().trim();
            const b = _b.model[sortBy].toLowerCase().trim();
            return ascending ? b.localeCompare(a) : a.localeCompare(b);
        });
        return sortingType.order;
    }
};

export default new SortElements();