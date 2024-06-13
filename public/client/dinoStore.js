import {hookAllFormSubmissions, hookAllHrefTags, hookPopstateEvents, initRouter} from "./routes.js";

function init_dino_store(){
    initRouter()
    hookAllHrefTags()
    hookAllFormSubmissions()
    hookPopstateEvents()
}

init_dino_store()
