
import { loadTemplate } from '../templateEngine.js';
import { Settings } from '../model/settings.js'
import {debugMessage} from "../common.js";
function render_index_page() {

}

export function indexController(searchParams) {

    const targetTemplate = "viewIndex"
    const bodyTarget = "page-content"

    const contextGatherer = {}

    async function initialize_index() {
        contextGatherer.settings = await Settings.getAll()
        loadTemplate(targetTemplate, contextGatherer).then((result)=>{
                const content = document.getElementById(bodyTarget);
                content.innerHTML += result
            }
        )
    }
    initialize_index().then(r => debugMessage('Index loaded', 'VERBOSE'))
}