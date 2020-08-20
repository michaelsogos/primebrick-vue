<template>
    <div class="h-panel-container">
        <div class="h-panel-header">
            <slot name="header">
                <h1>Panel Header</h1>
            </slot>
        </div>
        <div class="h-panel-body">
            <slot>
                Panel Body
                <br />a
                <br />a
                <br />a
                <br />a
                <br />a
                <br />a
                <br />a
                <br />a
                <br />a
                <br />a
                <br />a
                <br />a
                <br />a
                <br />a
                <br />a
                <br />a
                <br />a
                <br />a
                <br />a
                <br />a
                <br />a
                <br />End of Body
            </slot>
        </div>
        <div class="h-panel-footer">
            <slot name="footer">
                <h3>Panel Footer</h3>
            </slot>
        </div>
    </div>
</template>

<script>
export default {
    name: "h-panel",
    data: function () {
        return {

        };
    },
}
</script>

<style lang="scss">
.h-panel-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.h-panel-header {
    flex-shrink: 0;
}

.h-panel-body {
    flex: 1;
    overflow: auto;
    min-height: 2em;
}

.h-panel-footer {
    flex-shrink: 0;
    width: 100%;
}
</style>