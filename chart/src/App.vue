<template>
  <div id="app">
    <div>
      <h3>Filtrera</h3>

      <select v-model="selected_län">
        <option value="Alla">Alla Länen</option>
        <option v-for="län in all_länen" v-bind:key="län">
          {{län}}
        </option>
      </select>

      <select v-model="selected_kommun">
        <option value="Alla">Alla Kommuner</option>
        <option v-for="kommun in all_kommuner_for(län)" v-bind:key="kommun">
          {{kommun}}
        </option>
      </select>

      <div class="huvudsektor-options">
        <div class="huvudsektor-option" v-for="huvudsektor in all_sektorer" v-bind:key="huvudsektor">
          <label>
            <input type="checkbox" v-bind:value="huvudsektor" v-model="selected_huvudsektorer">
            {{huvudsektor}}
          </label>
        </div>
      </div>

      Data från <a href="http://extra.lansstyrelsen.se/rus/Sv/statistik-och-data/nationell-emissionsdatabas/Pages/default.aspx">RUS</a> och <a href="http://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__BE__BE0101__BE0101C/BefArealTathetKon/?rxid=bd5169ae-f630-42db-8c8e-3ffdbf806a73">SCB</a>

      <br/>

      <DatabaseChart v-for="year_data_set in year_data_sets" v-bind:key="year_data_set.title"
                  v-bind:year_data_by_kommun="year_data_set.data"
                  v-bind:years="emissions_database.years"
                  v-bind:title="year_data_set.title"
                  v-bind:unit="year_data_set.unit"
                  v-bind:kommun_to_highlight="kommun" />

      <PercentageChangeTable
                  v-bind:year_data_sets="year_data_sets"
                  v-bind:kommun_to_highlight="kommun" />
    </div>
  </div>
</template>

<script>
import _ from 'lodash';

import DatabaseChart from './components/DatabaseChart.vue';
import PercentageChangeTable from './components/PercentageChangeTable.vue'

import { EmissionsDatabase } from './db.js';
import emissions_data from '../data/emissions_data.json'
const initial_emissions_database = new EmissionsDatabase(emissions_data);

import populations_data from '../data/populations.json'
const years = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017] // TEMP
const population_data_by_kommun = _.reduce(populations_data, (result, record) => {
  result[record.kommun.name] = _.map(years, (year) => { return(record.populations[year]) });

  return(result);
}, {});

export default {
  name: 'app',
  components: {
    DatabaseChart,
    PercentageChangeTable,
  },
  data () {
    return({
      selected_kommun: 'Alla',
      selected_län: 'Alla',
      selected_huvudsektorer: initial_emissions_database.sektorer,
    })
  },
  watch: {
    selected_län () {
      this.selected_kommun = 'Alla';
    },
  },
  computed: {
    all_länen () {
      return(initial_emissions_database.länen);
    },
    all_sektorer () {
      return(initial_emissions_database.sektorer);
    },

    kommun () {
      return(this.selected_kommun == 'Alla' ? null : this.selected_kommun);
    },
    län () {
      return(this.selected_län == 'Alla' ? null : this.selected_län);
    },

    emissions_database () {
      return(initial_emissions_database.filter({
        Län: this.län,
        Huvudsektor: this.selected_huvudsektorer,
      }));
    },

    year_data_sets () {
      return([
        {
          title: 'CO2-equivalents - Per capita',
          unit: 'tons/person',
          data: this.emissions_database.filter({Ämne: 'CO2-equivalents'}).year_data_by_kommun(population_data_by_kommun)
        },
        {
          title: 'CO2-equivalents',
          unit: 'tons',
          data: this.emissions_database.filter({Ämne: 'CO2-equivalents'}).year_data_by_kommun()
        },
        {
          title: 'CO2 - Per capita',
          unit: 'tons/person',
          data: this.emissions_database.filter({Ämne: 'CO2'}).year_data_by_kommun(population_data_by_kommun)
        },
        {
          title: 'CO2',
          unit: 'tons',
          data: this.emissions_database.filter({Ämne: 'CO2'}).year_data_by_kommun()
        },
      ])
    },
  },
  methods: {
    all_kommuner_for (län) {
      return(initial_emissions_database.kommuner_for(län));
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

.huvudsektor-options {
  width: 800px;

}

.huvudsektor-option {
  display: inline-block;
  white-space: nowrap;
  margin: 0.3em 1em;

  border: 1px solid #333;
  border-radius: 0.7em;
  padding: 0.3em;
  background-color: #EEE;
}

</style>
