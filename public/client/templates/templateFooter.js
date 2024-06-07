import {Product} from "../model/product.js";

import {debugMessage} from "../common.js";

export function init_template(context) {
    return Product.getAll().then((resultList) => {
        context.products = context.products ? { ...context.products, resultList } : resultList;
        debugMessage('Footer template initialized with context. ' , "VERBOSE");
        return { "status": "success", "withContext": JSON.stringify(context) };
    });
}

export function get_footer_html(context){


}