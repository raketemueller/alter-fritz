<template>
  <div>
    <fieldset>
      <legend>Alter Fr!tz</legend>
      <div>
        <temperature-chart
          v-if="dataContainer.length > 0"
          :dataContainer="dataContainer"
        ></temperature-chart>
      </div>
      <button v-if="devices == null" @click="getDevices()">load devices</button>
      <div v-for="device in devices" :key="device.name">
        <fritz-box-device
          :sid="sid"
          :device="device"
          @temperatureData="addTemperatureToContainer"
        ></fritz-box-device>
      </div>
    </fieldset>
  </div>
</template>

<script>
export default {
  props: {
    sid: String,
  },
  data() {
    return {
      devices: null,
      dataContainer: [],
    };
  },
  methods: {
    getDevices() {
      const sid = this.sid;
      const cmd = "getdevicelistinfos";

      this.$http
        .get(
          `api/webservices/homeautoswitch.lua?0=0&sid=${sid}&switchcmd=${cmd}`
        )
        .then((json) => {
          this.devices = json.devicelist.device.sort((d1, d2) => {
            // Sort devices by temperature
            const t1 = (d1.temperature.celsius - d1.temperature.offset) / 10;
            const t2 = (d2.temperature.celsius - d2.temperature.offset) / 10;

            return (t1 - t2) * -1;
          });
        })
        .catch(console.error);
    },
    addTemperatureToContainer(temperatureData) {
      // Check if container already contains temperature of device
      const index = this.dataContainer.findIndex((data) => {
        return data.name === temperatureData.name;
      });

      if (index == -1) {
        // If new data push data to container
        this.dataContainer.push(temperatureData);
      } else {
        // Else replace existing data with new values
        this.dataContainer.splice(index, 1, temperatureData);
      }
    },
  },
};
</script>

<style scoped></style>
