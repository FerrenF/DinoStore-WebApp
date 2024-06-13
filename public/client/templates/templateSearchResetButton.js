import {debugMessage, setQueryParam} from "../common.js";

export function init_template(context) {
    return Promise.resolve({"status":"success"})
}

export function get_search_reset_link(context, parentTemplate) {
    return window.location.pathname + "?" + setQueryParam("search",null);
}