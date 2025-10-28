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
        //password: doc.data().password,
        billid: doc.data().billid
      };
    });
  } catch (error) {
    console.error("Error en archivo user.model.js función findAll: ", error);
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
        //password: snapshot.data().password,
        billid: snapshot.data().billid
      }
      : null;
  } catch (error) {
    console.error("Error en archivo user.model.js función findById: ", error);
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
      mail: data.mail,
      name: data.name,
      domicile: data.domicile,
      role: data.role,
      rfc: data.rfc,
      password: data.password,
      billid: data.billid,
    };
  } catch (error) {
    console.error("Error en archivo user.model.js función findByMail: ", error);
    throw new Error("Error al consultar la información.");
  }
}

//POST
async function addUser({
  name,
  password,
  mail,
  role = "cliente",
  domicile = "",
  rfc = "",
}) {
  try {
    const existingUser = await findByMail(mail);
    if (existingUser) return null;

    const newUser = {
      mail,
      name,
      password: await bcrypt.hash(password, 10),
      role,
      domicile,
      rfc,
      billid: randomUUID()
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
      billid: newUser.billid
    };
  } catch (error) {
    console.error("Error en archivo user.model.js función addUser: ", error);
    throw new Error("Error al crear el usuario.");
  }
}

//PUT
async function updateUser(userId, data) {
  try {
    const existingUser = await findById(userId);
    if (!existingUser) return null;
    const userRef = doc(usersCollection, userId);
    const updatedData = {
      mail: data.mail ?? existingUser.mail,
      name: data.name ?? existingUser.name,
      role: data.role ?? existingUser.role,
      domicile: data.domicile ?? existingUser.domicile,
      rfc: data.rfc ?? existingUser.rfc,
      password: data.password ? await bcrypt.hash(data.password, 10) : existingUser.password
    };
    await updateDoc(userRef, updatedData);
    return {
      id: userId,
      mail: updatedData.mail,
      name: updatedData.name,
      role: updatedData.role,
      domicile: updatedData.domicile,
      rfc: updatedData.rfc,
      billid: existingUser.billid
    };
  } catch (error) {
    console.error("Error en archivo user.model.js función updateUser: ", error);
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
    console.error("Error en archivo user.model.js función deleteUser: ", error);
    throw new Error("Error al eliminar el usuario.");
  }
}

//FUNCIÓN DE FILTRADO
async function filterUser(filter = {}) {
  try {
    const snapshot = await getDocs(usersCollection);
    const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

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
      result = result.filter((u) => (u.domicile || "").toLowerCase().includes(q));
    }

    if (filter.rfc) {
      const q = String(filter.rfc).toLowerCase();
      result = result.filter((u) => (u.rfc || "").toLowerCase().includes(q));
    }

    return result;
  } catch (error) {
    console.error("Error en archivo user.model.js función filterUser: ", error);
    throw new Error("Error al filtrar usuarios.");
  }
}

//EXPORTAMOS LAS DIVERSAS FUNCIONES (ESM)
export default {
  findAll,
  findById,
  findByMail,
  addUser,
  updateUser,
  deleteUser,
  filterUser,
};
