<template>
  <v-dialog width="500" v-model="dialog">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" size="small" style="background-color:rgb(153, 165, 204)">Добавить место</v-btn>
    </template>
    <template v-slot:default="{ isActive }">
      <v-card style="color: black;">
        <v-card-title>Добавить</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="createEvent">
            <v-text-field
              type="date"
              v-model="newEvent.date_start"
              label="Введите дату начала"
            />
            <v-text-field
              type="date"
              v-model="newEvent.date_end"
              :min="newEvent.date_start"
              label="Введите дату окончания"
            />
            <v-text-field
              v-model="newEvent.event_name"
              label="Введите название мероприятия"
              required
            >
            </v-text-field>
            <v-text-field
              v-model="newEvent.price"
              type="number"
              label="Укажите стоимость"
              required
            >
            </v-text-field>

            <v-btn type="submit" @click="isActive.value = false">Добавить</v-btn>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="Закрыть" @click="isActive.value = false"/>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
  <hr/>
</template>

<script>
import { ref, toRefs } from "vue";
import { useStore } from "../pinia/store.js";

export default {
  name: "NoteList",
  props: {
    travelId: Number,
  },
  setup(props) {
    const { travelId } = toRefs(props);
    const notesStore = useStore();
    const dialog = ref(false);
    const newEvent = ref({
      date_start: null,
      date_end: null,
      event_name: "",
      price: 0,
      id_event: null,
      status: false,
      highlighted: false,
    });
    const createEvent = () => {
      if (
        !newEvent.value.date_start ||
        !newEvent.value.event_name ||
        !newEvent.value.date_end
      ) {
        return;
      }
      notesStore.parTravel = travelId;
      notesStore.addEvent({
        date_start: newEvent.value.date_start,
        date_end: newEvent.value.date_end,
        event_name: newEvent.value.event_name,
        price: newEvent.value.price,
        id_event: notesStore.nextIdEvent,

        highlighted: false,
      });
      newEvent.value = {
        date_start: null,
        date_end: null,
        event_name: "",
        price: 0,
        id_event: null,
        status: false,
        highlighted: false,
      };
    };
    return { dialog, newEvent, createEvent };
  },
};
</script>
