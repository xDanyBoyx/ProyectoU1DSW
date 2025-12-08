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
import { get } from "http";

const cartsCollection = collection(db, "carts");

const getAll = async () => {
    try {
        const snapshot = await getDocs(cartsCollection);
        const data = snapshot.docs;
        return data.map((doc) => {
            return {
                id: doc.id,
                user: doc.data().user,
                products: doc.data().products || [],
                subtotal: doc.data().subtotal || 0,
                iva: doc.data().iva || 0,
                total: doc.data().total || 0,
                createdAt: doc.data().createdAt,
                paidAt: doc.data().paidAt || null,
                id_facturapi: doc.data().id_facturapi || null,
                id_stripe: doc.data().id_stripe || null
            };
        });
    } catch (error) {
        console.error("❌ Error en archivo cart.model.js función getAll: ", error);
        throw new Error("Error al consultar la información.");
    }
};

const findById = async (cartId) => {
    try {
        const cartRef = doc(cartsCollection, cartId);
        const snapshot = await getDoc(cartRef);
        return snapshot.exists() ? {
            id: snapshot.id,
            user: snapshot.data().user,
            products: snapshot.data().products || [],
            subtotal: snapshot.data().subtotal || 0,
            iva: snapshot.data().iva || 0,
            total: snapshot.data().total || 0,
            createdAt: snapshot.data().createdAt,
            paidAt: snapshot.data().paidAt || null,
            id_facturapi: snapshot.data().id_facturapi || null,
            id_stripe: snapshot.data().id_stripe || null
        } : null;
    } catch (error) {
        console.error("❌ Error en archivo cart.model.js función findById: ", error);
        throw new Error("Error al consultar la información.");
    }
}

const createNewCart = async ({
    user,
    products,
    subtotal,
    iva,
    total,
    createdAt,
    paidAt,
    id_facturapi,
    id_stripe
}) => {

    try {

        const newCart = {
            user,
            products,
            subtotal,
            iva,
            total,
            createdAt,
            paidAt,
            id_facturapi,
            id_stripe
        };

        const newCartRef = doc(cartsCollection, randomUUID());
        await setDoc(newCartRef, newCart);

        return {
            id: newCartRef.id,
            ...newCart
        };

    } catch (error) {
        console.error("❌ Error en archivo cart.model.js función createNewCart: ", error);
        throw new Error("Error al crear el carrito.");
    }
};

const getCurrentCart = async (userId) => {
    try {
        const q = query(
            cartsCollection,
            where("user.id", "==", userId),
            where("paidAt", "==", null),
            limit(1)
        );
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
            return null;
        }
        const doc = snapshot.docs[0];
        return {
            id: doc.id,
            ...doc.data()
        };
    } catch (error) {
        console.error("❌ Error en archivo cart.model.js función getCurrentCart: ", error);
        throw new Error("Error al consultar la información.");
    }

};

const getProductsPriceByIds = async (productIds) => {

    try {
        const products = [];
        for (const productId of productIds) {
            const product = await findById(productId);
            if (product) {
                products.push(
                    {
                        id: product.id,
                        price: product.price
                    }
                );
            }
        }
        return products;
    } catch (error) {
        console.error("❌ Error en archivo product.model.js función getProductsPriceByIds: ", error);
        throw new Error("Error al consultar los precios de los productos.");
    }
};

const updateCart = async (cartId, data) => {
    try {
        const existingCart = await findById(cartId);
        if (!existingCart) return null;

        const cartRef = doc(cartsCollection, cartId);

        // Crear objeto solo con los campos definidos
        const updatedData = {};

        if (data.products !== undefined) updatedData.products = data.products;
        if (data.subtotal !== undefined) updatedData.subtotal = data.subtotal;
        if (data.iva !== undefined) updatedData.iva = data.iva;
        if (data.total !== undefined) updatedData.total = data.total;
        if (data.paidAt !== undefined) updatedData.paidAt = data.paidAt;
        if (data.id_facturapi !== undefined) updatedData.id_facturapi = data.id_facturapi;
        if (data.id_stripe !== undefined) updatedData.id_stripe = data.id_stripe;
        if (data.invoice_pdf !== undefined) updatedData.invoice_pdf = data.invoice_pdf;
        if (data.invoice_xml !== undefined) updatedData.invoice_xml = data.invoice_xml;

        // Verificar que hay campos para actualizar
        if (Object.keys(updatedData).length === 0) {
            return existingCart; // No hay cambios
        }

        await updateDoc(cartRef, updatedData);

        return {
            id: cartId,
            ...existingCart,
            ...updatedData
        };
    } catch (error) {
        console.error("❌ Error en archivo cart.model.js función updateCart: ", error);
        throw new Error("Error al actualizar el carrito.");
    }
};

export default {
    getAll,
    findById,
    createNewCart,
    getCurrentCart,
    updateCart,
};