const socketClient = io()

socketClient.on("productsSend", (obj) => {
    updateProducts(obj)
});

function updateProducts(products) {
    let container = document.getElementById("list-products");
    let productos = "";
    
    products.forEach((product) => {
        productos += `
        <h1>${product.title}</h1>
        <h3>${product.description}</h3>
        <h5>${product.price}</h5>
        <h7>${product.id}</h7>
        <button>Comprar YA</button>`
    });

    container.innerHTML = productos;
};

let form = document.getElementById("formProduct");
form.addEventListener("submit", (evt) => {
    evt.preventDefault();

    let title = form.elements.title.value;
    let description = form.elements.description.value;
    let stock = form.elements.stock.value;
    let thumbnail = form.elements.thumbnail.value;
    let category = form.elements.category.value;
    let price = form.elements.price.value;
    let code = form.elements.code.value;

    socketClient.emit("addProduct", {
        title, description, stock, thumbnail, category, price, code,
    });
    form.reset();
});

document.getElementById("delete-btn").addEventListener("click", function() {
    const deleteIdInput = document.getElementById("id-prod");
    const deleteId = parseInt(deleteIdInput.value);
    socketClient.emit("deleteProduct", deleteId);
    deleteIdInput.value = "";
});

socketClient.on("productosUpdated", (obj) => {
    updateProductsList(obj);
})