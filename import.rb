require 'roo-xls'

data = 
  Dir.glob('./data/*.xls').flat_map do |filename|
    puts filename
    _, base_name = filename.match(/\/([^\/]+)\.xls$/).to_a
    puts "base_name: #{base_name.inspect}"

    _, subject = base_name.match(/_([^_]+)$/).to_a
    puts "subject: #{subject.inspect}"

    doc = Roo::Spreadsheet.open("./data/#{base_name}.xls", extension: :xls)

    rows = doc.sheet(1).parse

    require 'csv'
    require 'json'

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

      header_row.zip(row).to_h
    end
  end

File.open('./data/output.json', 'w') { |f| f << data.to_json }

keys = data.flat_map(&:keys).uniq

# puts data[0].inspect
# puts keys.inspect

CSV.open('./data/output.csv', 'wb') do |csv|
  csv << keys

  data.each do |record|
    csv << keys.map(&record)
  end
end
