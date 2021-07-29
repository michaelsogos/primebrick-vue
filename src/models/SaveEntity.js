import { BaseEntityAction } from "./BaseEntityAction";

export class SaveEntity extends BaseEntityAction {
    /**
     *
     * @param {String} brickName
     * @param {String} entityName
     * @param {Any} entity
     */
    constructor(brickName, entityName, entity) {
        super(brickName, entityName);

        /** @type {Any} */
        this.entity = entity;
    }
}
