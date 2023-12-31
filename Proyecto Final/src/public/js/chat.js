const socketClient=io()
const nombreUsuario=document.getElementById("nombreusuario")
const formulario=document.getElementById("formulario")
const inputmensaje=document.getElementById("mensaje")
const chat=document.getElementById("chat")

let usuario=null

if(!usuario){
    Swal.fire({
        title:"Bienvenido a IñaChat",
        text:"Ingresa tu nombre",
        input:"text",
        inputValidator:(value)=>{
            if(!value){
                return "Necesitas ingresar tu Nombre"
            }
        }
    })
    .then(username=>{
        usuario=username.value
        nombreUsuario.innerHTML = `Bienvenido ${usuario}`
        socketClient.emit("nuevousuario",usuario)
    })
}

formulario.onsubmit=(e)=>{
    e.preventDefault()
    const info={
        user:usuario,
        message:inputmensaje.value
    }
    console.log(info)
    socketClient.emit("mensaje",info)
    inputmensaje.value=" "

}

 socketClient.on("chat",mensaje=>{
   const chatrender=mensaje.map(e=>{
    return `<p><strong>${e.user}</strong>${e.message}`}).join(" ")
   chat.innerHTML=chatrender
});

 socketClient.on("broadcast",usuario=>{
    Toastify({
        text:`Ingreso ${usuario} al chat`,
        duration:5000,
        position:'right',
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          }
    }).showToast()
});

document.getElementById("clearChat").addEventListener("click", () => {
    document.getElementById("chat").textContent = "";
    socketClient.emit("clearchat");
});