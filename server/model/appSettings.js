class settings  {
    constructor(applicationObject) {
        this.applicationObject = applicationObject
    }
    get = () => {
        if (this.applicationObject.hasOwnProperty('settings')) {
            return this.applicationObject.settings;
        } else {
            return false
        }
    }
}

module.exports = {settings}