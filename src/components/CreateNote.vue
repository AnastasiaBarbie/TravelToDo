<template>
  <v-dialog width="500" v-model="dialog">
    <template v-slot:activator="{ props }">
      <v-btn class="btn_purple" v-bind="props" text="Запланировать новое путешествие"> </v-btn>
    </template>
    <template v-slot:default="{ isActive }">
      <v-card title="Планирование">
        <v-card-text>
          <v-form @submit.prevent="createTravel">
            <v-text-field
              v-model="newTravel.title"
              label="Введите город или страну"
              required
            >
            </v-text-field>

            <v-btn class="btn_purple" type="submit" text="Добавить" @click="isActive.value = false"/>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="btn_purple" text="Закрыть" @click="isActive.value = false"/>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
import { ref } from "vue";
import { useStore } from "../pinia/store.js";

export default {
  name: "NoteList",
  setup() {
    const notesStore = useStore();
    const dialog = ref(false);
    const newTravel = ref({
      title: "",
      id: null,
      event: [],
    });
    const createTravel = () => {
      if (!newTravel.value.title) {
        return;
      }

      notesStore.addTravel({
        title: newTravel.value.title,
        id: notesStore.nextIdTravel,
      });
      newTravel.value = {
        title: "",
        id: null,
      };
    };
    return { dialog, newTravel, createTravel };
  },
};
</script>
<style lang="scss">
@import '../assets/variables.scss';
</style>