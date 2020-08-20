import Store from '@store/store';

export const AppStore = new Store();

import Api from '@delivery/api';

import TableView from '@views/TableView';
import Modal from '@components/modal/modal';

import {csvJSON} from '@helpers/CSVtoJSON';

import '@styles/index';
import styles from '@styles/index';


export class UserList {
    constructor(rootElement, type, settings, data) {
        this.rootElement = rootElement;
        this.type = type;
        this.settings = settings;
        this.data = data;
        this.api = null;
        this.modal = null;
    }

    init() {
        const {data, settings, rootElement} = this;
        let {api} = this;

        rootElement.classList.add(styles.moduleRoot);

        if (data) {
            if (data.static) AppStore.update({users: data.static});
            if (data.dynamic) {
                api = new Api(data.dynamic);
                AppStore.update({apiConf: data.dynamic});
            }
            if (data.csv) {
                fetch(data.csv)
                    .then(response => response.text())
                    .then((content) => {
                        let userList = JSON.parse(csvJSON(content));
                        if (settings.limit) {
                            userList = userList.slice(0, settings.limit)
                        }
                        userList.map((el, i) => el.userId = i);
                        AppStore.update({users: userList})
                    })
            }
        } else {
            throw Error('Set data source');
        }

        if (this.type === 'table') {
            const table = new TableView(rootElement, settings);

            AppStore.addObserver(table);

            if (api) api.getList()
                .then((response) => {
                    let users = response;
                    if (settings.limit) users = response.slice(0, settings.limit);
                    AppStore.update({users}, 'TableView');
                    if (settings.modalTemplate) this.initModal();
                });
        } else {
            throw Error(`Type ${this.type} is not support`);
        }
    }

    initModal() {
        const {settings, rootElement} = this;

        const modalConfig = {
            show: false,
            content: ''
        };

        AppStore.update({modal: modalConfig}, 'Modal');

        this.modal = new Modal(rootElement, settings);
        AppStore.addObserver(this.modal);
    }
}
