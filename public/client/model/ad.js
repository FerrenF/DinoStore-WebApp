import {debugMessage} from "../common.js";
import {apiRequest} from "../apiRequest.js";

export class Ad {
    constructor(data) {
        this.ad_name = data.ad_name;
        this.ad_image = data.ad_image;
        this.ad_type = data.ad_type;
        this.ad_link = data.ad_link;
        this.ad_sponsor = data.ad_sponsor;
        this.alt_text = data.alt_text;
        this.weight = data.weight;
    }

    static getAllAds() {
        return apiRequest('ads')
            .then((data) => {
                let rawList = Array.from(data);
                if (rawList.length) {
                    return rawList.map(ad => new Ad(ad));
                }
                return rawList;
            })
            .catch(error => {
                debugMessage('Failed to fetch product catalog.', 'ERROR');
                throw error;
            });
    }
}