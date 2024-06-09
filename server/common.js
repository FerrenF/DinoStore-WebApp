
const DEBUG_MODE = "WARN"
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
    if ((incomingLevel && incomingLevel) >= monitorLevel) {
        console.log(message)
    }
}

module.exports = {debugMessage, DEBUG_MODE}