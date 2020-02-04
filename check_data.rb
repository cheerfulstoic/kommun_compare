require 'json'

emissions_data = JSON.load(File.read('output/without_industry.json'))

population_data = JSON.load(File.read('output/populations.json'))

emissions_kommuner = emissions_data.map {|obj| obj['Kommun'] }

population_kommuner = population_data.map {|obj| obj['kommun']['name'] }

puts

puts "Extra kommuner in emissions_data:"
puts (emissions_kommuner.uniq - population_kommuner)

puts

puts "Extra kommuner in population_data:"
puts (population_kommuner - emissions_kommuner.uniq)
