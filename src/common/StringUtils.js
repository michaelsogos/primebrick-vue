/**
 * Static class with helper functions for strings.
 */

export class StringUtils {
    /**
     * Check wherever a string: is empty, contains only spaces, is null
     * @param {String} str The string to evaluate
     */
    static isNullOrWhitespace(str) {
        return !str || str.length === 0 || /^\s*$/.test(str);
    }

    /**
     * Transform the provided number value into a string representing the local currency with the local currency rules
     * @param {Number} value The number to be transformed
     * @param {String} cultureCode The ISO culture code (like "it-IT")
     * @param {String} currencyCode The ISO currency code (like "EUR")
     * @param {String} symbolType A value between "symbol" (print "€"), "code" (print "EUR"), "name" (print "euro")
     */
    static formatCurrency(value, cultureCode, currencyCode, symbolType = "symbol") {
        if (typeof value != "number") return "NaN";
        else
            return new Intl.NumberFormat(cultureCode, {
                style: "currency",
                currency: currencyCode,
                currencyDisplay: symbolType,
            }).format(value);
    }

    /**
     * transforms the provuded number value into a string using the local number rules with prefix and/or suffix if provided
     * @param {Number} value The number to be transformed
     * @param {Number} decimalDigits The decimal ditits to print out else it will be 0
     * @param {String} cultureCode The ISO culture code (like "it-IT")
     * @param {String} prefix The string used as prefix before
     * @param {String} suffix The string used as suffix after
     * @param {Boolean} useGrouping True to show thousand separator
     * @returns {String}
     */
    static formatNumber(value, cultureCode, decimalDigits, useGrouping, prefix, suffix) {
        if (!decimalDigits) decimalDigits = 0;
        if (useGrouping != true) useGrouping = false;

        return `${prefix || ""}${new Intl.NumberFormat(cultureCode, {
            style: "decimal",
            useGrouping: useGrouping,
            minimumFractionDigits: decimalDigits,
            maximumFractionDigits: decimalDigits,
        }).format(value)}${suffix || ""}`;
    }

    /**
     *
     * @param {Date} value The date to be transformed
     * @param {String} cultureCode The ISO culture code (like "it-IT")
     */
    static formatDate(value, cultureCode) {
        if (!value) return "";
        else return new Intl.DateTimeFormat(cultureCode, { year: "numeric", month: "numeric", day: "numeric" }).format(value);
    }

    /**
     *
     * @param {Date} value The date to be transformed
     * @param {String} cultureCode The ISO culture code (like "it-IT")
     */
    static formatTime(value, cultureCode) {
        if (!value) return "";
        else return new Intl.DateTimeFormat(cultureCode, { hour: "numeric", minute: "numeric", second: "numeric" }).format(value);
    }

    /**
     *
     * @param {Date} value The date to be transformed
     * @param {String} cultureCode The ISO culture code (like "it-IT")
     */
    static formatDateTime(value, cultureCode) {
        if (!value) return "";
        else
            return new Intl.DateTimeFormat(cultureCode, {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
            }).format(value);
    }

    /**
     * transforms the provuded number value into a string as percentage
     * @param {Number} value - the number to be transformed
     * @param {Number} decimalDigits - if provided, it will be the number of decimal digits to be used for the perent. If not provided, it will be 0
     * @param {String} cultureCode The ISO culture code (like "it-IT")
     * @returns {String} the number formatted as string using the local number and percentage rules
     */
    static formatPercent(value, cultureCode, decimalDigits) {
        if (!decimalDigits) decimalDigits = 0;

        return new Intl.NumberFormat(cultureCode, {
            style: "percent",
            minimumFractionDigits: decimalDigits,
            maximumFractionDigits: decimalDigits,
        }).format(value);
    }

    /**
     *
     * @param {String} template
     * @param {any} record
     * @returns {String}
     */
    static buildEntityName(template, record) {
        return template.interpolate(record);
    }
}
