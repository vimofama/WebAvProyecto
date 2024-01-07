const express = require('express');
const cors = require('cors');

const {dbConnection} = require('../database/confing');
const { socketController } = require('../sockets/socketController');

class Server {
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server);

        this.paths = {
            auth: '/api/auth',
            usuarios: '/api/usuarios'
        }

        // Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();

        // Sockets
        this.sockets();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());

        // Directorio público
        // this.app.use(express.static('public'));
        // Directorio dist creado en astro
        this.app.use(express.static('dist'));
    }

    routes(){
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));
    }

    sockets(){
        this.io.on('connection', (socket) => socketController(socket, this.io));
    }

    listen(){
        this.server.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });   
    }
}

module.exports = Server;