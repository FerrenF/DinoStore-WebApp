import {Product} from "../model/product.js";

import {debugMessage, getQueryParam, setQueryParam} from "../common.js";

let maxDisplayProductsOnGuide = 4;
export function init_template(context) {
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
  return `<div class="product-card">
    <a href="/products/name/${product.product_name}">
        <img class="product-image-preview" src="${product.product_image}" alt="${product.product_image_alt}" loading="lazy" decoding="async">
        <h2>${product.product_title}</h2>
        <p>${product.product_short_description}</p>
    </a>
</div>`
};

export function get_product_guide(context) {

    let count = context.totalProductCount;
    let start = context.pageNumber * maxDisplayProductsOnGuide
    let end = Math.min(start+maxDisplayProductsOnGuide, count)
    let displayedItems = Object.values(context["products"]).slice(start,end)
    return displayedItems.map((product) => make_product_card(product)).join('');
}

export function get_page_count_descriptor(context) {
    let count = context.totalProductCount;
    let filteredCount = context.products.length;
    let start = context.pageNumber * maxDisplayProductsOnGuide
    let end = Math.min(start+maxDisplayProductsOnGuide, filteredCount)
    let pagesNeeded = Math.ceil(context.products.length / maxDisplayProductsOnGuide)

    let next_page_link = ((context.pageNumber + 1) < pagesNeeded) ? setQueryParam("page",Number.parseInt(context.pageNumber,10) + 1).toString() : "";
    let next_page_html = next_page_link.length ? `<a href="?${next_page_link}">Next Page</a>` : ""

    let first_page_link = context.pageNumber > 0 ? setQueryParam("page", 0).toString() : "";
    let first_page_html = first_page_link.length ? `<a href="?${first_page_link}">First Page</a>` : "";

    let currentlyDisplayed = Math.min(maxDisplayProductsOnGuide, context.products.length)
    return `Showing ${currentlyDisplayed} items (${(start+1)} - ${(end)}) of ${filteredCount}. ${next_page_html} ${first_page_html}`
}

export function get_pagination_display(context) {
    let count = context.products.length;
    let pagesNeeded = Math.ceil(count / maxDisplayProductsOnGuide)

    let buttonBuilder = ""
    for(let i=0;i<pagesNeeded;i++){
        let qp = setQueryParam("page",i);

        let url = qp.toString();
        buttonBuilder+=`<a href="?${url}">${i+1}</a>`;
    }
    return context.products.length ? `<div class="page-counter" style="width:50%;"><span>Show Page:</span>${buttonBuilder}</div>` : "";
}

export function get_applied_filters_html(context){
    const filterTags = getQueryParam('filter');
    const filterParams = filterTags ? filterTags.split(',') : [];
    return `Applied filters: `+filterParams.join(", ");
}