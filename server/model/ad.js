const {JsonDataSource} = require("../jsonDataSource");

class ad  {
    constructor(applicationObject) {
        this.applicationObject = applicationObject
        this.dataSourceName = 'ads'
        this.ads = new JsonDataSource(this.applicationObject.settings.dataSources[this.dataSourceName]).read('ads')

    }

    get_by_name = (name, single=true) => {
        let matches = Array.of(this.ads.filter((x)=>x.name===name))
        if(matches && matches.length){
            return single ? matches[0] : matches; //first only
        }
    }

    get_all = (type="*") => {
        if (this.ads) {
            let ads = this.ads;
            if(type!=="*"){ads = ads.filter((x)=>x.ad_type===type)}
            if (ads) {
                return ads;
            } else {
                return false
            }
        }
    }

}

module.exports={ad}