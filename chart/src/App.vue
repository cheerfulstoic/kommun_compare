<template>
  <div id="app">
    <Header
      @open="open_dialog($event)"
     />

    <DialogContent
      v-bind:is_open="dialog_is_open"
      @close="close_dialog()" />

    <div class="columns main-section">
      <div class="column is-one-quarter">
        <div id="filters">
          <h3 class="is-size-4 has-text-weight-semibold">Filtrera</h3>
  
          <div class="field">
            <label class="label" for="lan">Län</label>
            <div class="select is-fullwidth">
              <select id="lan" v-model="selected_län">
                <option value="Alla">Välj län</option>
                <option v-for="län in all_länen" v-bind:key="län">
                  {{län}}
                </option>
              </select>
            </div>
          </div>
  
          <div class="field">
            <label class="label" for="kommun">Kommun</label>
            <div class="select is-fullwidth">
              <select id="kommun" v-model="selected_kommun">
                <option value="Alla">Välj kommun</option>
                <option v-for="kommun in all_kommuner_for(län)" v-bind:key="kommun">
                  {{kommun}}
                </option>
              </select>
            </div>
          </div>
  
          <label class="label">Nyckeltal</label>

          <div class="field toggle-buttons">
            <div class="buttons has-addons">
              <button
                @click="set_value_type('change')"
                :class="{ 'is-selected': selected_value_type === 'change', button: true }"
                >Förändringstakt</button>
              <button
                @click="set_value_type('total')"
                :class="{ 'is-selected': selected_value_type === 'total', button: true }"
                >Totalutsläpp</button>
            </div>
          </div>

          <div class="field toggle-buttons">
            <div class="buttons has-addons">
              <button
                @click="set_emission_type('all')"
                :class="{ 'is-selected': selected_emission_type === 'all', button: true }"
                >Växthusgaser</button>
              <button
                @click="set_emission_type('co2')"
                :class="{ 'is-selected': selected_emission_type === 'co2', button: true }"
                >Koldioxid</button>
            </div>
          </div>

          <label class="label">Sektorer</label>

          <div class="sektor-all-toggles is-flex">
            <button type="button" class="button is-fullwidth" v-on:click="select_all">Välj alla</button>
            <button type="button" class="button is-fullwidth" v-on:click="deselect_all">Avmarkera alla</button>
          </div>

          <div class="sektor-buttons"> 
            <div v-for="(huvudsektor, index) in all_sektorer" v-bind:key="huvudsektor">
              <input type="checkbox" class="is-sr-only" :disabled="selected_value_type === 'total' && huvudsektor === industri_sektor" v-bind:id="'sektor-button-' + index" v-bind:value="huvudsektor" v-model="selected_huvudsektorer">
              <label v-bind:for="'sektor-button-' + index" class="button">
                {{huvudsektor}}
              </label>
            </div>
          </div>

          <div class="data-credits">
            <p>
              Data från
              <a href="http://extra.lansstyrelsen.se/rus/Sv/statistik-och-data/nationell-emissionsdatabas/Pages/default.aspx">RUS</a>
              och
              <a href="http://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__BE__BE0101__BE0101C/BefArealTathetKon/?rxid=bd5169ae-f630-42db-8c8e-3ffdbf806a73">SCB</a>
            </p>
            <p>Utvecklat av <a href="https://www.klimatsekretariatet.se/">Klimatsekretariatet</a></p>
          </div>
        </div>
      </div>

      <div class="column charts">
        <DatabaseChart
                    v-bind:year_data_set="year_data_sets[graph_type]"
                    v-bind:years="emissions_database.years"
                    v-bind:kommun_to_highlight="kommun" />
      </div>
    </div>

    <PercentageChangeTable
                v-bind:year_data_sets="year_data_sets"
                v-bind:kommun_to_highlight="kommun"
                v-bind:lan_to_highlight="län"
                v-on:focus_kommun="focus_kommun" />
  </div>
</template>

<script>
import _ from 'lodash';

import Header from './components/Header.vue';
import DialogContent from './components/DialogContent.vue';
import DatabaseChart from './components/DatabaseChart.vue';
import PercentageChangeTable from './components/PercentageChangeTable.vue'

import { EmissionsDatabase } from './db.js';
import emissions_data from '../data/emissions_data.json'
const initial_emissions_database = new EmissionsDatabase(emissions_data);

import populations_data from '../data/populations.json'
const years = [2013, 2014, 2015, 2016, 2017] // TEMP
const population_data_by_kommun = _.reduce(populations_data, (result, record) => {
  result[record.kommun.name] = _.map(years, (year) => { return(record.populations[year]) });

  return(result);
}, {});

