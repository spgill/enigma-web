import json
import os
import uuid

import flask

import enigma.machine
import bitnigma.machine

# Initialize the app
app = flask.Flask(__name__, static_folder='public', static_url_path='')
app.config['DEBUG'] = os.environ.get('DEBUG', False) == 'True'
app.config['MAX_CONTENT_LENGTH'] = 2 * 1024 * 1024  # 2 megabytes, fyi


# Download queue
app.download_queue = {}


# Index redirect
@app.route('/')
def index_redirect():
    return flask.redirect('/html/index.html')


# Normal enigma API
@app.route('/api/enigma', methods=['POST'])
def api_enigma():
    data = flask.request.get_json()

    machine = enigma.machine.Machine(
        plugboardStack=data['plugboard'],
        rotorStack=data['rotors'],
        reflector=data['reflector'],
        outputMode=enigma.machine.OUTPUT.PENTAGRAPH if data['pentagraph'] else
        enigma.machine.OUTPUT.CONTINUOUS
    )

    return machine.translateChunk(data['text'].encode()).decode()


# Bitnigma API
@app.route('/api/bitnigma', methods=['POST'])
def api_bitnigma():
    data = json.loads(flask.request.headers['Payload'])

    machine = bitnigma.machine.Machine(
        plugboardStack=data['plugboard'],
        rotorStack=data['rotors'],
        reflector=data['reflector']
    )

    out = machine.translateStream(stream_in=flask.request.files['file'])
    tag = uuid.uuid4().hex

    app.download_queue[tag] = [
        flask.request.files['file'].filename,
        out
    ]

    return tag

    # machine = enigma.machine.Machine(
    #     plugboardStack=data['plugboard'],
    #     rotorStack=data['rotors'],
    #     reflector=data['reflector'],
    #     outputMode=enigma.machine.OUTPUT.PENTAGRAPH if data['pentagraph'] else
    #     enigma.machine.OUTPUT.CONTINUOUS
    # )
    #
    # return machine.translateChunk(data['text'].encode()).decode()


# Bitnigma download queue
@app.route('/api/bitnigma/queue/<tag>')
def api_bitnigma_queue(tag):
    if tag in app.download_queue:
        dl = app.download_queue.pop(tag)
        return flask.send_file(
            dl[1],
            as_attachment=True,
            attachment_filename=dl[0]
        )
    else:
        flask.abort(404)
