import { mount } from "@vue/test-utils";
import RacesList, {
  GREYHOUND_ID,
  HARNESS_ID
} from "../../src/components/Races.vue";
import moment from "moment";

const fakeTime = moment()
  .add(90, "seconds")
  .unix();

const fakeTimeTwo = moment()
  .add(100, "seconds")
  .unix();

const fakeTimeThree = moment()
  .add(35, "seconds")
  .unix();

const raceOne = {
  category_id: GREYHOUND_ID,
  meeting_name: "Greyhound Race",
  race_number: 3,
  advertised_start: {
    seconds: fakeTime
  }
};

const raceTwo = {
  category_id: GREYHOUND_ID,
  meeting_name: "Greyhound Race",
  race_number: 3,
  advertised_start: {
    seconds: fakeTimeTwo
  }
};

const raceThree = {
  category_id: HARNESS_ID,
  meeting_name: "Harness Race",
  race_number: 3,
  advertised_start: {
    seconds: fakeTimeThree
  }
};

const initData = {
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

describe("Races List", () => {
  it("Validates props passed to component", () => {
    const racesList = mount(RacesList, {
      data() {
        return initData;
      }
    });

    expect(racesList.find(".loader").exists()).toBe(true);
  });

  it("Validate that loader is hidden when races are available", () => {
    const racesList = mount(RacesList, {
      data() {
        return {
          ...initData,
          categories: {
            greyhound: [raceOne, raceTwo],
            harness: [raceThree],
            horse: []
          }
        };
      }
    });

    expect(racesList.find(".loader").exists()).toBe(false);
  });

  it("Validate that when races are available, cards are displayed correctly", () => {
    const racesList = mount(RacesList, {
      data() {
        return {
          ...initData,
          categories: {
            greyhound: [raceOne, raceTwo],
            harness: [raceThree],
            horse: []
          }
        };
      }
    });
    const titles = racesList.findAll(".card-title");
    const timers = racesList.findAll(".card-timer");

    const firstTitle = titles.at(0);
    const secondTitle = titles.at(1);

    const firstTimer = timers.at(0);
    const secondTimer = timers.at(1);

    expect(firstTitle.text()).toMatch(
      `${raceOne.meeting_name} R${raceOne.race_number}`
    );
    expect(secondTitle.text()).toMatch(
      `${raceTwo.meeting_name} R${raceTwo.race_number}`
    );

    expect(firstTimer.text()).toMatch("1m 29s");
    expect(secondTimer.text()).toMatch("1m 39s");
  });

  it("Validate change in category affecting cards displayed", () => {
    const racesList = mount(RacesList, {
      data() {
        return {
          ...initData,
          categories: {
            greyhound: [raceOne, raceTwo],
            harness: [raceThree],
            horse: []
          },
          categorySelected: "harness"
        };
      }
    });

    const titles = racesList.findAll(".card-title");
    const timers = racesList.findAll(".card-timer");

    const firstTitle = titles.at(0);

    const firstTimer = timers.at(0);

    expect(firstTitle.text()).not.toMatch(
      `${raceOne.meeting_name} R${raceOne.race_number}`
    );
    expect(firstTimer.text()).not.toMatch("1m 29s");
    expect(firstTimer.text()).toMatch("34s");
  });
});
