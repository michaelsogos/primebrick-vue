const apiEndPoints = {
    POST_USER_LOGIN: "api/auth/login",
    POST_REFRESH_TOKEN: "api/auth/refresh_token",
    GET_META_INFO: "api/meta/info",
    GET_META_MENU: "api/meta/menu",
    GET_META_TRANSLATIONS: "api/meta/translations",
    GET_META_VIEW: "api/meta/view",
    POST_GET_DATA: "api/data/find",
    POST_GET_ENTITY: "api/data/findOne",
    POST_SAVE_ENTITY: "api/data/save",
    POST_GET_RECORDINFO: "api/data/info",
    POST_DELETE_ENTITY: "api/data/delete",
    POST_DELETE_ENTITIES: "api/data/deleteMany",
    POST_ARCHIVE_ENTITIES: "api/data/archiveMany",
    POST_ARCHIVE_ENTITY: "api/data/archive",
    POST_RESTORE_ENTITY: "api/data/restore",
    POST_RESTORE_ENTITIES: "api/data/restoreMany",

};

export default apiEndPoints;
