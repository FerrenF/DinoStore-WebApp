export const APP_PORT = 3050
export const API_PORT = 3051

export const DEBUG_MODE = "WARN"
const msgMap = {
    'VERBOSE' : 0,
    'INFO': 1,
    'WARN': 2,
    'WARNING': 2,
    'ERROR': 3,
    'CRITICAL': 4
}
export function debugMessage(message, level="INFO") {
    let monitorLevel = msgMap[DEBUG_MODE];
    let incomingLevel = msgMap[level.toUpperCase()]
    if ((incomingLevel && incomingLevel) >= monitorLevel) {
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
    urlParams.set(param, value);
    return urlParams;
}

/*
    apiRequest
        apiRequest takes: a string to append to the current URL's root as an endpoint, a string representing request method, and a list of parameters to convert into query params
        apiRequest makes use of XMLHttpRequest() to send a request to the server, instead of the fetch api

        TODO:
            Possibly change promise rejections and subsequent errors into a debugMessage and resolution with placeholder values.
            Currently, the rejections cause the UX to halt.
 */
export function apiRequest(endpoint, method = 'GET', params = null) {

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const baseUrl = appendPortToCurrentLocation(API_PORT,false,true);
        let url = `${baseUrl}${endpoint}`;

        debugMessage(`Processing API request to ${method} : ${endpoint} with params ${JSON.stringify(params)} through URL:\n${url}`,"VERBOSE");
        if (params && method === 'GET') {
            const queryString = new URLSearchParams(params).toString();
            url += `?${queryString}`;
        }

        xhr.open(method, url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const jsonResponse = JSON.parse(xhr.responseText);

                        resolve(jsonResponse);
                    } catch (error) {
                        reject(new Error(`Error parsing response JSON: ${error.message}`));
                    }
                } else {
                    reject(new Error(`Request failed with status ${xhr.status}: ${xhr.statusText}`));
                }
            }
        };

        xhr.ontimeout = function () {
            reject(new Error(`Request to ${endpoint} timed out`));
        };

        xhr.onerror = function () {
            reject(new Error(`Error during the request to ${endpoint}`));
        };

        // Send the request
        if (params && method !== 'GET') {
            xhr.send(JSON.stringify(params));
        } else {
            xhr.send();
        }
    });
}
