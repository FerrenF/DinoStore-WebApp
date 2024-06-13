import {debugMessage, getQueryParam} from "./common.js";

function loadScript(src, type="module") {
    debugMessage('Appending template script '+src,'VERBOSE')
    return import(src).catch(err => {
        const m = `Failed to load module ${src}: ${err.message}`
        debugMessage(m,'ERROR')
        return null;
    });
}

// processTemplateVariables is responsible for finding template variables in HTML that we load.
//         This is a heavyweight method. It also handles calls to load template scripts into context module slots.
async function processTemplateVariables(html, context, parentTemplate) {

    //  This code matches {{ * }}
    const templateVariableRegex = /\{\{(([\t\n\r]|.)*?)\}\}/gim;
    const matches = [...html.matchAll(templateVariableRegex)];

    debugMessage('Template matched variables: ' + matches.map((m)=>m[0]).join(","), 'VERBOSE');

    for (const templateVariableMatches of matches) {

        const templateString = templateVariableMatches[1].trim();

        let templateData;

        try {
            templateData = JSON.parse(`{${templateString}}`);
            debugMessage('Processing template variable: ' + templateString, 'VERBOSE');
        } catch (e) {
            debugMessage('Error parsing template variable:' + e.toString(), 'ERROR');
            continue;
        }

        // first, does our variable impose any conditions?
        let conditionMet = true;
        if(templateData.condition){
            Object.entries(templateData.condition).forEach(([key, value])=>{
                if(conditionMet) {
                    if (key === "isPage") {
                        conditionMet = (value.toLowerCase().split(',').indexOf(context.pageUrl.toLowerCase()) >-1 );
                    }
                    if (key === "urlParamIsSet") {
                        let p = getQueryParam(value)
                        conditionMet = !!p;
                    }
                }
            })
        }

        if(!conditionMet) {
            debugMessage(`Conditions for sub-template ${(templateData.template)} have not been met. Passing on render.`, 'VERBOSE');
            html = html.replace(templateVariableMatches[0], "");
        }
        else
        {

            if(templateData.settings){
                let val = templateData.settings
                debugMessage(`${templateString} includes additional options: ${JSON.stringify(templateData.settings)}`, 'WARN');
                context.settings = context.settings ? {...context.settings, ...val} : templateData.settings;
            }

            if (templateData.template ) {
                const childTarget = templateData.template
                debugMessage('Loading sub-template ' + childTarget, 'VERBOSE');
                try {

                    const subTemplateHtml = await loadTemplate(childTarget, context, parentTemplate);
                    html = html.replace(templateVariableMatches[0], subTemplateHtml);
                    context[parentTemplate].children = context[parentTemplate].children ? [...context[parentTemplate].children, childTarget] : [childTarget];

                } catch (e) {
                    debugMessage('Error loading sub-template ' + templateData.template + ":" + e.toString(), 'VERBOSE');
                }

            } else if (templateData.query) {

                let querySplit = templateData.query.split('.');
                let resultData = context[querySplit[0]];

                if (resultData) {
                    for (let i = 1; i < querySplit.length; i++) {
                        let component = querySplit[i];
                        resultData = resultData[component];
                    }
                }

                if (templateData.format) {
                    if (templateData.format === "csv") {
                        resultData = Object.values(resultData).join(", ")
                    }
                }

                debugMessage('Loading data into template slot ' + templateData.query + ": " + JSON.stringify(resultData), 'VERBOSE');
                html = html.replace(templateVariableMatches[0], resultData);

            } else if (templateData.method) {

                if (context[parentTemplate].module) {
                    let supposedMethod = context[parentTemplate].module[templateData.method];
                    if (typeof supposedMethod === "function") {
                        debugMessage(`${templateString} requested method ${templateData.method}, and data was loaded into the variable.`, 'VERBOSE');
                        html = html.replace(templateVariableMatches[0], supposedMethod(context, parentTemplate));
                    }
                    else
                    {
                        debugMessage(`${templateString} requested method ${templateData.method}, but its undefined.`, 'Error');
                    }
                } else {
                    debugMessage(`${templateString} requested method ${templateData.method} but does not have a module associated with it.`, 'Error');
                }

            } else {
                debugMessage(`${templateString} does not request a function that exists.`, 'WARN');
                html = html.replace(templateVariableMatches[0], "emptymatch");
            }

        }

    }

    return html;
}

