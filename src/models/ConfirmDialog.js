import translate from "../plugins/filters/translate";

export class ConfirmDialog {
    /**
     *
     * @param {Boolean} isAlert
     */
    constructor(isAlert) {
        this.isAlert = isAlert || false;
        this.show = false;
        this.title = "{{missing title}}";
        this.subTitle = null;
        this.message = "{{missing-message}}";
        this.iconColor = "info";
        this.icon = "mdi-help-circle-outline";
        this.noButtonText = translate.filter("no");
        this.yesButtonText = this.isAlert ? translate.filter("ok") : translate.filter("yes");
        this.otherButtonText = null;
        this.yesButtonCallback = () => {};
        this.noButtonCallback = () => {};
        this.otherButtonCallback = () => {};
    }
}
