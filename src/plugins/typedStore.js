import Vue from "vue";

Object.defineProperty(Vue.prototype, "$$store", {
    get: function () {
        return this.$store;
    },
    enumerable: true,
});
