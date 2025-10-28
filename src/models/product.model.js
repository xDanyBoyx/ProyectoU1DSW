// GENERADOR DE IDS ÚNICOS
const { randomUUID } = require("node:crypto");

// ARREGLO LOCAL PARA ALMACENAR PRODUCTOS
let products = [
  {
    billid: randomUUID(),
    productsid: randomUUID(),
    name: "Laptop HP Pavilion 15",
    brand: "HP",
    stock: 10,
    price: 15999.99,
    category: "Electrónica",
    urlimg: "https://picsum.photos/200",
    codesat: "43211503",
  },
];

//GET ALL
function findAll() {
  return products;
}

//GET ID
function findById(productsid) {
  return products.find((p) => p.productsid === productsid) || null;
}

//POST
function addProduct(data) {
  const nuevoProducto = {
    billid: randomUUID(),
    productsid: randomUUID(),
    name: data.name,
    brand: data.brand || "",
    stock: Number(data.stock) || 0,
    price: Number(data.price) || 0,
    category: data.category || "",
    urlimg: data.urlimg || "https://picsum.photos/200", //PICSUM PARA FOTOS ALEATORIAS
    codesat: data.codesat || "",
  };

  products.push(nuevoProducto);
  return nuevoProducto;
}

//PUT
function updateProduct(productsid, data) {
  const index = products.findIndex((p) => p.productsid === productsid);
  if (index === -1) return null;

  products[index] = {
    ...products[index],
    name: data.name ?? products[index].name,
    brand: data.brand ?? products[index].brand,
    stock: data.stock ?? products[index].stock,
    price: data.price ?? products[index].price,
    category: data.category ?? products[index].category,
    urlimg: data.urlimg ?? products[index].urlimg,
    codesat: data.codesat ?? products[index].codesat,
  };

  return products[index];
}

//DELETE
function deleteProduct(productsid) {
  const index = products.findIndex((p) => p.productsid === productsid);
  if (index === -1) return false;

  products.splice(index, 1);
  return true;
}

//FUNCIÓN DE FILTRADO
function filterProduct(filter = {}) {
  let result = products;

  if (filter.name) {
    const q = String(filter.name).toLowerCase();
    result = result.filter((p) => p.name.toLowerCase().includes(q));
  }

  if (filter.brand) {
    const q = String(filter.brand).toLowerCase();
    result = result.filter((p) => p.brand.toLowerCase().includes(q));
  }

  if (filter.category) {
    const q = String(filter.category).toLowerCase();
    result = result.filter((p) => p.category.toLowerCase().includes(q));
  }

  if (filter.codesat) {
    const q = String(filter.codesat).trim();
    result = result.filter((p) => p.codesat.includes(q));
  }

  if (filter.price) {
    const q = Number(filter.price);
    result = result.filter((p) => p.price === q);
  }

  if (filter.stock) {
    const q = Number(filter.stock);
    result = result.filter((p) => p.stock === q);
  }

  return result;
}

// EXPORTAR FUNCIONES
module.exports = {
  findAll,
  findById,
  addProduct,
  updateProduct,
  deleteProduct,
  filterProduct,
};
