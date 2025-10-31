//IMPORTAMOS DEPENDENCIAS
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
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

const usersCollection = collection(db, "users");

//GET ALL
async function findAll() {
  try {
    const snapshot = await getDocs(usersCollection);
    const data = snapshot.docs;
    return data.map((doc) => {
      return {
        id: doc.id,
        mail: doc.data().mail,
        name: doc.data().name,
        domicile: doc.data().domicile,
        role: doc.data().role,
        rfc: doc.data().rfc,
        rf : doc.data().rf,
        phone: doc.data().phone,
        //password: doc.data().password,
        id_facturapi: doc.data().id_facturapi,
      };
    });
  } catch (error) {
    console.error("❌ Error en archivo user.model.js función findAll: ", error);
    throw new Error("Error al consultar la información.");
  }
}

//GET ID
async function findById(userId) {
  try {
    const userRef = doc(usersCollection, userId);
    const snapshot = await getDoc(userRef);
    return snapshot.exists() ?
      {
        id: snapshot.id,
        mail: snapshot.data().mail,
        name: snapshot.data().name,
        domicile: snapshot.data().domicile,
        role: snapshot.data().role,
        rfc: snapshot.data().rfc,
        rf : doc.data().rf,
        phone: doc.data().phone,
        //password: snapshot.data().password,
        id_facturapi: snapshot.data().id_facturapi,
      }
      : null;
  } catch (error) {
    console.error("❌ Error en archivo user.model.js función findById: ", error);
    throw new Error("Error al consultar la información.");
  }
}

//FUNCIÓN PARA BUSCAR USUARIOS POR CORREO
async function findByMail(mail) {
  try {
    const q = query(usersCollection, where("mail", "==", mail), limit(1));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    const docSnap = querySnapshot.docs[0];
    const data = docSnap.data();
    return {
      id: docSnap.id,
      password: data.password, // importante para verificar contraseña en api de login
    };
  } catch (error) {
    console.error("❌ Error en archivo user.model.js función findByMail: ", error);
    throw new Error("Error al consultar la información.");
  }
}

//POST
async function addUser({
  name,
  password,
  mail,
  role,
  domicile,
  rfc,
  rf, // régimen fiscal
  phone,
  id_facturapi
}) {
  try {
    const existingUser = await findByMail(mail);
    if (existingUser) return null;

    const newUser = {
      mail,
      name,
      password: await bcrypt.hash(password, 10),
      role,
      domicile, // es un objeto
      rfc,
      rf,
      phone,
      id_facturapi,
    };

    const docRef = doc(usersCollection, randomUUID());
    await setDoc(docRef, newUser);

    return {
      id: docRef.id,
      mail: newUser.mail,
      name: newUser.name,
      role: newUser.role,
      domicile: newUser.domicile,
      rfc: newUser.rfc,
      rf: newUser.rf, 
      phone: newUser.phone, 
      id_facturapi: newUser.id_facturapi
    };
  } catch (error) {
    console.error("❌ Error en archivo user.model.js función addUser: ", error);
    throw new Error("Error al crear el usuario.");
  }
}

//PUT
async function updateUser(userId, data) {
  try {
    const existingUser = await findById(userId);
    if (!existingUser) return null;
    const userRef = doc(usersCollection, userId);

    const updatedData = {};

    if (data.mail !== undefined) updatedData.mail = data.mail;
    if (data.name !== undefined) updatedData.name = data.name;
    if (data.role !== undefined) updatedData.role = data.role;
    if (data.domicile !== undefined) updatedData.domicile = data.domicile;
    if (data.rfc !== undefined) updatedData.rfc = data.rfc;

    // Manejar password solo si se proporciona
    if (data.password) {
      updatedData.password = await bcrypt.hash(data.password, 10);
    }

    // Verificar que hay campos para actualizar
    if (Object.keys(updatedData).length === 0) {
      return existingUser; // No hay cambios
    }

    await updateDoc(userRef, updatedData);

    return {
      id: userId,
      mail: updatedData.mail ?? existingUser.mail,
      name: updatedData.name ?? existingUser.name,
      role: updatedData.role ?? existingUser.role,
      domicile: updatedData.domicile ?? existingUser.domicile,
      rfc: updatedData.rfc ?? existingUser.rfc,
      rf: updatedData.rf ?? existingUser.rf, 
      phone: updatedData.phone ?? existingUser.phone, 
      id_facturapi: existingUser.id_facturapi
    };
  } catch (error) {
    console.error("❌ Error en archivo user.model.js función updateUser: ", error);
    throw new Error("Error al actualizar el usuario.");
  }
}

//DELETE
async function deleteUser(userid) {
  try {
    const userRef = doc(usersCollection, userid);
    const snapshot = await getDoc(userRef);
    if (!snapshot.exists()) return false;
    await deleteDoc(userRef);
    return true;
  } catch (error) {
    console.error("❌ Error en archivo user.model.js función deleteUser: ", error);
    throw new Error("Error al eliminar el usuario.");
  }
}

//FUNCIÓN DE FILTRADO
async function filterUser(filter = {}) {
  try {
    const snapshot = await getDocs(usersCollection);
    const docs = snapshot.docs.map((d) => ({ 
      id: d.id, 
      mail: d.mail,
      name: d.name,
      role: d.role,
      domicile: d.domicile,
      rfc: d.rfc,
      rf: d.rf, 
      phone: d.phone, 
      id_facturapi: d.id_facturapi 
    }));

    let result = docs;

    if (filter.name) {
      const q = String(filter.name).toLowerCase();
      result = result.filter((u) => (u.name || "").toLowerCase().includes(q));
    }

    if (filter.mail) {
      const q = String(filter.mail).toLowerCase();
      result = result.filter((u) => (u.mail || "").toLowerCase().includes(q));
    }

    if (filter.role) {
      const q = String(filter.role).toLowerCase();
      result = result.filter((u) => (u.role || "").toLowerCase().includes(q));
    }

    if (filter.domicile) {
      const q = String(filter.domicile).toLowerCase();
      result = result.filter((u) =>
        JSON.stringify(u.domicile || {}).toLowerCase().includes(q)
      );
    }

    if (filter.rfc) {
      const q = String(filter.rfc).toLowerCase();
      result = result.filter((u) => (u.rfc || "").toLowerCase().includes(q));
    }

    if (filter.rf) {
      const q = String(filter.rf).toLowerCase();
      result = result.filter((u) => (u.rf || "").toLowerCase().includes(q));
    }

    if (filter.phone) {
      const q = String(filter.phone).toLowerCase();
      result = result.filter((u) => (u.phone || "").toLowerCase().includes(q));
    }

    return result;
  } catch (error) {
    console.error("❌ Error en archivo user.model.js función filterUser: ", error);
    throw new Error("Error al filtrar usuarios.");
  }
}

export default {
  findAll,
  findById,
  findByMail,
  addUser,
  updateUser,
  deleteUser,
  filterUser,
};
