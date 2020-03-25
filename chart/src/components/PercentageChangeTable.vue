
<template>
  <div class="percentage-change-table">
    <a v-bind:href="csv_file_data_url()"
       v-bind:download="csv_filename() + '.csv'">Save CSV</a>

    <table class="table">
      <thead>
        <tr class="title-row">
          <th>&nbsp;</th>
          <th v-for="(year_data_set, index) in year_data_sets"
            colspan="2"
            v-bind:key="year_data_set.title"
            class="{'currently-ordered': index == order_index}"
            v-on:click="toggle_order(index)">
            {{year_data_set.title}}
            <span class="sort-icon" v-if="order_index === index">
              <span v-if="order_direction === 'ascending'">
                <font-awesome-icon icon="sort-down"></font-awesome-icon>
              </span>
              <span v-if="order_direction === 'descending'">
                <font-awesome-icon icon="sort-up"></font-awesome-icon>
              </span>
            </span>
            <span class="sort-icon" v-if="order_index !== index">
              <font-awesome-icon icon="sort"></font-awesome-icon>
            </span>
          </th>
          <th>Totalpoäng</th>
        </tr>
        <tr class="subtitle-row">
          <th></th>
          <th>Utsläpp/invånare</th>
          <th>Poäng</th>
          <th>Utsläpp/invånare</th>
          <th>Poäng</th>
          <th>Ändring/år</th>
          <th>Poäng</th>
          <th>Ändring/år</th>
          <th>Poäng</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="kommun in ordered_kommuner"
            v-bind:key="kommun"
            v-bind:class="{'highlighted-kommun': kommun === kommun_to_highlight}">
          <th v-on:click="$emit('focus_kommun', kommun)">
            {{kommun}}
          </th>
          <template v-for="year_data_set in year_data_sets.slice(0,2)">
            <td v-bind:key="year_data_set.title + 'foo'"
                v-on:click="$emit('focus_kommun', kommun)">
              {{(year_data_set.metrics[kommun]>25)?">25":year_data_set.metrics[kommun]}}
            </td>
            <td v-bind:key="year_data_set.title + 'bar'"
                v-on:click="$emit('focus_kommun', kommun)">
              {{year_data_set.points[kommun]}}
            </td>
          </template>
          <template v-for="year_data_set in year_data_sets.slice(2)">
            <td v-bind:key="year_data_set.title + 'foo'"
                v-on:click="$emit('focus_kommun', kommun)">
              {{year_data_set.metrics[kommun]}}%
            </td>
            <td v-bind:key="year_data_set.title + 'bar'"
                v-on:click="$emit('focus_kommun', kommun)">
              {{year_data_set.points[kommun]}}
            </td>
          </template>

          <th>{{total_points(kommun)}}</th>
        </tr>
      </tbody>
    </table>
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
      header1.push('');
      _.each(this.year_data_sets, (year_data_set) => {
        header1.push(year_data_set.title);
        header1.push('')
      })
      header1.push(`Totalpoäng`)
      data.push(header1);

      header2.push('');
      _.each(this.year_data_sets.slice(0,2), () => {
        header2.push('Utsläpp/invånare');
        header2.push('Poäng')
      })
      _.each(this.year_data_sets.slice(2), () => {
        header2.push('Procentändring');
        header2.push('Poäng')
      })
      header2.push('')
      data.push(header2);

      _.each(this.ordered_kommuner, (kommun) => {
        let row = [], total_points = 0;

        row.push(kommun);
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
      if ( this.lan_to_highlight != null ) {
        return this.lan_to_highlight;
      } else {
        return 'Alla länen'
      }
    },
    csv_file_data_url () {
      let file = new Blob([this.csv()], {type: 'text/csv'});
      return(URL.createObjectURL(file))
    }
  },
}

</script>

<style scoped>
.percentage-change-table {
  padding: 40px;
}

.table {
  width: 100%;
}

.table thead {
  position: sticky;
  top: 0;
  background-color: white;
  white-space: nowrap;
}

.sort-icon {
  float: right;
}

td:nth-child(4n + 2),
td:nth-child(4n + 3) {
  background-color: #f7f7f7;
}

tbody tr:hover th,
tbody tr:hover td {
  background-color: hsl(210, 91%, 97%);
  cursor: pointer;
}

tbody tr.highlighted-kommun th,
tbody tr.highlighted-kommun td {
  background-color: #bfdefc;
}

</style>
