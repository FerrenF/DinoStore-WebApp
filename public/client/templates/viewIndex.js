import {debugMessage} from "../common.js";

export function init_template(context) {
    debugMessage('Index template initialized with context: '+JSON.stringify(context), "VERBOSE");
    return Promise.resolve({"status":"success"})
}
