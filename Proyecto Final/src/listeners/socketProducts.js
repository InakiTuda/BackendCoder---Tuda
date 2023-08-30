import ProductManager from "../dao/mongomanagers/productManagerMongo.js";

const pm = new ProductManager();

const socketProducts = (socketServer) => {
    socketServer.on("connection",async(socket)=>{
        console.log("Cliente conectado con ID:", socket.id)
            const listaProducts = await pm.getProductsView()
        socketServer.emit("enviodeproducts", listaProducts)
    
        socket.on("addProduct",async(obj)=> {
        await pm.addProduct(obj)
        const listaProducts = await pm.getProductsView()
        socketServer.emit("enviodeproducts", listaProducts)
        })
    
        socket.on("deleteProduct",async(id)=> {
            console.log(id)
            await pm.deleteProduct(id)
            const listaProducts = await pm.getProductsView()
            socketServer.emit("enviodeproducts", listaProducts)
        })
    
        socket.on("nuevousuario",(usuario)=> {
            console.log("usuario" ,usuario)
            socket.broadcast.emit("broadcast",usuario)
            })
            socket.on("disconnect",()=>{
                console.log(`Usuario con ID : ${socket.id} se desconectó`)
            })
    })
};

export default socketProducts;