import {Product} from "../model/product.js";
import {debugMessage} from "../common.js";

export function init_template(context) {
        return Promise.resolve({ "status": "success"})
}

export function get_query_param_home_url(context) {
    return "/" + window.location.search;
}
export function get_query_param_product_url(context){
    return "/products"+window.location.search;
}