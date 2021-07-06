import { assert } from "chai";

import { DualHistory } from "../dual-commander/dual_history";
import { urlconf } from "../dual-commander/urls";


describe("test/test_dual_history.js", () => {

    beforeEach(() => {
        urlconf.prefix = "/core";
    });

    it("asserts basic navigation in commander panel", () => {
        /* At the beginning user has only one commander panel open.
        Internally left commander attribute is used; user sees
        only one panel.
        */
        let dual_history;

        dual_history = new DualHistory();
        // user clicks on folder 4
        dual_history.push({
            left: {
                commander: true
                folder: {id: 4}
            }
        });
        assert.isEqual(
            dual_history.url,
            "/core/folder/4/"
        );

        // user clicks on folder 9
        dual_history.push({
            left: {
                commander: true
                folder: {id: 9}
            }
        });
        assert.isEqual(
            dual_history.url,
            "/core/folder/9/"
        );

        // user clicks on document 7
        // and `open_mode` is set to `OpenModeView.OTHER_PANEL` i.e.
        // document will open viewer in panel right
        dual_history.push({
            left: {
                commander: true
                folder: {id: 9}
            },
            right: {
                viewer: true,
                doc: {id: 7}
            }
        });
        assert.isEqual(
            dual_history.url,
            "/core/folder/9/?right=/core/document/7/"
        );
    });

    it("asserts initial value of DualHistory.url", () => {
        /* DuaHistory.url is initialized with whatever state
        are passed to DualCommander.open(...)
        */
        let dual_history;

        dual_history = new DualHistory({
            left: {
                commander: true,
                folder: {id: 3}
            },
        });
        assert.isEqual({
            dual_history.url,
            "/core/folder/3/"
        });
        // assuming that on document click the document will
        // open in right panel
        dual_history.push({
            right: {
                viewer: true,
                doc: {id: 5}
            }
        })
        assert.isEqual(
            dual_history.url,
            "/core/folder/3/?right=/core/document/5/"
        );
        // user switches left commander to inline mode
        // and clicks on document 7
        dual_history.push({
            left: {
                viewer: true,
                doc: {id: 7}
            }
        });
        assert.isEqual(
            dual_history.url,
            "/core/document/7/?right=/core/document/5/"
        )
        // and user clicks 'close' button in the left viewer
        // thus only (one) viewer (from the right side, with document 5) is open
        dual_history.push({
            left: false
        });
        assert.isEqual(
            dual_history.url,
            "/core/document/5/"
        );
    });

    it("asserts initial state with two panel open", () => {
        let dual_history1,
            dual_history2;

        dual_history1 = new DualHistory({
            left: {
                commander: true
                // notice that folder is not mentioned
                // which means that root folder will be opened
            },
            right: {
                commander: true
                // notice that folder is not mentioned
                // which means that root folder will be opened
            }
        });
        // state with two commanders open, both commander
        // panel have root folder opened
        assert.isEqual(
            dual_history1.url,
            "/core/folder/?right=/core/folder/"
        );

        dual_history2 = new DualHistory({
            left: {
                viewer: {
                    doc: {id: 13}
                }
            },
            right: {
                viewer: {
                    doc: {id: 13}
                }
            }
        });
        // state with two viewers open, both viewers show
        // same document 13
        assert.isEqual(
            dual_history2.url,
            "/core/document/13/?right=/core/document/13/"
        );
    });
});