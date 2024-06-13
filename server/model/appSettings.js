const {JsonDataSource} = require("../jsonDataSource");

class settings  {
    constructor(applicationObject) {
        this.applicationObject = applicationObject
        this.dataSourceName = 'settings'
        this.settings = new JsonDataSource(this.applicationObject.settings.dataSources[this.dataSourceName]).read('settings')
    }
    get = () => {
        if (this.settings) {
            return this.settings;
        } else {
            return false
        }
    }
}

module.exports = {settings}