
import {urlconf as commander_url_conf} from "@papermerge/commander";
import {urlconf as viewer_url_conf} from "@papermerge/viewer";

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

    folder_url(folder) {
        return commander_url_conf.folder_url(folder);
    }

    document_url(doc) {
        return viewer_url_conf.document_url(doc);
    }
}

// there is only one UrlConf instance
let urlconf = new UrlConf();


export { urlconf };