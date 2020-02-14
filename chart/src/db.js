import _ from 'lodash';

export class EmissionsDatabase {
  constructor({years, records}) {
    this.years = years;
    this.records = records;

    this.länen = _(records).map('Län').uniq().sort().value();
    this.kommuner = _(records).map('Kommun').uniq().sort().value();
    this.sektorer = _(records).map('Huvudsektor').uniq().sort().value();

    this.kommuner_by_län = _.reduce(records, (result, record) => {
      if (result[record.Län] == null) { result[record.Län] = new Set([]) }

      result[record.Län].add(record.Kommun)

      return(result);
    }, {})
  }

  // Can take a `filters` object with the keys:
  // Ämne, Huvudsektor, Län, or Kommun
  filter(filters) {
    let new_records = _.reduce(filters, (result, value, key) => {
      if (_.isArray(value)) {
        let value_set = new Set(value);

        return(result.filter((record) => {
          return(value_set.has(record[key]));
        }));
      } else if (value == null) {
        return(result)
      } else {
        return(result.filter([key, value]))
      }
    }, _(this.records)).value();

    return(new EmissionsDatabase({
      years: this.years,
      records: new_records,
    }))
  }

  year_data_by_kommun (population_data_by_kommun) {
    let r = _.reduce(this.records, (result, record) => {
      if (result[record.Kommun]) {

        result[record.Kommun] = _.map(result[record.Kommun], (year_sum, index) => {
          return(year_sum + record.year_data[index]);
        })
      } else {
        result[record.Kommun] = record.year_data;
      }

      return(result);
    }, {});

    if (population_data_by_kommun) {
      _(r).keys().each((kommun) => {
        r[kommun] = _.map(r[kommun], (value, index) => {
          return(value / population_data_by_kommun[kommun][index]);
        })
      })
    }

    return(r);
  }

  // TEMP: Passing in year_data_by_kommun for efficiency
  percentage_change (year_data_by_kommun, kommun) {
    let year_data = year_data_by_kommun[kommun],
        first_year_value = year_data[0],
        last_year_value = year_data[year_data.length - 1];

    return(this.round_number(100.0 * (last_year_value - first_year_value) / first_year_value));
  }

  kommuner_for (län) {
    if (län == null) { return(this.kommuner) }

    return(Array.from(this.kommuner_by_län[län]).sort());
  }

  round_number(num) {
    return(Math.round((num + Number.EPSILON) * 100) / 100);
  }
}
