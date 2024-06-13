
import { loadTemplate } from '../templateEngine.js';
import { Settings } from '../model/settings.js'
import {Product} from "../model/product.js";
import {debugMessage, isString} from "../common.js";

export function productsController() {

    const targetTemplate = "viewProducts"
    const contextGatherer = {}

    async function initialize_products_page() {
        contextGatherer.settings = await Settings.getAll()
        contextGatherer.pageUrl = "products"

        return await loadTemplate(targetTemplate, contextGatherer).then((result)=>{
            debugMessage(`Loaded template ${targetTemplate}`, "VERBOSE")
                return result
            }
        ).catch((e)=>{debugMessage(`Problem loading view template ${targetTemplate}: ${e.message}`, "ERROR")})

    }

    return initialize_products_page()
}