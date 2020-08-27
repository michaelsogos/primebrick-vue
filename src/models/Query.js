// eslint-disable-next-line no-unused-vars
import { ViewFilter, ViewSort } from "./View";

export class Query {
	constructor() {
		/** @type {String} */
		this.entity = null;
		/** @type {String[]} */
		this.fields = [];
		/** @type {ViewFilter[]} */
		this.filters = [];
		/** @type {ViewSort[]} */
		this.sorts = [];
		/** @type {Number} */
		this.take = null;
		/** @type {Number} */
		this.skip = null;
	}
}