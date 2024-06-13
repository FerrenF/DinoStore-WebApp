
import { loadTemplate } from '../templateEngine.js';
import { Settings } from '../model/settings.js'
import {Product} from "../model/product.js";
import {debugMessage, isString} from "../common.js";

export function productController(productId) {

    const targetTemplate = "viewProduct"
    const contextGatherer = {}

    async function initialize_product_page(productId) {
        contextGatherer.settings = await Settings.getAll()
        contextGatherer.pageUrl = "product"

        // The two conditionals below handle the case when a user
        // navigates to /products/x instead of /products/name/x or /products/id/x

        if(/^-?\d+$/.test(productId)){
            contextGatherer.product = await Product.getById(productId)
        }
        else if(isString(productId)){
            contextGatherer.product = await Product.getByName(productId)

        }

        return await loadTemplate(targetTemplate, contextGatherer).then((result)=>{
            debugMessage(`Loaded template ${targetTemplate}`, "VERBOSE")
                return result
            }
        ).catch((e)=>{debugMessage(`Problem loading view template ${targetTemplate}: ${e.message}`, "ERROR")})

    }
    return initialize_product_page(productId)
}