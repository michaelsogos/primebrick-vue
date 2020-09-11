export class SaveEntity {
    /**
     *
     * @param {String} entityName
     * @param {Any} entity
     */
    constructor(entityName, entity) {
        /** @type {String} */
        this.entityName = entityName;
        /** @type {Any} */
        this.entity = entity;
    }
}
