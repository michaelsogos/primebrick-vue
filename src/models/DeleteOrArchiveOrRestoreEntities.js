import { BaseEntityAction } from "./BaseEntityAction";

export class DeleteOrArchiveOrRestoreEntities extends BaseEntityAction {
    /**
     *
     * @param {String} brickName
     * @param {String} entityName
     * @param {Number[]} entityIds
     */
    constructor(brickName, entityName, entityIds) {
        super(brickName, entityName);

        /** @type {Number[]} */
        this.entityIds = entityIds;
    }
}
