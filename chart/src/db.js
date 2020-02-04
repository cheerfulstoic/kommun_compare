import _ from 'lodash';

const years = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017];

export class Database {
  constructor(emissions_records, population_records) {
    this.emissions_records = emissions_records;

    this.populations_by_kommun_name = _.keyBy(population_records, (record) => {
      return(record.kommun.name);
    })
  }

  query({filter, by_population}) {
    let result = _(this.emissions_records);

    let filter_values = _.pickBy({
      Ämne: filter.Ämne,
      Län: filter.Län,
    }, _.identity);
    result = result.filter(filter_values);

    return result.groupBy('Kommun').reduce((result, values, key) => {
      result[key] = {}
      years.forEach((year) => {
        result[key][year] = _(values).map(year).sum()

        if (by_population) {
          let population = this.populations_by_kommun_name[key].populations[year];
          result[key][year] = result[key][year] / population;
        }
      })

      return(result);
    }, {})
  }

  values_for(property) {
    return _(this.emissions_records).map(property).uniq().sort().value();
  }

  kommuner_for(län) {
    let result = _(this.emissions_records)

    if (län !== 'Alla') {
      result = result.filter({Län: län})
    }

    return result.map('Kommun').uniq().sort().value();
  }
}
