//////////  Creamos el stock  ///////////////////

// Constructor de objetos para modelar los productos
class Producto {
    constructor(id, nombre, imagen, precio) {
        this.id = id;
        this.nombre = nombre;
        this.imagen = imagen;
        this.precio = precio;
    }
}

// Instanciamos los objetos
const prod1 = new Producto(1, "Producto 1", "./img/imagen-producto.jpg", 200);
const prod2 = new Producto(2, "Producto 2", "./img/imagen-producto.jpg", 300);
const prod3 = new Producto(3, "Producto 3", "./img/imagen-producto.jpg", 800);
const prod4 = new Producto(4, "Producto 4", "./img/imagen-producto.jpg", 100);
const prod5 = new Producto(5, "Producto 5", "./img/imagen-producto.jpg", 500);
const prod6 = new Producto(6, "Producto 6", "./img/imagen-producto.jpg", 900); 
const prod7 = new Producto(7, "Producto 7", "./img/imagen-producto.jpg", 300);
const prod8 = new Producto(8, "Producto 8", "./img/imagen-producto.jpg", 400);
const prod9 = new Producto(9, "Producto 9", "./img/imagen-producto.jpg", 700); 
const prod10 = new Producto(8, "Producto 10", "./img/imagen-producto.jpg", 400);
const prod11 = new Producto(9, "Producto 11", "./img/imagen-producto.jpg", 700);

// Construimos un array con los objetos como elementos
const stock = [prod1, prod2, prod3, prod4, prod5, prod6, prod7, prod8, prod9, prod10, prod11];



///// Creamos la vista de los productos con la info de los objetos instanciados ///////////

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

mostrarStock(); // Ejecutamos la vista inicial con la primera fila de productos



/////// Creamos el carrito /////////////

// Si hay carrito en el localStorage lo cargamos, si no creamos el array vacío
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];


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
    console.log(carrito)
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
}

// Función para eliminar un producto del carrito
function eliminarProducto(id) {
    let encontrado = carrito.findIndex(item => item.id == id);
    carrito.splice(encontrado, 1);
    mostrarCarrito();
}

// Función para vaciar el carrito
function vaciarCarrito() {
    carrito = [];
    mostrarCarrito();
}

// Función para incrmentar la cantidad de un producto en el carrito
function incrementar(id) {
    let encontrado = carrito.findIndex(item => item.id == id);
    carrito[encontrado].cantidad += 1;
    mostrarCarrito();
}

// Función para decrmentar la cantidad de un producto en el carrito
function decrementar(id) {
    let encontrado = carrito.findIndex(item => item.id == id);
    if (carrito[encontrado].cantidad > 1) carrito[encontrado].cantidad -= 1;
    mostrarCarrito();
}