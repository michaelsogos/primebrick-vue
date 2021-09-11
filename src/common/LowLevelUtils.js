export class LowLevelUtils {
    /**
     *
     * @param {any} context
     * @param {String} expression
     */
    static makeExpessionEvaluator(context, expression) {
        let template = createContextFunctionTemplate(expression, context);
        let functor = Function(template);
        return functor();
    }
}

function createContextFunctionTemplate(expression, context) {
    return `
    return function (context) {
      "use strict";
      ${Object.keys(context).length > 0 ? `var ${Object.keys(context).map((key) => ` ${key} = context['${key}']`)};` : ``}
      return ${expression};
    }                                                                                                                   
    `;
}
