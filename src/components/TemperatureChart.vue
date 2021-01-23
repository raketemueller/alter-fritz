<template>
  <canvas id="chart-temperature"></canvas>
</template>

<script>
import Chart from "chart.js";

export default {
  props: {
    dataContainer: Array,
  },
  date() {
    return {
      chart: null,
    };
  },
  watch: {
    dataContainer: {
      handler() {
        this.updateChart();
      },
      deep: true,
    },
  },
  computed: {
    computedDatasets: function() {
      return this.dataContainer.map((dataObject) => {
        return {
          label: dataObject.name,
          data: dataObject.data,
          lineTension: 0,
          fill: false,
          radius: 1,
        };
      });
    },
    computedLabels: function() {
      return this.dataContainer[0].data.map((element) => {
        return element.x;
      });
    },
  },
  mounted() {
    this.createChart();
  },
  methods: {
    createChart() {
      this.chart = new Chart(document.getElementById("chart-temperature"), {
        type: "line",
        data: {
          labels: this.computedLabels,
          datasets: this.computedDatasets,
        },
        options: {
          scales: {
            xAxes: [
              {
                type: "time",
                time: {
                  unit: "hour",
                  unitStepSize: 1,
                  displayFormats: {
                    hour: "HH:mm",
                  },
                },
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: "Date",
                },
              },
            ],
            yAxes: [
              {
                ticks: {
                  max: 40,
                  min: -5,
                  stepSize: 5,
                },
              },
            ],
          },
        },
      });
    },
    updateChart() {
      this.chart.data.datasets = this.computedDatasets;
      this.chart.update();
    },
  },
};
</script>
