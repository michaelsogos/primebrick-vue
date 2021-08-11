// eslint-disable-next-line no-unused-vars
import { ViewFilter, ViewSort } from "./View";

export class Query {
    constructor() {
        /** @type {String} */
        this.brick = null;
        /** @type {String} */
        this.entity = null;
        /** @type {String[]} */
        this.fields = [];
        /** @type {String} */
        this.showArchivedEntities = null;
        /** @type {ViewFilter[]} */
        this.filters = [];
        /** @type {ViewSort[]} */
        this.sorts = [];
        /** @type {Number} */
        this.take = null;
        /** @type {Number} */
        this.skip = null;
        /** @type {Boolean} */
        this.excludeIDField = false;
    }
}
