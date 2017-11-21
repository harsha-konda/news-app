import sys
import json

for i in sys.stdin:
	print(json.dumps(eval(i.strip())))
	
