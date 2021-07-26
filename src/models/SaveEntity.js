export class SaveEntity {
    /**
     *
     * @param {String} brickName
     * @param {String} entityName
     * @param {Any} entity
     */
    constructor(brickName, entityName, entity) {
        /** @type {String} */
        this.brickName = brickName;
        /** @type {String} */
        this.entityName = entityName;
        /** @type {Any} */
        this.entity = entity;
    }
}
