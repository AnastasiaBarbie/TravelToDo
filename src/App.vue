<template>
  <v-app>
    <v-app-bar app style="background-color: rgb(130, 145, 196)"
      ><v-app-bar-title class="center"
        >Спланируем-слетаем!</v-app-bar-title
      ></v-app-bar
    >
    <v-container class="d-flex justify-center align-center" style="margin-top: 64px ">
      <router-link style="color: rgba(0, 0, 0, 0.776);" :to="{ name: 'NotesTravels' }">
        <v-btn :class="{ btn_purple: $route.name === 'NotesTravels' }" style="margin-right;: 10px">
          Запланированные путешествия
        </v-btn>
      </router-link>
      <router-link style="color: rgba(0, 0, 0, 0.776);" :to="{ name: 'TouristGuide' }">
        <v-btn :class="{ btn_purple: $route.name === 'TouristGuide' }" style="margin-left: 10px">
          Справочник
        </v-btn>
      </router-link>
    </v-container>
    <router-view />
  </v-app>
</template>

<script>
export default {
  name: "App",
};
</script>

<style lang="scss">
@import './assets/variables.scss';
.center {
  text-align: center;
}
</style>
