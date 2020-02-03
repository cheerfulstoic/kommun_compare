<template>
  <div id="app">
    <div class="trend-chart">
      <h3>Filtrera</h3>

      <select v-if="group_by !== 'Ämne'" v-model="Ämne">
        <option>CO2</option>
        <option>CO2-equivalents</option>
      </select>

      <select v-model="Län">
        <option value="Alla">Alla Länen</option>
        <option v-for="län in länen" v-bind:key="län">
          {{län}}
        </option>
      </select>

      <select v-if="group_by !== 'Kommun'" v-model="Kommun">
        <option value="Alla">Alla Kommuner</option>
        <option v-for="kommun in kommuner" v-bind:key="kommun">
          {{kommun}}
        </option>
      </select>

      <h3>Grupp</h3>

      <select v-model="group_by">
        <option>Ämne</option>
        <option>Kommun</option>
      </select>


      <Trend class="trend-chart" v-bind:data="trend_data" v-bind:options="trend_options"/>
      <div>Enhet: ton/year</div>
      <div>Exklusive industrisektorn</div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';

import Trend from './components/Trend.vue';

import { Database } from './db.js';
import without_industry_records from '../data/without_industry.json'

const years = [2013, 2014, 2015, 2016, 2017];
const database = new Database(without_industry_records);

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

      group_by: 'Ämne',
    })
  },
  watch: {
    Län () {
      this.Kommun = 'Alla';
    },
    group_by (new_value) {
      this.Ämne = 'CO2';
      if (new_value === 'Ämne') {
        this.Ämne = null;
      }
      if (new_value === 'Kommun') {
        this.Kommun = 'Alla';
      }
    },
  },
  computed: {
    kommuner () {
      return(database.kommuner_for(this.Län));
    },
    länen () {
      return(database.values_for('Län'));
    },
    trend_data () {
      let kommun = this.Kommun == 'Alla' ? null : this.Kommun
      let län = this.Län == 'Alla' ? null : this.Län
      let records = database.query({
        filter: {
          Ämne: this.Ämne,
          Kommun: kommun,
          Län: län,
        },
        group_by: this.group_by,
      });
      window.console.log({record_count: _.size(records)});

      return({
        labels: years,
        datasets: _.flatMap(records, (record, grouping) => {
          return({
            // label: this.record_label(record),
            label: grouping,
            fill: false,
            backgroundColor: '#f87979',
            data: _.map(years, (year) => { return(record[year]) })
          })
        })
      })
    },
    trend_options () {
      return({
        legend: { display: false },
        scales: {
          yAxes: [{
            ticks: { suggestedMin: 0 },
          }],
        },
      })
    }
  },
  methods: {
    record_label (record) {
      if (this.Kommun == 'Alla') {
        return `${record.Kommun}-${record.Huvudsektor}`;
      } else {
        return `${record.Huvudsektor}`;
      }
    }
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
  max-width: 600px;
  max-height: 600px;
}
</style>
