from flask import Flask, request
import sys
import json
import os, sys
import newspaper

app = Flask(__name__, static_url_path='')

@app.route("/", methods=['GET', 'POST'])
def handle():

    if request.method == 'POST':
        # Implementation goes here.
        #
        # Both stdout and stderr should be captured.
        # {"stdout": "<output_from_stdout>", "stderr": "<output_from_stderr>"}

        code=request.form['code']


        final_dump=json.dumps({"stderr":code,"stdout":"dpg"})

        return final_dump

    if request.method=='GET':

        return json.dumps({"newspaper":"some randomshit"})

if __name__ == '__main__':
    app.run(threaded=True, debug=True, host="0.0.0.0", port=5000)
