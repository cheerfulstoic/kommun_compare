<template>
  <div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js";

export default {
  props: ["data", "options"],
  mounted() {
    this.render_chart(this.data, this.options);
  },
  watch: {
    data() {
      this.render_chart(this.data, this.options);
    }
  },

  // not stored in data to avoid reactivity
  // reactivity is not needed and has a big performance impact
  _chart: null,

  methods: {
    render_chart(data, options) {
      if (this._chart) {
        this._chart.destroy();
      }

      const newChart = new Chart(this.$refs.canvas, {
        type: "line",
        data: data,
        options: options
      });

      this._chart = newChart;
    }
  },

  beforeDestroy() {
    if (this._chart) {
      this._chart.destroy();
    }
  }
};
</script>
