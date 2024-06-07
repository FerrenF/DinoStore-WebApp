import {Product} from "../model/product.js";

import {debugMessage} from "../common.js";

export function init_template(context) {
    return Product.getAll().then((resultList) => {
        context.products = context.products ? { ...context.products, resultList } : resultList;
        debugMessage('Product guide template initialized with context: ' + JSON.stringify(context), "VERBOSE");
        return { "status": "success" };
    });
}
/*
<div class="product-card">
    <a href="${productPageLink}">
        <img class="product-image-preview" src="${productImageUrl}" alt="${productImageAlt}" loading="lazy" decoding="async">
        <h2>${productTitle}</h2>
        <p>${productShortDescription}</p>
    </a>
</div>
 */

const make_product_card = (product) =>{
  return `<div class="product-card">
    <a href="/products/name/${product.product_name}">
        <img class="product-image-preview" src="${product.product_image}" alt="${product.product_image_alt}" loading="lazy" decoding="async">
        <h2>${product.product_title}</h2>
        <p>${product.product_short_description}</p>
    </a>
</div>`
};

export function get_product_guide(context) {
    return Object.values(context["products"]).map((product) => make_product_card(product)).join('');
}

export function get_page_count_descriptor(context) {
    return 'cummies'
}

export function get_pagination_display(context) {
    return "pee"
}