// Constructor de objetos para modelar los productos del carrito
class Producto {
    constructor(id, nombre, imagen, precio) {
        this.id = id;
        this.nombre = nombre;
        this.imagen = imagen;
        this.precio = precio;
    }
}



//////////  Creamos el stock trayendo los datos de un JSON  ///////////////////

let stock = [];
const urlProductos = '../data/data.json';

fetch(urlProductos)
.then(response => response.json())
.then(data => {
    stock = data;
    mostrarStock(); // Ejecutamos la vista inicial con la primera fila de productos
});



///// Creamos la vista de los productos en stock ///////////

let inicio = 0;  // En esta variable llevamos la cuenta para la posición inicial del stock a mostrar

function mostrarStock() {
    // En este ciclo generamos una fila de tres tarjetas de productos
    for (let i = inicio; i < inicio + 3; i++) {
        let tarjeta = document.createElement('div');
        tarjeta.setAttribute("class", "card col-4")
        if (stock[i]) {
            tarjeta.innerHTML = `
            <img class="card-img-top" src=${stock[i].imagen} alt="Card image" style="width:100%">
            <div class="card-body">
                <h4 class="card-title">${stock[i].nombre}</h4>
                <p class="card-text">Precio $${stock[i].precio}</p>
                <button 
                    class="btn btn-primary" 
                    data-id=${stock[i].id}
                    data-nombre=${stock[i].nombre.replaceAll(" ", "_")} // Reemplazamos los espacios en blanco para evitar errores
                    data-precio=${stock[i].precio} 
                    data-imagen=${stock[i].imagen} 
                    onclick="agregarProducto(event)"
                >Comprar</button>
            </div>
            `;
        } else {
            tarjeta.innerHTML = `
            <img class="card-img-top" src="./img/imagen-producto.jpg" alt="Placeholder" style="width:100%">
            <div class="card-body">
                <h4 class="card-title">No hay más productos</h4>
            </div>
            `;
        }
        // Enviamos cada tarjeta al HTML
        document.querySelector('#stock').appendChild(tarjeta);
    }

    if (inicio + 3 >= stock.length) {
        document.querySelector('#btnMore').disabled = true;  // Deshabilitamos el botón 'Más Productos'
    } else {
        inicio += 3;  // Incrementamos en tres unidades el punto de inicio de la muestra de productos
    }

}


/////// Creamos el carrito /////////////

let carrito = [];

// Si hay carrito en el localStorage lo cargamos y lo mostramos
if (localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"));
    mostrarCarrito();
}

// Creamos la función para la vista del carrito en el HTML

function mostrarCarrito() {
    let acumuladorCarritoHTML = ``;

    for (let i = 0; i < carrito.length; i++) {
        let template = `
        <div class="card" style="width:200px">
            <img class="card-img-top" src=${carrito[i].imagen} alt="Card image" style="width:100%">
            <div class="card-body">
                <h4 class="card-title">${carrito[i].nombre.replaceAll("_", " ")}</h4> <!--Recuperamos los espacios en blanco-->
                <p class="card-text">Cantidad: ${carrito[i].cantidad}</p>
                <button class="btn btn-secondary" onclick="decrementar('${carrito[i].id}')">-</button>
                <button class="btn btn-secondary" onclick="incrementar('${carrito[i].id}')">+</button>
                <p class="card-text">Precio $${carrito[i].precio * carrito[i].cantidad}</p>
                <button 
                class="btn btn-danger"  
                onclick="eliminarProducto('${carrito[i].id}')"
                >Eliminar</button>
            </div>
        </div>
        `;

        acumuladorCarritoHTML += template;
    }

    document.querySelector('#carrito').innerHTML = acumuladorCarritoHTML;
    // Guardamos el estado del carrito en el localStorage
    localStorage.setItem("carrito", JSON.stringify(carrito));
}


// Función para agregar productos al carrito
function agregarProducto(event) {
    let encontrado = carrito.findIndex(item => item.id == event.target.dataset.id);
    if (encontrado == -1) {
        let productoElegido = new Producto(event.target.dataset.id,
            event.target.dataset.nombre, 
            event.target.dataset.imagen, 
            event.target.dataset.precio);
        productoElegido.cantidad = 1;
        carrito.push(productoElegido);
    } else {
        carrito[encontrado].cantidad += 1;
    }
    mostrarCarrito();
    actualizarTotal();
}

// Función para eliminar un producto del carrito
function eliminarProducto(id) {
    let encontrado = carrito.findIndex(item => item.id == id);
    carrito.splice(encontrado, 1);
    mostrarCarrito();
    actualizarTotal();
}

// Función para vaciar el carrito
function vaciarCarrito() {
    carrito = [];
    mostrarCarrito();
    actualizarTotal();
}

// Función para incrmentar la cantidad de un producto en el carrito
function incrementar(id) {
    let encontrado = carrito.findIndex(item => item.id == id);
    carrito[encontrado].cantidad += 1;
    mostrarCarrito();
    actualizarTotal();
}

// Función para decrmentar la cantidad de un producto en el carrito
function decrementar(id) {
    let encontrado = carrito.findIndex(item => item.id == id);
    if (carrito[encontrado].cantidad > 1) carrito[encontrado].cantidad -= 1;
    mostrarCarrito();
    actualizarTotal();
}

// Función para actualizar el total del carrito
function actualizarTotal() {
    let total = 0;
    carrito.forEach(item => total += (item.cantidad * item.precio));
    document.querySelector('#total').innerHTML = "$" + total;
}