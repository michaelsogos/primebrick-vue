<template>
    <v-app id="inspire">
        <div @mouseleave="onLeaveDrawer">
            <v-navigation-drawer
                app
                expand-on-hover
                mini-variant
                fixed
                clipped
                color="primary"
                dark
                v-if="$store.state.app.isAuthenticated"
            >
                <h-nav-tree :items="$store.state.app.drawerItems" ref="navTree"></h-nav-tree>
            </v-navigation-drawer>
        </div>

        <v-app-bar app clipped-left flat dense>
            <v-toolbar-title>
                <span class="title">PrimeBrick</span>
            </v-toolbar-title>
            <v-spacer></v-spacer>

            <v-menu bottom offset-y min-width="200" v-if="$store.state.app.isAuthenticated">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                        <v-avatar :color="$store.state.app.user.color || 'tertiary'" size="36">
                            <img
                                v-if="$store.state.app.user.image"
                                :src="$store.state.app.user.image"
                                :alt="getUserFullname"
                            />
                            <span v-else class="white--text h4">{{getUserInitials}}</span>
                        </v-avatar>
                    </v-btn>
                </template>
                <v-list nav>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title class="title">{{getUserFullname}}</v-list-item-title>
                            <v-list-item-subtitle>{{$store.state.app.user.email}}</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item @click="onLogout">
                        <v-list-item-icon>
                            <v-icon>mdi-location-exit</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Logout</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-app-bar>

        <v-main class="content-not-scrollable blue-grey lighten-4">
            <component :is="$store.state.app.page"></component>
        </v-main>
    </v-app>
</template>

<script>
import $ from "./store/types";

export default {
    name: 'App',
    data: () => ({
    }),
    computed: {
        getUserFullname() {
            return `${this.$store.state.app.user.firstName || ''} ${this.$store.state.app.user.lastName || ''}`;
        },
        getUserInitials() {
            const firstLetter = this.$store.state.app.user.firstName ? this.$store.state.app.user.firstName.charAt(0).toUpperCase() : '';
            const lastLetter = this.$store.state.app.user.lastName ? this.$store.state.app.user.lastName.charAt(0).toUpperCase() : '';
            return `${firstLetter}${lastLetter}`;
        }
    },
    methods: {
        onLeaveDrawer() {
            this.$refs.navTree.collapseAll();
        },
        onLogout() {
            this.$store.dispatch($.actions.APP_LOGOUT_USER);
        }
    },
    mounted() {
        this.$store.dispatch($.actions.APP_EXEC_INIT);
        this.$store.commit($.mutations.APP_SET_PAGE, "page-login");
    },
}
</script>

<style>
.content-not-scrollable {
    height: 100vh;
    overflow: hidden;
}
</style>