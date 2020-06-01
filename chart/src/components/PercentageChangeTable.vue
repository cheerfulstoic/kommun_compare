
<template>
  <div class="percentage-change-table">
    <a
      class="button is-hidden"
      v-bind:href="csv_file_data_url()"
      v-bind:download="csv_filename() + '.csv'"
    >Spara som CSV</a>

    <p class="points-change-explainer">
      Välj alla sektorer och alla län för att se årets poäng.
      <br />Välj enskilda län och/eller olika sektorer för att utforska hur detta urval påverkar dina poäng.
    </p>

    <table class="table">
      <thead>
        <tr class="title-row">
          <th></th>
          <th
            v-for="(year_data_set, index) in year_data_sets"
            colspan="2"
            class="is-sortable"
            v-bind:key="year_data_set.title"
            v-on:click="toggle_order(index)"
          >
            <span class="is-flex">
              {{year_data_set.title}}
              <span
                :class="{ 'is-active': order_index === index, 'sort-icon': true }"
              >
                <font-awesome-icon v-if="order_index !== index" icon="sort"></font-awesome-icon>
                <font-awesome-icon
                  v-if="order_index === index && order_direction === 'ascending'"
                  icon="sort-down"
                ></font-awesome-icon>
                <font-awesome-icon
                  v-if="order_index === index && order_direction === 'descending'"
                  icon="sort-up"
                ></font-awesome-icon>
              </span>
            </span>
          </th>
          <th>Totalpoäng</th>
        </tr>
        <tr class="subtitle-row">
          <th></th>
          <th>Ton CO<sub>2</sub>-ekv./invånare</th>
          <th>Poäng</th>
          <th>Ton CO<sub>2</sub>/invånare</th>
          <th>Poäng</th>
          <th>Ändring/år</th>
          <th>Poäng</th>
          <th>Ändring/år</th>
          <th>Poäng</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="kommun in ordered_kommuner"
          v-bind:key="kommun"
          v-bind:class="{'highlighted-kommun': kommun === kommun_to_highlight}"
          v-on:click="$emit('focus_kommun', kommun)"
        >
          <th>{{kommun}}</th>
          <template v-for="year_data_set in year_data_sets.slice(0,2)">
            <td
              v-bind:key="year_data_set.title + 'foo'"
            >{{(year_data_set.metrics[kommun]>25)?"> 25":year_data_set.metrics[kommun]}}</td>
            <td v-bind:key="year_data_set.title + 'bar'">{{year_data_set.points[kommun]}}</td>
          </template>
          <template v-for="year_data_set in year_data_sets.slice(2)">
            <td v-bind:key="year_data_set.title + 'foo'">{{year_data_set.metrics[kommun]}}%</td>
            <td v-bind:key="year_data_set.title + 'bar'">{{year_data_set.points[kommun]}}</td>
          </template>

          <th>{{total_points(kommun)}}</th>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<script>
import _ from "lodash";

export default {
  name: "PercentageChangeTable",
  props: ["year_data_sets", "kommun_to_highlight", "lan_to_highlight"],
  data() {
    return {
      order_index: 0,
      order_direction: "ascending"
    };
  },
  computed: {
    ordered_kommuner() {
      let kommuner = _.keys(this.year_data_sets[0].data);

      let order_index = this.order_index;
      kommuner = _.sortBy(kommuner, kommun => {
        return this.year_data_sets[order_index].metrics[kommun];
      });
      if (this.order_direction === "descending") {
        kommuner = _.reverse(kommuner);
      }

      return kommuner;
    }
  },
  methods: {
    toggle_order(index) {
      let index_changed = this.order_index !== index;
      this.order_index = index;
      if (index_changed) {
        this.order_direction = "ascending";
      } else {
        window.console.log({ order_direction: this.order_direction });
        if (this.order_direction === "ascending") {
          this.order_direction = "descending";
        } else {
          this.order_direction = "ascending";
        }
      }
    },
    round_number(num) {
      return Math.round((num + Number.EPSILON) * 100) / 100;
    },
    total_points(kommun) {
      return this.round_number(
        _.sumBy(this.year_data_sets, year_data_set => {
          return year_data_set.points[kommun];
        })
      );
    },
    csv() {
      let data = [];

      let header1 = [],
        header2 = [];
      header1.push("");
      _.each(this.year_data_sets, year_data_set => {
        header1.push(year_data_set.title);
        header1.push("");
      });
      header1.push(`Totalpoäng`);
      data.push(header1);

      header2.push("");
      _.each(this.year_data_sets.slice(0, 2), () => {
        header2.push("Utsläpp/invånare");
        header2.push("Poäng");
      });
      _.each(this.year_data_sets.slice(2), () => {
        header2.push("Procentändring");
        header2.push("Poäng");
      });
      header2.push("");
      data.push(header2);

      _.each(this.ordered_kommuner, kommun => {
        let row = [],
          total_points = 0;

        row.push(kommun);
        _.each(this.year_data_sets, year_data_set => {
          row.push(year_data_set.metrics[kommun]);
          row.push(year_data_set.points[kommun]);
          total_points += year_data_set.points[kommun];
        });
        row.push(this.round_number(total_points));

        data.push(row);
      });

      return _.join(
        _.map(data, row => {
          return _.join(row, ",");
        }),
        "\n"
      );
    },
    csv_filename() {
      if (this.lan_to_highlight != null) {
        return this.lan_to_highlight;
      } else {
        return "Alla länen";
      }
    },
    csv_file_data_url() {
      let file = new Blob([this.csv()], { type: "text/csv" });
      return URL.createObjectURL(file);
    }
  }
};
</script>

<style scoped>
.percentage-change-table {
  padding: 40px;
}

.points-change-explainer {
  margin-bottom: 30px;
}

.table {
  width: 100%;
}

.table thead {
  white-space: nowrap;
}

.title-row th,
.subtitle-row th {
  position: sticky; /* position sticky doesn't work on thead or tr */
  top: 0;
  background-color: white;
  box-shadow: 0 1px #dbdbdb; /* border doesn't work well with position sticky */
}

.subtitle-row th {
  top: 40px;
}

.is-sortable {
  cursor: pointer;
}

.is-sortable > .is-flex {
  justify-content: space-between;
}

.sort-icon {
  padding: 8px 10px;
  margin: -8px;
  margin-left: 10px;
}

.sort-icon.is-active {
  background: #f45959;
  color: white;
}

td:nth-child(4n + 2),
td:nth-child(4n + 3) {
  background-color: #f7f7f7;
}

tbody tr:hover th,
tbody tr:hover td {
  background-color: #faf5f5;
  cursor: pointer;
}

tbody tr.highlighted-kommun th,
tbody tr.highlighted-kommun td {
  background-color: #fbc5c5;
}
</style>
