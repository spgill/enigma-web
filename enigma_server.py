import os

import flask

import enigma.machine
import bitnigma

# Initialize the app
app = flask.Flask(__name__, static_folder='public', static_url_path='')
app.config['DEBUG'] = os.environ.get('DEBUG', False) == 'True'
app.config['MAX_CONTENT_LENGTH'] = 2 * 1024 * 1024  # 2 megabytes, fyi


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
