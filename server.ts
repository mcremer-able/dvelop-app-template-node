import {app} from './app'
import http from 'http'
import {AddressInfo} from "net";
import ErrnoException = NodeJS.ErrnoException;

const port = process.env.PORT || '8001';
app.set('port', port);
const server = http.createServer(app);
server.listen(port);

server.on('error',err => {
    if (err as ErrnoException){
        switch ((err as ErrnoException).code) {
            case 'EACCES':
                console.error(port + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(port + ' is already in use');
                process.exit(1);
                break;
            default:
                throw err;
        }
    }else{
        throw err
    }
});

server.on('listening',() => {
    const addr = server.address();
    if ((addr as AddressInfo)){
        console.info('Listening on http://localhost:' + (addr as AddressInfo).port )
    }else{
        console.info('Listening on ' + addr)
    }
});

