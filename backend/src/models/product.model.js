// GENERADOR DE IDS ÚNICOS
import { randomUUID } from "crypto";
import { db } from "../db/firebase.js";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  setDoc,
  limit,
  updateDoc,
  deleteDoc
} from "firebase/firestore";


const productsCollection = collection(db, "products");

//GET ALL
async function findAll() {
  try {
    const snapshot = await getDocs(productsCollection);
    const data = snapshot.docs;
    return data.map((doc) => {
      return {
        id: doc.id,
        name: doc.data().name,
        brand: doc.data().brand,
        stock: doc.data().stock,
        price: doc.data().price,
        category: doc.data().category,
        urlimg: doc.data().urlimg,
        codesat: doc.data().codesat,
        id_facturapi: doc.data().id_facturapi || null
      };
    });
  } catch (error) {
    console.error("Error en archivo product.model.js función findAll: ", error);
    throw new Error("Error al consultar la información.");
  }
}

//GET ID
async function findById(productId) {
  try {
    const productRef = doc(productsCollection, productId);
    const snapshot = await getDoc(productRef);
    return snapshot.exists() ?
      {
        id: snapshot.id,
        name: snapshot.data().name,
        brand: snapshot.data().brand,
        stock: snapshot.data().stock,
        price: snapshot.data().price,
        category: snapshot.data().category,
        urlimg: snapshot.data().urlimg,
        codesat: snapshot.data().codesat,
        id_facturapi: snapshot.data().id_facturapi || null
      }
      : null;
  } catch (error) {
    console.error("Error en archivo product.model.js función findById: ", error);
    throw new Error("Error al consultar la información.");
  }
}

//POST
async function addProduct({
  name,
  brand,
  stock,
  price,
  category,
  urlimg,
  codesat,
  id_facturapi
}) {
  try {
    const newProduct = {
      id_facturapi,
      name,
      brand: brand || "",
      stock: Number(stock) || 1,
      price: Number(price),
      category: category || "",
      urlimg: urlimg || "https://picsum.photos/200", //PICSUM PARA FOTOS ALEATORIAS
      codesat: codesat || "",
    };

    const docRef = doc(productsCollection, randomUUID());
    await setDoc(docRef, newProduct);

    return {
      id: docRef.id,
      id_facturapi: newProduct.id_facturapi,
      name: newProduct.name,
      brand: newProduct.brand,
      stock: newProduct.stock,
      price: newProduct.price,
      category: newProduct.category,
      urlimg: newProduct.urlimg,
      codesat: newProduct.codesat,
    };
  } catch (error) {
    console.error("Error en archivo product.model.js función addProduct: ", error);
    throw new Error("Error al crear producto.");
  }


}

//PUT
async function updateProduct(productId, data) {
  try {
    const existingProduct = await findById(productId);
    if (!existingProduct) return null;

    const productRef = doc(productsCollection, productId);
    
    // Crear objeto solo con los campos definidos
    const updatedData = {};
    
    if (data.name !== undefined) updatedData.name = data.name;
    if (data.brand !== undefined) updatedData.brand = data.brand;
    if (data.stock !== undefined) updatedData.stock = data.stock;
    if (data.price !== undefined) updatedData.price = data.price;
    if (data.category !== undefined) updatedData.category = data.category;
    if (data.urlimg !== undefined) updatedData.urlimg = data.urlimg;
    
    // Verificar que hay campos para actualizar
    if (Object.keys(updatedData).length === 0) {
      return existingProduct; // No hay cambios
    }

    await updateDoc(productRef, updatedData);
    
    return {
      id: productId,
      billid: existingProduct.billid,
      name: updatedData.name ?? existingProduct.name,
      brand: updatedData.brand ?? existingProduct.brand,
      stock: updatedData.stock ?? existingProduct.stock,
      price: updatedData.price ?? existingProduct.price,
      category: updatedData.category ?? existingProduct.category,
      urlimg: updatedData.urlimg ?? existingProduct.urlimg
    };
  } catch (error) {
    console.error("Error en archivo product.model.js función updateProduct: ", error);
    throw new Error("Error al actualizar el producto.");
  }
}

//DELETE
async function deleteProduct(productId) {
  try {
    const productRef = doc(productsCollection, productId);
    const snapshot = await getDoc(productRef);
    if (!snapshot.exists()) return false;
    
    await deleteDoc(productRef);
    return true;
  } catch (error) {
    console.error("Error en archivo product.model.js función deleteProduct: ", error);
    throw new Error("Error al eliminar el producto.");
  }
}

//FUNCIÓN DE FILTRADO
async function filterProduct(filter = {}) {
  try {
    const snapshot = await getDocs(productsCollection);
    const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

    let result = docs;

    if (filter.name) {
      const q = String(filter.name).toLowerCase();
      result = result.filter((p) => (p.name || "").toLowerCase().includes(q));
    }

    if (filter.brand) {
      const q = String(filter.brand).toLowerCase();
      result = result.filter((p) => (p.brand || "").toLowerCase().includes(q));
    }

    if (filter.category) {
      const q = String(filter.category).toLowerCase();
      result = result.filter((p) => (p.category || "").toLowerCase().includes(q));
    }

    if (filter.codesat) {
      const q = String(filter.codesat).trim();
      result = result.filter((p) => (p.codesat || "").includes(q));
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
  } catch (error) {
    console.error("Error en archivo product.model.js función filterProduct: ", error);
    throw new Error("Error al filtrar productos.");
  }
}

// EXPORTAR FUNCIONES (ESM)
export default {
  findAll,
  findById,
  addProduct,
  updateProduct,
  deleteProduct,
  filterProduct,
};
