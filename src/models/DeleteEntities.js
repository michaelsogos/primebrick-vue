export class DeleteEntities {
    /**
     *
     * @param {String} brickName
     * @param {String} entityName
     * @param {Number[]} entityIds
     */
    constructor(brickName, entityName, entityIds) {
        /** @type {String} */
        this.brickName = brickName;
        /** @type {String} */
        this.entityName = entityName;
        /** @type {Number[]} */
        this.entityIds = entityIds;
    }
}
