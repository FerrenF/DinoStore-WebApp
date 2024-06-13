import {debugMessage, getQueryParam} from "../common.js";

export function init_template(context) {
    debugMessage('Searchbar initialized.', "VERBOSE");
    return Promise.resolve({"status":"success"})
}

export function get_search_hidden_inputs(context, parentTemplate){

    try {

        let qParamsFilter = getQueryParam('filter')
        let fElementContainer = document.createElement('DIV')

        if (qParamsFilter) {
            let newElement =document.createElement('INPUT');
            newElement.setAttribute('name', 'filter');
            newElement.setAttribute('value', qParamsFilter);
            newElement.setAttribute('type', 'hidden')
            fElementContainer.appendChild(newElement)
        }
        return fElementContainer.innerHTML;
    }
    catch (e){
        debugMessage('There was a problem constructing search form inputs: '+e.message,'ERROR');
    }

    return "";
}
