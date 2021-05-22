
import {urlconf as commander_url_conf} from "document-commander";
import {urlconf as viewer_url_conf} from "document-viewer";

class UrlConf {
    /**
     *
     * Central point for managing urls.
     */

    constructor(prefix="/browser") {
        this._prefix = prefix;
    }

    root_url() {
        return this.prefix;
    }

    set prefix(value) {
        commander_url_conf.prefix = value;
        viewer_url_conf.prefix = value;
        this._prefix = value;
    }
    get prefix() {
        return this._prefix;
    }
}

// there is only one UrlConf instance
let urlconf = new UrlConf();


export { urlconf };