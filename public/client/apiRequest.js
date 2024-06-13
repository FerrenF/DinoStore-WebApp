/*
    apiRequest
        endpoint:   a string to append to the current URL root as an endpoint
        method:     a string representing request method, and
        params:     a list of parameters to convert into query parameters (?x=y&i=j)

        apiRequest makes use of XMLHttpRequest() to send a request to the server, instead of the fetch api
 */
import {appendPortToCurrentLocation, debugMessage} from "./common.js";
import {API_PORT} from "./config.js";

export function apiRequest(endpoint, method = 'GET', params = null) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const baseUrl = appendPortToCurrentLocation(API_PORT, false, true);
        let url = `${baseUrl}${endpoint}`;

        debugMessage(`Processing API request to ${method} : ${endpoint} with params ${JSON.stringify(params)} through URL:\n${url}`, "VERBOSE");

        if (params && (method === 'GET'||method==='PUT')) {
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
                        debugMessage(`Problem sending API request ${endpoint}:\n${error.message}`, "ERROR");
                        resolve(false);
                    }
                } else {
                    debugMessage(`Request failed with status ${xhr.status}: ${xhr.statusText}`, "ERROR");
                    resolve(false);
                }
            }
        };

        xhr.ontimeout = function () {
            debugMessage(`Request to ${endpoint} timed out`, "ERROR");
            resolve(false);
        };

        xhr.onerror = function () {
            debugMessage(`Error during the request to ${endpoint}`, "ERROR");
            resolve(false);
        };

            xhr.send(JSON.stringify(params));
    });
}