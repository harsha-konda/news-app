from flask import Flask, request
import sys
import StringIO
import json
import os, sys
from subprocess import Popen,PIPE


app = Flask(__name__, static_url_path='')

@app.route("/", methods=['GET', 'POST'])
def handle():

    if request.method == 'POST':
        # Implementation goes here.
        #
        # Both stdout and stderr should be captured.
        # {"stdout": "<output_from_stdout>", "stderr": "<output_from_stderr>"}

        code=request.form['code']

        target = open("test.py", 'w+')
        target.write(code)
        target.close()
        p = Popen(['python', 'test.py'], stdin=PIPE, stdout=PIPE, stderr=PIPE)
        stdout = p.stdout.read()
        stderr = p.stderr.read()

        final_dump=json.dumps({"stderr":stderr,"stdout":stdout})

        return final_dump

if __name__ == '__main__':
    app.run(threaded=True, debug=True, host="0.0.0.0", port=6000)
