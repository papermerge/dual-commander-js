window.addEventListener('DOMContentLoaded', () => {
    let DC = DualCommander,
        dual_commander;


    DC.urlconf.prefix = '/03-open-at-my-documents-b';

    dual_commander = new DC.DualCommanderView({
        'panel_left': {'el': '#panel_left'},
        'panel_right': {'el': '#panel_right'},
        // we start here with dual history disabled
        'dual_history': false
    });

    dual_commander.open({
        left: {commander: true, folder: {id: 4}},
        right: {commander: true, folder: {id: 7}}
    });
});