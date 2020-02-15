<template>
  <div class="data-column">
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
  props: ['year_data_by_kommun', 'years', 'title', 'unit', 'kommun_to_highlight'],
  components: {
    Trend
  },
  data () {
    return({});
  },
  methods: {
    trend_data () {
      let result = _.cloneDeep(this.year_data_by_kommun);

      // Put kommun in first position so that it is on top
      let highlighted_year_data = result[this.kommun_to_highlight];
      if (highlighted_year_data) {
        delete result[this.kommun_to_highlight];
      }
      result = _.toPairs(result);
      if (highlighted_year_data) {
        result.unshift([this.kommun_to_highlight, highlighted_year_data])
      }

      return({
        labels: this.years,
        datasets: _.map(result, (pair) => {
          let grouping = pair[0], year_data = pair[1];
          return({
            label: grouping,
            data: year_data,
            spanGaps: true,
          })
        })
      })
    },
    trend_options () {
      return({
        tooltips: {enabled: false},
        hover: {mode: null},
        parsing: false,
        spanGaps: true,
        title: { display: true, text: this.title },
        legend: { display: false },
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: this.unit,
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
            borderColor: (info) => {
              // return(this.Kommun !== 'Alla' && info.datasetIndex == 0 ? '#f87979' : '#bbb');
              return(this.kommun_to_highlight && info.datasetIndex == 0 ? '#f87979' : '#ccc');
            },
            borderWidth: (info) => {
              return(this.kommun_to_highlight && info.datasetIndex == 0 ? 2 : 0.7);
            },
          },
        },
        animation: false,
      })
    },
  }
}
</script>

<style>

.data-column {
  display: inline-block;
  border: 1px solid #888;
  margin: 1em;
  padding: 1em;
}

.trend-chart {
  display: inline-block;
}

canvas {
  border-radius: 0.5em;
}

</style>
