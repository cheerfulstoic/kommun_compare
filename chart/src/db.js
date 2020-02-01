import _ from 'lodash';

const years = [2013, 2014, 2015, 2016, 2017];

export class Database {
  constructor(records) {
    this.records = records;
  }

  query({filter, group_by}) {
    let result = _(this.records);

    let filter_values = _.pickBy({
      Ämne: filter.Ämne,
      Kommun: filter.Kommun,
      Län: filter.Län,
    }, _.identity);
    result = result.filter(filter_values);

    let group_iteratee = group_by ? group_by : () => { return('foo') }

    return result.groupBy(group_iteratee).reduce((result, values, key) => {
      result[key] = {}
      _.each(years, (year) => {
        result[key][year] = _(values).map(year).sum()
      })

      return(result);
    }, {})
  }

  values_for(property) {
    return _(this.records).map(property).uniq().sort().value();
  }

  kommuner_for(län) {
    let result = _(this.records)

    if (län !== 'Alla') {
      result = result.filter({Län: län})
    }

    return result.map('Kommun').uniq().sort().value();
  }
}
