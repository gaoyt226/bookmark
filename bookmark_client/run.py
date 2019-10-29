from flask import Flask, send_file

app = Flask(__name__)

@app.route('/shiji/welcome')
def welcome():
    return send_file('templates/welcome.html')

@app.route('/shiji/index')
def index():
    return send_file('templates/index.html')

@app.route('/shiji/collections')
def collections():
    return send_file('templates/collections.html')

@app.route('/shiji/tags')
def tags():
    return send_file('templates/tags.html')

@app.route('/test')
def test():
    return send_file('templates/header2.html')




if __name__ == '__main__':
    app.run(debug=True)