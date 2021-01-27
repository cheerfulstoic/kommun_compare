update:
	cd chart/data && curl -JO https://storage.googleapis.com/klimatsekretariatet-static/kommun_compare/emissions_data.json
	cd chart/data && curl -JO https://storage.googleapis.com/klimatsekretariatet-static/kommun_compare/populations.json
