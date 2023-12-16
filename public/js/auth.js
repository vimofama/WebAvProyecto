const miFormulario = document.querySelector('form');

const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:3000/api/auth/'
    : 'https://curso-node-restserver-mlkw.onrender.com/api/auth/';

miFormulario.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = {};

    for (let el of miFormulario.elements){
        if (el.name.length > 0){
            formData[el.name] = el.value;
        }
    }

    fetch(url, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {'Content-Type': 'application/json'}
    })
        .then(resp => resp.json())
        .then(({msg, token}) => {
            if (msg){
                return console.error(msg);
            }
            localStorage.setItem('token', token);
            window.location = 'chat.html';
        })
        .catch(console.warn);

});