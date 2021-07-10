import { mount } from "@vue/test-utils";
import RaceCard from "../../src/components/RaceCard.vue";
import moment from "moment";

const fakeTime = moment()
  .add(1, "minutes")
  .unix();

const _race = {
  meeting_name: "Greyhound",
  race_number: 3,
  advertised_start: {
    seconds: fakeTime
  }
};

describe("Race Card", () => {
  it("Validates props passed to component", () => {
    const raceCard = mount(RaceCard, {
      data() {
        return {
          counter: null,
          timer: null
        };
      },
      propsData: {
        race: _race
      }
    });

    expect(raceCard.props().race.meeting_name).toBe(_race.meeting_name);
    expect(raceCard.props().race.race_number).toBe(_race.race_number);
    expect(raceCard.props().race.advertised_start.seconds).toBe(
      _race.advertised_start.seconds
    );
  });
  it("Renders component and validate content rendered", async () => {
    const raceCard = mount(RaceCard, {
      propsData: {
        race: _race
      }
    });

    await raceCard.setData({
      counter: null,
      timer: null
    });

    await raceCard.vm.initRaceTime();

    expect(raceCard.find(".card").exists()).toBe(true);
    const title = raceCard.find(".card-title");
    const timer = raceCard.find(".card-timer");
    expect(title.text()).toMatch("Greyhound R3");
    expect(timer.text()).toMatch("59s");
  });

  it("Renders component and validate contents rendered with different params on race", async () => {
    const raceCard = mount(RaceCard, {
      propsData: {
        race: {
          ..._race,
          race_number: 13,
          advertised_start: {
            seconds: moment()
              .add(90, "seconds")
              .unix()
          }
        }
      }
    });

    await raceCard.setData({
      counter: null,
      timer: null
    });

    await raceCard.vm.initRaceTime();

    expect(raceCard.find(".card").exists()).toBe(true);
    const title = raceCard.find(".card-title");
    const timer = raceCard.find(".card-timer");
    expect(title.text()).toMatch("Greyhound R13");
    expect(timer.text()).toMatch("1m 29s");
  });

  it("Test counter on race card after waiting 2 seconds", async () => {
    const raceCard = mount(RaceCard, {
      propsData: {
        race: {
          ..._race,
          race_number: 10,
          advertised_start: {
            seconds: moment()
              .add(90, "seconds")
              .unix()
          }
        }
      }
    });

    await raceCard.setData({
      counter: null,
      timer: null
    });

    await raceCard.vm.initRaceTime();
    await raceCard.vm.updateRaceTime();
    const timer = raceCard.find(".card-timer");
    jest.useFakeTimers();
    setTimeout(() => {
      expect(timer.text()).toMatch("1m 27s"); //TIMER SHOULD BE 2 SECONDS AFTER 1m 29s
    }, 2000);
  });
});
