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
        rf: doc.data().rf,
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
        rf: snapshot.data().rf,
        phone: snapshot.data().phone,
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
      mail: data.mail,
      role: data.role,
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
    if (data.rfc !== undefined) updatedData.rfc = data.rfc;
    if (data.rf !== undefined) updatedData.rf = data.rf;
    if (data.phone !== undefined) updatedData.phone = data.phone;

    // Manejar domicilio con MERGE (no reemplazo completo)
    if (data.domicile !== undefined) {
      // Si el usuario tiene domicilio existente, hacer merge
      if (existingUser.domicile && typeof existingUser.domicile === 'object') {
        updatedData.domicile = {
          ...existingUser.domicile,  // Mantener valores existentes
          ...data.domicile           // Aplicar nuevos valores
        };
      } else {
        // Si no existe domicilio anterior, usar el nuevo
        updatedData.domicile = data.domicile;
      }
    }

    // Manejar password solo si se proporciona
    if (data.password) {
      updatedData.password = await bcrypt.hash(data.password, 10);
    }

    // Verificar que hay campos para actualizar
    if (Object.keys(updatedData).length === 0) {
      const { password, ...userWithoutPassword } = existingUser;
      return userWithoutPassword;
    }

    await updateDoc(userRef, updatedData);

    // Combinar datos actualizados con existentes para la respuesta
    const userResponse = {
      id: userId,
      mail: updatedData.mail ?? existingUser.mail,
      name: updatedData.name ?? existingUser.name,
      role: existingUser.role, // role no se actualiza
      domicile: updatedData.domicile ?? existingUser.domicile,
      rfc: updatedData.rfc ?? existingUser.rfc,
      rf: updatedData.rf ?? existingUser.rf,
      phone: updatedData.phone ?? existingUser.phone,
      id_facturapi: existingUser.id_facturapi
    };

    return userResponse;

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

async function filterUser(filters = {}) {
  try {

    // Obtener todos los usuarios
    const snapshot = await getDocs(usersCollection);
    const allUsers = snapshot.docs.map(doc => {
      const data = doc.data();

      // Estructura consistente con todos los campos, excluyendo password
      const { password, ...userData } = data;

      return {
        id: doc.id,
        mail: userData.mail,
        name: userData.name,
        domicile: userData.domicile,
        role: userData.role,
        rfc: userData.rfc,
        rf: userData.rf,
        phone: userData.phone,
        id_facturapi: userData.id_facturapi,
      };
    });

    let results = allUsers;

    // Aplicar filtros de forma flexible
    if (filters.name) {
      const searchName = filters.name.toLowerCase();
      results = results.filter(user =>
        user.name?.toLowerCase().includes(searchName)
      );
    }

    if (filters.mail) {
      const searchMail = filters.mail.toLowerCase();
      results = results.filter(user =>
        user.mail?.toLowerCase().includes(searchMail)
      );
    }

    if (filters.role) {
      results = results.filter(user => user.role === filters.role);
    }

    if (filters.rfc) {
      const searchRfc = filters.rfc.toLowerCase();
      results = results.filter(user =>
        user.rfc?.toLowerCase().includes(searchRfc)
      );
    }

    if (filters.domicile && typeof filters.domicile === 'object') {
      const domicileFilters = filters.domicile;

      Object.entries(domicileFilters).forEach(([key, value]) => {
        if (!value || value === '') return;

        const searchValue = value.toLowerCase();

        results = results.filter(user => {
          const domicileValue = user.domicile?.[key];
          return domicileValue?.toLowerCase().includes(searchValue);
        });

      });
    }

    if (filters.phone) {
      results = results.filter(user =>
        user.phone?.includes(filters.phone)
      );
    }

    if (filters.rf) {
      results = results.filter(user =>
        user.rf?.includes(filters.rf)
      );
    }

    return results;

  } catch (error) {
    console.error("❌ Error en user.model.js función filterUser:", error);
    throw new Error("Error al consultar la información.");
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
