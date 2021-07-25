String.prototype.interpolate = function (params) {
    try {
        const names = Object.keys(params);
        const vals = Object.values(params);
        return new Function(...names, `return \`${this}\`;`)(...vals);
    } catch (err) {
        console.error(`Cannot interpolate template string \`${this}\`; ${err.message}`);
        throw err;
    }
};
