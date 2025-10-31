
// ============= VALIDACIONES PARA CREATE (POST) =============

export const validateUser = (userData = {}) => {
    const {
        name,
        password,
        mail,
        domicile,
        rfc
    } = userData;
    
    const errors = {};

    // Validaciones de campos requeridos
    if (!name || name.trim() === '') {
        errors.name = "El nombre es requerido.";
    } else if (typeof name !== "string") {
        errors.name = "El nombre debe ser un texto.";
    } else if (/\d/.test(name)) {
        errors.name = "El nombre no debe contener números.";
    }

    if (!password || password.trim() === '') {
        errors.password = "La contraseña es requerida.";
    } else if (password.length < 6) {
        errors.password = "La contraseña debe tener al menos 6 caracteres.";
    }

    if (!mail || mail.trim() === '') {
        errors.mail = "El correo es requerido.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
        errors.mail = "El formato del correo electrónico es inválido.";
    }

    if (!rfc || rfc.trim() === '') {
        errors.rfc = "El RFC es requerido.";
    } else if (typeof rfc !== "string") {
        errors.rfc = "El RFC debe ser un texto.";
    }

    // Validaciones de domicilio (solo si se proporciona)
    if (!domicile) {
        errors.domicile = "El domicilio es requerido.";
    } else if (typeof domicile !== "object" || Array.isArray(domicile)) {
        errors.domicile = "El domicilio debe ser un objeto.";
    } else {
        const { cp, calle, numeroExt, colonia, ciudad, municipio, estado } = domicile;

        if (!cp || cp.trim() === '') errors.domicile_cp = "El código postal es requerido.";
        if (!calle || calle.trim() === '') errors.domicile_calle = "La calle es requerida.";
        if (!numeroExt || numeroExt.trim() === '') errors.domicile_numeroExt = "El número exterior es requerido.";
        if (!colonia || colonia.trim() === '') errors.domicile_colonia = "La colonia es requerida.";
        if (!ciudad || ciudad.trim() === '') errors.domicile_ciudad = "La ciudad es requerida.";
        if (!municipio || municipio.trim() === '') errors.domicile_municipio = "El municipio es requerido.";
        if (!estado || estado.trim() === '') errors.domicile_estado = "El estado es requerido.";
    }

    return Object.keys(errors).length > 0 ? errors : null;
};

export const validateProduct = (productData = {}) => {
    const {
        name,
        brand,
        stock,
        price,
        category,
        urlimg,
        codesat
    } = productData;

    const errors = {};

    // Validaciones de campos requeridos
    if (!name || name.trim() === '') {
        errors.name = "El nombre del producto es requerido.";
    } else if (typeof name !== "string") {
        errors.name = "El nombre del producto debe ser un texto.";
    }

    if (!brand || brand.trim() === '') {
        errors.brand = "La marca es requerida.";
    } else if (typeof brand !== "string") {
        errors.brand = "La marca debe ser un texto.";
    }

    if (stock === undefined || stock === null) {
        errors.stock = "El stock es requerido.";
    } else if (typeof stock !== "number" || isNaN(stock)) {
        errors.stock = "El stock debe ser un número válido.";
    } else if (stock < 0) {
        errors.stock = "El stock no puede ser negativo.";
    }

    if (price === undefined || price === null) {
        errors.price = "El precio es requerido.";
    } else if (typeof price !== "number" || isNaN(price)) {
        errors.price = "El precio debe ser un número válido.";
    } else if (price < 0) {
        errors.price = "El precio no puede ser negativo.";
    }

    if (!category || category.trim() === '') {
        errors.category = "La categoría es requerida.";
    } else if (typeof category !== "string") {
        errors.category = "La categoría debe ser un texto.";
    }

    if (!urlimg || urlimg.trim() === '') {
        errors.urlimg = "La URL de la imagen es requerida.";
    } else if (typeof urlimg !== "string") {
        errors.urlimg = "La URL de la imagen debe ser un texto.";
    } else if (!/^https?:\/\/.+\..+/.test(urlimg)) {
        errors.urlimg = "La URL de la imagen tiene un formato inválido.";
    }

    if (!codesat || codesat.trim() === '') {
        errors.codesat = "El código SAT es requerido.";
    } else if (typeof codesat !== "string") {
        errors.codesat = "El código SAT debe ser un texto.";
    }

    return Object.keys(errors).length > 0 ? errors : null;
};

// ============= VALIDACIONES PARA UPDATE (PATCH) =============

