import {Product} from "../model/product.js";

import {debugMessage} from "../common.js";

export function init_template(context) {
    return Product.getAll().then((resultList) => {
        context.products = context.products ? { ...context.products, ...resultList } : resultList;
        debugMessage('Footer template initialized with context. ' , "VERBOSE");
        return Promise.resolve({ "status": "success", "withContext": JSON.stringify(context) })

    });
}

/*
    makeFooterLink  -   Returns the HTML for a footer link using either the product name slug or id
    If you are using id, leave name as ""

 */
const makeFooterLink = (active, product_name, product_title, product_id) => {

    let buildUrl = "/products/"

    if( product_id)
    {
        buildUrl+="id/"+product_id;
    }
    else if(product_name&&product_name.length){
        buildUrl+="name/"+product_name;
    }
    return `<a ${(active?'class="footer-link-active"':"")} href="${buildUrl}">${product_title}</a>`

}

export function get_footer_html(context){
    let indexIsActive = (context.pageUrl && context.pageUrl === "index");
    let returnFooterHTML = `<a ${(indexIsActive ? 'class="footer-link-active"':'')} href="/">Home</a>`;
    if(context.products) {
        let productFit = 10;
        let productBegin = (context.pageUrl === "product" && context.product) ? context.product.id : 0;
        let filteredProducts = Object.values(context.products).filter((p)=>Number.parseInt(p.id,10) >= productBegin);

        try {

            filteredProducts.forEach((filteredProduct) => {
                const op = (fp)=>(fp.id && (fp.id === context.product.id) )|| (fp.product_name && (fp.product_name === context.product.product_name));
                let isActive =  !indexIsActive ? op(filteredProduct) : false;
                returnFooterHTML += makeFooterLink(isActive, filteredProduct.product_name, filteredProduct.product_title, filteredProduct.id);
            });

            let remainingLength = productFit - filteredProducts.length
            if ((remainingLength > 0) && (productBegin > 0)) {
                let extensio = Array.from(context.products, (p)=>new Product(p)).slice(0, Math.min(remainingLength, productBegin - 1))

                extensio.forEach((filteredProduct) => {
                    let isActive = !indexIsActive ? (filteredProduct.id && (filteredProduct.id === context.product.id)) : false;
                    returnFooterHTML += makeFooterLink(isActive, filteredProduct.product_name, filteredProduct.product_title, filteredProduct.id);
                });
            }
        }
        catch (e){
            debugMessage(`Failed in generating footer link: ${e}`,'WARNING')
        }
    }

    return returnFooterHTML
}