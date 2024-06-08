import {Settings} from "../model/settings.js";

import {debugMessage} from "../common.js";

export function init_template(context) {
    let addedContext = Settings.getAll()
    context.settings = context.settings ? {...context.settings, ...addedContext} : addedContext

    debugMessage('Site Summary template initialized with context: '+JSON.stringify(context), "VERBOSE");
    return Promise.resolve({"status":"success", "addedContext": addedContext})
}
