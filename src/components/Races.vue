<template>
  <div>
    <div v-if="races.length === 0 && !error" class="loader">
      <RingLoader :color="'#fff'" />
    </div>
    <div v-if="error" class="error-message">
      Connection issue. Cannot retrieve races
    </div>
    <div v-if="showContent">
      <span class="category-select-title">CATEGORY</span>
      <div class="category-select">
        <select v-model="categorySelected" class="select">
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
  </div>
</template>

<script>
import axios from "axios";
import RingLoader from "vue-spinner/src/RingLoader.vue";
import RaceCards from "./RaceCard.vue";

const API =
  "https://api.neds.com.au/rest/v1/racing/?method=nextraces&count=100";
const GREYHOUND_ID = "9daef0d7-bf3c-4f50-921d-8e818c60fe61";
const HARNESS_ID = "161d9be2-e909-4326-8c2c-35ed71fb460b";
const HORSE_ID = "4a2788f8-e825-4d36-9894-efd4baf1cfae";

const CATEGORIES = {
  [GREYHOUND_ID]: "greyhound",
  [HARNESS_ID]: "harness",
  [HORSE_ID]: "horse"
};

export default {
  name: "Races",
  components: { RaceCards, RingLoader },
  data() {
    //set initial values of variables within Races component
    return {
      categories: { greyhound: [], harness: [], horse: [] },
      categorySelected: "greyhound",
      pollingData: null,
      categoriesAvailable: [
        { text: "Greyhound", value: "greyhound" },
        { text: "Harness", value: "harness" },
        { text: "Horse", value: "horse" }
      ],
      error: null
    };
  },
  created() {
    this.getData();
    this.pollData();
  },
  methods: {
    //Call method to retrieve data from API every 30 seconds
    pollData() {
      this.pollingData = setInterval(this.getData, 30000);
    },
    //Sort races by ascending order
    sortAscending(a, b) {
      if (a.advertised_start.seconds > b.advertised_start.seconds) return 1;
      if (a.advertised_start.seconds < b.advertised_start.seconds) return -1;
      return 0;
    },
    //Retrieve data from API and only store new races, removing duplicates
    getData() {
      axios
        .get(API)
        .then(response => {
          const sumaries = response.data.data.race_summaries;
          const summaries_ids = Object.keys(response.data.data.race_summaries);
          const categories = summaries_ids.reduce((acc, curr) => {
            const race = sumaries[curr];
            if (
              race.category_id === GREYHOUND_ID &&
              acc.greyhound.findIndex(x => x.race_id == race.race_id) < 0
            )
              acc.greyhound.push(race);
            if (
              race.category_id === HARNESS_ID &&
              acc.harness.findIndex(x => x.race_id == race.race_id) < 0
            )
              acc.harness.push(race);
            if (
              race.category_id === HORSE_ID &&
              acc.horse.findIndex(x => x.race_id == race.race_id) < 0
            )
              acc.horse.push(race);
            return acc;
          }, this.categories);
          categories["greyhound"].sort(this.sortAscending);
          categories["harness"].sort(this.sortAscending);
          categories["horse"].sort(this.sortAscending);
          this.categories = categories;
        })
        .catch(error => {
          this.error = error;
          if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          }
        });
    },
    //Removes the race from categories
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
    //Get value of races based on category selected
    races() {
      return this.categories[this.categorySelected];
    },
    showContent() {
      return this.races && this.races.length > 0;
    }
  }
};
</script>

<style scoped>
.loader {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 40vh;
}
.error-message {
  font-size: 40px;
  font-weight: 600;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 40vh;
  color: #fff;
}
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
  justify-content: center;
  text-align: center;
  flex-direction: row;
}
.line {
  transition: all 1s;
  font-size: 80px;
}

ul {
  padding: 0;
  list-style-type: none;
}

select {
  appearance: none;
  outline: none;
  background-color: transparent;
  border: none;
  padding: 0 1em 0 0;
  margin: 0;
  width: 100%;
  font-family: inherit;
  font-size: inherit;
  cursor: inherit;
  line-height: inherit;
  text-align-last: center;
}

select {
  outline: none;
}

.select {
  width: 100%;
  max-width: 200px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  text-align: center;
  border: 1px solid #eee;
  border-radius: 2px;
  padding: 2px 5px;
  font-weight: 600;
  font-size: 22px;
  cursor: pointer;
  line-height: 1.1;
  background-color: #fff;
  background-image: linear-gradient(to top, #f9f9f9, #fff 33%);
  display: grid;
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
