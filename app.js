const {printAvailableRoutes} = require("./server/routes.js");

const PORT = 3050;
const SERVER_PORT = PORT + 1

const express = require('express');
const serverApp = express();
serverApp.use(express.urlencoded({extended:true}));

const clientApp = express();
clientApp.use(express.urlencoded({extended:true}));

//
//
// Server Initialization
//
//

const {init_server_application} = require('./server/init')
const serverApplicationObject = init_server_application(serverApp,clientApp)

clientApp.listen(PORT,()=> console.info(`Client has started on ${PORT}\n`))
serverApp.listen(SERVER_PORT,()=> {
    console.info(`Server has started on ${SERVER_PORT}`)
    printAvailableRoutes(serverApp)
})

module.exports = {serverApp, clientApp, serverApplicationObject};