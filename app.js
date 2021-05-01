// const button = document.getElementById('btn-ajax');
const inputBuscador = document.getElementById('BuscadorElemento');
// Fetch es la version actual del objeto xmlhttprequest


const numeroOxigenos = document.getElementById('numeroOxigenos')


numeroOxigenos.addEventListener('change', () => {
    document.getElementById("subIndiceOxigeno").innerHTML = numeroOxigenos.value
})


const numeroElementos = document.getElementById('numeroElementos')


numeroElementos.addEventListener('change', () => {
    document.getElementById("subIndiceElemento").innerHTML = numeroElementos.value
})

inputBuscador.addEventListener('keyup', () => {

    // Por defecto fetch usa Get
    // .json() reemplaza al json parse
    fetch('./api.php?numeroAtomico=' + inputBuscador.value)
        // fetch('https://neelpatel05.pythonanywhere.com')

        .then(res => res.ok ? Promise.resolve(res) : Promise.reject(res))
        .then(res => res.json())
        .then(res => {
            const list = document.getElementById('list');


            if (res.message == "does not exists") {
                list.innerHTML = "<tr><td colspan='3'> No se encontró el elemento </td></tr>"
            } else {
                const fragment = document.createDocumentFragment();

                list.innerHTML = ""

                const fila = document.createElement('tr');
                const columna1 = document.createElement('td');
                const columna2 = document.createElement('td');
                const columna3 = document.createElement('td');
                const boton = document.createElement('button');


                boton.textContent = 'Agregar'
                boton.id = "boton-agregar"
                boton.value = res.atomicNumber

                columna1.textContent = `${res.symbol}`
                columna2.textContent = `${res.oxidationStates}`
                columna3.innerHTML = `<button value='${res.atomicNumber}' onclick='refrescarCampos(event)'>Agregar</button>`;

                const btnValidar = document.getElementById('btn-validar')

                btnValidar.value = res.atomicNumber
                btnValidar.setAttribute('onClick', 'refrescarCampos(event)')

                fila.appendChild(columna1)
                fila.appendChild(columna2)
                fila.appendChild(columna3)


                fragment.appendChild(fila);

                list.appendChild(fragment);
            }


        })
})

function refrescarCampos(e) {
    const numeroAtomico = e.target.value

    fetch('./api.php?numeroAtomico=' + numeroAtomico)
        // fetch('https://neelpatel05.pythonanywhere.com')

        .then(res => res.ok ? Promise.resolve(res) : Promise.reject(res))
        .then(res => res.json())
        .then(res => {
            document.getElementById('numeroAtomicoElemento').value = res.atomicNumber
            document.getElementById('elemento').innerText = res.symbol
            document.getElementById('metal').value = res.bondingType

            let estadosOxidacion = String(res.oxidationStates).split(",")
            let oxigenos = document.getElementById("subIndiceOxigeno").textContent
            let numeroElementos = document.getElementById("subIndiceElemento").textContent
            const electronegatividad = oxigenos * 2

            const estado = document.getElementById('estado')

            let oxidacionUtilizada = 0

            // numeroElementos(oxidacion) - numeroOxigenos(2) = 0
            // 
            for (let index = 0; index < estadosOxidacion.length; index++) {

                numero = estadosOxidacion[index]
                if ((electronegatividad / numeroElementos) == numero) {
                    oxidacionUtilizada = numero

                    console.log(oxidacionUtilizada)

                    estado.innerHTML = "Valido"

                    break;
                } else {
                    estado.innerHTML = "No valido"
                }

            }


        })
}