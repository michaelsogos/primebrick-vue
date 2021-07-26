export class DeleteEntity {
    /**
     *
     * @param {String} brickName
     * @param {String} entityName
     * @param {Number} entityId
     * @param {Boolean} isRecoverable
     */
    constructor(brickName, entityName, entityId, isRecoverable = true) {
        /** @type {String} */
        this.brickName = brickName;
        /** @type {String} */
        this.entityName = entityName;
        /** @type {Number} */
        this.entityId = entityId;
        /** @type {Boolean} */
        this.isRecoverable = isRecoverable;
    }
}
