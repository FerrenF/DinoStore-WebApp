import {hook_all_form_submissions, hook_all_href_tags, init_router} from "./routes.js";

function init_dino_store(){
    init_router()
    hook_all_href_tags()
    hook_all_form_submissions()

}

init_dino_store()