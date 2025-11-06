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

const cartCollection = collection(db, "carts");

const Cart = {
  async addCart(cartData) {
    const docRef = await addDoc(cartCollection, cartData);
    const newDoc = await getDoc(docRef);
    return { id: docRef.id, ...newDoc.data() };
  },

  async findAll() {
    const snapshot = await getDocs(cartCollection);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  async findById(id) {
    const docRef = doc(db, "carts", id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  },

  async updateCart(id, data) {
    const docRef = doc(db, "carts", id);
    await updateDoc(docRef, data);
    const updatedSnap = await getDoc(docRef);
    return { id, ...updatedSnap.data() };
  },

  async updatePaid(id, paid) {
    const docRef = doc(db, "carts", id);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      throw new Error("Carrito no encontrado");
    }

    await updateDoc(docRef, { paid });

    const updatedSnap = await getDoc(docRef);
    return { id, ...updatedSnap.data() };
  },

  async deleteCart(id) {
    const docRef = doc(db, "carts", id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return false;
    await deleteDoc(docRef);
    return true;
  }
};

export default Cart;