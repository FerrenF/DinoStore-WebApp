
import { loadTemplate } from '../templateEngine.js';
import { Settings } from '../model/settings.js'
import {debugMessage} from "../common.js";

export function indexController() {

    const targetTemplate = "viewIndex"
    const contextGatherer = {}

    async function initialize_index() {
        contextGatherer.settings = await Settings.getAll()
        contextGatherer.pageUrl = "index"
       return await loadTemplate(targetTemplate, contextGatherer)
    }
    return initialize_index()
}