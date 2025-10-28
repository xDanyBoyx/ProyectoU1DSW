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
import bcrypt from "bcryptjs";


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
        billid: doc.data().billid
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
        billid: snapshot.data().billid
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
}) {
  try {
    const newProduct = {
      billid: randomUUID(),
      name,
      brand: brand || "",
      stock: Number(stock) || 0,
      price: Number(price),
      category: category || "",
      urlimg: urlimg || "https://picsum.photos/200", //PICSUM PARA FOTOS ALEATORIAS
      codesat: codesat || "",
    };

    const docRef = doc(productsCollection, randomUUID());
    await setDoc(docRef, newProduct);

    return {
      id: docRef.id,
      billid: newProduct.billid,
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
    const updatedData = {
      name: data.name ?? existingProduct.name,
      brand: data.brand ?? existingProduct.brand,
      stock: data.stock ?? existingProduct.stock,
      price: data.price ?? existingProduct.price,
      category: data.category ?? existingProduct.category,
      urlimg: data.urlimg ?? existingProduct.urlimg
    };

    await updateDoc(productRef, updatedData);
    return {
      id: productId,
      billid: existingProduct.billid,
      ...updatedData
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
