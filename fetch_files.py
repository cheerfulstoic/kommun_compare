import requests

prefix = "http://www.airviro.smhi.se/RUS/rapporter/"
#fin = open("files.txt","r")
outputdir = ".\data"

dataparse = requests.get(prefix).text.split("\"")
data = []

for s in dataparse:
	if "lansrapport_" in s:
		if "xls" in s:
			s = s.split("\"")
			print(s[0])
			data.append(s[0])

all_lines = data 

for file_name in all_lines:
    fn = prefix + file_name
    print(fn)
    r = requests.get(fn)
    fo = "{}\{}".format(outputdir, file_name.strip())
    open(fo, "wb").write(r.content)
    print("File {} has been fetched to {}".format(file_name.strip(), outputdir))
    

