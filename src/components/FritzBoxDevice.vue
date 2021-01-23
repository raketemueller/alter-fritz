<template>
  <fieldset v-if="device">
    <legend>Device {{ name }}</legend>
    <div v-if="temperature">last temp: {{ temperature }}°C</div>
    <button @click="getTemperature()">load temperature</button>
  </fieldset>
</template>

<script>
export default {
  emits: ["temperatureData"],
  props: {
    device: Object,
    sid: null,
  },
  data() {
    return {
      temperatureOffset: 0,
    };
  },
  computed: {
    ain: function() {
      // remove spaces from identifier
      return this.device.$.identifier.replace(/\s/g, "");
    },
    name: function() {
      return this.device.name;
    },
    temperature: function() {
      return this.calculateTemperature(this.device.temperature.celsius);
    },
  },
  methods: {
    calculateTemperature(rawTemperature) {
      return (rawTemperature - this.device.temperature.offset) / 10;
    },
    getTemperature() {
      const sid = this.sid;
      const cmd = "getbasicdevicestats";
      const ain = this.ain;

      this.$http
        .get(
          `api/webservices/homeautoswitch.lua?0=0&sid=${sid}&ain=${ain}&switchcmd=${cmd}`
        )
        .then((json) => {
          //console.log("json: " + JSON.stringify(json));
          this.$emit("temperatureData", {
            name: this.device.name,
            data: this.mapping(json),
          });
        })
        .catch(console.error);
    },
    mapping(json) {
      const temperatures = json.devicestats.temperature.stats._.split(",");

      const startDate = new Date();
      // Adjust minutes (15min interval)
      const minutes = Math.floor(startDate.getMinutes() / 15);
      startDate.setMinutes(minutes - 1);
      startDate.setSeconds(0);

      let counter = 0;
      // (!) reverse temperatures first
      return temperatures
        .map((temperature) => {
          return {
            x: this.calculateTime(++counter, startDate.getTime()),
            y: this.calculateTemperature(temperature),
          };
        })
        .reverse();
    },
    calculateTime(counter, time) {
      return new Date(time - counter * 15 * 60 * 1000);
    },
  },
};
</script>
