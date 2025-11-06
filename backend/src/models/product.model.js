import { db } from "../db/firebase.js";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";

const productCollection = collection(db, "products");

const Product = {
  // Crear producto
  async addProduct(productData) {
    const docRef = await addDoc(productCollection, productData);
    const newDoc = await getDoc(docRef);
    return { id: docRef.id, ...newDoc.data() };
  },

  // Obtener todos los productos
  async findAll() {
    const snapshot = await getDocs(productCollection);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  // Buscar producto por ID
  async findById(id) {
    const docRef = doc(db, "products", id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  },

  // Actualizar producto
  async updateProduct(id, data) {
    const docRef = doc(db, "products", id);
    await updateDoc(docRef, data);
    const updatedSnap = await getDoc(docRef);
    return { id, ...updatedSnap.data() };
  },

  // Eliminar producto
  async deleteProduct(id) {
    const docRef = doc(db, "products", id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return false;
    await deleteDoc(docRef);
    return true;
  },

  // (Opcional) Filtrar productos por campo
  async filterProduct(filters) {
    // Simple: busca por coincidencia exacta
    const all = await this.findAll();
    return all.filter((p) =>
      Object.entries(filters).every(([key, value]) => p[key] == value)
    );
  }
};

export default Product;