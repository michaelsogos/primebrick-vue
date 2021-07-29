import { BaseEntityAction } from "./BaseEntityAction";

export class DeleteEntity extends BaseEntityAction {
    /**
     *
     * @param {String} brickName
     * @param {String} entityName
     * @param {Number} entityId
     * @param {Boolean} isRecoverable
     */
    constructor(brickName, entityName, entityId, isRecoverable = true) {
        super(brickName, entityName);
        /** @type {Number} */
        this.entityId = entityId;
        /** @type {Boolean} */
        this.isRecoverable = isRecoverable;
    }
}