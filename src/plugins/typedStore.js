import Vue from "vue";

Object.defineProperty(Vue.prototype, "$$store", {
    get: function () {
        return this.$store;
    },
    enumerable: true,
});

Object.defineProperty(Vue.prototype, "$$refs", {
    get: function () {
        return this.$refs;
    },
    enumerable: true,
});
