//VARIABLES GLOBALES
let totalSinDescuento=0;
let nombre=document.getElementById("nombre"); 
let apellido = document.getElementById("apellido"); 
let documento = document.getElementById("documento"); 
let telefono = document.getElementById("telefono"); 
let mail = document.getElementById("mail");
let domicilio = document.getElementById("domicilio"); 
let localidad = document.getElementById("localidad"); 
let cantHuespedes= document.getElementById("cant-huespedes"); 
let cantDias = document.getElementById("cant-dias"); 
let elegirCabana= document.getElementById("numero-cabana"); 
let contenedorDiv="";
let ocupada;
const precioPorPersona=3000;
const porcentajeDias=0.15;
const porcentajePersonas=0.10;


//ARRAYS
const listaHuespedes = [];
const listaCabanas = [];

//CLASES
class Huesped {
    constructor(nombre,apellido,documento,telefono,mail,domicilio,localidad,totHuespedes,totDias,cabanaReservada){
        this.nombre=nombre;
        this.apellido=apellido;
        this.documento=documento;
        this.telefono=telefono;
        this.mail=mail;
        this.domicilio=domicilio;
        this.localidad=localidad;
        this.cantHuespedes=totHuespedes;
        this.cantDias=totDias
        this.cabanaReservada=cabanaReservada;
    } 
}

class Cabana {
    constructor(idCabana,libre){
        this.idCabana=idCabana;
        this.estado=libre;
    }
}

//llena el array de cabañas
listaCabanas.push(new Cabana(1,"libre"))
listaCabanas.push(new Cabana(2,"libre"))
listaCabanas.push(new Cabana(3,"libre"))
listaCabanas.push(new Cabana(4,"libre"))
listaCabanas.push(new Cabana(5,"libre"))
listaCabanas.push(new Cabana(6,"libre"))

//Recupera los datos de las reservas del localStorage
if(localStorage.getItem("listaHuespedes")!=null){
    const huespedStorage=JSON.parse(localStorage.getItem("listaHuespedes"));
    for (const hRecuperado of huespedStorage) {
        listaHuespedes.push(new Huesped(hRecuperado.nombre,hRecuperado.apellido,hRecuperado.documento,hRecuperado.telefono,hRecuperado.mail,hRecuperado.domicilio,hRecuperado.localidad,
            hRecuperado.cantHuespedes,hRecuperado.cantDias,hRecuperado.cabanaReservada));

            //Verifica si las cabañas ya se encuentran reservadas
            for (const cabana of listaCabanas) {

                const {idCabana} = cabana;
                if(idCabana==hRecuperado.cabanaReservada){
                    cabana.estado="ocupada";
                }
            }
    }
     
    //Carga los datos de las reservas en la tabla
     for (const huesped of listaHuespedes) {
         document.getElementById("tablabody").innerHTML+=`
         <tr>
             <td>${huesped.cabanaReservada}</td>
             <td>${huesped.nombre.toUpperCase()+' '+huesped.apellido.toUpperCase()}</td>
             <td>${huesped.documento}</td>
             <td>${huesped.cantHuespedes}</td>
             <td>${huesped.cantDias}</td>
         </tr>
          `;
     }


}

//Eventos de botones
let botonIngresar = document.getElementById("botonIngresar");
botonIngresar.addEventListener("click",ingresarHuesped);

let botonLimpiar = document.getElementById("botonLimpiar");
botonLimpiar.addEventListener("click",limpiarFormulario);

let botonCalcular = document.getElementById("botonCalcular");
botonCalcular.addEventListener("click",imprimeTotales);


//FUNCIONES
function precioPorEstadia(cantHuesp,cantDias,precioPorPers){
    return ((cantHuesp*precioPorPers)*cantDias);
}

function descPorDias(total,porcentaje){
    return total*porcentaje;
}

function descPorPersonas(total,porcentaje){
    return total*porcentaje;
}

function calcularTotalEstadia(...numeros){
    return numeros.reduce((acc,n)=>acc-n,totalSinDescuento);
}

function muestraCabanasLibres(){

    for (const cabana of cabanasLibres) {
        document.getElementById("tablabodyCabanas").innerHTML+=`
            <tr>
                <td>${cabana.idCabana}</td>
                <td>${cabana.estado.toUpperCase()}</td>
            </tr>
        `;
    }
}



