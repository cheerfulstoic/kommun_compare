<template>
  <div class="percentage-change-table">
    <table>
      <tr>
        <th>&nbsp;</th>
        <th v-for="(year_data_set, index) in year_data_sets"
          v-bind:key="year_data_set.title"
          v-bind:class="{'currently-ordered': index == order_index}"
            v-on:click="order_index = index">
          {{year_data_set.title}}
        </th>
      </tr>
      <tr v-for="kommun in ordered_kommuner" v-bind:key="kommun">
        <th>{{kommun}}</th>
        <td v-for="(year_data_set, index) in year_data_sets"
            v-bind:key="year_data_set.title"
            v-bind:class="{'currently-ordered': index == order_index}"
            v-on:click="order_index = index">
          {{total_percentage_change(year_data_set.data[kommun])}}%
        </td>
      </tr>
    </table>
  </div>
</template>


<script>

import _ from 'lodash';

export default {
  name: 'PercentageChangeTable',
  props: ['year_data_sets'],
  data () {
    return({order_index: 0});
  },
  computed: {
    ordered_kommuner () {
      let kommuner = _.keys(this.year_data_sets[0].data)

      if (this.order_index != null) {
        kommuner = _.sortBy(kommuner, (kommun) => {
          return(this.total_percentage_change(this.year_data_sets[this.order_index].data[kommun]))
        })
      }

      return(kommuner);
    },
  },
  methods: {
    total_percentage_change (year_data) {
      let first_year_value = year_data[0],
          last_year_value = year_data[year_data.length - 1];

      return(this.round_number(100.0 * (last_year_value - first_year_value) / first_year_value));
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

</style>
