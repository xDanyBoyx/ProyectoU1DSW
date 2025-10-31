
// ============= VALIDACIONES PARA CREATE (POST) =============

export const validateUser = (userData = {}) => {
    const {
        name,
        password,
        mail,
        domicile,
        rfc,
        rf, // régimen fiscal
        phone
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

    if (!rf || rf.trim() === '') {
        errors.rf = "El régimen fiscal es requerido.";
    } else if (typeof rf !== "string") {
        errors.rf = "El régimen fiscal debe ser un texto.";
    }

    if (!phone || phone.trim() === '') {
        errors.phone = "El teléfono es requerido.";
    } else if (typeof phone !== "string") {
        errors.phone = "El teléfono debe ser un texto.";
    } else if (!/^\d+$/.test(phone)) {
        errors.phone = "El teléfono debe contener solo números.";
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