export function loadTemplate(templateName, context) {
    // CONFIGURATION
    const basePath = '/client/templates/';
    const htmlPath = `${basePath}${templateName}.html`;
    const jsPath = `${basePath}${templateName}.js`;

    debugMessage(`Loading template ${templateName}`, 'INFO');
    context[templateName] = context[templateName] ? context[templateName] : {}

    // Function to load the HTML file
    function loadHTML() {
        return new Promise((resolve, reject) => {
            const xhrHtml = new XMLHttpRequest();
            xhrHtml.open('GET', htmlPath, true);
            xhrHtml.onreadystatechange = function () {
                if (xhrHtml.readyState === 4) {
                    if (xhrHtml.status === 200) {
                        processTemplateVariables(xhrHtml.responseText, context, templateName)
                            .then((processedHtml) => {
                                resolve(processedHtml)
                            })
                            .catch(err => {
                                debugMessage(`Error while processing template ${templateName}.html: ${err.message}`, 'ERROR');
                                resolve(""); // Resolve with empty string on error
                            });
                    } else {
                        debugMessage(`Template ${templateName}.html not found`, 'ERROR');
                        resolve(""); // Resolve with empty string if HTML file is not found
                    }
                }
            };
            xhrHtml.send();
        });
    }

    // Function to load and execute the JS file
    function loadJS() {
        return new Promise((resolve, reject) => {
            const xhrJs = new XMLHttpRequest();
            xhrJs.open('GET', jsPath, true);
            xhrJs.timeout = 5000;
            xhrJs.onreadystatechange = function () {
                if (xhrJs.readyState === 4) {

                    if (xhrJs.status === 200) { // Request success
                        try {

                            loadScript(jsPath)
                                .then(module => {
                                   // if(module) {

                                        //
                                        // Checkpoint: Module Loaded
                                        //

                                        context[templateName].module = module;

                                        if (typeof module.init_template === 'function') {
                                            module.init_template(context).then(() => resolve()).catch(err => {
                                                debugMessage(`Error initializing template context method in ${templateName}.js: ${err.message}`, 'WARN');
                                                return resolve(); // Resolve even if init_template execution fails
                                            });
                                        } else {
                                            debugMessage(`Script loaded but init_template context method not found in ${templateName}.js`, 'WARN');
                                        }
                                   // }

                                })
                                .catch(err => {
                                    debugMessage(`Error loading script ${templateName}.js: ${err.message}`, 'WARN');
                                    return resolve(); // Resolve even if JS execution fails
                                });

                        } catch (e) {
                            debugMessage(`Error loading script ${templateName}.js: ${e.message}`, 'WARN');
                            return resolve(); // Resolve even if JS execution fails
                        }
                    } else if (xhrJs.status === 404) { // Request file not found
                        debugMessage(`Script file ${templateName}.js not found (404)`, 'WARN');
                        return resolve(); // Resolve even if JS file is not found
                    } else {
                        return resolve(); // Resolve for any other HTTP status
                    }
                }

            };
            xhrJs.ontimeout = function () {
                debugMessage(`Request for ${templateName}.js timed out`, 'WARN');
                resolve(); // Resolve on timeout
            };
            xhrJs.onerror = function () {
                debugMessage(`Error during the request for ${templateName}.js`, 'ERROR');
                resolve(); // JUST RESOLVE IT BB (This one might be serous)
            };
            xhrJs.send();
        }).catch((e)=>{
            debugMessage(`Error during the request for ${templateName}.js: ${e.message}`, 'ERROR');
        });
    }

    // Critical logic: load JS first, then HTML.
    return loadJS().then(() => loadHTML());
}