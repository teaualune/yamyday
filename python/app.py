from bottle import Bottle, run, route, request, response, template
import bottle
import json
import htmlParser

app = bottle.Bottle()

@app.route('/')
def index():
    url = unicode(request.query.url).encode('utf-8')
    source = request.query.source
    results = htmlParser.getContentWithUrl(url, source)
    jsonObj = json.dumps(results)
    print 'parse complete'
    return jsonObj

run(app, host='localhost', port=8080)