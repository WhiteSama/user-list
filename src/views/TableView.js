import Observer from '@store/observer';

import Table from '@components/table/table';
import {AppStore} from '@module/UserList';
import Pagination from '@components/pagination/pagination';

class TableView extends Observer {
    constructor(rootElement, settings) {
        super();

        this.name = 'TableView';
        this.rootElement = rootElement;
        this.settings = settings;
        this.table = [];
        this.pagination = [];
        this.sortConfig = {
            column: 0,
            direction: 'asc'
        };
        this.paginationConfig = {
            currentPage: 1,
            pageCount: 1
        };
        this.markup = [];

        this.init();
    }

    init() {
        const {sortConfig, paginationConfig, settings} = this;

        if (!settings.columns) {
            throw Error('Columns settings need to be add')
        }

        AppStore.update({sort: sortConfig}, 'TableView');

        this.table = new Table();
        this.table.setColumns(settings.columns);

        if (settings.pageLimit) {
            this.pagination = new Pagination(settings.pageLimit);
            AppStore.update({pagination: paginationConfig}, 'TableView')
        }
    }

    sortTable(users) {
        const {sort} = AppStore.get();

        users.sort((a, b) => {
            const a_value = Object.values(a)[sort.column];
            const b_value = Object.values(b)[sort.column];

            if (typeof a_value === 'string') {
                if (sort.direction === 'desc') {
                    return b_value.localeCompare(a_value)
                }
                return a_value.localeCompare(b_value)
            }
            if (typeof a_value === 'number') {
                if (sort.direction === 'desc') {
                    return b_value - a_value
                }
                return a_value - b_value
            }
        });

        return users;
    }

    createPagination(users) {
        const {pagination} = this;

        return pagination.generatePagination(users) || '';
    }

    createMarkup(store) {
        const {table, settings} = this;
        const {pagination} = AppStore.get();
        const {users} = store;

        let newMarkup = [],
            usersList = [...users];

        try {
            this.sortTable(usersList);
            if (settings.pageLimit) usersList = this.sortTable(usersList).slice((pagination.currentPage - 1) * settings.pageLimit, pagination.currentPage * settings.pageLimit);
            table.setRows(usersList);
        } catch (e) {
            console.error('Data list is empty')
        }

        newMarkup.push(table.generateTable());

        if (settings.pageLimit) newMarkup.push(this.createPagination(users));

        return newMarkup;
    }

    render(store) {
        const {rootElement, markup} = this;

        const newMarkup = this.createMarkup(store);

        markup.forEach((el) => {
            if (rootElement.contains(el)) el.remove();
        });

        newMarkup.forEach((el) => {
            rootElement.append(el);
        });

        this.markup = newMarkup;
    }

    update(store) {
        this.render(store, "user-table");
    }
}

export default TableView;
