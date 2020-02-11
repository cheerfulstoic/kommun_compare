require 'nokogiri'
require 'json'

file = File.open('data/kommun_population.html', "r:UTF-8")
doc = Nokogiri::HTML(file, nil, Encoding::UTF_8.to_s)

rows = doc.css('table#ctl00_ctl00_ContentPlaceHolderMain_cphMain_Table1_Table1_DataTable tr')

rows.shift

years = rows.shift.css('th').map(&:text).map(&:to_i)

data =
  (0..(rows.size / 2)-1).map do |i|
    kommun = rows[i * 2].css('th').text

    populations = rows[(i * 2) + 1].css('td').map(&:text)


    # puts kommun
    # puts populations.inspect
    populations = populations.map {|s| s.gsub(/\s/, '').to_i }

    # puts years.inspect
    # puts years.zip(populations).to_h.inspect

    # _, kommun_code, kommun_name = kommun.match(/^(\d+) (.*)$/).to_a
    kommun_name = kommun.match(/^(\d+) (.*)$/).to_a[2]
    {
      kommun: {
        # code: kommun_code.to_i,
        name: kommun_name,
        # original: kommun
      },
      populations: years.zip(populations).to_h
    }
  end

File.open('output/populations.json', 'w') {|f| f << data.to_json }
