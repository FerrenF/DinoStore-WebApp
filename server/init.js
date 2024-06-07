
// init.js makes sure that we initiate 'connection' to our data before we start serving routes.

const {debug_message, graceful_shutdown} = require("./common.js");
const fs = require('fs');


function load_json_data_source(dataSource) {
    let rawData = fs.readFileSync(dataSource);
    return JSON.parse(rawData);
}

function load_data_sources(dataSources, applicationObject) {
    dataSources.forEach(source => {
        let [filetype, filepath] = source.split(':');

        if (filetype === 'json') {
            let data = load_json_data_source(filepath);

            Object.keys(data).forEach(key => {
                if (applicationObject.hasOwnProperty(key)) {
                    applicationObject[key] = { ...applicationObject[key], ...data[key] };
                } else {
                    applicationObject[key] = data[key];
                }
            });
        } else {
            debug_message(`Unsupported file type in data sources: ${filetype}`, 'warn');
        }
    });
}

const {serverApplicationObject} = require("./application");
function init_server_application(){
    /*
        returns an object holding server data
     */
    console.log(serverApplicationObject)
    if(!serverApplicationObject.hasOwnProperty('settings') || !serverApplicationObject['settings'].hasOwnProperty('dataSources')){
        let m = 'Failed to load data sources. Exiting application'
        debug_message(m, 'critical')
        graceful_shutdown(-1,m)
        return false
    }
    load_data_sources(serverApplicationObject.settings.dataSources, serverApplicationObject)

    return serverApplicationObject
}


const serverApplication = init_server_application()
module.exports = {serverApplication}