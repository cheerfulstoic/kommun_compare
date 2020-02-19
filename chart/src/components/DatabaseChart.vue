<template>
  <div class="database-chart">
    <div class="card">
      <header class="card-header">
        <p class="card-header-title">
          {{year_data_set.title}}
        </p>
      </header>
      <div class="card-content">
        <p v-for="part in parts(year_data_set.description)" v-bind:key="part">
          {{part}}
        </p>
      </div>
      <div class="card-image">
        <Trend class="trend-chart"
               v-bind:data="trend_data()"
               v-bind:options="trend_options()" />
      </div>
    </div>
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
        let grouping = pair[0], year_data = pair[1];
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
          borderColor: 'red',
          borderWidth: 2,
        })
      }

      if (this.kommun_to_highlight && this.year_data_set.highlight_data && this.year_data_set.highlight_data[this.kommun_to_highlight]) {
        datasets.unshift({
          label: 'TEMP label',
          data: this.year_data_set.highlight_data[this.kommun_to_highlight],
          borderColor: 'red',
          borderWidth: 1.4,
          borderDash: [10, 10],
        })
      }

      return({ labels: this.years, datasets: datasets })
    },
    trend_options () {
      return({
        tooltips: {enabled: false},
        hover: {mode: null},
        parsing: false,
        spanGaps: true,
        legend: { display: false },
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: this.year_data_set.unit,
            },
            ticks: {
              suggestedMin: 0,
              minRotation: 0,
              maxRotation: 0,
            },
          }],
          xAxes: [{
            gridLines: { color: '#fff' },
            ticks: {
              minRotation: 45,
              maxRotation: 45,
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
            tension: 0,
            steppedLine: false,
            borderDash: [],
            borderColor: '#ccc',
            borderWidth: 0.7,
          },
        },
        animation: false,
      })
    },
    parts (s) {
      return s.split(/[\n\r]+/);
    },
  }
}
</script>

<style>

.card-header {
  text-align: center;
}

.database-chart {
  display: inline-block;
  margin: 1em;
  padding: 1em;
  width: 500px;
}

.trend-chart {
  display: inline-block;
}

</style>
