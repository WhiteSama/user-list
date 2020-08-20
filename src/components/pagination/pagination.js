import {addElement as add} from '@helpers/addElement';

import {AppStore} from '@module/UserList';

import styles from '@styles/index';

class Pagination {
    constructor(pageLimit) {
        this.pagination = [];
        this.pageLimit = pageLimit;
    }

    generatePagination(data) {
        const { pageLimit } = this;
        const { pagination } = AppStore.get();

        const pages = Math.ceil(data.length / pageLimit);
        const paginationContainer = add('ul');
        paginationContainer.classList.add(styles.pagination);

        if (pages < 2) return false;

        for (let i = 1; pages >= i; i++) {
            const content = pagination.currentPage === i ? `<span>${i}</span>` : `<a href="?page=${i}">${i}</a>`
            add('li', paginationContainer, content);
        }

        paginationContainer.childNodes.forEach((el, i) => {
            const child = el.firstElementChild;

            if (child.tagName === 'A') {
                child.addEventListener('click', (e) => this.setCurrentPage(i + 1, e), true);
            }
        });

        this.pagination = paginationContainer;
        return paginationContainer;
    }

    setCurrentPage(page, e) {
        const { pagination } = AppStore.get();

        if (e) e.preventDefault();

        const paginationConfig = {
            ...pagination,
            currentPage: page
        };

        AppStore.update({pagination: paginationConfig}, 'TableView');
    }
}

export default Pagination;
