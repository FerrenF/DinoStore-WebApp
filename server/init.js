const {serverApplicationObject} = require("./application");
const {debugMessage} = require("./common");
const {set_up_server_routes, set_up_client_routes} = require("./routes");

function init_server_application(serverApp, clientApp){
    debugMessage('Server initializing...','REQUIRED');

    set_up_server_routes(serverApp, serverApplicationObject)
    set_up_client_routes(clientApp)
    return serverApplicationObject;
}

module.exports = {init_server_application}