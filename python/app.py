from bottle import Bottle, run, route, request, response, template
import bottle
import json

app = bottle.Bottle()

@app.route('/')
def index():
    return 'hello'

run(app, host='localhost', port=8080)