const {printAvailableRoutes} = require("./server/routes.js");

const PORT = process.env.PORT || 3051;
const SERVER_PORT = PORT + 1

const express = require('express');
const serverApp = express();
serverApp.use(express.urlencoded({extended:true}));

//
//
// Server Initialization
//
//

const {init_server_application} = require('./server/init')
const serverApplicationObject = init_server_application(serverApp)

serverApp.listen(SERVER_PORT,()=> {
    console.info(`Server has started on ${SERVER_PORT}`)
    printAvailableRoutes(serverApp)
})

module.exports = {serverApp, serverApplicationObject};