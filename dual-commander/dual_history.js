import { ValueError } from "@papermerge/symposium";

import { urlconf } from "./urls";


class DualHistory {
    /*
        Saves states of both panels in window.history.

        The only relevant public attribute is `url`.
        `url` attribute corresponds to the url argument from
        window.history.pushState(obj, title, url) method.
        See https://developer.mozilla.org/en-US/docs/Web/API/History/pushState

        Both panels' state (i.e. state of left and right panels) is
        fully represented by the url.
        url = <left-panel-state> ? right=<right-panel-state>

        where <left-panel-state> or <right-panel-state> can be either
        * /core/folder/<folder-id> - for commander panels
        * /core/viwer/<document-id>  - for viewer panel
    */
    constructor({left, right}={}) {
        if (left) {
            this._path = this._build_path(left);
        }

        if (right) {
            this._params = this._build_params(right);
        }
    }

    get url() {
        /*
            url = this._path ? params

        the '?' characters is present only if params is non
        empty.
        */
        if (this.params) {
            return `${this._path}?${this.params}`;
        }

        return this._path;
    }

    get params() {
        if (this._params) {
            return `right=${this._params}`;
        }
    }

    push({left, right}) {
        if (left) {
            this._path = this._build_path(left);
        } else if (left == false) {
            // this means user closed left panel
            this._path = this._params;
            this._params = undefined;
            window.history.pushState(
                {left, right},
                undefined,
                this.url
            );
            return;
        }

        if (right) {
            this._params = this._build_params(right);
        } else if (right == false ){
            // this means user closed
            // right panel
            this._params = undefined;
        }

        window.history.pushState(
            {left, right},
            undefined,
            this.url
        );
    }

    _build_path({
        viewer,
        commander,
        folder,
        doc
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
        viewer,
        commander,
        folder,
        doc
    }) {
        let param;

        if (viewer) {
            param = urlconf.document_url(doc);
        }

        if (commander) {
            param = urlconf.folder_url(folder);
        }

        if (param) {
            return param;
        }

        throw new ValueError("Invalid param: viewer and commander missing");
    }
}

export { DualHistory };