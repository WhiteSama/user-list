import {fillTemplate as fill} from '@helpers/fillTemplate';

class Api {
    constructor(config) {
        this.config = config;
    }

    getList(data) {
        const { getListRequest } = this.config;
        const request = { ...getListRequest };

        if (data) request.url = fill(request.url, data);
        if (typeof request.url !== "string") request.url = request.url.body.innerText;

        return this.req(request)
    }

    getDetails(data) {
        const { getDetailsRequest } = this.config;
        const request = { ...getDetailsRequest };

        if (data) request.url = fill(request.url, data);
        if (typeof request.url !== "string") request.url = request.url.body.innerText;

        return this.req(request)
    }

    req(requestData) {
        if (!requestData.method) requestData.method = 'get';
        let request = new Request(requestData.url, { ...requestData });
        return this.fetchReq(request);
    }

    fetchReq(request) {
        return fetch(request)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Response status error: ${response.status}`);
                }

                return response.json();
            })
            .catch((error) => {
                throw new Error(error);
            })
    }
}

export default Api;
