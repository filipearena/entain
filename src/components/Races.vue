<template>
  <div>
    <input
      type="radio"
      id="greyhoundRace"
      value="greyhound"
      v-model="categorySelected"
    />
    <label for="greyhoundRace">Greyhound</label>
    <br />
    <input
      type="radio"
      id="harnessRace"
      value="harness"
      v-model="categorySelected"
    />
    <label for="harnessRace">Two</label>
    <br />
    <input
      type="radio"
      id="horseRace"
      value="horse"
      v-model="categorySelected"
    />
    <label for="horseRace">Two</label>
    <br />
    <span>Category Selected: {{ categorySelected }}</span>
    <ul id="races">
      <li v-for="race in races" :key="race.race_id">
        <div>
          <div>{{ race.meeting_name + race.race_number }}</div>
          <div>{{ race.advertised_start.seconds }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
const axios = require("axios");
const API = "https://api.neds.com.au/rest/v1/racing/?method=nextraces&count=10";
export default {
  name: "Races",
  data() {
    return {
      categories: [],
      GREYHOUND: "9daef0d7-bf3c-4f50-921d-8e818c60fe61",
      HARNESS: "161d9be2-e909-4326-8c2c-35ed71fb460b",
      HORSE: "4a2788f8-e825-4d36-9894-efd4baf1cfae",
      categorySelected: "greyhound"
    };
  },
  mounted() {
    axios.get(API).then(response => {
      const sumaries = response.data.data.race_summaries;
      const summaries_ids = Object.keys(response.data.data.race_summaries);
      const categories = summaries_ids.reduce(
        (acc, curr) => {
          const race = sumaries[curr];
          if (race.category_id === this.GREYHOUND) acc.greyhound.push(race);
          if (race.category_id === this.HARNESS) acc.harness.push(race);
          if (race.category_id === this.HORSE) acc.horse.push(race);
          return acc;
        },
        { greyhound: [], harness: [], horse: [] }
      );
      this.categories = categories;
    });
  },
  computed: {
    races() {
      return this.categories[this.categorySelected];
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
