import { View } from "@papermerge/symposium";
import {
    CommanderView,
    OpenModeView,
    PanelModeView
} from "@papermerge/commander";
import { DocumentView } from "@papermerge/viewer";
import { DualHistory } from "../dual_history";


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
        // pushes history states of the panels (left/right/commander/viewer)
        this.dual_history = new DualHistory();

        this.on("switch-mode", this.on_switch_mode, this);
        this.on_anypanel("document-click", this.on_document_clicked);
        this.on_anyviewer("close-document", this.on_close_document);
        this.on_anypanel("switch-2-dual", this.on_switch_2_dual);
        this.on_anypanel("switch-2-single", this.on_switch_2_single);

        if (options['dual_history'] === true) {
            this.enable_dual_history();
        }
    }

    open({left=false, right=false}) {
        if (left) {
            if (left['commander']) {
                this.panel_view_left = this.commander_left;
                this.panel_view_left.open({folder: left['folder']});
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
                this.panel_view_right.open({folder: right['folder']});
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

    on_anypanel(name, callback, ...args) {
        this.panel_view_right.on(
            name,
            callback,
            this,
            this.panel_view_right,
            this.panel_view_left,
            this.viewer_right,
            this.viewer_left
        );
        this.panel_view_left.on(
            name,
            callback,
            this,
            this.panel_view_left,
            this.panel_view_right,
            this.viewer_left,
            this.viewer_right
        );
    }

    on_anyviewer(name, callback, ...args) {
        this.viewer_right.on(
            name,
            callback,
            this,
            this.panel_view_right,
            this.panel_view_left,
            this.viewer_right,
            this.viewer_left
        );
        this.viewer_left.on(
            name,
            callback,
            this,
            this.panel_view_left,
            this.panel_view_right,
            this.viewer_left,
            this.viewer_right
        );
    }

    on_close_document(
        node,
        receiver_panel,
        other_panel,
        receiver_viewer,
        other_viewer
    ) {
        let breadcrumb;

        breadcrumb = receiver_viewer.breadcrumb.slice();
        breadcrumb.change_parent(node);

        receiver_viewer.close();
        receiver_viewer = receiver_panel
        receiver_viewer.open({
            folder: node, breadcrumb: breadcrumb
        });
    }

    on_document_clicked(
        doc,
        receiver_panel,
        other_panel,
        receiver_viewer,
        other_viewer
    ) {
        /*
        Document icon was clicked in receiver panel.

        Will get current (i.e. receiver's panel commander's) breadcrumb, add
        to it clicked document's title and open clicked document
        (together with breadcrumb) either inline or in other panel.
        */
        let breadcrumb;

        // make a copy of breadcrumb
        breadcrumb = receiver_panel.breadcrumb.slice();

        if (receiver_panel.open_mode == OpenModeView.OTHER_PANEL) {
            // open document in other panel
            if (other_panel.is_hidden()) {
                // switch to dual mode first
                other_panel.open();
                other_panel.halfscreen();
                receiver_panel.halfscreen();
            } else {
                other_panel.close();
            }
            other_panel = other_viewer

            breadcrumb.add(doc);
            other_panel.open({doc, breadcrumb});
        } else if (receiver_panel.open_mode == OpenModeView.INLINE) {
            // open document inline
            receiver_panel.close();
            receiver_panel = receiver_viewer

            breadcrumb.add(doc);
            receiver_panel.open({doc, breadcrumb});
        }
    }

    on_switch_2_single(receiver_panel, other_panel) {
        receiver_panel.close({display: false});
        other_panel.trigger("mode-button-dual");
        other_panel.fullscreen();
    }

    on_switch_2_dual(receiver_panel, other_panel) {
        other_panel.open();
        other_panel.halfscreen();
        receiver_panel.halfscreen();
    }
    // ---
    on_folder_click_in_commander_left(folder) {
        this.dual_history.push({
            left: {
                folder: folder,
                commander: true
            }
        });
    }

    on_document_click_in_commander_left(doc) {
    }

    on_close_commander_left() {
        this.dual_history.push({
            left: false
        });
    }

    on_open_commander_left(folder) {
        this.dual_history.push({
            left: {
                folder: folder,
                commander: true
            }
        });
    }
    // ---
    on_folder_click_in_commander_right(folder) {
        this.dual_history.push({
            right: {
                folder: folder,
                commander: true
            }
        });
    }

    on_document_click_in_commander_right(doc) {
    }

    on_close_commander_right() {
        this.dual_history.push({
            right: false
        });
    }

    on_open_commander_right(folder) {
        this.dual_history.push({
            right: {
                folder: folder,
                commander: true
            }
        });
    }
    // ---
    on_folder_click_in_viewer_left(folder){
    }

    on_close_viewer_left() {
    }

    on_open_viewer_left() {
    }
    // ---
    on_folder_click_in_viewer_right(folder) {
    }

    on_close_viewer_right() {
    }

    on_open_viewer_right() {
    }

    enable_dual_history() {
        /*
            Will listen to panels events and update window.location
            accordingly
        */
        // update history/pushState => updates window.location
        this.commander_left.on(
            "folder-click",
            this.on_folder_click_in_commander_left,
            this
        );
        this.commander_left.on(
            "document-click",
            this.on_document_click_in_commander_left,
            this
        );
        this.commander_left.on(
            "close",
            this.on_close_commander_left,
            this
        );
        this.commander_left.on(
            "open",
            this.on_open_commander_left,
            this
        );
        // ---
        this.commander_right.on(
            "folder-click",
            this.on_folder_click_in_commander_right,
            this
        );
        this.commander_right.on(
            "document-click",
            this.on_document_click_in_commander_right,
            this
        );
        this.commander_right.on(
            "close",
            this.on_close_commander_right,
            this
        );
        this.commander_right.on(
            "open",
            this.on_open_commander_right,
            this
        );
        // ---
        this.viewer_left.on(
            "folder-click",
            this.on_folder_click_in_viewer_left,
            this
        );
        this.viewer_left.on(
            "close",
            this.on_close_viewer_left,
            this
        );
        this.viewer_left.on(
            "open",
            this.on_open_viewer_left,
            this
        );
        // --
        this.viewer_right.on(
            "folder-click",
            this.on_folder_click_in_viewer_right,
            this
        );
        this.viewer_right.on(
            "close",
            this.on_close_viewer_right,
            this
        );
        this.viewer_right.on(
            "open",
            this.on_open_viewer_right,
            this
        );
    }
}

export { DualCommanderView };