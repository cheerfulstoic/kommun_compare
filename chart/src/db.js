import _ from 'lodash';

const years = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017];

export class Database {
  constructor(emissions_records, population_records) {
    this.emissions_records = _(emissions_records);

    this.kommuer_by_län = this.emissions_records.reduce((result, record) => {
      if (result[record.Län] == null) { result[record.Län] = new Set() }

      result[record.Län].add(record.Kommun);

      return(result);
    }, {})

    this.emissions_records = this.emissions_records.groupBy('Kommun');

    this.populations_by_kommun_name = _.keyBy(population_records, (record) => {
      return(record.kommun.name);
    })
  }

  query({filter, by_population}) {
    let result = this.emissions_records;

    // Only need to filter by Län at the moment
    if ( filter.Län ) {
      result = result.pick(Array.from(this.kommuer_by_län[filter.Län]));
    }

    return result.reduce((result, values, key) => {
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

  länen() {
    return(_.keys(this.kommuer_by_län));
  }

  kommuner_for(län) {
    if (län === 'Alla') {
      return(this.emissions_records.keys().value().sort());
    } else {
      return(Array.from(this.kommuer_by_län[län]).sort());
    }

  }
}
