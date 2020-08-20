import {AppStore} from '@module/UserList';
import Api from '@delivery/api';

export const loadModalData = (id, e) => {
    const {apiConf} = AppStore.get();

    const api = new Api(apiConf);

    if (e) e.preventDefault();

    if (api) api.getDetails({userId: id})
        .then((response) => {
            AppStore.update({modal: {show: true, content: response}}, 'Modal');
        })
        .catch((error) => console.log(error));
};
