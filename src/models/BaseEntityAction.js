export class BaseEntityAction {
    /**
     *
     * @param {String} brickName
     * @param {String} entityName
     */
    constructor(brickName, entityName) {
        /** @type {String} */
        this.brickName = brickName;
        /** @type {String} */
        this.entityName = entityName;
    }
}
