
class ad  {
    constructor(applicationObject) {
        this.applicationObject = applicationObject
    }

    get_by_name = (name, single=true) => {
        let matches = Array.of(this.get_all().filter((x)=>x.name===name))
        if(matches && matches.length){
            return single ? matches[0] : matches; //first only
        }
    }

    get_all = (type="*") => {
        if (this.applicationObject.hasOwnProperty('ads')) {
            let ads = this.applicationObject['ads'];
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