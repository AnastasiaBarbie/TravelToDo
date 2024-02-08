<template>
  <v-app style="margin-left: 150px; margin-right: 150px">
    <!--Create place-->
    <v-dialog width="500" v-model="dialog">
      <template v-slot:activator="{ props }">
        <v-btn
          class="btn_purple"
          style="margin-right: 75%"
          v-bind="props"
          text="Внести новое путешествие"
        >
        </v-btn>
      </template>
      <template v-slot:default="{ isActive }">
        <v-card>
          <v-card-title>Новое путешествие</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="createGuide">
              <v-text-field v-model="newGuide.title" label="Название" required>
              </v-text-field>

              <v-btn type="submit" @click="isActive.value = false"
                >Добавить</v-btn
              >
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn text="Закрыть" @click="isActive.value = false"></v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
    <v-expansion-panels
      class="sort"
      :disabled="disabled"
      style="margin-top: 20px"
      multiple
    >
      <v-expansion-panel>
        <v-expansion-panel-title>Сортировать</v-expansion-panel-title>
        <v-expansion-panel-text @click="sortAlphabetically()">
          от А до Я
        </v-expansion-panel-text>
        <v-expansion-panel-text @click="sortAlphabeticallyMax()">
          от Я до А
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-list v-if="notesStore.guide">
      <v-list-item
        style="color: rgb(33, 54, 124)"
        v-for="guide in notesStore.guide"
        :key="guide.id"
      >
        <strong> {{ guide.title }}</strong>

        <v-btn
          small
          class="btn_delete"
          :icon="true"
          @click="notesStore.deleteTravelInGuide(guide.id)"
          ><v-icon> mdi-delete</v-icon>
        </v-btn>
        <v-list>
          <v-list-item v-for="event in guide.event" :key="event.id_event">
            - {{ event.event_name }}
            <v-btn
              small
              :icon="true"
              class="btn_delete"
              @click="notesStore.deleteEventInGuide(guide.id, event.id_event)"
            >
              <v-icon> mdi-delete</v-icon></v-btn
            >
          </v-list-item>
          <v-dialog width="500" v-model="guide.dialogEvent">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" icon="mdi-plus" size="small"></v-btn>
            </template>
            <template v-slot:default="{ isActive }">
              <v-card>
                <v-card-title>Новое место посещения</v-card-title>
                <v-card-text>
                  <v-form @submit.prevent="createEvent(guide.id)">
                    <v-text-field
                      v-model="newEvent.event_name"
                      label="Введите название места посещения"
                      required
                    >
                    </v-text-field>

                    <v-btn type="submit" @click="isActive.value = false"
                      >Create</v-btn
                    >
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text="Закрыть" @click="isActive.value = false"></v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
          <hr />
        </v-list>
      </v-list-item>
    </v-list>

    <v-dialog width="500" v-model="notesStore.deleteGuideEvent" persistent>
      <v-card>
        <v-card-title>Ошибка</v-card-title>
        <v-card-text>
          Данное место используется на главной странице
        </v-card-text>
        <v-card-actions>
          <v-btn @click="notesStore.deleteGuideEvent = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>
<script>
import { ref } from "vue";
import { useStore } from "@/pinia/store";
export default {
  name: "TouristGuide",
  setup() {
    const notesStore = useStore();
    const sortAlphabetically = () => {
      notesStore.guide.sort((a, b) => a.title.localeCompare(b.title));
    };
    const sortAlphabeticallyMax = () => {
      notesStore.guide.sort((a, b) => b.title.localeCompare(a.title));
    };
    const dialog = ref(false);
    const dialogEvent = ref(false);
    const newGuide = ref({
      title: "",
      id: null,
      dialogEvent: false,
      event: [{}],
    });
    const newEvent = ref({
      event_name: "",
      id_event: null,
    });
    const createGuide = () => {
      if (!newGuide.value.title) {
        return;
      }

      notesStore.addGuide({
        title: newGuide.value.title,
        id: notesStore.nextIdTravel,
        dialogEvent: false,
      });
      newGuide.value = {
        title: "",
        id: null,
        event: [{}],
      };
    };

    const createEvent = (guideId) => {
      if (!newEvent.value.event_name) {
        return;
      }
      notesStore.parGuide = guideId;
      notesStore.addEventToGuide({
        event_name: newEvent.value.event_name,
        id_event: notesStore.nextIdEvent,
      });
      newEvent.value = {
        event_name: "",
        id_event: null,
      };
    };
    return {
      dialog,
      dialogEvent,
      createGuide,
      newGuide,
      newEvent,
      notesStore,
      sortAlphabetically,
      sortAlphabeticallyMax,
      createEvent,
    };
  },
};
</script>
<style lang="scss">
@import "../assets/variables.scss";
</style>
