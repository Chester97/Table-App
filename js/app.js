import 'regenerator-runtime/runtime';
import UIElements from './elements.js';
import SortElements from './sorting.js';
import Utils from './utils.js';

class Main {
    
    constructor() {
        this.UI = UIElements;
        this.sorting = SortElements;
        this.utils = Utils;
        this.allItems = [];
        this.targetItems = null;
        this.itemsPerPage = null;
        this.pagesCount = null;
        this.page = null;
        this.fetchData();
    }

    displayPage() {
        const startIndex = this.page * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const items = this.targetItems.slice(startIndex, endIndex);


        this.UI.displayRows(items);
        this.UI.enableControls();
        this.UI.setPageInfo(this.page + 1, this.pagesCount);
    }

    onSearchQueryChange() {
        const query = document
          .getElementById("search-company")
          .value.trim()
          .toLowerCase();
        this.targetItems =
          query.length === 0
            ? this.allItems
            : this.allItems.filter((item) =>
                item.model.name.toLowerCase().includes(query)
                || item.model.city.toLowerCase().includes(query)
                || String(item.model.id).includes(query)
                || String(item.details.total).includes(query)
                || String(item.details.average).includes(query)
                || String(item.details.lastMonthIncomeSummary).includes(query)
            );
        this.recalculatePages();
        this.displayPage();
        this.UI.setCounter(query.length === 0 ? null : this.targetItems.length);
      }

    calculateDetails(data) {
        const sum = data.incomes.reduce((sum, { value }) => sum + parseFloat(value), 0);
        const items = data.incomes.sort((a, b) => b.date.localeCompare(a.date));
        const last = items[0];
        const lastMonth = last.date.substring(0, 6);
        const lastMonthIncomes = items.filter(item => item.date.startsWith(lastMonth));
        const lastMonthIncomeSummary = lastMonthIncomes.reduce((sum, {value}) => sum + +value, 0).toFixed(2);
        const total = sum.toFixed(2);
        const average = (sum / data.incomes.length).toFixed(2);
        return { total, average, lastMonthIncomeSummary };
    }

    async fetchData() {
        this.UI.setIsLoading(true);
        const response = await fetch(process.env.API_COMPANIES, this.utils.fetchParams);
        const data = await response.json();
        const dataDetails = await this.fetchDetails(data);
        this.onDataReceived({data,dataDetails});
    }

    async fetchDetails(data)  {
        return Object.fromEntries(await Promise.all(data.map(async (item) => {
            const detailsResponse = await fetch(`${process.env.API_DETAILS}${item.id}`);
            const details = await detailsResponse.json();
            return [item.id, details];
        })));
    }

    onDataReceived(dataItems) {
        const { data, dataDetails } = dataItems;
        this.allItems = data.map((company) => ({
            view: null,
            model: company,
            details: this.calculateDetails(dataDetails[company.id])
        }));
        this.targetItems = this.allItems;
        this.setItemsPerPage(5);
        this.UI.setIsLoading(false);
        this.displayPage();
    }

    recalculatePages() {
        this.pagesCount = Math.ceil(this.targetItems.length / this.itemsPerPage);
        this.page = 0;
    }

    setItemsPerPage(count) {
        this.itemsPerPage = count;
        this.recalculatePages();
    }

    changePage(offset) {
        this.page += offset || 0;
        if(this.page < 0) this.page = this.pagesCount - 1;
        if(this.page >= this.pagesCount) this.page = 0;
        this.displayPage();
    }

    sort(dataset, field, dataType) {
        const order = this.sorting[dataType](dataset, this.targetItems, field);
        this.displayPage();
        this.UI.setSorting(field, order);
    }
}

const table = new Main();
document.getElementById("previous").addEventListener("click", () => table.changePage(-1));
document.getElementById("next").addEventListener("click", () => table.changePage(1));
document
    .getElementById("items-per-page")
    .addEventListener("change", (e) => {
      const itemsPerPage = +e.target.value;
      table.setItemsPerPage(itemsPerPage);
      table.displayPage();
    });
document
    .getElementById("search-company")
    .addEventListener("input", () => table.onSearchQueryChange());
[
    { field: "id", type: "digits" },
    { field: "name", type: "strings" },
    { field: "city", type: "strings" },
    { field: "total", type: "digits" },
    { field: "average", type: "digits" },
    { field: "lastMonthIncomeSummary", type: "digits" },
].forEach(({ field, type }) =>
    document.getElementById(field).addEventListener("click", e => table.sort(e.target.dataset, field, type))
);
