class UIElements {
    constructor() {
        this.table = document.querySelector('.main-table');
        this.container = document.querySelector('.main-table tbody');
        this.pageInfo = document.getElementById('info');
        this.previousPageButton = document.getElementById('previous');
        this.nextPageButton = document.getElementById('next');
        this.searchCompanyInput = document.getElementById('search-company');
        this.resultsCounter = document.getElementById('results-counter');
        this.itemsPerPage = document.getElementById('items-per-page');
        this.loadingElement = null;
        this.loadingString = "Loading...";
    }

    renderCompany(data) {
        const items = [
            data.model.id,
            data.model.name,
            data.model.city,
            data.details.total || this.loadingString,
            data.details.average || this.loadingString,
            data.details.lastMonthIncomeSummary || this.loadingString,
        ];
        const fragment = document.createDocumentFragment();
        items
            .map(item => {
                const td = document.createElement("td");
                td.textContent = item;
                return td;
            })
            .forEach(td => fragment.appendChild(td));
        return fragment;
    }

    displayRows(items) {
        this.clearContainer();
        const fragment = document.createDocumentFragment();

        items.map((item) => {
            if(item.view) {
                return item.view;
            };
            const tr = document.createElement('tr');
            tr.dataset.type = "company";
            item.view = tr;
            tr.appendChild(this.renderCompany(item));
            return item.view;
        }).forEach((element) => {
            fragment.appendChild(element);
        });

        this.container.appendChild(fragment);
    }

    setCounter(count) {
        this.resultsCounter.textContent = count != null ? `Filtered ${count} result(s)` : '';
    }

    setIsLoading(value) {
        if (!value) {
            if (this.loadingElement)
                this.container.removeChild(this.loadingElement);
            return;
        }
        const loadingTR = document.createElement('tr');
        const loadingTD = document.createElement('td');
        loadingTD.setAttribute('colspan', 6);
        loadingTD.innerText = this.loadingString
        loadingTR.setAttribute('data-type', 'loading');
        loadingTR.appendChild(loadingTD);

        this.loadingElement = loadingTR;
        this.container.appendChild(loadingTR);
    }

    setPageInfo(page, count) {
        this.pageInfo.textContent = `Page ${page} of ${count}`;
    }

    clearContainer() {
        this.container.innerHTML = '';
    }

    enableControls() {
        [
            this.previousPageButton,
            this.nextPageButton,
            this.itemsPerPage,
            this.searchCompanyInput
        ].forEach((item) => item.removeAttribute('disabled'));
    }

    setSorting(field, order) {
        this.table.dataset.sortField = field;
        this.table.dataset.sortOrder = order;
    }
}
 export default new UIElements();