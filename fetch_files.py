import requests

prefix = "http://www.airviro.smhi.se/RUS/rapporter/"
fin = open("files.txt","r")
outputdir = ".\data"

all_lines = fin.readlines()

for file_name in all_lines:
    fn = prefix + file_name.strip()
    #print(fn)
    r = requests.get(fn)
    fo = "{}\{}".format(outputdir, file_name.strip())
    open(fo, "wb").write(r.content)
    print("File {} has been fetched to {}".format(file_name.strip(), outputdir))
    