function imprimeTotales(){
    cantHuespedes =parseInt(document.getElementById("cant-huespedes").value);
    cantDias = parseInt(document.getElementById("cant-dias").value);

    totalSinDescuento = precioPorEstadia(cantHuespedes,cantDias,precioPorPersona);
    document.getElementById("total-sin-desc").value= totalSinDescuento;

    (cantHuespedes>3) ? document.getElementById("desc-huespedes").value = descPorPersonas(totalSinDescuento,porcentajePersonas) : document.getElementById("desc-huespedes").value = 0 ;

    (cantDias>6) ? document.getElementById("desc-dias").value =descPorDias(totalSinDescuento,porcentajeDias) : document.getElementById("desc-dias").value =0; 

    document.getElementById("total").value = calcularTotalEstadia (document.getElementById("desc-dias").value, document.getElementById("desc-huespedes").value) ;

}

function limpiarFormulario(){
    document.getElementById("nombre").value = "";
    document.getElementById("apellido").value = "";
    document.getElementById("documento").value = "";
    document.getElementById("telefono").value = "";
    document.getElementById("mail").value = "";
    document.getElementById("domicilio").value = "";
    document.getElementById("localidad").value = "";
    document.getElementById("cant-huespedes").value = "";
    document.getElementById("cant-dias").value = "";
    document.getElementById("numero-cabana").value = "";
    document.getElementById("total-sin-desc").value= "";
    document.getElementById("desc-huespedes").value = "";
    document.getElementById("desc-dias").value = "";
    document.getElementById("total").value = "";
    contenedorDiv.innerText="";
}

//Valida si la cabaña se encuentra libre o existe
function validarCabana(numCabana){

    let cabanaEncontrada=listaCabanas.find((c) => c.idCabana === numCabana);

    cabanaEncontrada ? (cabanaEncontrada.estado=="libre" ? ocupada= true :  (ocupada=false, alert("La cabaña ingresada se encuentra ocupada.")) ) : (ocupada=false,alert("La cabaña ingresada no existe."));

    return ocupada;
}

function validarFormulario(){

    ((nombre==null)||(nombre==''))  &&  alert("Debe ingresar un nombre.");
    ((apellido==null)||(apellido=='')) && alert("Debe ingresar un apellido.");
    ((mail==null)||(mail=='')) && alert("Debe ingresar un mail válido.");
    ((domicilio==null)||(domicilio=='')) && alert("Debe ingresar un domicilio válido.");
    ((localidad==null)||(localidad=='')) && alert("Debe ingresar una localidad válida.");
    
}

function ingresarHuesped(){

    ocupada= true;    
    
    nombre=document.getElementById("nombre").value; 
    apellido = document.getElementById("apellido").value; 
    documento = parseInt(document.getElementById("documento").value); 
    telefono = parseInt(document.getElementById("telefono").value); 
    mail = document.getElementById("mail").value;
    domicilio = document.getElementById("domicilio").value; 
    localidad = document.getElementById("localidad").value; 
    cantHuespedes= parseInt(document.getElementById("cant-huespedes").value); 
    cantDias = parseInt(document.getElementById("cant-dias").value); 
    elegirCabana= parseInt(document.getElementById("numero-cabana").value) ; 

    validarFormulario();

    validarCabana(elegirCabana);


    if(ocupada==false){
        //Si la cabaña seleccionada se encuentra ocupada pide ingresar otra.
        alert("Debe ingresar otra cabaña.");
    }else{
        //Si la cabaña se encuentra desocupada realiza la reserva.
        let huesped = new Huesped(nombre,apellido,documento,telefono,mail,domicilio,localidad,cantHuespedes,cantDias,elegirCabana);

        listaHuespedes.push(huesped);
    
        let indice = listaCabanas.findIndex((c) => c.idCabana === elegirCabana);
        listaCabanas[indice].estado = "ocupada";
        alert("Se ha reservado la cabaña "+listaCabanas[indice].idCabana);
      

        document.getElementById("tablabody").innerHTML+=`
            <tr>
                <td>${huesped.cabanaReservada}</td>
                <td>${huesped.nombre.toUpperCase()+' '+huesped.apellido.toUpperCase()}</td>
                <td>${huesped.documento}</td>
                <td>${huesped.cantHuespedes}</td>
                <td>${huesped.cantDias}</td>
            </tr>
        `;
        
        //Carga los datos de la reserva en el localStorage
        localStorage.setItem("listaHuespedes",JSON.stringify(listaHuespedes));
    
        imprimeTotales(huesped.cantHuespedes,huesped.cantDias);
    }
    
}


const cabanasLibres=listaCabanas.filter((cl) =>cl.estado=="libre");

muestraCabanasLibres();



