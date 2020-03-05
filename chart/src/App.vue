<template>
  <div id="app">
    <div>
      <div id="filters">
        <h3>Filtrera</h3>

        <select v-model="selected_län" class="select">
          <option value="Alla">Alla Länen</option>
          <option v-for="län in all_länen" v-bind:key="län">
            {{län}}
          </option>
        </select>

        <select v-model="selected_kommun" class="select">
          <option value="Alla">Alla Kommuner</option>
          <option v-for="kommun in all_kommuner_for(län)" v-bind:key="kommun">
            {{kommun}}
          </option>
        </select>

        <div class="sektor-buttons">
          <a class="button" v-on:click="select_all">Select All</a>
          <!-- TODO: Make buttons clump together -->
          <span class="buttons has-addons is-centered" v-for="(huvudsektor, index) in all_sektorer" v-bind:key="huvudsektor">
            <span class="button">
              <input type="checkbox" v-bind:id="'sektor-button-' + index" v-bind:value="huvudsektor" v-model="selected_huvudsektorer">
            </span>
            <label v-bind:for="'sektor-button-' + index" class="button">{{huvudsektor}}</label>

            <a class="button" v-on:click="focus_huvudsektor(huvudsektor)">🔎</a>
          </span>
        </div>
      </div>

      <div id="data-notification" class="notification is-info">
        Data från <a href="http://extra.lansstyrelsen.se/rus/Sv/statistik-och-data/nationell-emissionsdatabas/Pages/default.aspx">RUS</a> och <a href="http://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__BE__BE0101__BE0101C/BefArealTathetKon/?rxid=bd5169ae-f630-42db-8c8e-3ffdbf806a73">SCB</a>
      </div>

      <div class="columns is-multiline is-gapless">
        <div class="column is-half"
             v-for="year_data_set in year_data_sets"
             v-bind:key="year_data_set.title">
          <DatabaseChart v-bind:year_data_set="year_data_set"
                         v-bind:years="emissions_database.years"
                         v-bind:kommun_to_highlight="kommun" />
        </div>
      </div>

      <PercentageChangeTable
                  v-bind:year_data_sets="year_data_sets"
                  v-bind:kommun_to_highlight="kommun"
                  v-on:focus_kommun="focus_kommun"/>
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
      let co_equivalents_year_data =
            this.emissions_database.filter({Ämne: 'CO2-equivalents'}).year_data_by_kommun(population_data_by_kommun),
          co_year_data =
            this.emissions_database.filter({Ämne: 'CO2'}).year_data_by_kommun(population_data_by_kommun),
          percent_change_co2_equivalents =
            this.percent_year_over_year_change_data(this.emissions_database.filter({Ämne: 'CO2-equivalents'}).year_data_by_kommun()),
          percent_change_co2 =
            this.percent_year_over_year_change_data(this.emissions_database.filter({Ämne: 'CO2'}).year_data_by_kommun());

      let total_points_fn =
            (percentage, min_value, max_value) => {
              let x = ((percentage - min_value) / (max_value - min_value))

              return(this.round_number(3 * (1 - Math.pow(x, 1/3) * Math.sign(x))));
            },
          percent_change_points_fn =
            (percentage, min_value, max_value) => {
              let x = ((percentage - min_value) / (max_value - min_value))

              return(this.round_number(3 * (1 - Math.pow(x, 1/3) * Math.sign(x)) - 1));
            };
      let result = [
        {
          title: 'UTSLÄPP VÄXTHUSGASER TOTALT',
          description: "Genomsnittliga årliga utsläpp av växthusgaser de senaste fem mätperioderna. (Samtliga växthusgaser totalt, exklusive industrin, omräknat till CO2e, per capita). ",
          unit: 'tons/person',
          data: co_equivalents_year_data,
          metrics: _.reduce(co_equivalents_year_data, (result, year_data, kommun) => {
            result[kommun] = this.total_percentage_change(year_data);

            return(result);
          }, {}),
          points_fn: total_points_fn,
        },
        {
          title: 'UTSLÄPP KOLDIOXID TOTALT',
          description: 'Genomsnittliga årliga utsläpp av koldioxid de senaste fem mätperioderna. (Exklusive industrin, per capita). ',
          unit: 'tons/person',
          data: co_year_data,
          metrics: _.reduce(co_year_data, (result, year_data, kommun) => {
            result[kommun] = this.total_percentage_change(year_data);

            return(result);
          }, {}),
          points_fn: total_points_fn,
        },
        {
          title: 'FÖRÄNDRINGSTAKT UTSLÄPP VÄXTHUSGASER',
          description: 'Genomsnittlig årlig procentuell förändringstakt de senaste fem mätperioderna. (Samtliga växthusgaser totalt, per capita). ',
          unit: 'procent',
          data: percent_change_co2_equivalents,
          highlight_data: this.mean_year_data(percent_change_co2_equivalents),
          metrics: _.reduce(this.mean_year_data(percent_change_co2_equivalents), (result, year_data, kommun) => {
            result[kommun] = this.round_number(year_data[0]);

            return(result);
          }, {}),
          points_fn: percent_change_points_fn,
        },

        {
          title: 'FÖRÄNDRINGSTAKT UTSLÄPP KOLDIOXID',
          description: 'Genomsnittlig årlig procentuell förändringstakt de senaste fem mätperioderna i din kommun. (Koldioxid totalt, per sektor, per capita).',
          unit: 'procent',
          data: percent_change_co2,
          highlight_data: this.mean_year_data(percent_change_co2),
          metrics: _.reduce(this.mean_year_data(percent_change_co2), (result, year_data, kommun) => {
            result[kommun] = this.round_number(year_data[0]);

            return(result);
          }, {}),
          points_fn: percent_change_points_fn,
        },
      ]

      _.each(result, (year_data_set) => {
        let max = _(year_data_set.metrics).values().max(),
            min = _(year_data_set.metrics).values().min();


        year_data_set.points = _.mapValues(year_data_set.metrics, (percentage) => {
          return year_data_set.points_fn(percentage, min, max);
        });
      })

      return(result);
    },
  },
  methods: {
    all_kommuner_for (län) {
      return(initial_emissions_database.kommuner_for(län));
    },

    percent_year_over_year_change_data (year_data_by_kommun) {
      return _.reduce(year_data_by_kommun, (result, year_data, kommun) => {
        result[kommun] = [0].concat(_.map(_.range(1, year_data.length), (index) => {
          // TODO:
          // What should we do if the previous year is zero but the current year isn't?
          return 100 * (year_data[index] - year_data[index - 1]) / year_data[index - 1]
        }))

        return(result);
      }, {})
    },

    mean_year_data(year_data_by_kommun) {
      return _.reduce(year_data_by_kommun, (result, year_data, kommun) => {
        let mean = _.mean(year_data);

        result[kommun] = _.map(year_data, () => { return(mean) });

        return(result);
      }, {})
    },

    total_percentage_change (year_data) {
      if (year_data == null) { return(null) }

      let first_year_value = year_data[0],
          last_year_value = year_data[year_data.length - 1];

      return(this.round_number(100 * (last_year_value - first_year_value) / first_year_value));
    },

    round_number(num) {
      // return(Math.round((num + Number.EPSILON) * 10) / 10);
      return(Math.round((num + Number.EPSILON) * 100) / 100);
    },

    focus_kommun (kommun) {
      this.selected_kommun = kommun;
    },

    focus_huvudsektor (selected_huvudsektorer) {
      this.selected_huvudsektorer = [selected_huvudsektorer];
    },

    select_all () {
      this.selected_huvudsektorer = initial_emissions_database.sektorer;
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

#filters {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 5;
}

#data-notification {
  width: 400px;
  margin: 1em auto;
}

.sektor-buttons .buttons {
  display: inline-block;
  margin: 0.2em;
}

.sektor-buttons .button {
  font-size: 0.8em;
  display: inline-block;
}


</style>
