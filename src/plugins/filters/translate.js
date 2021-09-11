import store from "../../store/index";
import $ from "../../store/types";

/**
 *
 * @param {String} key the key that is going to be translated
 * @param {Array} params is an array of elements containig the params to replace
 * @returns {String} Return the string parsed and translated. Just in case return a MISSING pattern string.
 */
function translate(key, params = null) {
    return store.getters[$.getters.APP_TRANSLATE_STRING](key, params);
}

export default {
    name: "translate",
    filter: translate,
};
