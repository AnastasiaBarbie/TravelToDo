<template>
  <v-app>
    <v-container>
      <create-note />
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
          <v-expansion-panel-text @click="sortByPriceMin()">
            Цена по возрастанию
          </v-expansion-panel-text>
          <v-expansion-panel-text @click="sortByPriceMax()">
            Цена по убыванию
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
      <draggable class="travelsList" v-model="travels" item-key="id">
        <template #item="{ element }">
          <v-list>
            <v-container
              class="handle"
              @click="showEvent(element)"
              style="display: flex; align-items: right; color: rgb(33, 54, 124)"
            >
              <div style="margin-right: 20px">
                <span>&#x2630;</span>
                <strong>{{ element.title }}</strong>
              </div>
              Расходы:{{ getTotalPrice(element) }}
              <div class="btn_delete">
                <v-btn @click="notesStore.deleteTravel(element.id)"
                  ><v-icon> mdi-delete</v-icon></v-btn
                >
              </div>
            </v-container>

            <v-list v-if="element.showDetails">
              <draggable
                v-model="element.event"
                :item-key="id_event"
                @end="onEventDragEnd(element)"
              >
                <template #item="{ element: event }">
                  <v-row>
                    <v-col align="left">
                      <v-checkbox
                        v-model="event.status"
                        :class="{ highlighted_date: event.highlighted }"
                        @change="notesStore.saveDataToLocalStorage()"
                      >
                        <template #label>
                          <div>
                            <div>
                              {{ formattedDate(event.date_start) }} -
                              {{ formattedDate(event.date_end) }} Стоимость:
                              {{ event.price }}
                            </div>
                            <div style="color: rgb(0, 14, 58)">
                              {{ event.event_name }}
                            </div>
                          </div>
                        </template>
                      </v-checkbox>
                    </v-col>
                    <v-col align="right">
                      <v-btn
                        :icon="true"
                        @click="
                          notesStore.deleteEvent(element.id, event.id_event)
                        "
                        ><v-icon> mdi-delete</v-icon></v-btn
                      >
                    </v-col>
                  </v-row>
                </template>
              </draggable>
              <create-event :travelId="element.id" />
            </v-list>
          </v-list>
        </template>
      </draggable>
    </v-container>
  </v-app>
</template>

<script>
import { useStore } from "../pinia/store.js";
import CreateNote from "./CreateNote.vue";
import CreateEvent from "./CreateEvent.vue";
import draggable from "vuedraggable";
import { ref } from "vue";

export default {
  name: "NoteList",
  components: { CreateNote, CreateEvent, draggable },
  setup() {
    const id_event = ref(null);
    const notesStore = useStore();
    const showEvent = (travel) => {
      travel.showDetails = !travel.showDetails;
      notesStore.saveDataToLocalStorage();
    };
    const disabled = ref(false);
    const sortAlphabetically = () => {
      notesStore.travels.sort((a, b) => a.title.localeCompare(b.title));
    };
    const sortAlphabeticallyMax = () => {
      notesStore.travels.sort((a, b) => b.title.localeCompare(a.title));
    };
    const getTotalPrice = (travel) => {
      if (travel && travel.event) {
        return travel.event.reduce(
          (total, event) => total + Number(event.price),
          0
        );
      } else if (travel && !travel.event) {
        return 0;
      }
    };
    const sortByPriceMin = () => {
      notesStore.travels.sort((a, b) => {
        const totalPriceA = getTotalPrice(a);
        const totalPriceB = getTotalPrice(b);
        return totalPriceA - totalPriceB;
      });
    };
    const sortByPriceMax = () => {
      notesStore.travels.sort((a, b) => {
        const totalPriceA = getTotalPrice(a);
        const totalPriceB = getTotalPrice(b);
        return totalPriceB - totalPriceA;
      });
    };
    return {
      id_event,
      disabled,
      showEvent,
      notesStore,
      sortAlphabetically,
      sortAlphabeticallyMax,
      getTotalPrice,
      sortByPriceMin,
      sortByPriceMax,
    };
  },
  computed: {
    travels: {
      get() {
        return this.notesStore.travels;
      },
      set(value) {
        this.notesStore.updateList(value);
      },
    },
  },
  methods: {
    onEventDragEnd(travel) {
      // Подсвечиваем названия мероприятий красным
      this.highlightDelayedEvents(travel.event);

      // Сохраняем изменения в локальном хранилище
      this.notesStore.saveDataToLocalStorage();
    },
    highlightDelayedEvents(events) {
      for (let i = 1; i < events.length; i++) {
        const currentEvent = events[i];
        const previousEvent = events[i - 1];
        if (previousEvent) {
          const currentStartDate = new Date(currentEvent.date_start);
          const previousStartDate = new Date(previousEvent.date_start);

          if (currentStartDate < previousStartDate) {
            // Если текущее мероприятие начинается раньше чем предыдущее, подсвечиваем красным
            currentEvent.highlighted = true;
          } else {
            // Иначе убираем подсветку
            currentEvent.highlighted = false;
          }
        }
      }
      for (let i = 0; i < events.length; i++) {
        const currentEvent = events[i];
        const nextEvent = events[i + 1];
        if (nextEvent) {
          const currentStartDate = new Date(currentEvent.date_start);
          const nextStartDate = new Date(nextEvent.date_start);

          if (currentStartDate > nextStartDate) {
            currentEvent.highlighted = true;
          } else {
            currentEvent.highlighted = false;
          }
        }
      }
    },
    formattedDate(dateString) {
      //код форматирования даты
      const [year, month, day] = dateString.split("-");
      return `${day}.${month}.${year}`;
    },
  },
};
</script>
<style lang="scss">
@import "../assets/variables.scss";
.highlighted_date {
  color: red;
}
.handle {
  margin-top: 1px;
  cursor: pointer;
}

::-webkit-scrollbar {
  width: 0px;
}
hr {
  margin-top: 10px;
}
</style>
