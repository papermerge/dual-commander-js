window.addEventListener('DOMContentLoaded', () => {
    let DC = DualCommander,
        dual_commander,
        switch_2_single,
        switch_2_dual;


    DC.urlconf.prefix = '/01-dual-commander';

    dual_commander = new DC.DualCommanderView({
        'panel_left': {'el': '#panel_left'},
        'panel_right': {'el': '#panel_right'},
    });

    dual_commander.open();
    dual_commander.panel_view_left.on('document_clicked', (doc) => {
        alert(`Panel Left: doc id=${doc.id} title=${doc.title} clicked`);
    });

    dual_commander.panel_view_right.on('document_clicked', (doc) => {
        alert(`Panel Right: doc id=${doc.id} title=${doc.title} clicked`);
    });

    switch_2_single = document.querySelector('#single-panel-mode');
    switch_2_dual = document.querySelector('#dual-panel-mode');

    switch_2_single.addEventListener('click', () => {
        let panel_r,
            panel_l,
            row;

        dual_commander.panel_view_right.close();

        panel_l = document.querySelector('#panel_left');
        panel_l.classList = ["col-12"];
        row = document.querySelector(".row");
        row.styles = "width: 100%";

        switch_2_single.classList.replace('btn-secondary', 'btn-primary');
        switch_2_dual.classList.replace('btn-primary', 'btn-secondary');
    });

    switch_2_dual.addEventListener('click', () => {
        let panel_r,
            panel_l,
            row;

        dual_commander.panel_view_right.open();

        panel_l = document.querySelector('#panel_left');
        panel_l.classList = ["col-6"];
        row = document.querySelector(".row");
        row.styles = "";

        switch_2_single.classList.replace('btn-primary', 'btn-secondary');
        switch_2_dual.classList.replace('btn-secondary', 'btn-primary');
    });
});