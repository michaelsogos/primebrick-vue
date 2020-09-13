export class Translation {
    constructor(key, value, isTemplate) {
        /** @type {String} */
        this.key = key;
        /** @type {String} */
        this.value = value;
        /** @type {Boolean} */
        this.isTemplate = isTemplate;
    }
}
