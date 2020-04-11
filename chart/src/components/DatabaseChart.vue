<template>
  <div class="database-chart">
    <header>
      <h2>{{year_data_set.title}}</h2>
      <p v-for="part in parts(year_data_set.description)" v-bind:key="part">
        {{part}}
      </p>
    </header>
    <Trend class="trend-chart"
            v-bind:data="trend_data()"
            v-bind:options="trend_options()" />
  </div>
</template>

<script>
import _ from 'lodash';
import Trend from './Trend.vue';

export default {
  name: 'DatabaseChart',
  props: ['year_data_set', 'years', 'kommun_to_highlight'],
  components: {
    Trend
  },
  data () {
    return({});
  },
  methods: {
    trend_data () {
      let result = _.cloneDeep(this.year_data_set.data);

      // Put kommun in first position so that it is on top
      let highlighted_year_data = result[this.kommun_to_highlight];
      
      if (highlighted_year_data) {
        delete result[this.kommun_to_highlight];
      }
      
      result = _.toPairs(result);
      
      let datasets = _.map(result, (pair) => {
        let grouping = pair[0];
        let year_data = pair[1];

        return({
          label: grouping,
          data: year_data,
          spanGaps: true,
        })
      })

      if (highlighted_year_data) {
        datasets.unshift({
          label: this.kommun_to_highlight,
          data: highlighted_year_data,
          borderColor: '#f91308',
          borderWidth: 3,
        })
      }

      if (this.kommun_to_highlight && this.year_data_set.highlight_data && this.year_data_set.highlight_data[this.kommun_to_highlight]) {
        datasets.unshift({
          label: 'TEMP label',
          data: this.year_data_set.highlight_data[this.kommun_to_highlight],
          borderColor: '#f91308',
          borderWidth: 2.5,
          borderDash: [10, 10],
        })
      }

      return({ labels: this.years, datasets: datasets })
    },
    trend_options () {
      return({
        maintainAspectRatio: false,
        tooltips: {enabled: false},
        hover: {mode: null},
        parsing: false,
        spanGaps: true,
        legend: { display: false },
        scales: {
          yAxes: [{
            gridLines: { color: '#f0f0f0' },
            scaleLabel: {
              display: true,
              labelString: this.year_data_set.unit,
              padding: {
                top: 0,
                bottom: -4,
              },
            },
            ticks: {
              suggestedMin: 0,
              minRotation: 0,
              maxRotation: 0,
            },
          }],
          xAxes: [{
            gridLines: { color: '#f0f0f0' },
            ticks: {
              suggestedMin: 0,
              minRotation: 0,
              maxRotation: 0,
            },
          }],
        },
        datasets: {
          line: { pointRadius: 0 },
        },
        elements: {
          point: { radius: 0 },
          line: {
            pointRadius: 0,
            fill: false,
            tension: 0.08,
            steppedLine: false,
            borderDash: [],
            borderColor: 'hsl(0, 0%, 30%)',
            borderWidth: 0.3,
          },
        },
        animation: false,
        chartAreaBackground: 'white',
      })
    },
    parts (s) {
      return s.split(/[\n\r]+/);
    },
  }
}
</script>

<style scoped>
.database-chart {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.trend-chart {
  margin-top: 10px;
  flex: 1 0 auto;
}

header {
  margin: 16px 0 20px 40px;
}

h2 {
  font-weight: bold;
  font-size: 2em;
}
</style>

<style>
.trend-chart canvas {
  min-height: 70vh;
}
</style>
