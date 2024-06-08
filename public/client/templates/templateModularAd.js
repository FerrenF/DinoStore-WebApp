
import {debugMessage, shuffle} from "../common.js";
import {Ad} from "../model/ad.js";

export function init_template(context) {
    /*
     <a href="{{ "property":"ad.ad_link" }}"><img src="{{ "property":"ad.ad_image" }}" alt_text="{{ "property":"ad.ad_alt_text" }}"/></a>
    <span>Ad Sponsored by {{ "property":"ad.ad_sponsor" }}</span>
     */
    return Ad.getAllAds().then((resultList) => {

        context.ads = (resultList);
        debugMessage('Modlar ad initialized.', "VERBOSE");
        return { "status": "success" };
    });
}
export function get_ad(context){
    if(context.ads){
        context.active_ads = context.active_ads ? context.active_ads + 1 : 1;
        let ad = Object.values(context.ads)[context.active_ads-1];
        return `<a href="${ad.ad_link}"><img src="${ad.ad_image}" alt_text="${ad.ad_alt_text}"/></a>
    <span>Ad Sponsored by ${ad.ad_sponsor}</span>`;
    }
}