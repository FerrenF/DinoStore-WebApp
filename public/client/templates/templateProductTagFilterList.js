import {debugMessage, getQueryParam, setQueryParam} from "../common.js";
import {Product} from "../model/product.js";

export function init_template(context) {

    const searchTerms = getQueryParam('search');
    const filterTags = getQueryParam('filter');
    const filterParams = filterTags ? filterTags.split(',') : [];
    return Product.getAll(searchTerms ? searchTerms.split(',') : "*", undefined, filterParams).then((resultList) => {
        context.products = resultList;
        return Product.getAllTags().then((resultList) => {
            context.tags = resultList;
            debugMessage('Tag filter list template initialized.', "VERBOSE");
            return { "status": "success" };
        });

    });
}

export function get_tag_list_html(context, parentTemplate){

    let current_tagsQuery = getQueryParam("filter")
    let current_tags = Array();

        if (current_tagsQuery) {
            current_tags = current_tagsQuery.split(',')
        }

        if (context.tags) {

            return Object.keys(context.tags).map((tag) => {
                let newTags = Array.from(current_tags)
                let removeBtnHTML = "";
                let tagNotActive = newTags.indexOf(tag) === -1;

                let windLoc = window.location.pathname

                if (tagNotActive) {
                    newTags.push(tag)
                } else {
                    let newTagsMinus = newTags.filter((ctag) => ctag !== tag)
                    let newParamMin = setQueryParam('filter', newTagsMinus)
                    removeBtnHTML = `<a href="${windLoc}?${newParamMin}" class="filter-remove"><span><b> - Remove Filter</b></span></a>`
                }

                let newParam = setQueryParam('filter', newTags.join(","))
                let urlBuild = `${windLoc}?${newParam}`

                let currentPListLinks = context.products ? context.products.length : 0
                let countProductsWithTag = 0;
                context.products.forEach((product)=>{
                    countProductsWithTag += (product.product_tags.indexOf(tag)>-1) ? 1 : 0;
                })

                let tagCountHtml = tagNotActive ? (current_tags.length === 0 ? `(${context.tags[tag]})` : `(${countProductsWithTag})`) : `(${currentPListLinks})`
                return countProductsWithTag ? `<li><a href="${urlBuild}">${tag} ${(tagCountHtml)}</a>${removeBtnHTML}</li>` : '';
            }).join('')
        } else {
            debugMessage('Failed to load tag list.', 'ERROR')
        }
}