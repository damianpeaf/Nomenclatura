// const button = document.getElementById('btn-ajax');
const inputBuscador = document.getElementById('BuscadorElemento');
// Fetch es la version actual del objeto xmlhttprequest
const estado = document.getElementById('estado')


const btnNombrar = document.getElementById('btn-nombrar')
btnNombrar.style.display = "none"


const numeroOxigenos = document.getElementById('numeroOxigenos')


numeroOxigenos.addEventListener('change', () => {
    document.getElementById("subIndiceOxigeno").innerHTML = numeroOxigenos.value
    btnNombrar.style.display = "none"
    estado.innerHTML = ""

})


const numeroElementos = document.getElementById('numeroElementos')


numeroElementos.addEventListener('change', () => {
    document.getElementById("subIndiceElemento").innerHTML = numeroElementos.value
    btnNombrar.style.display = "none"
    estado.innerHTML = ""


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


            let oxidacionUtilizada = 0

            // numeroElementos(oxidacion) - numeroOxigenos(2) = 0
            // 
            for (let index = 0; index < estadosOxidacion.length; index++) {

                numero = estadosOxidacion[index]
                if ((electronegatividad / numeroElementos) == numero) {
                    oxidacionUtilizada = numero

                    console.log(oxidacionUtilizada)

                    estado.innerHTML = "Valido"
                    btnNombrar.style.display = "initial"

                    document.getElementById('valenciaUtilizada').value = oxidacionUtilizada

                    break;
                } else {
                    estado.innerHTML = "No valido"

                    btnNombrar.style.display = "none"
                }

            }


        })
}

function nombrarElemento(e) {

    //oxido o Anhídrido

    const numeroAtomico = document.getElementById('btn-validar').value
    const valenciaUtilizada = document.getElementById('valenciaUtilizada').value
    const tipo = document.getElementById('metal').value


    let prefijo = ''
    let sufijo = ''
    let nombreGeneral = ''

    fetch('./api.php?numeroAtomico=' + numeroAtomico)
        // fetch('https://neelpatel05.pythonanywhere.com')

        .then(res => res.ok ? Promise.resolve(res) : Promise.reject(res))
        .then(res => res.json())
        .then(res => {

            let estadosOxidacion = String(res.oxidationStates).split(",")

            for (let index = 0; index < estadosOxidacion.length; index++) {
                const element = estadosOxidacion[index];

                estadosOxidacion[index] = parseInt(element)

                if (element < 0) {
                    estadosOxidacion[index] = element * -1
                }
            }

            estadosOxidacion = estadosOxidacion.sort()
            console.log(estadosOxidacion)

            let nombreEspecifico = res.name


            if (tipo == 'metallic') {

                console.log('Es metalico')

                if (valenciaUtilizada > 3) {
                    nombreGeneral = ' Anhidrido '

                    //segun los rangos
                    if (valenciaUtilizada == 1 || valenciaUtilizada == 2) {
                        prefijo = 'hipo'
                        sufijo = 'oso'
                    } else if (valenciaUtilizada == 3 || valenciaUtilizada == 4) {
                        sufijo = 'oso'
                    } else if (valenciaUtilizada == 5 || valenciaUtilizada == 6) {
                        sufijo = 'ico'
                    } else {
                        prefijo = 'per'
                        sufijo = 'ico'
                    }

                } else {
                    nombreGeneral = ' Oxido '

                    //valencia unica
                    if (estadosOxidacion.length == 1) {
                        sufijo = 'ico'
                    } else {

                        //valencia mayor o menor
                        if (valenciaUtilizada == estadosOxidacion[0]) {
                            sufijo = 'oso'
                        } else {
                            sufijo = 'ico'
                        }

                    }

                }

            } else {
                columna = estadosOxidacion[estadosOxidacion.length - 1]

                console.log('No es metalico')
                console.log('Columna ' + columna)
                console.log('valencia ' + valenciaUtilizada)

                //par e impar
                if ((columna % 2 == 0 && valenciaUtilizada % 2 == 0) || (columna % 2 != 0 && valenciaUtilizada % 2 != 0)) {
                    nombreGeneral = ' Anhidrido '

                    //segun los rangos
                    if (valenciaUtilizada == 1 || valenciaUtilizada == 2) {
                        prefijo = 'hipo'
                        sufijo = 'oso'
                    } else if (valenciaUtilizada == 3 || valenciaUtilizada == 4) {
                        sufijo = 'oso'
                    } else if (valenciaUtilizada == 5 || valenciaUtilizada == 6) {
                        sufijo = 'ico'
                    } else {
                        prefijo = 'per'
                        sufijo = 'ico'
                    }

                } else {
                    nombreGeneral = ' Oxido '

                    //valencia unica
                    if (estadosOxidacion.length == 1) {
                        sufijo = 'ico'
                    } else {

                        //segun los rangos
                        if (valenciaUtilizada == 1 || valenciaUtilizada == 2) {
                            prefijo = 'hipo'
                            sufijo = 'oso'
                        } else if (valenciaUtilizada == 3 || valenciaUtilizada == 4) {
                            sufijo = 'oso'
                        } else if (valenciaUtilizada == 5 || valenciaUtilizada == 6) {
                            sufijo = 'ico'
                        } else {
                            prefijo = 'per'
                            sufijo = 'ico'
                        }

                    }

                }

            }

            //fin de la regla

            let nombreCompuesto = nombreGeneral + prefijo + nombreEspecifico + sufijo

            document.getElementById('nombre-compuesto').innerHTML = nombreCompuesto

        })

}