export default {
  name: 'app',
  components: {
    Header,
    DialogContent,
    DatabaseChart,
    PercentageChangeTable,
  },
  data () {
    return({
      selected_kommun: 'Alla',
      selected_län: 'Alla',
      selected_value_type: 'change',
      selected_emission_type: 'all',
      selected_huvudsektorer: initial_emissions_database.sektorer,
      industri_sektor: 'Industri (energi och processer)',
      dialog_is_open: false
    })
  },
  watch: {
    selected_län () {
      this.selected_kommun = 'Alla';
    },
  },
  computed: {
    active_huvudsektorer () {
      return this.selected_value_type === 'change' ? 
        this.selected_huvudsektorer :
        _.without(this.selected_huvudsektorer, this.industri_sektor);
    },

    all_länen () {
      return(initial_emissions_database.länen);
    },
    all_sektorer () {
      return(initial_emissions_database.sektorer);
    },

    kommun () {
      return(this.selected_kommun === 'Alla' ? null : this.selected_kommun);
    },
    län () {
      return(this.selected_län === 'Alla' ? null : this.selected_län);
    },

    graph_type () {
      const type = `${this.selected_value_type }_${this.selected_emission_type}`;
      const type_to_index_mapping = {
        total_all: 0,
        total_co2: 1,
        change_all: 2,
        change_co2: 3,
      };

      return type_to_index_mapping[type];
    },

    emissions_database () {
      return(initial_emissions_database.filter({
        Län: this.län,
        Huvudsektor: this.active_huvudsektorer,
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

      let emission_points_fn =
            (emission, min_value, max_value) => {
              if(emission < min_value || emission > max_value) return(null);
              let x = ((emission - min_value) / (max_value - min_value));

              return(this.round_number(2 - 2 * x)); // Linear scale 0..2 points for this category
            },
          math_s_curve_fn =
            (x) => {
              return 1 - Math.pow(Math.abs(x), 1/3) * Math.sign(x)
            },
          percent_change_points_fn =
            (percentage, min_value, max_value) => {
              let x = ((math_s_curve_fn(percentage) - math_s_curve_fn(min_value)) / (math_s_curve_fn(max_value) - math_s_curve_fn(min_value)))
              return(this.round_number(3 - 5 * x)); // S-curve scale -2..3 points for this category
            };

      let result = [
        {
          title: 'Utsläpp växthusgaser totalt',
          description: 'Årliga utsläpp av växthusgaser. (Samtliga växthusgaser totalt, per capita).',
          unit: 'ton/invånare',
          data: co_equivalents_year_data,
          metrics: _.reduce(co_equivalents_year_data, (result, year_data, kommun) => {
            result[kommun] = this.yearly_average(year_data);

            return(result);
          }, {}),
          points_fn: emission_points_fn,
        },
        {
          title: 'Utsläpp koldioxid totalt',
          description: 'Årligt utsläpp av koldioxid jämfört med startåret. (Koldioxid totalt, per capita).',
          unit: 'ton/invånare',
          data: co_year_data,
          metrics: _.reduce(co_year_data, (result, year_data, kommun) => {
            result[kommun] = this.yearly_average(year_data);

            return(result);
          }, {}),
          points_fn: emission_points_fn,
        },
        {
          title: 'Förändringstakt utsläpp växthusgaser',
          description: 'Årligt utsläpp av växthusgaser jämfört med startåret. (Samtliga växthusgaser totalt, per capita).',
          unit: 'procent',
          data: percent_change_co2_equivalents,
          metrics: _.reduce(this.mean_year_data(percent_change_co2_equivalents), (result, year_data, kommun) => {
            let rel_change = (year_data[year_data.length-1])/100,
                yoy_change = Math.pow(1+rel_change, 1/(year_data.length-1))-1;
            result[kommun] = this.round_number(100*yoy_change);

            return(result);
          }, {}),
          points_fn: percent_change_points_fn,
        },
        {
          title: 'Förändringstakt utsläpp koldioxid',
          description: 'Årlig procentuell förändringstakt under mätperioden. (Koldioxid totalt, per capita).',
          unit: 'procent',
          data: percent_change_co2,
          metrics: _.reduce(this.mean_year_data(percent_change_co2), (result, year_data, kommun) => {
            let rel_change = (year_data[year_data.length-1])/100,
                yoy_change = Math.pow(1+rel_change, 1/(year_data.length-1))-1;
            result[kommun] = this.round_number(100*yoy_change);

            return(result);
          }, {}),
          points_fn: percent_change_points_fn,
        },
      ];

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
          // TODO What should we do if the previous year is zero but the current year isn't?
          return 100 * (year_data[index] - year_data[0]) / (year_data[0] + .00001);
        }))

        return(result);
      }, {})
    },

    mean_year_data(year_data_by_kommun) {
      return _.reduce(year_data_by_kommun, (result, year_data, kommun) => {
        //result[kommun] = _.map(year_data, () => { return(mean) });
        result[kommun] = _.map(_.range(0, year_data.length), (index) => { 
          return(year_data[year_data.length-1])*(index/(year_data.length-1))
        });

        return(result);
      }, {})
    },

    yearly_average (year_data) {
      if (year_data == null) { return(null) }

      let sum = year_data.reduce((sum, val) => sum + val, 0),
          num = year_data.length,
          avg = sum/num;

      if (avg > 25) { 
        return(25 + avg/10000) // adding the average makes them sort correctly
      }

      return(this.round_number(avg));
    },

    total_percentage_change (year_data) {
      if (year_data == null) { return(null) }

      let first_year_value = year_data[0],
          last_year_value = year_data[year_data.length - 1];

      return(this.round_number(100 * (last_year_value - first_year_value) / first_year_value));
    },

    round_number(num) {
      return(Math.round((num + Number.EPSILON) * 100) / 100);
    },

    focus_kommun (kommun) {
      this.selected_kommun = kommun;
    },

    set_value_type (value_type) {
      this.selected_value_type = value_type;
    },

    set_emission_type (emission_type) {
      this.selected_emission_type = emission_type;
    },

    select_all () {
      this.selected_huvudsektorer = initial_emissions_database.sektorer;
    },

    deselect_all () {
      this.selected_huvudsektorer = [];
    },

    open_dialog (e) {
      e.preventDefault();

      this.dialog_is_open = true;
    },

    close_dialog () {
      this.dialog_is_open = false;
    },
  }
}
</script>

