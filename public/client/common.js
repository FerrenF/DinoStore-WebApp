import {DEBUG_MODE} from "./config.js";

const msgMap = {
    'VERBOSE' : 0,
    'INFO': 1,
    'WARN': 2,
    'WARNING': 2,
    'ERROR': 3,
    'CRITICAL': 4
}

export function debugMessage(message, level="WARN") {
    let monitorLevel = msgMap[DEBUG_MODE];
    let incomingLevel = msgMap[level.toUpperCase()]
    if (incomingLevel >= monitorLevel) {
        console.log(message)
    }
}

export const shuffle = (array) => {
    // i feel like i am missing a builtin somewhere
    return array.sort(() => Math.random() - 0.5);
};


export function graceful_shutdown(code, message){

}

export function isString(x) {
    return Object.prototype.toString.call(x) === "[object String]";
}

export function isNumber(x){
    return (typeof x === 'number' && isFinite(x)) ||  (Object.prototype.toString.apply(x) === '[object Number]') ;
}

/*

    appendPortToCurrentLocation
        appendPortToCurrentLocation appends a set of query parameters either to the root directory or current relative directory

 */
export function appendPortToCurrentLocation(port, includeQueryParams = false, rootDirectory = false) {
    const currentLocation = window.location;
    const protocol = currentLocation.protocol;
    const hostname = currentLocation.hostname;
    const pathname = rootDirectory ? '/' : currentLocation.pathname;
    const hash = currentLocation.hash;
    const search = includeQueryParams ? currentLocation.search : '';
    return `${protocol}//${hostname}:${port}${pathname}${search}${hash}`;
}

export function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search)
    let p = urlParams.get(param);
    return p ? p : false ;
}

export function setQueryParam(param, value) {
    const urlParams = new URLSearchParams(window.location.search)
    if(value == null){
        urlParams.delete(param)
        return urlParams;
    }
    urlParams.set(param, value);
    return urlParams;
}

