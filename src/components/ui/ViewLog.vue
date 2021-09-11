<template>
    <div>
        <v-btn v-if="showTable" text tile small @click.stop="showTable = !showTable">
            <v-icon small class="mx-1">mdi-chevron-down</v-icon>
            {{ "collapse" | translate }}
        </v-btn>
        <v-simple-table dense class="grey lighten-4 rounded-b-lg rounded-t-0">
            <template v-slot:default>
                <tbody>
                    <template v-for="(log, index) in $store.state.app.logs">
                        <tr v-if="showTable || index == 0" :key="index">
                            <td v-if="!showTable" class="pa-0">
                                <v-btn text tile small @click.stop="showTable = !showTable">
                                    <v-icon small class="mx-1">mdi-chevron-up</v-icon>
                                    {{ "show-more" | translate }}
                                </v-btn>
                            </td>
                            <td>
                                <v-icon :color="chipColor(log.severity)" dense>{{ chipIcon(log.severity) }}</v-icon>
                            </td>
                            <td style="white-space: nowrap" class="grey--text caption">{{ log.raisedOn.toLocaleString() }}</td>
                            <td style="width: 99%" class="caption">{{ log.message }}</td>
                        </tr>
                    </template>
                </tbody>
            </template>
        </v-simple-table>
    </div>
</template>

<script>
import { AppLogSeverity } from "../../enums/AppLogSeverity";

export default {
    name: "h-view-log",
    data: function () {
        return {
            /** @type {Boolean}*/
            showTable: false
        };
    },
    methods: {
        /** 
         * @param {Number} severity
         */
        chipColor(severity) {
            switch (severity) {
                case AppLogSeverity.DEBUG:
                    return "teal";
                case AppLogSeverity.INFO:
                    return "info";
                case AppLogSeverity.WARNING:
                    return "warning";
                case AppLogSeverity.ERROR:
                    return "error";
                default:
                    return "primary";

                // var a = new Date();
                // a.to
            }
        },
        /** 
         * @param {Number} severity
         */
        chipIcon(severity) {
            switch (severity) {
                case AppLogSeverity.DEBUG:
                    return "mdi-bug";
                case AppLogSeverity.INFO:
                    return "mdi-information";
                case AppLogSeverity.WARNING:
                    return "mdi-alert";
                case AppLogSeverity.ERROR:
                    return "mdi-close-circle";
                default:
                    return "mdi-account-circle";
            }
        }
    }
};
</script>
