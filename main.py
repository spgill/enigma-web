#! /usr/bin/python3
"""
Basically just a wrapper that loads the main flask up and
runs it under a Tornado server, to provide better performance than
the builtin development server.
"""

import os

from tornado.wsgi import WSGIContainer
from tornado.httpserver import HTTPServer
from tornado.ioloop import IOLoop
from werkzeug.serving import run_simple
from werkzeug.wsgi import LimitedStream

from enigma_server import app


class StreamConsumingMiddleware(object):

    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        stream = LimitedStream(environ['wsgi.input'],
                               int(environ['CONTENT_LENGTH'] or 0))
        environ['wsgi.input'] = stream
        app_iter = self.app(environ, start_response)
        try:
            stream.exhaust()
            for event in app_iter:
                yield event
        finally:
            if hasattr(app_iter, 'close'):
                app_iter.close()


def run_tornado(host, port):
    message = 'Starting Tornado production server on {0}:{1} ...'
    print(message.format(host, port))

    http_server = HTTPServer(WSGIContainer(app))
    http_server.listen(port, address=host)
    IOLoop.instance().start()


def run_werkzeug(host, port):
    message = 'Starting Werkzeug development server on {0}:{1} ...'
    print(message.format(host, port))
    app.wsgi_app = StreamConsumingMiddleware(app.wsgi_app)
    run_simple(host, port, app, use_reloader=True, use_debugger=True)


def main():
    """Run the selected web server backend"""
    host = '0.0.0.0'
    port = int(os.environ.get("PORT", 8080))
    server_name = os.environ.get('PYTHONSERVER', 'tornado')

    if server_name == 'tornado':
        run_tornado(host, port)
    elif server_name == 'werkzeug':
        run_werkzeug(host, port)
    else:
        raise RuntimeError(server_name + ' is not a valid backend...')


if __name__ == "__main__":
    main()
