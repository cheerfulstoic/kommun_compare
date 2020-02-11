<template>
  <div id="app">
    <div class="trend-chart">
      <h3>Filtrera</h3>

      <select v-model="Län">
        <option value="Alla">Alla Länen</option>
        <option v-for="län in länen" v-bind:key="län">
          {{län}}
        </option>
      </select>

      <select v-model="Kommun">
        <option value="Alla">Alla Kommuner</option>
        <option v-for="kommun in kommuner" v-bind:key="kommun">
          {{kommun}}
        </option>
      </select>

      <div>
        <Trend class="trend-chart" v-bind:data="trend_data('CO2', true)" v-bind:options="trend_options('CO2', true)"/>
        <Trend class="trend-chart" v-bind:data="trend_data('CO2-equivalents', true)" v-bind:options="trend_options('CO2-equivalents', true)"/>
      </div>

      <div>
        <Trend class="trend-chart" v-bind:data="trend_data('CO2', false)" v-bind:options="trend_options('CO2', false)"/>
        <Trend class="trend-chart" v-bind:data="trend_data('CO2-equivalents', false)" v-bind:options="trend_options('CO2-equivalents', false)"/>
      </div>

      Data från <a href="http://extra.lansstyrelsen.se/rus/Sv/statistik-och-data/nationell-emissionsdatabas/Pages/default.aspx">RUS</a> och <a href="http://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__BE__BE0101__BE0101C/BefArealTathetKon/?rxid=bd5169ae-f630-42db-8c8e-3ffdbf806a73">SCB</a>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';

import Trend from './components/Trend.vue';

import { Database } from './db.js';
// import without_industry_records from '../data/without_industry.json'
import co2_data from '../data/CO2.json'
import co2_equivalents_data from '../data/CO2-equivalents.json'
import populations from '../data/populations.json'

const years = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017];
const co2_database = new Database(co2_data, populations);
const co2_equivalents_database = new Database(co2_equivalents_data, populations);

export default {
  name: 'app',
  components: {
    Trend
  },
  data () {
    return({
      Ämne: null,
      Kommun: 'Alla',
      Län: 'Alla',
    })
  },
  watch: {
    Län () {
      this.Kommun = 'Alla';
    },
  },
  computed: {
    kommuner () {
      return(co2_database.kommuner_for(this.Län));
    },
    länen () {
      return(co2_database.länen());
    },
  },
  methods: {
    trend_data (Ämne, by_population) {
      let database;
      if (Ämne === 'CO2') { database = co2_database }
      if (Ämne === 'CO2-equivalents') { database = co2_equivalents_database }

      let kommun = this.Kommun == 'Alla' ? null : this.Kommun
      let län = this.Län == 'Alla' ? null : this.Län
      let records = database.query({
        filter: {
          Län: län,
        },
        by_population: by_population,
      });

      let highlighted_record = records[kommun];
      if (highlighted_record) {
        delete records[kommun];
      }

      // Put kommun in first position so that it is on top
      records = _.toPairs(records);
      if (highlighted_record) {
        records.unshift([kommun, highlighted_record])
      }

      return({
        labels: years,
        datasets: _.map(records, (pair) => {
          let grouping = pair[0], record = pair[1];
          return({
            label: grouping,
            data: _.map(years, (year) => { return(record[year]) })
          })
        })
      })
    },
    trend_options (Ämne, by_population) {
      return({
        title: { display: true, text: `${Ämne} - exklusive industrisektorn${by_population ? ' - per capita' : ''}` },
        legend: { display: false },
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: `ton/${by_population ? 'person/' : ''}year`,
            },
            ticks: { suggestedMin: 0 },
          }],
        },
        elements: {
          point: { radius: 0 },
          line: {
            fill: false,
            tension: 0,
            borderColor: (info) => {
              return(this.Kommun !== 'Alla' && info.datasetIndex == 0 ? '#f87979' : '#bbb');
            },
            borderWidth: (info) => {
              return(this.Kommun !== 'Alla' && info.datasetIndex == 0 ? 3 : 1);
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
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.trend-chart {
  display: inline-block;
}
</style>