export const validateUserUpdate = (userData = {}) => {
    const {
        name,
        password,
        mail,
        domicile,
        rfc
    } = userData;
    
    const errors = {};

    // Solo valida los campos que vienen en la petición
    if (name !== undefined) {
        if (name.trim() === '') {
            errors.name = "El nombre no puede estar vacío.";
        } else if (typeof name !== "string") {
            errors.name = "El nombre debe ser un texto.";
        } else if (/\d/.test(name)) {
            errors.name = "El nombre no debe contener números.";
        }
    }

    if (password !== undefined) {
        if (password.trim() === '') {
            errors.password = "La contraseña no puede estar vacía.";
        } else if (password.length < 6) {
            errors.password = "La contraseña debe tener al menos 6 caracteres.";
        }
    }

    if (mail !== undefined) {
        if (mail.trim() === '') {
            errors.mail = "El correo no puede estar vacío.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
            errors.mail = "El formato del correo electrónico es inválido.";
        }
    }

    if (rfc !== undefined) {
        if (rfc.trim() === '') {
            errors.rfc = "El RFC no puede estar vacío.";
        } else if (typeof rfc !== "string") {
            errors.rfc = "El RFC debe ser un texto.";
        }
    }

    // Validación de domicilio (solo si se envía)
    if (domicile !== undefined) {
        if (typeof domicile !== "object" || Array.isArray(domicile)) {
            errors.domicile = "El domicilio debe ser un objeto.";
        } else {
            const { cp, calle, numeroExt, colonia, ciudad, municipio, estado } = domicile;

            // Solo validar los campos del domicilio que vienen
            if (cp !== undefined && cp.trim() === '') {
                errors.domicile_cp = "El código postal no puede estar vacío.";
            }
            if (calle !== undefined && calle.trim() === '') {
                errors.domicile_calle = "La calle no puede estar vacía.";
            }
            if (numeroExt !== undefined && numeroExt.trim() === '') {
                errors.domicile_numeroExt = "El número exterior no puede estar vacío.";
            }
            if (colonia !== undefined && colonia.trim() === '') {
                errors.domicile_colonia = "La colonia no puede estar vacía.";
            }
            if (ciudad !== undefined && ciudad.trim() === '') {
                errors.domicile_ciudad = "La ciudad no puede estar vacía.";
            }
            if (municipio !== undefined && municipio.trim() === '') {
                errors.domicile_municipio = "El municipio no puede estar vacío.";
            }
            if (estado !== undefined && estado.trim() === '') {
                errors.domicile_estado = "El estado no puede estar vacío.";
            }
        }
    }

    return Object.keys(errors).length > 0 ? errors : null;
};

export const validateProductUpdate = (productData = {}) => {
    const {
        name,
        brand,
        stock,
        price,
        category,
        urlimg,
        codesat
    } = productData;

    const errors = {};

    // Solo valida los campos que vienen en la petición
    if (name !== undefined) {
        if (name.trim() === '') {
            errors.name = "El nombre del producto no puede estar vacío.";
        } else if (typeof name !== "string") {
            errors.name = "El nombre del producto debe ser un texto.";
        }
    }

    if (brand !== undefined) {
        if (brand.trim() === '') {
            errors.brand = "La marca no puede estar vacía.";
        } else if (typeof brand !== "string") {
            errors.brand = "La marca debe ser un texto.";
        }
    }

    if (stock !== undefined) {
        if (typeof stock !== "number" || isNaN(stock)) {
            errors.stock = "El stock debe ser un número válido.";
        } else if (stock < 0) {
            errors.stock = "El stock no puede ser negativo.";
        }
    }

    if (price !== undefined) {
        if (typeof price !== "number" || isNaN(price)) {
            errors.price = "El precio debe ser un número válido.";
        } else if (price < 0) {
            errors.price = "El precio no puede ser negativo.";
        }
    }

    if (category !== undefined) {
        if (category.trim() === '') {
            errors.category = "La categoría no puede estar vacía.";
        } else if (typeof category !== "string") {
            errors.category = "La categoría debe ser un texto.";
        }
    }

    if (urlimg !== undefined) {
        if (urlimg.trim() === '') {
            errors.urlimg = "La URL de la imagen no puede estar vacía.";
        } else if (typeof urlimg !== "string") {
            errors.urlimg = "La URL de la imagen debe ser un texto.";
        } else if (!/^https?:\/\/.+\..+/.test(urlimg)) {
            errors.urlimg = "La URL de la imagen tiene un formato inválido.";
        }
    }

    if (codesat !== undefined) {
        if (codesat.trim() === '') {
            errors.codesat = "El código SAT no puede estar vacío.";
        } else if (typeof codesat !== "string") {
            errors.codesat = "El código SAT debe ser un texto.";
        }
    }

    return Object.keys(errors).length > 0 ? errors : null;
};
