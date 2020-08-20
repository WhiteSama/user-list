import {addElement as add} from '@helpers/addElement';
import {loadModalData} from '@helpers/loadModalData';
import Observer from '@store/observer';

import {fillTemplate as fill} from '@helpers/fillTemplate';
import {AppStore} from '@module/UserList';

import styles from '@styles/index';


class Modal extends Observer {
    constructor(rootElement, settings) {
        super();

        this.name = 'Modal';
        this.rootElement = rootElement;
        this.settings = settings;
        this.modalComponent = [];
        this.markup = [];

        this.init();
    }

    init() {
        const {rootElement} = this;

        document.body.classList.add(styles.modal);
        const modalComponent = add('div');
        modalComponent.classList.add(styles.modalContainer);

        const cross = add('div', modalComponent);
        cross.classList.add(styles.closeBtn);
        cross.addEventListener('click', () => this.close(), true);

        document.addEventListener('click', (e) => {
            if (e.target.closest(`.${styles.modalContainer}`)) return;
            this.close()
        }, true);

        rootElement.append(modalComponent);

        this.modalComponent = modalComponent;
    }

    setModalEvents() {
        const {rootElement} = this;
        const modalTriggerElements = rootElement.querySelectorAll('[data-modal]');

        modalTriggerElements.forEach((el) => {
            el.addEventListener('click', (e) => loadModalData(el.dataset.modal, e), true)
        });
    }

    open() {
        const {modal} = AppStore.get();

        if (!modal.show) AppStore.update({modal: {...modal, show: true}}, 'Modal');

        document.body.classList.add(styles.open);
    }

    close() {
        const {modal} = AppStore.get();

        if (modal.show) AppStore.update({modal: {...modal, show: false}}, 'Modal');

        document.body.classList.remove(styles.open);
    }

    createMarkup(store) {
        const {modalComponent, settings} = this;
        const {modal} = store;

        let newMarkup = [];
        const content = fill(settings.modalTemplate, modal.content);
        const contentObj = add('div', modalComponent, content.body.innerHTML);
        contentObj.classList.add(styles.modalContent);

        const fillClass = (el) => {
            el.childNodes.forEach((innerEl) => {
                if (innerEl.classList && styles[innerEl.classList.value]) innerEl.classList = styles[innerEl.classList.value];
                if (innerEl.hasChildNodes()) {
                    fillClass(innerEl);
                }
            });
        };

        fillClass(contentObj);

        newMarkup.push(contentObj);

        return newMarkup;
    }

    render(store) {
        const {modalComponent, markup} = this;
        const {modal} = store;

        const newMarkup = this.createMarkup(store);

        markup.forEach((el) => {
            if (modalComponent.contains(el)) el.remove();
        });

        newMarkup.forEach((el) => {
            modalComponent.append(el);
        });

        this.setModalEvents();

        modal.show ? this.open() : this.close();

        this.markup = newMarkup;
    }

    update(store) {
        this.render(store, "user-modal");
    }
}

export default Modal;
