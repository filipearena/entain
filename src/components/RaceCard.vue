<template>
  <div class="card" v-if="this.timer">
    <div class="card-title" id="card-title">
      {{ `${this.race.meeting_name} R${this.race.race_number}` }}
    </div>
    <div class="card-timer">{{ this.timer }}</div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "RaceCard",
  data() {
    return {
      counter: null,
      timer: null
    };
  },
  props: {
    race: Object
  },
  //On component creation, get time for this race and start the countdown to be updated every 1 second
  created() {
    this.initRaceTime();
    this.updateRaceTime();
  },
  methods: {
    //Set the interval for updating race time, generating a countdown
    updateRaceTime() {
      this.counter = setInterval(() => {
        this.timer = this.getCountDown(this.race.advertised_start.seconds);
      }, 1000);
    },
    //Set first value of timer to immediately display current count
    initRaceTime() {
      this.timer = this.getCountDown(this.race.advertised_start.seconds);
    },
    //Returns the time until the race starts in minutes
    getCountDown(time) {
      const now = moment();
      const raceTime = moment.unix(time);
      const duration = moment.duration(raceTime.diff(now));
      if (duration.minutes() < 0) {
        this.$emit("time-expired", this.race);
        return null;
      } else {
        if (duration.minutes() > 0) {
          return `${duration.minutes()}m ${duration.seconds()}s`;
        } else {
          return `${duration.seconds()}s`;
        }
      }
    }
  }
};
</script>

<style scoped>
.card {
  display: flex;
  justify-content: center;
  flex-direction: column;
  flex: 1;
  background-color: #30363a;
  border-bottom: 3px solid white;
  border-radius: 5px;
  width: 60vw;
  height: 10vh;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
}
.card-title {
  color: white;
  font-size: 25px;
  font-weight: 800;
}
.card-timer {
  color: white;
  font-size: 18px;
  font-weight: 600;
}
</style>
