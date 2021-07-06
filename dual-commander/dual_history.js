import { ValueError } from "@papermerge/exceptions";

import { urlconf } from "../urls";


class DualHistory {
    /*
        Saves states of both panel in window.history.

        Has only one public attribute `url`.
        `url` attribute corresponds to the url argument from
        window.history.pushState(obj, title, url) method.
        See https://developer.mozilla.org/en-US/docs/Web/API/History/pushState
    */
    constructor({left, right, urlconf}) {
        this.url = this.build_url({left, right});
    }

    push({left, right}) {
        let url;

        this.url = this.build_url({left, right});

        window.history.pushState(
            {left, right},
            undefined,
            this.url
        );
    }

    build_url({left=false, right=false}) {
        /*
            Builds a string url out of provided panel states.
        */
        let path = "", params="";

        if (!left && !right) {
            throw new ValueError("Invalid state: both panels are empty");
        }

        if (left) {
            path = this._build_path(left);
        }

        if (right) {
            params = this._build_params(right);
        }

        return `${path}?${params}`;
    }

    _build_path({viewer=false, commander=false}) {
        let result;

        if (viewer) {
            result = urlconf.document_url(viewer['doc']);
        }

        if (commander) {
            result = urlconf.folder_url(commander['folder']);
        }

        if (result) {
            return result;
        }

        throw new ValueError("Invalid path: viewer and commander missing");
    }

    _build_params({viewer, commander}) {
        let param, result;

        if (viewer) {
            param = urlconf.document_url(viewer['doc']);
        }

        if (commander) {
            param = urlconf.folder_url(commander['folder']);
        }

        if (param) {
            result = `right=${param}`;
            return result;
        }

        throw new ValueError("Invalid param: viewer and commander missing");
    }
}

export { DualHistory };