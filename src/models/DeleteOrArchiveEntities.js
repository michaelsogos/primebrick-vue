import { BaseEntityAction } from "./BaseEntityAction";

export class DeleteOrArchiveEntities extends BaseEntityAction {
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
