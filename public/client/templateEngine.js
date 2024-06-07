import {debugMessage} from "./common.js";

function loadScript(src, type="module") {
    debugMessage('Appending template script '+src,'VERBOSE')
    return import(src).catch(err => {
        throw new Error(`Failed to load module ${src}: ${err.message}`);
    });
}


// processTemplate is responsible for finding template variables in HTML that we load. It's also responsible for replacing these variables
// with the necessary data
async function processTemplate(html, context) {
    const templateVariableRegex = /\{\{(([\t\n\r]|.)*?)\}\}/gim;
    const matches = [...html.matchAll(templateVariableRegex)];

    for (const match of matches) {
        const templateString = match[1].trim();
        let templateData;

        try {
            templateData = JSON.parse(`{${templateString}}`);
            debugMessage('Processing template variable: ' + templateString, 'VERBOSE');
        } catch (e) {
            debugMessage('Error parsing template variable:' + e.toString(), 'ERROR');
            continue;
        }
        if (templateData.template) {
            debugMessage('Loading subtemplate ' + templateData.template, 'VERBOSE');
            try {
                const subTemplateHtml = await loadTemplate(templateData.template, context);
                html = html.replace(match[0], subTemplateHtml);
            }
            catch (e){
                debugMessage('Error loading subtemplate ' + templateData.template + ":"+e.toString(), 'VERBOSE');
            }

        } else if (templateData.query) {
            let splitr = templateData.query.split('.');

            let resultData = context[splitr[0]];
            if (resultData) {
                for (let i = 1; i < splitr.length; i++) {
                    let component = splitr[i];
                    if (resultData[component]) {
                        console.log(component + ": " + resultData);
                        resultData = resultData[component];
                    }
                }
            }
            debugMessage('Loading data into template slot ' + templateData.query + ": " + JSON.stringify(resultData), 'VERBOSE');
            html = html.replace(match[0], resultData);
        } else if (templateData.method) {
            if (context.module) {
                let supposedMethod = context.module[templateData.method];
                if (typeof supposedMethod === "function") {
                    html = html.replace(match[0], supposedMethod(context));
                }
            } else {
                debugMessage(`${templateString} requested method ${templateData.method} but does not have a module associated with it.`, 'Error');
            }
        } else {
            html = html.replace(match[0], "emptymatch");
        }
    }

    return html;
}

export function loadTemplate(name, context) {
    // CONFIGURATION
    const basePath = '/client/templates/';
    const htmlPath = `${basePath}${name}.html`;
    const jsPath = `${basePath}${name}.js`;
    debugMessage(`Loading template ${name}`, 'INFO');

    // Function to load the HTML file
    function loadHTML() {
        return new Promise((resolve, reject) => {
            const xhrHtml = new XMLHttpRequest();
            xhrHtml.open('GET', htmlPath, true);
            xhrHtml.onreadystatechange = function () {
                if (xhrHtml.readyState === 4) {
                    if (xhrHtml.status === 200) {
                        processTemplate(xhrHtml.responseText, context)
                            .then(processedHtml => resolve(processedHtml))
                            .catch(err => {
                                debugMessage(`Error while processing template ${name}.html: ${err.message}`, 'ERROR');
                                resolve(""); // Resolve with empty string on error
                            });
                    } else {
                        debugMessage(`Template ${name}.html not found`, 'ERROR');
                        resolve(""); // Resolve with empty string if HTML file is not found
                    }
                }
            };
            xhrHtml.send();
        });
    }

    // Function to load and execute the JS file
    function loadJS(context) {
        return new Promise((resolve, reject) => {
            const xhrJs = new XMLHttpRequest();
            xhrJs.open('GET', jsPath, true);
            xhrJs.timeout = 5000;
            xhrJs.onreadystatechange = function () {
                if (xhrJs.readyState === 4) {
                    if (xhrJs.status === 200) {
                        try {
                            loadScript(jsPath)
                                .then(module => {
                                    context.module = module;
                                    if (typeof module.init_template === 'function') {
                                        return module.init_template(context).then(() => {
                                            resolve(); // Resolve after JS and init_template are executed
                                        }).catch(err => {
                                            debugMessage(`Error initializing template context in ${name}.js: ${err.message}`, 'WARN');
                                            resolve(); // Resolve even if init_template execution fails
                                        });
                                    } else {
                                        debugMessage(`init_template function not found in ${name}.js`, 'WARN');
                                    }
                                    resolve(); // Resolve after JS is executed
                                })
                                .catch(err => {
                                    debugMessage(`Error loading script ${name}.js: ${err.message}`, 'WARN');
                                    resolve(); // Resolve even if JS execution fails
                                });
                        } catch (e) {
                            debugMessage(`Error loading script ${name}.js: ${e.message}`, 'WARN');
                            resolve(); // Resolve even if JS execution fails
                        }
                    } else if (xhrJs.status === 404) {
                        debugMessage(`Script file ${name}.js not found (404)`, 'WARN');
                        resolve(); // Resolve if JS file is not found
                    } else {
                        resolve(); // Resolve for any other HTTP status
                    }
                }
            };
            xhrJs.ontimeout = function () {
                debugMessage(`Request for ${name}.js timed out`, 'WARN');
                resolve(); // Resolve on timeout
            };
            xhrJs.onerror = function () {
                debugMessage(`Error during the request for ${name}.js`, 'WARN');
                resolve(); // Resolve on error
            };
            xhrJs.send();
        });
    }

    // Main logic: load JS first, then HTML
    return loadJS(context).then(() => loadHTML());
}