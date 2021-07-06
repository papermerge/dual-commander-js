import { ValueError } from "@papermerge/symposium";

import { urlconf } from "./urls";


class DualHistory {
    /*
        Saves states of both panel in window.history.

        Has only one public attribute `url`.
        `url` attribute corresponds to the url argument from
        window.history.pushState(obj, title, url) method.
        See https://developer.mozilla.org/en-US/docs/Web/API/History/pushState
    */
    constructor({left=false, right=false}={}) {
        if (left) {
            this._path = this._build_path(left);
        }

        if (right) {
            this._params = this._build_params(right);
        }
    }

    get url() {
        if (this._params) {
            return `${this._path}?${this._params}`;
        }

        return this._path;
    }

    push({left, right}) {
        if (left) {
            this._path = this._build_path(left);
        }

        if (right) {
            this._params = this._build_params(right);
        }

        window.history.pushState(
            {left, right},
            undefined,
            this.url
        );
    }

    _build_path({
        viewer=false,
        commander=false,
        folder=undefined,
        doc=undefined
    }) {
        let result;

        if (viewer) {
            result = urlconf.document_url(doc);
        }

        if (commander) {
            result = urlconf.folder_url(folder);
        }

        if (result) {
            return result;
        }

        throw new ValueError("Invalid path: viewer and commander missing");
    }

    _build_params({
        viewer=false,
        commander=false,
        folder=undefined,
        doc=undefined
    }) {
        let param, result;

        if (viewer) {
            param = urlconf.document_url(doc);
        }

        if (commander) {
            param = urlconf.folder_url(folder);
        }

        if (param) {
            result = `right=${param}`;
            return result;
        }

        throw new ValueError("Invalid param: viewer and commander missing");
    }
}

export { DualHistory };