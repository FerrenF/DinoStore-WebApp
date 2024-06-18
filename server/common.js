const SERVER_API_ROOT = '/api/';
const CLIENT_ROOT = '/';
const DEBUG_MODE = "INFO"
const msgMap = {
    'VERBOSE' : 0,
    'INFO': 1,
    'WARN': 2,
    'WARNING': 2,
    'ERROR': 3,
    'CRITICAL': 4,
    'REQUIRED': 5
}

function debugMessage(message, level="INFO") {
    let monitorLevel = msgMap[DEBUG_MODE];
    let incomingLevel = msgMap[level.toUpperCase()]
    if (incomingLevel && (incomingLevel >= monitorLevel)) {
        console.log(message)
    }
}

module.exports = {debugMessage, DEBUG_MODE, SERVER_API_ROOT, CLIENT_ROOT}