
<template>
  <div class="percentage-change-table">
    <a class="btn btn-primary mx-2"
       v-bind:href="csv_file_data_url()"
       v-bind:download="csv_filename() + '.csv'">Save CSV</a>

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
            <span v-if="order_direction === 'ascending'">
              <font-awesome-icon icon="sort-down"></font-awesome-icon>
            </span>
            <span v-if="order_direction === 'descending'">
              <font-awesome-icon icon="sort-up"></font-awesome-icon>
            </span>
          </span>
          <span v-if="order_index !== index">
            <font-awesome-icon icon="sort"></font-awesome-icon>
          </span>
        </th>
        <th>Total poäng</th>
      </tr>
      <tr class="subtitle-row">
        <th>&nbsp;</th>
        <template v-for="(year_data_set, index) in year_data_sets">
          <th v-bind:key="year_data_set.title + 'foo'"
              v-bind:class="{'currently-ordered': index == order_index}"
              v-on:click="toggle_order(index)">
            Procentändring
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
            {{year_data_set.points[kommun]}}
          </td>
        </template>

        <th>{{total_points(kommun)}}</th>
      </tr>
    </table>

    <pre>
      {{csv()}}
    </pre>
  </div>
</template>


<script>

import _ from 'lodash';

export default {
  name: 'PercentageChangeTable',
  props: ['year_data_sets', 'kommun_to_highlight', 'lan_to_highlight'],
  data () {
    return({
      order_index: 0,
      order_direction: 'ascending',
    });
  },
  computed: {
    ordered_kommuner () {
      let kommuner = _.keys(this.year_data_sets[0].data)

      let order_index = this.order_index;
      kommuner = _.sortBy(kommuner, (kommun) => {
        return(this.year_data_sets[order_index].metrics[kommun]);
      })
      if (this.order_direction === 'descending') {
        kommuner = _.reverse(kommuner);
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
    round_number(num) {
      return(Math.round((num + Number.EPSILON) * 100) / 100);
    },
    total_points(kommun) {
      return this.round_number(_.sumBy(this.year_data_sets, (year_data_set) => {
        return year_data_set.points[kommun]
      }));
    },
    csv () {
      let data = [];

      let header1 = [], header2 = [];
      _.each(this.year_data_sets, (year_data_set) => {
        header1.push(year_data_set.title);
        header1.push('')
      })
      header1.push(`Total poäng`)
      data.push(header1);

      _.each(this.year_data_sets, () => {
        header2.push('Procentändring');
        header2.push('Score')
      })
      header2.push('')
      data.push(header2);

      _.each(this.ordered_kommuner, (kommun) => {
        let row = [], total_points = 0;

        _.each(this.year_data_sets, (year_data_set) => {
          row.push(year_data_set.metrics[kommun]);
          row.push(year_data_set.points[kommun]);
          total_points += year_data_set.points[kommun];
        })
        row.push(this.round_number(total_points));

        data.push(row)
      })

      return _.join(_.map(data, (row) => { return _.join(row, ',') }), "\n")
    },
    csv_filename () {
      if ( this.kommun_to_highlight != null ) {
        return this.kommun_to_highlight
      } else {
        if ( this.lan_to_highlight != null ) {
          return this.lan_to_highlight;
        } else {
          return 'Alla kommuner'
        }
      }
    },
    csv_file_data_url () {
      let file = new Blob([this.csv()], {type: 'text/csv'});
      return(URL.createObjectURL(file))
    }
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
