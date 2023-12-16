const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:3000/api/auth/'
    : 'https://curso-node-restserver-mlkw.onrender.com/api/auth/';

let usuario = null;
let socketServer = null;

// Referencias HTML
const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('#btnSalir');

const validarJWT = async () => {
    const token = localStorage.getItem('token') || '';

    if (token.length <= 10) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    const resp = await fetch(url, {
        headers: {'x-token': token}
    });

    const {usuario: userDB, token: tokenDB} = await resp.json();
    localStorage.setItem('token', tokenDB);
    usuario = userDB;
    document.title = usuario.nombre;
    await conectarSocket();
}

const conectarSocket = async () => {
    socketServer = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socketServer.on('connect', () => {
        console.log('Sockets online')
    });

    socketServer.on('disconnect', () => {
        console.log('Sockets offline')
    });

    socketServer.on('recibir-mensajes', dibujarMensajes);

    socketServer.on('usuarios-activos', (payload) => {
        dibujarUsuarios(payload);
    });

    socketServer.on('mensaje-privado', dibujarMensajesPrivado);
}

const dibujarUsuarios = (usuarios = []) => {
    let usersHtml = '';
    usuarios.forEach(({nombre, uid}) => {
        usersHtml += `
            <li>
                <p>
                    <h5 class="text-success"> ${nombre}</h5>
                    <span class="fs-6 text-muted">${uid}</span>
                </p>
            </li>
        `
    });

    ulUsuarios.innerHTML = usersHtml;
}

const dibujarMensajes = (mensajes = []) => {
    let mensjaesHtml = '';
    mensajes.forEach(({nombre, mensaje}) => {
        mensjaesHtml += `
            <li>
                <p>
                    <span class="text-primary"> ${nombre}:</span>
                    <span>${mensaje}</span>
                </p>
            </li>
        `
    });

    ulMensajes.innerHTML = mensjaesHtml;
}

const dibujarMensajesPrivado = (payload) => {

    const {de: nombre, mensaje} = payload;

    let mensjaesHtml = `
            <li>
                <p>
                    <span class="text-primary"> ${nombre}:</span>
                    <span>${mensaje}</span>
                </p>
            </li>
        `;

    ulMensajes.innerHTML = mensjaesHtml;
}

txtMensaje.addEventListener('keyup', ({keyCode}) => {

    const mensaje = txtMensaje.value;
    const uid = txtUid.value;

    if (keyCode !== 13) {
        return;
    }
    if (mensaje.length === 0) {
        return;
    }

    socketServer.emit('enviar-mensaje', {mensaje, uid});

    txtMensaje.value = '';
    txtUid.value = '';
});

btnSalir.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/';
});

const main = async () => {
    // Validar JWT
    await validarJWT();
}

main();