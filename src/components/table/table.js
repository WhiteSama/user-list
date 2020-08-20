import {addElement as add} from '@helpers/addElement';
import {fillTemplate as fill} from '@helpers/fillTemplate';
import {loadModalData} from '@helpers/loadModalData';

import {AppStore} from '@module/UserList';

import styles from '@styles/index';


class Table {
    constructor() {
        this.table = [];
        this.columns = [];
        this.rows = [];
    }

    setColumns(newColumns) {
        const sortedColumns = newColumns.sort((a, b) => (a.position - b.position));
        this.columns = sortedColumns.map((column) => (column));
    }

    setRows(newRows) {
        this.rows = newRows;
    }

    async generateColumns() {
        const {sort} = AppStore.get();
        const {columns} = this;
        if (!columns) return false;

        const thead = add('thead');
        const theadRow = add('tr', thead);
        thead.classList.add(styles.tableHead);

        for (let col = 0; col < columns.length; col++) {
            const column = columns[col];
            const th = add('th', theadRow);
            add('span', th, column.title);

            if (columns[col].sortable) {
                th.classList.add(styles.sortable);
                if (col === sort.column) th.classList.add(styles[sort.direction]);
                th.addEventListener('click', () => this.sortColumns(col), true);
            }
        }

        return thead;
    }

    async generateRows() {
        const {rows, columns} = this;

        if (!columns || !rows) return false;
        const tbody = add('tbody');
        tbody.classList.add(styles.tableBody);
        let tr;

        if (!!rows && rows.length > 0) {
            for (let row = 0; row < rows.length; row++) {
                tr = add('tr', tbody);
                for (let col = 0; col < columns.length; col++) {
                    const template = columns[col].template;
                    let content;

                    if (template) {
                        content = fill(template, rows[row]);
                    } else {
                        content = new DOMParser().parseFromString(Object.values(rows[row])[col].toString(), 'text/html');
                    }

                    const td = add('td', tr, content.body.innerHTML);

                    const ets = td.querySelectorAll('[data-modal]');

                    ets.forEach((et) => {
                        if (!!et) {
                            et.addEventListener('click', (e) => loadModalData(et.dataset.modal, e), true)
                        }
                    });
                }
            }
        }

        return tbody;
    }

    generateTable() {
        const table = add('table');
        table.id = window.crypto.getRandomValues(new Uint32Array(1))[0];
        table.classList.add(styles.table);

        this.generateColumns()
            .then((theadRow) => {
                add(theadRow, table);
                return this.generateRows();
            })
            .then((tbody) => {
                add(tbody, table)
            })
            .catch((error) => console.Error(error));

        this.table = table;
        return table;
    }

    sortColumns(column) {
        const {sort} = AppStore.get();

        const setDirection = () => {
            if (sort.column !== column) {
                return 'asc'
            }
            return sort.direction === 'asc' ? 'desc' : 'asc'
        };

        const sortConfig = {
            column: column,
            direction: setDirection()
        };

        AppStore.update({sort: sortConfig}, 'TableView');
    }
}

export default Table;
