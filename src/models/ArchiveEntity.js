import { BaseEntityAction } from "./BaseEntityAction";

export class ArchiveEntity extends BaseEntityAction {
    /**
     *
     * @param {String} brickName
     * @param {String} entityName
     * @param {Number} entityId
     */
    constructor(brickName, entityName, entityId) {
        super(brickName, entityName);
        /** @type {Number} */
        this.entityId = entityId;
    }
}
