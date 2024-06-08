import {debugMessage, getQueryParam} from "../common.js";
import {Product} from "../model/product.js";

export function init_template(context) {
    /*
     <a href="{{ "property":"ad.ad_link" }}"><img src="{{ "property":"ad.ad_image" }}" alt_text="{{ "property":"ad.ad_alt_text" }}"/></a>
    <span>Ad Sponsored by {{ "property":"ad.ad_sponsor" }}</span>
     */

    const filterTags = getQueryParam('filter');
    const filterParams = filterTags ? filterTags.split(',') : [];
    return Product.getAll("*", [], filterParams).then((resultList) => {
        context.products = resultList;
        return Product.getAllTags().then((resultList) => {
            context.tags = resultList;
            debugMessage('Tag filter list template initialized.', "VERBOSE");
            return { "status": "success" };
        });

    });
}

export function get_tag_list_html(context){

    let current_tagsQuery = getQueryParam("filter")
    let current_tags = Array();
    if(current_tagsQuery){
        current_tags = current_tagsQuery.split(',')
    }
    if(context.tags){
        return Object.keys(context.tags).map((tag)=>{
            let newTags = Array.from(current_tags)
            let removeBtnHTML = "";
            let tagNotActive = newTags.indexOf(tag)===-1;
            if(tagNotActive) {
                newTags.push(tag)
            }else {
                let newTagsMinus =  newTags.filter((ctag)=>ctag!==tag)
                removeBtnHTML = `<a href="/?filter=${(newTagsMinus.join(","))}" class="filter-remove"><span><b> - Remove Filter</b></span></a>`
            }
            let urlBuild = `/?filter=${(newTags.join(","))}`

            let currentPListLinks = context.products ? context.products.length : 0
            let tagCountHtml = tagNotActive ? (current_tags.length === 0 ? `(${context.tags[tag]})`: "") : `(${currentPListLinks})`
            return `<li><a href="${urlBuild}">${tag} ${(tagCountHtml)}</a>${removeBtnHTML}</li>`
        }).join('')
    }
}