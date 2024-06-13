import {debugMessage} from "../common.js";

export function init_template(context) {
    debugMessage('Left sidebar initialized.', "VERBOSE");
    return Promise.resolve({"status":"success"})
}

export function test_method(context, params, parentTemplate){

    console.log(params)
}
