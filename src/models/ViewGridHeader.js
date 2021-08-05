export class ViewGridHeader {
    constructor() {
        /** @type {String} */
        this.text = null;
        /** @type {String} */
        this.value = null;
        /** @type {String} */
        this.type = null;
        /** @type {Boolean} */
        this.sortable = false;
        /** @type {Boolean} */
        this.groupable = false;
        /** @type {String} */
        this.align = null;
        /** @type {String} */
        this.width = null;
        /** @type {String} */
        this.class = null;
        /** @type {import("../models/View").ViewFilterField} */
        this.columnFilter = null;
    }
}
