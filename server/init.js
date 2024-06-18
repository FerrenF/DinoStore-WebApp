const {serverApplicationObject} = require("./application");
const {debugMessage} = require("./common");
const {set_up_server_routes} = require("./routes");

function init_server_application(serverApp){
    debugMessage('Server initializing...','REQUIRED');

    set_up_server_routes(serverApp, serverApplicationObject)
    return serverApplicationObject;
}

module.exports = {init_server_application}