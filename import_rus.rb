require 'roo-xls'
require 'csv'
require 'json'

years = (2013..2017)

records = 
  Dir.glob('./data/*.xls').flat_map do |filename|
    _, base_name = filename.match(/\/([^\/]+)\.xls$/).to_a
    # puts "base_name: #{base_name.inspect}"

    _, subject = base_name.match(/_([^_]+)$/).to_a
    # puts "subject: #{subject.inspect}"

    next if base_name.match(/lansrapport_sverige_/)

    puts filename

    if %w[CO2 CO2-equivalents].include?(subject)
      doc = Roo::Spreadsheet.open("./data/#{base_name}.xls", extension: :xls)

      rows = doc.sheet(1).parse

      # Drop first three rows
      rows.shift
      rows.shift
      rows.shift

      year_row = rows.shift
      header_row = rows.shift

      header_row = year_row.zip(header_row).map do |year_row_cell, header_row_cell|
        if year_row_cell.nil? || year_row_cell.strip == ''
          header_row_cell
        else
          year_row_cell
        end
      end

      header_row.unshift('Ämne')


      rows.map do |row|
        row.unshift(subject)

        d = header_row.zip(row).to_h

        d['Kommun'].gsub!(/([a-z])([A-Z])/, '\1 \2')
        d['Kommun'].gsub!('-', ' ')
        d['Kommun'] = 'Malung-Sälen' if d['Kommun'] == 'Malung'
        d['Kommun'] = 'Upplands-Bro' if d['Kommun'] == 'Upplands Bro'
        d['Kommun'] = 'Dals-Ed' if d['Kommun'] == 'Dals Ed'

        year_data = {}
        d.keys.each do |key|
          if key.match?(/\A\d+\Z/)
            value = d.delete(key)

            if years.include?(key.to_i)
              year_data[key.to_i] = value
            end
          end
        end

        d['year_data'] = years.map {|year| year_data.fetch(year, 0) }

        d
      end.reject do |d|
        d['Huvudsektor'] == 'alla' ||
        d['Kommun'] == 'alla' ||
        d['Kommun'] == 'Rest'#  ||
        # d['Huvudsektor'] == 'Industri (energi och processer)'
      end.select do |d|
        d['Undersektor'] == 'alla'
      end.each do |d|
        # Unused
        d.delete('Undersektor')
      end
    else
      []
    end
  end.compact

File.open("./output/emissions_data.json", 'w') do |f|
  f << {
    years: years.to_a,
    records: records,
  }.to_json
end

keys = records.flat_map(&:keys).uniq
CSV.open("./output/emissions_data.csv", 'wb') do |csv|
  csv << keys

  records.each do |record|
    csv << keys.map(&record)
  end
end
