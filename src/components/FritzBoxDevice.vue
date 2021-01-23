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
      let counter = 0;
      return temperatures.map((temperature) => {
        return {
          x: counter++,
          y: this.calculateTemperature(temperature),
        };
      });
    },
  },
};
</script>
