window.onload = function(){   

    fetch("http://localhost:3000/api/products")
    .then(function(response){
        return response.json()
    })
    .then(function(baseDeDatoss){
            
        let baseDeDatos = baseDeDatoss.data
        let carrito = [];
        const divisa = '$';
        const DOMitems = document.querySelector('#items');
        const DOMcarrito = document.querySelector('#carrito');
        const DOMtotal = document.querySelector('#total');
        const DOMbotonVaciar = document.querySelector('#boton-vaciar');
        const miLocalStorage = window.localStorage;



        function renderizarProductos() {
            const miNodo = document.createElement('div');
            miNodo.classList.add('shopping-cart-title');
            DOMitems.appendChild(miNodo);

            baseDeDatos.forEach((info) => {

                const miNodoCardBody = document.createElement('div');
                miNodoCardBody.classList.add('courses-cart');
                miNodo.appendChild(miNodoCardBody);

                    const miNodoCardLi = document.createElement('li');
                    miNodoCardLi.classList.add("prod-name");
                    miNodoCardBody.appendChild(miNodoCardLi);
                    
                        const miNodoCardDivLi = document.createElement('div');
                        miNodoCardDivLi.classList.add("courses-cart-item");
                        miNodoCardLi.appendChild(miNodoCardDivLi)

                            const miNodoCardDivLiDiv = document.createElement('div');
                            miNodoCardDivLi.appendChild(miNodoCardDivLiDiv)

                                const miNodoCardlink = document.createElement('a');
                                miNodoCardlink.setAttribute('href', "/products/"+ info.id);
                                miNodoCardDivLiDiv.appendChild(miNodoCardlink)

                                    const miNodoImagen = document.createElement('img');
                                    miNodoImagen.classList.add('courses-images-cart');
                                    miNodoImagen.setAttribute('src', "/images/productImages/"+ info.image);
                                    miNodoCardlink.appendChild(miNodoImagen)
                                     
                            const miNodoTitle = document.createElement('div');
                            miNodoTitle.classList.add('courses-cart-descrip');
                            miNodoCardDivLi.appendChild(miNodoTitle)  

                                const miNodoTitleH2 = document.createElement('h2');
                                miNodoTitleH2.classList.add("courses-cart-name");
                                miNodoTitleH2.textContent = info.product_name;
                                miNodoTitle.appendChild(miNodoTitleH2)

                                const miNodoPrice = document.createElement('div');
                                miNodoPrice.classList.add('price-cart');
                                miNodoPrice.textContent = `${info.price}${divisa}`;
                                miNodoTitle.appendChild(miNodoPrice) 

                                const miNodoCategory = document.createElement('div');
                                miNodoCategory.classList.add('price-cart');
                                
                                miNodoCategory.textContent = 
                                (info.category.category == "Curso") ? "Duración del Curso " + info.duration + " h"   
                                : info.category.category
                        
                                miNodoTitle.appendChild(miNodoCategory) 

                                const miNodoButton = document.createElement('button');
                                miNodoButton.classList.add("shopping-cart");
                                miNodoButton.textContent = '+';
                                miNodoButton.setAttribute('marcador', info.id);
                                miNodoButton.addEventListener('click', anyadirProductoAlCarrito);
                                miNodoTitle.appendChild(miNodoButton)
            });
        }

            function anyadirProductoAlCarrito(evento) {
                // Anyadimos el Nodo a nuestro carrito
                carrito.push(evento.target.getAttribute('marcador'))
                // Actualizamos el carrito 
                renderizarCarrito();
                // Actualizamos el LocalStorage
                guardarCarritoEnLocalStorage();
            }

            function renderizarCarrito() {
                // Vaciamos todo el html
                DOMcarrito.textContent = '';
                // Quitamos los duplicados
                const carritoSinDuplicados = [...new Set(carrito)];
                // Generamos los Nodos a partir de carrito
                carritoSinDuplicados.forEach((item) => {
                    // Obtenemos el item que necesitamos de la variable base de datos
                    const miItem = baseDeDatos.filter((itemBaseDatos) => {
                        // ¿Coincide las id? Solo puede existir un caso
                        return itemBaseDatos.id === parseInt(item);
                    });
                    // Cuenta el número de veces que se repite el producto
                    const numeroUnidadesItem = carrito.reduce((total, itemId) => {
                        // ¿Coincide las id? Incremento el contador, en caso contrario no mantengo
                        return itemId === item ? total += 1 : total;
                    }, 0);
                    // Creamos el nodo del item del carrito
                    const miNodo = document.createElement('li');
                    miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
                    miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${miItem[0].precio}${divisa}`;
                    // Boton de borrar
                    const miBoton = document.createElement('button');
                    miBoton.classList.add('btn', 'btn-danger', 'mx-5');
                    miBoton.textContent = 'X';
                    miBoton.style.marginLeft = '1rem';
                    miBoton.dataset.item = item;
                    miBoton.addEventListener('click', borrarItemCarrito);
                    // Mezclamos nodos
                    miNodo.appendChild(miBoton);
                    DOMcarrito.appendChild(miNodo);
                });
                // Renderizamos el precio total en el HTML
                DOMtotal.textContent = calcularTotal();
            }

            function borrarItemCarrito(evento) {
                // Obtenemos el producto ID que hay en el boton pulsado
                const id = evento.target.dataset.item;
                // Borramos todos los productos
                carrito = carrito.filter((carritoId) => {
                    return carritoId !== id;
                });
                // volvemos a renderizar
                renderizarCarrito();
                // Actualizamos el LocalStorage
                guardarCarritoEnLocalStorage();

            }

            function calcularTotal() {
                // Recorremos el array del carrito 
                return carrito.reduce((total, item) => {
                    // De cada elemento obtenemos su precio
                    const miItem = baseDeDatos.filter((itemBaseDatos) => {
                        return itemBaseDatos.id === parseInt(item);
                    });
                    // Los sumamos al total
                    return total + miItem[0].precio;
                }, 0).toFixed(2);
            }

            function vaciarCarrito() {
                // Limpiamos los productos guardados
                carrito = [];
                // Renderizamos los cambios
                renderizarCarrito();
                // Borra LocalStorage
                localStorage.clear();
            }

            function guardarCarritoEnLocalStorage () {
                miLocalStorage.setItem('carrito', JSON.stringify(carrito));
            }

            function cargarCarritoDeLocalStorage () {
                // ¿Existe un carrito previo guardado en LocalStorage?
                if (miLocalStorage.getItem('carrito') !== null) {
                    // Carga la información
                    carrito = JSON.parse(miLocalStorage.getItem('carrito'));
                }
            }

            // Eventos
            DOMbotonVaciar.addEventListener('click', vaciarCarrito);

             // Inicio
            cargarCarritoDeLocalStorage();
            renderizarProductos();
            renderizarCarrito();
        })
  
    .catch(function(error){
        console.error(error)
  })
}
