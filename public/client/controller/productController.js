
import { loadTemplate } from '../templateEngine.js';
import { Settings } from '../model/settings.js'
import {Product} from "../model/product.js";
import {isString} from "../common.js";

export function productController(productId) {

    const targetTemplate = "viewProduct"
    const contextGatherer = {}
    async function initialize_product_page(productId) {
        contextGatherer.settings = await Settings.getAll()
        contextGatherer.pageUrl = "product"

        if(/^-?\d+$/.test(productId)){
            contextGatherer.product = await Product.getById(productId)
        }
        else if(isString(productId)){
            contextGatherer.product = await Product.getByName(productId)

        }

        return await loadTemplate(targetTemplate, contextGatherer).then((result)=>{
                return result
            }
        ).catch((e)=>{console.log(e.message)})
    }
    return initialize_product_page(productId)
}