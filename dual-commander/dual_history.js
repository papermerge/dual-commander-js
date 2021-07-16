import { exceptions } from "@papermerge/symposium";

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
        /*
            When left or right are specifically set to
            `false`, it signals that users closes respective
            panel
        */
        if (left) {
            this._path = this._build_path(left);
        } else if (left == false) {
            // this means user closed left panel
            this._path = this._params;
            this._params = undefined;
            window.history.pushState(
                {}, // not used
                // browsers ignore this arg
                "Papermerge",
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
            {}, // not used
            // browsers ignore this argument
            "Papermerge",
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
            result = urlconf.url('document', {
                document_id: doc.id
            });
        }

        if (commander) {
            result = this._folder_url(folder);
        }

        if (result) {
            return result;
        }

        throw new exceptions.ValueError(
            "Invalid path: viewer and commander missing"
        );
    }

    _build_params({
        viewer,
        commander,
        folder,
        doc
    }) {
        let param;

        if (viewer) {
            param = urlconf.url('document', {
                document_id: doc.id
            });
        }

        if (commander) {
            param = this._folder_url(folder);
        }

        if (param) {
            return param;
        }

        throw new exceptions.ValueError(
            "Invalid param: viewer and commander missing"
        );
    }

    _folder_url(folder) {
        let ret;

        if (folder && folder.id) {
            ret = urlconf.url('folder', {
                folder_id: folder.id
            });
        } else if (folder) {
            ret = urlconf.url('folder', {
                folder_id: folder
            });
        } else {
            ret = urlconf.url('folder');
        }

        return ret;
    }
}

export { DualHistory };