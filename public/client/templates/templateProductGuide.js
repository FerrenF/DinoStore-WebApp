import {Product} from "../model/product.js";

import {debugMessage, getQueryParam, setQueryParam} from "../common.js";

let maxItemDisplay = 4;
export function init_template(context) {

    // look for settings
    if(context.settings.maxItemDisplay){
        maxItemDisplay = context.settings.maxItemDisplay;
    }

    const searchTerms = getQueryParam('search');
    const filterTags = getQueryParam('filter');
    const pageNumberQuery = getQueryParam('page');
    const pageNumber = pageNumberQuery ? pageNumberQuery : 0;
    const searchParams = searchTerms ? searchTerms.split(',') : ["*"];
    const searchProps = ["product_name", "product_title", "product_description", "product_short_description"];
    const filterParams = filterTags ? filterTags.split(',') : [];

    return Product.getCount().then((count)=>{
        context.totalProductCount = count;
        context.pageNumber = pageNumber;
        return Product.getAll(searchParams, searchProps, filterParams).then((resultList) => {
            context.products = resultList;
            debugMessage('Product guide template initialized with context: ' + JSON.stringify(context), "VERBOSE");
            return { "status": "success" };

        });
    })
}

const make_product_card = (product) =>{

    let script = `document.getElementById("sidebar_cart").scrollIntoView(${JSON.stringify({behavior:"smooth"})});`
  return `<div class="product-card">
    <div class="product-link-area">
        <a href="/products/name/${product.product_name}">
            <img class="product-image-preview" src="${product.product_image}" alt="${product.product_image_alt}" loading="lazy" decoding="async">
            <h2>${product.product_title}</h2>
            <p>${product.product_short_description}</p>
        </a>
    </div>
    <div class="product-details">
        <span class="product-price">Your Price: ${product.priceString}</span>
        <a onclick='${script}' class="add-to-cart-button" href="/cart/add/${product.id}/1?returnUrl=${encodeURIComponent(window.location.pathname+window.location.search)}">Add to Cart</a>
    </div>
</div>`
};

export function get_product_guide(context, parentTemplate) {

    let count = context.totalProductCount;
    let start = context.pageNumber * maxItemDisplay
    let end = Math.min(start+maxItemDisplay, count)
    let displayedItems = Object.values(context["products"]).slice(start,end)

    return displayedItems.map((product) => {

        const priceString = new Intl.NumberFormat('en-US', { style: 'currency', currency: context.settings.priceUnit }).format(product.product_price);
        product.priceString = priceString;
        return make_product_card(product);
    }).join('');
}

export function get_page_count_descriptor(context, parentTemplate) {

    let filteredCount = context.products.length;
    let start = context.pageNumber * maxItemDisplay
    let end = Math.min(start+maxItemDisplay, filteredCount)
    let pagesNeeded = Math.ceil(context.products.length / maxItemDisplay)

    let next_page_link = ((context.pageNumber) < pagesNeeded-1) ? setQueryParam("page",Number.parseInt(context.pageNumber,10) + 1).toString() : "";
    let next_page_html = next_page_link.length ? `<a href="${(window.location.pathname)}?${next_page_link}">Next Page</a>` : ""

    let first_page_link = context.pageNumber > 1 ? setQueryParam("page", 0).toString() : "";
    let first_page_html = first_page_link.length ? `<a href="${(window.location.pathname)}?${first_page_link}">First Page</a>` : "";

    let currentlyDisplayed = Math.min(maxItemDisplay, context.products.length)
    return `Showing ${currentlyDisplayed} items (${(start+1)} - ${(end)}) of ${filteredCount}. ${next_page_html} ${first_page_html}`
}

export function get_pagination_display(context, parentTemplate) {
    let count = context.products.length;
    let pagesNeeded = Math.ceil(count / maxItemDisplay)

    let buttonBuilder = ""
    for(let i=0;i<pagesNeeded;i++){
        let qp = setQueryParam("page",i);

        let url = qp.toString();
        buttonBuilder+=`<a href="${(window.location.pathname)}?${url}">${i+1}</a>`;
    }
    return context.products.length ? `<div class="page-counter" style="width:50%;"><span>Show Page:</span>${buttonBuilder}</div>` : "";
}

export function get_applied_filters_html(context, parentTemplate){
    const filterTags = getQueryParam('filter');
    const filterParams = filterTags ? filterTags.split(',') : [];
    return `<span>Applied filters: <b>${filterParams.join(", ")}</b></span>`;

}

export function get_applied_search_html(context, parentTemplate){
    const searchTerm = getQueryParam('search');
    return `<span>Searching for term: <b>${searchTerm}</b></span>`;
}