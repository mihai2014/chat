#https://pypi.org/project/python-socketio/

import eventlet
import socketio

sio = socketio.Server()
app = socketio.WSGIApp(sio, static_files={
    '/': {'content_type': 'text/html', 'filename': 'index.html'}
})

@sio.event
def msg(sid, data):
    print('msg ', sid)
    sio.emit('msg', sid + " " + data);

@sio.event
def connect(sid, environ):
    print('connect ', sid)
    sio.emit('connect ', "welcome");

@sio.event
def my_message(sid, data):
    print('message ', data)

@sio.event
def disconnect(sid):
    print('disconnect ', sid)

if __name__ == '__main__':
    eventlet.wsgi.server(eventlet.listen(('', 3001)), app)