<style lang="scss">
$primary: #0080cc;
$primary: #f45959;
$family-primary: 'Work Sans', BlinkMacSystemFont, -apple-system, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
$weight-semibold: 500;
$border: #ebebeb;
$button-background-color: #f4f4f4;

@import '~bulma';

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.main-section {
  background-color: #faf5f5;
  padding: 40px;
}

#filters {
  height: 100%;
  padding: 20px;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
}

#filters h3 {
  margin-bottom: 10px;
}

.field .select select {
  background-color: #f4f4f4;
  border-color: #ebebeb;
}

.field .select:not(.is-multiple):not(.is-loading)::after {
  border-color: #777;
}

.toggle-buttons {
  background-color: $button-background-color;
  padding: 8px 10px;
  border-radius: 6px;
}

.buttons .button {
  background-color: $white;
  width: 50%;
  border-radius: 20px;
}

.buttons .button.is-selected {
  background-color: $primary;
  color: $white;
}

.sektor-all-toggles {
  margin-bottom: 8px;
}

.sektor-all-toggles .button:first-child {
  margin-right: 10px;
}

.sektor-buttons {
  flex: 1 0 auto;
}

.sektor-buttons .button {
  display: block;
  text-align: left;
  font-size: 0.8em;
  margin-bottom: 0.5em;
  padding-left: 3em;
}

.sektor-buttons .button::before {
  content: "";
  position: absolute;
  left: 10px;
  top: 6px;
  width: 18px;
  height: 18px;
  border-radius: 3px;
  background-color: white;
  border: 1px solid #dbdbdb;
}

.sektor-buttons input:checked + .button::before {
  background-color: $primary;
  border-color: transparent;
}

.sektor-buttons input:checked + .button::after {
  content: "";
  position: absolute;
  left: 14px;
  top: 10px;
  width: 11px;
  height: 11px;
  /* Checkmark icon from Bootstrap */
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3e%3c/svg%3e")
}

.sektor-buttons input:disabled + .button {
    cursor: not-allowed;
}

.sektor-buttons input:disabled + .button::before {
    background-color: #d1d1d1;
}

.sektor-buttons input:disabled + .button::after {
    background-image: none;
}

.data-credits {
  margin-top: 10px;
}

/* TODO this is meant as a temporary fix. */
/* "Utrikes transporter" should be removed from the data altogether */
.sektor-buttons div:last-child {
  display: none;
}
</style>
