<template>
  <div class="percentage-change-table">
    <table class="table">
      <tr class="title-row">
        <th>&nbsp;</th>
        <th v-for="(year_data_set, index) in year_data_sets"
          colspan="2"
          v-bind:key="year_data_set.title"
          v-bind:class="{'currently-ordered': index == order_index}"
          v-on:click="toggle_order(index)">
          {{year_data_set.title}}
          <span v-if="order_index === index">
            <span v-if="order_direction === 'ascending'">👇 </span>
            <span v-if="order_direction === 'descending'">☝️  </span>
          </span>
          <span v-if="order_index !== index">
            🤷‍♂️
          </span>
        </th>
      </tr>
      <tr class="subtitle-row">
        <th>&nbsp;</th>
        <template v-for="(year_data_set, index) in year_data_sets">
          <th v-bind:key="year_data_set.title + 'foo'"
              v-bind:class="{'currently-ordered': index == order_index}"
              v-on:click="toggle_order(index)">
            Procent
          </th>
          <th v-bind:key="year_data_set.title + 'bar'"
              v-bind:class="{'currently-ordered': index == order_index}"
              v-on:click="toggle_order(index)">
            Score
          </th>
        </template>
      </tr>
      <tr v-for="kommun in ordered_kommuner"
          v-bind:key="kommun"
          v-bind:class="{'highlighted-kommun': kommun === kommun_to_highlight}">
        <th v-on:click="$emit('focus_kommun', kommun)">
          {{kommun}} 🔎
        </th>
        <template v-for="(year_data_set, index) in year_data_sets">
          <td v-bind:key="year_data_set.title + 'foo'"
              v-bind:class="{'currently-ordered': index == order_index}"
              v-on:click="$emit('focus_kommun', kommun)">
            {{year_data_set.metrics[kommun]}}%
          </td>
          <td v-bind:key="year_data_set.title + 'bar'"
              v-bind:class="{'currently-ordered': index == order_index}"
              v-on:click="$emit('focus_kommun', kommun)">
            {{points(year_data_set.metrics[kommun])}}
          </td>
        </template>
      </tr>
    </table>
  </div>
</template>


<script>

import _ from 'lodash';

export default {
  name: 'PercentageChangeTable',
  props: ['year_data_sets', 'kommun_to_highlight'],
  data () {
    return({order_index: 0, order_direction: 'ascending'});
  },
  computed: {
    ordered_kommuner () {
      let kommuner = _.keys(this.year_data_sets[0].data)

      if (this.order_index != null) {
        kommuner = _.sortBy(kommuner, (kommun) => {
          return(this.year_data_sets[this.order_index].metrics[kommun]);
        })
        if (this.order_direction === 'descending') {
          kommuner = _.reverse(kommuner);
        }
      }

      return(kommuner);
    },
  },
  methods: {
    toggle_order (index) {
      let index_changed = this.order_index !== index;
      this.order_index = index;
      if (index_changed) {
        this.order_direction = 'ascending';
      } else {
        window.console.log({order_direction: this.order_direction});
        if (this.order_direction === 'ascending') {
          this.order_direction = 'descending';
        } else {
          this.order_direction = 'ascending';
        }
      }
    },
    points (percentage) {
      let x = percentage / 100;
      return(this.round_number(1 - Math.pow(Math.abs(x), 1/3) * Math.sign(x)));
    },
    round_number(num) {
      return(Math.round((num + Number.EPSILON) * 100) / 100);
    },
  },
}

</script>

<style>

.currently-ordered {
  background-color: #eee;
}

tr.title-row {
  position: sticky;
  top: 165px;
}
tr.subtitle-row {
  position: sticky;
  top: 195px;
}
tr.title-row,
tr.subtitle-row {
  background-color: white;
  white-space: nowrap;
}

tr.highlighted-kommun th,
tr.highlighted-kommun td {
  background-color: #BFDEFC;
}

</style>
