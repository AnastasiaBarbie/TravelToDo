import { defineStore } from "pinia";

export const useStore = defineStore("mainStore", {
  state: () => ({
    travels: [],
    guide: [],
    deleteGuideEvent: false,
    parGuide: null,
    parTravel: null,
    nextIdTravel: 1,
    nextIdEvent: 1,
  }),
  actions: {
    addTravel(newTravel) {
      location.reload();
      const copiedTravel = JSON.parse(JSON.stringify(newTravel));

      this.travels.push(copiedTravel);
      this.guide.push(copiedTravel);

      this.nextIdTravel = this.nextIdTravel + 1;
      this.saveDataToLocalStorage();
    },
    addGuide(newGuide) {
      this.guide.push(newGuide);
      this.nextIdTravel = this.nextIdTravel + 1;
      this.saveDataToLocalStorage();
    },

    addEvent(newEvent) {
      const travel = this.travels.find((t) => t.id === this.parTravel);
      const guide = this.guide.find((t) => t.id === this.parTravel);
      let a=true;
      if (travel) {
        if (!travel.event) {
          travel.event = [];
          a=false;
        }
        travel.event.push(newEvent);
        if (a){
          const currentStartDate = new Date(travel.event[travel.event.length-1].date_start);
          const previousStartDate = new Date(travel.event[travel.event.length-2].date_start);
          if (currentStartDate < previousStartDate) {
            // Если текущее мероприятие начинается раньше чем предыдущее, подсвечиваем красным
            travel.event[travel.event.length-1].highlighted = true;
          } 
        }
        this.nextIdEvent = this.nextIdEvent + 1;
      }
      if (guide) {
        if (!guide.event) {
          guide.event = [];
        }
        guide.event.push(newEvent);
      }
      this.parTravel = null;
      this.saveDataToLocalStorage();
    },
    addEventToGuide(newEvent) {
      const guide = this.guide.find((t) => t.id === this.parGuide);
      if (guide) {
        if (!guide.event) {
          guide.event = [];
        }
        guide.event.push(newEvent);
        this.nextIdEvent = this.nextIdEvent + 1;
      }
      this.parGuide = null;
      this.saveDataToLocalStorage();
    },


    deleteTravel(travelId) {
      const index = this.travels.findIndex((travel) => travel.id === travelId);
      if (index !== -1) {
        this.travels.splice(index, 1);
        this.saveDataToLocalStorage();
      }
    },
    deleteEvent(travelId, eventId) {
      const travel = this.travels.find((t) => t.id === travelId);
      if (travel) {
        travel.event = travel.event.filter(
          (event) => event.id_event !== eventId
        );
        this.saveDataToLocalStorage();
      }
    },

    deleteTravelInGuide(guideId) {
      const travel = this.travels.find((t) => t.id === guideId);
      if (travel) {
        return (this.deleteGuideEvent = true);
      } else {
        this.deleteGuideEvent = false;
        const index = this.guide.findIndex((travel) => travel.id === guideId);
        if (index !== -1) {
          this.guide.splice(index, 1);
          this.saveDataToLocalStorage();
        }
      }
    },
    deleteEventInGuide(guideId, eventId) {
      const travel = this.travels.find((t) => t.id === guideId);
      if (travel) {
        const event = travel.event.find((t) => t.id_event === eventId);
        if (event) {
          return (this.deleteGuideEvent = true);
        } else {
          this.deleteGuideEvent = false;
          const guide = this.guide.find((t) => t.id === guideId);
          guide.event = guide.event.filter(
            (event) => event.id_event !== eventId
          );
          this.parGuide = null;
          this.saveDataToLocalStorage();
        }
      } else {
        this.deleteGuideEvent = false;
        const guide = this.guide.find((t) => t.id === guideId);
        guide.event = guide.event.filter((event) => event.id_event !== eventId);
        this.parGuide = null;
        this.saveDataToLocalStorage();
      }
    },
    saveDataToLocalStorage() {
      localStorage.setItem("mainStore", JSON.stringify(this.$state));
    },
    initializeStore() {
      const loadedData = this.loadState;
      Object.keys(loadedData).forEach((key) => {
        this.$state[key] = loadedData[key];
      });
    },
    updateList(value) {
      this.travels = value;
      localStorage.setItem("mainStore", JSON.stringify(this.$state));
    },
  },
  getters: {
    loadState() {
      const storedData = localStorage.getItem("mainStore");
      if (storedData) {
        return JSON.parse(storedData);
      }
      return this.$state;
    },
  },
});
