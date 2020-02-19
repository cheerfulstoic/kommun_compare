<template>
  <div class="percentage-change-table">
    <table class="table">
      <tr class="title-row">
        <th>&nbsp;</th>
        <th v-for="(year_data_set, index) in year_data_sets"
          v-bind:key="year_data_set.title"
          v-bind:class="{'currently-ordered': index == order_index}"
            v-on:click="order_index = index">
          {{year_data_set.title}}
        </th>
      </tr>
      <tr v-for="kommun in ordered_kommuner"
          v-bind:key="kommun"
          v-bind:class="{'highlighted-kommun': kommun === kommun_to_highlight}">
        <th v-on:click="$emit('focus_kommun', kommun)">
          {{kommun}}
        </th>
        <td v-for="(year_data_set, index) in year_data_sets"
            v-bind:key="year_data_set.title"
            v-bind:class="{'currently-ordered': index == order_index}"
            v-on:click="$emit('focus_kommun', kommun)">
          {{year_data_set.metrics[kommun]}}%
        </td>
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
    return({order_index: 0});
  },
  computed: {
    ordered_kommuner () {
      let kommuner = _.keys(this.year_data_sets[0].data)

      if (this.order_index != null) {
        kommuner = _.sortBy(kommuner, (kommun) => {
          return(this.year_data_sets[this.order_index].metrics[kommun]);
        })
      }

      return(kommuner);
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
  top: 130px;
}
tr.title-row {
  background-color: white;
}

tr.highlighted-kommun th,
tr.highlighted-kommun td {
  background-color: #BFDEFC;
}

</style>
