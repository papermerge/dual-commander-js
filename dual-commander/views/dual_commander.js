import { View } from "@papermerge/symposium";
import { CommanderView } from "@papermerge/commander";
import { DocumentView } from "@papermerge/viewer";


const LEFT_PANEL = "left",
    RIGHT_PANEL = "right",
    COMMANDER_MODE = "commander",
    VIEWER_MODE = "viewer";


class DualCommanderView extends View {

    constructor(options={}) {
        super();
        this.commander_left = new CommanderView(
            options['panel_left']
        );
        this.viewer_left = new DocumentView(
            options['panel_left']
        );
        this.commander_right = new CommanderView(
            options['panel_right']
        );
        this.viewer_right = new DocumentView(
            options['panel_right']
        );
        this.panel_view_left = this.commander_left;
        this.panel_view_right = this.commander_right;
        this.options = options;

        this.on("switch-mode", this.on_switch_mode, this);
        this.panel_view_left.on(
            "document-click", this.on_left_document_click, this
        );
        this.panel_view_right.on(
            "document-click", this.on_right_document_click, this
        );
        this.viewer_left.on(
            "close-document", this.on_left_close_document, this
        );
        this.viewer_right.on(
            "close-document", this.on_right_close_document, this
        );
    }

    open({left=false, right=false}) {
        if (left) {
            if (left['commander']) {
                this.panel_view_left = this.commander_left;
                this.panel_view_left.open(left['folder']);
            } else if (left['viewer']) {
                this.panel_view_left = this.viewer_left;
                this.panel_view_left.open({
                    doc: left['doc']
                });
            }
        }

        if (right) {
            if (right['commander']) {
                this.panel_view_right = this.commander_right;
                this.panel_view_right.open(right['folder']);
            } else if (right['viewer']) {
                this.panel_view_right = this.viewer_right;
                this.panel_view_right.open({
                    doc: right['doc']
                });
            }
        }
    }

    close({left, right}) {
        if (left) {
            this.panel_view_left.close();
        } else if (right) {
            this.panel_view_right.close();
        }
    }

    on_left_document_click(doc) {
        let breadcrumb;

        breadcrumb = this.panel_view_right.breadcrumb;


        this.panel_view_right.close();
        this.panel_view_right = this.viewer_right

        breadcrumb.add(doc);
        this.panel_view_right.open({doc, breadcrumb});
    }

    on_right_document_click(doc) {
        let breadcrumb;

        breadcrumb = this.panel_view_left.breadcrumb;

        this.panel_view_left.close();
        this.panel_view_left = this.viewer_left

        breadcrumb.add(doc);
        this.panel_view_left.open({doc, breadcrumb});
    }

    on_right_close_document(node) {
        console.log("Close the document");
        this.panel_view_right.close();
        this.panel_view_right = this.commander_right
        this.panel_view_right.open(node);
    }

    on_left_close_document(node) {
        console.log("Close the document");
        this.panel_view_left.close();
        this.panel_view_left = this.commander_left
        this.panel_view_left.open(node);
    }

    on_switch_mode(mode, left_or_right) {
        let panel;

        if (left_or_right == LEFT_PANEL) {
            panel = this.panel_view_left;
        } else if (left_or_right == RIGHT_PANEL) {
            panel = this.panel_view_right;
        }

        if (mode == VIEWER_MODE) {
            this.switch_to_viewer(panel);
        } else if (mode == COMMANDER_MODE) {
            this.switch_to_commander(panel);
        }
    }

    switch_to_viewer(panel) {
    }

    switch_to_commander(panel) {

    }

}

export { DualCommanderView };