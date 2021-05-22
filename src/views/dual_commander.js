import { View } from "symposium";
import { CommanderView, fetch_children } from "document-commander";


const LEFT = "left",
    RIGHT = "right",
    COMMANDER = "commander",
    VIEWER = "viewer";


class DualCommanderView extends View {

    constructor(options={}) {
        super();
        this.panel_view_left = new CommanderView(
            options['panel_left']
        );
        this.panel_view_right = new CommanderView(
            options['panel_right']
        );
        this.options = options;

        this.on("switch-mode", this.on_switch_mode, this);
        this.panel_view_left.on(
            "document-click", this.on_left_document_click, this
        );
        this.panel_view_right.on(
            "document-click", this.on_right_document_click, this
        );
    }

    initial_fetch(left_folder, right_folder) {
        /**
        Fetch left and right panel nodes for the very first time.

        Fetch nodes for first time has some cosmetical nuances:
            - loader is not shown
            - node placeholders provide user visual
                feedback about ongoing request
        */
        if (left_folder == right_folder) {
            // a small optimization here, perform a single request
            // as both left and right panels display same folder
            this._initial_fetch_same_folder(left_folder);
        } else {
            this._initial_fetch_diff_folders(left_folder, right_folder);
        }
    }

    on_left_document_click(doc) {
        this.on_document_click.apply(
            this,
            [this.panel_view_left, doc]
        );
    }

    on_right_document_click(doc) {
        this.on_document_click.apply(
            this,
            [this.panel_view_right, doc]
        );
    }

    on_document_click(panel, doc) {
        console.log(`document-click ${panel} ${doc}`);
    }

    on_switch_mode(mode, left_or_right) {
        let panel;

        if (left_or_right == LEFT) {
            panel = this.panel_view_left;
        } else if (left_or_right == RIGHT) {
            panel = this.panel_view_right;
        }

        if (mode == VIEWER) {
            this.switch_to_viewer(panel);
        } else if (mode == COMMANDER) {
            this.switch_to_commander(panel);
        }
    }

    switch_to_viewer(panel) {

    }

    switch_to_commander(panel) {

    }

    _initial_fetch_diff_folders(left_folder, right_folder) {
        let that = this,
            left_promise,
            right_promise;

        left_promise = fetch_children(left_folder);
        right_promise = fetch_children(right_folder);

        Promise.all([left_promise, right_promise]).then(
            (values) => {
                that.panel_view_left.reset(values[0]);
                that.panel_view_right.reset(values[1]);
        }).catch((error) => {
            alert(`Error while fetching folders '${left_folder}', '${right_folder}': ${error}`);
        });
    }

    _initial_fetch_same_folder(folder) {
        let that = this;

        fetch_children(folder).then(
            (nodes) => {
                that.panel_view_left.reset(nodes);
                that.panel_view_right.reset(nodes);
            }
        ).catch(
            (error) => {
                alert(`Error while fetchinf folder '${folder}': ${error}`);
            }
        );
    }
}

export { DualCommanderView };