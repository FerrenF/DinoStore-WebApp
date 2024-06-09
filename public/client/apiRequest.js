/*
    apiRequest
        apiRequest takes: a string to append to the current URL's root as an endpoint, a string representing request method, and a list of parameters to convert into query params
        apiRequest makes use of XMLHttpRequest() to send a request to the server, instead of the fetch api

        TODO:
            Possibly change promise rejections and subsequent errors into a debugMessage and resolution with placeholder values.
            Currently, the rejections cause the UX to halt.
 */
import {API_PORT, appendPortToCurrentLocation, debugMessage} from "./common.js";

export function apiRequest(endpoint, method = 'GET', params = null) {

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const baseUrl = appendPortToCurrentLocation(API_PORT, false, true);
        let url = `${baseUrl}${endpoint}`;

        debugMessage(`Processing API request to ${method} : ${endpoint} with params ${JSON.stringify(params)} through URL:\n${url}`, "VERBOSE");
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