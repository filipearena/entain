<template>
  <div>
    <span class="category-select-title">CATEGORY:</span>
    <div class="category-select">
      <select v-model="categorySelected" class="category-select">
        <option
          v-for="category in categoriesAvailable"
          v-bind:value="category.value"
          v-bind:key="category.text"
        >
          <div class="category-text">{{ category.text }}</div>
        </option>
      </select>
    </div>

    <div class="list-container">
      <ul v-if="races && races.length > 0" id="races">
        <transition-group name="fade">
          <li
            v-for="race in races.slice(0, 5)"
            :key="race.race_id"
            class="line"
          >
            <RaceCards :race="race" v-on:time-expired="removeRace" />
          </li>
        </transition-group>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import RaceCards from "./RaceCard.vue";

const API =
  "https://api.neds.com.au/rest/v1/racing/?method=nextraces&count=100";
const GREYHOUND = "9daef0d7-bf3c-4f50-921d-8e818c60fe61";
const HARNESS = "161d9be2-e909-4326-8c2c-35ed71fb460b";
const HORSE = "4a2788f8-e825-4d36-9894-efd4baf1cfae";

const CATEGORIES = {
  "9daef0d7-bf3c-4f50-921d-8e818c60fe61": "greyhound",
  "161d9be2-e909-4326-8c2c-35ed71fb460b": "harness",
  "4a2788f8-e825-4d36-9894-efd4baf1cfae": "horse"
};

export default {
  name: "Races",
  components: { RaceCards },
  data() {
    return {
      categories: { greyhound: [], harness: [], horse: [] },
      categorySelected: "greyhound",
      pollingData: null,
      categoriesAvailable: [
        { text: "Greyhound", value: "greyhound" },
        { text: "Harness", value: "harness" },
        { text: "Horse", value: "horse" }
      ]
    };
  },
  created() {
    this.getData();
    this.pollData();
  },
  methods: {
    pollData() {
      this.pollingData = setInterval(this.getData, 30000);
    },
    sortAscending(a, b) {
      if (a.advertised_start.seconds > b.advertised_start.seconds) return 1;
      if (a.advertised_start.seconds < b.advertised_start.seconds) return -1;
      return 0;
    },
    getData() {
      axios.get(API).then(response => {
        const sumaries = response.data.data.race_summaries;
        const summaries_ids = Object.keys(response.data.data.race_summaries);
        const categories = summaries_ids.reduce((acc, curr) => {
          const race = sumaries[curr];
          if (
            race.category_id === GREYHOUND &&
            acc.greyhound.findIndex(x => x.race_id == race.race_id) < 0
          )
            acc.greyhound.push(race);
          if (
            race.category_id === HARNESS &&
            acc.harness.findIndex(x => x.race_id == race.race_id) < 0
          )
            acc.harness.push(race);
          if (
            race.category_id === HORSE &&
            acc.horse.findIndex(x => x.race_id == race.race_id) < 0
          )
            acc.horse.push(race);
          return acc;
        }, this.categories);
        categories["greyhound"].sort(this.sortAscending);
        categories["harness"].sort(this.sortAscending);
        categories["horse"].sort(this.sortAscending);
        this.categories = categories;
      });
    },
    removeRace(race) {
      const category = CATEGORIES[race.category_id];
      var removeIndex = this.categories[category]
        .map(function(item) {
          return item.race_id;
        })
        .indexOf(race.race_id);
      this.categories[category].splice(removeIndex, 1);
    }
  },
  computed: {
    races() {
      return this.categories[this.categorySelected];
    }
  }
};
</script>

<style scoped>
.category-select {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.category-select-title {
  display: flex;
  font-size: 25px;
  font-weight: 800;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 10px;
}
.category-select {
  display: flex;
  flex-direction: row;
  align-self: flex-start;
  height: 5vh;
  font-size: 20px;
  margin-bottom: 25px;
}

.list-container {
  display: flex;
  padding: 0;
  justify-content: center;
  justify-items: center;
  flex-direction: row;
  align-content: space-between;
}
.line {
  transition: all 1s;
  font-size: 80px;
}

ul {
  list-style-type: none;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateX(1000px);
}

.fade-leave-active {
  position: absolute;
}
</style>
