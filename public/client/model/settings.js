import {apiRequest} from "../apiRequest.js";

export class Settings {
    constructor(data) {
        this.siteTitle = data.siteTitle;
        this.siteSlogan = data.siteSlogan;
        this.siteIcon = data.siteIcon;
        this.siteSummary = data.siteSummary;
        this.applicationPath = data.applicationPath;
        this.maxFilters = data.maxFilters;
        this.priceUnit = data.priceUnit;
        this.priceSymbol = data.priceSymbol;
    }

    static getAll() {
        return apiRequest('settings')
            .then(data => new Settings(data))
            .catch(error => {
                console.error(`Failed to fetch settings: ${error.message}`);
                throw error;
            });
    }
}