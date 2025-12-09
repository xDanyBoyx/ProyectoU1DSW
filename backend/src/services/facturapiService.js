import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const Facturapi = require('facturapi').default;

// Configuración de directorios para ESM (módulos modernos de Node)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============= SINGLETON PATTERN =============

class FacturapiService {
    constructor() {
        if (FacturapiService.instance) {
            return FacturapiService.instance;
        }

        this.facturapi = null;
        FacturapiService.instance = this;
    }

    // Lazy initialization - solo se crea cuando se necesita
    getFacturapi() {
        if (!this.facturapi) {
            const apiKey = process.env.TEST_SECRET_API_FACTURAPI;

            this.facturapi = new Facturapi(apiKey);
            console.log('✅ Instancia de Facturapi inicializada');
        }

        return this.facturapi;
    }

    // Método para reiniciar la conexión (útil en tests o cambios de ambiente)
    reset() {
        this.facturapi = null;
        console.log('🔄 Instancia de Facturapi reiniciada');
    }
}

// Exportar instancia única
const facturapiService = new FacturapiService();

export default facturapiService;

// ============= FUNCIONES DE SERVICIO =============

export const createFacturapiCustomer = async ({
    name,
    mail,
    domicile,
    rfc,
    rf, // régimen fiscal
    phone
}) => {
    try {
        const facturapi = facturapiService.getFacturapi();
        const customer = await facturapi.customers.create({
            legal_name: name, // Nombre o razón social
            tax_id: rfc, // RFC
            tax_system: rf, // Regimen fiscal
            email: mail, // Correo para envío (opcional).
            phone,
            address: {
                zip: domicile.cp,
                street: domicile.calle,
                exterior: domicile.numeroExt,
                neighborhood: domicile.colonia,
                city: domicile.ciudad,
                municipality: domicile.municipio,
                state: domicile.estado,
            }
        });

        return customer;
    } catch (error) {
        console.error('❌ Error al crear cliente en Facturapi: ', error);
        const errorMessage = error.message || 'Error desconocido en el servicio de facturación.';
        throw new Error(errorMessage);
    }
};

export const removeFacturapiCustomer = async (id) => {
    const facturapi = facturapiService.getFacturapi();

    try {
        // primero se verifica si existe el usuario en facturapi
        const customer = await facturapi.customers.retrieve(id);

        if (!customer.id) return null; // no se encontró en facturapi

        const removedCustomer = await facturapi.customers.del(id);
        return removedCustomer;
    } catch (error) {
        console.error('❌ Error al eliminar cliente en Facturapi: ', error);
        return null;
    }
};

export const updateFacturapiCustomer = async ({ id, data }) => {
    const facturapi = facturapiService.getFacturapi();
    try {
        // primero se verifica si existe el usuario en facturapi
        const customer = await facturapi.customers.retrieve(id);

        if (!customer.id) return null; // no se encontró en facturapi

        const updatedCustomer = await facturapi.customers.update(
            id,
            {
                legal_name: data.name ?? customer.legal_name, // Nombre o razón social
                tax_id: data.rfc ?? customer.tax_id, // RFC
                tax_system: data.rf ?? customer.tax_system, // Regimen fiscal
                email: data.mail ?? customer.email, // Correo para envío (opcional).
                phone: data.phone ?? customer.phone,
                address: {
                    zip: data.domicile?.cp ?? customer.address.zip,
                    street: data.domicile?.calle ?? customer.address.street,
                    exterior: data.domicile?.numeroExt ?? customer.address.exterior,
                    neighborhood: data.domicile?.colonia ?? customer.address.neighborhood,
                    city: data.domicile?.ciudad ?? customer.address.city,
                    municipality: data.domicile?.municipio ?? customer.address.municipality,
                    state: data.domicile?.estado ?? customer.address.state,
                }
            }
        );

        return updatedCustomer;

    } catch (error) {
        console.error('❌ Error al actualizar cliente en Facturapi: ', error);
        return null;
    }
}

export const createFacturapiProducto = async ({
    name,
    price,
    codesat
}) => {
    try {
        const facturapi = facturapiService.getFacturapi();
        const product = await facturapi.products.create({
            description: name,
            product_key: codesat,
            price,
            tax_included: false,
            //unit_key: ?  al parecer este atributo no es necesario. no lo fue :D
            taxes: [
                {
                    type: 'IVA',
                    rate: 0.16
                }
            ]
        });
        return product;
    } catch (error) {
        console.error('❌ Error al crear producto en Facturapi: ', error.message);
        return null;
    }
};

export const removeFacturapiProducto = async (id) => {
    const facturapi = facturapiService.getFacturapi();
    try {
        // primero se verifica si existe el producto en facturapi
        const product = await facturapi.products.retrieve(id);

        if (!product.id) return null; // no se encontró en facturapi

        const removedProduct = await facturapi.products.del(id);
        return removedProduct;
    } catch (error) {
        console.error('❌ Error al eliminar producto en Facturapi: ', error);
        return null;
    }

}

export const updateFacturapiProducto = async ({ id, data }) => {
    const facturapi = facturapiService.getFacturapi();
    try {
        // primero se verifica si existe el producto en facturapi
        const product = await facturapi.products.retrieve(id);

        if (!product.id) return null; // no se encontró en facturapi

        const updatedProduct = await facturapi.products.update(
            id,
            {
                description: data.name ?? product.description,
                product_key: data.codesat ?? product.product_key,
                price: data.price ?? product.price,
                //unit_key: ?  al parecer este atributo no es necesario. no lo fue :D
            });

        return updatedProduct;

    } catch (error) {
        console.error('❌ Error al actualizar cliente en Facturapi: ', error);
        return null;
    }
}

export const createFacturapiInvoice = async (idCustomer, items) => {
    const facturapi = facturapiService.getFacturapi();
    try {
        const lineItems = items.map(item => ({
            quantity: item.qty,
            product: item.productId
        }));

        const invoice = await facturapi.invoices.create({
            customer: idCustomer,
            items: lineItems,
            payment_form: '03', //  Forma de pago: Transferencia electrónica
            use: 'G01', // Uso del CFDI: Adquisición de mercancías
        });

        return invoice;

    } catch (error) {
        console.error('❌ Error al crear factura en Facturapi: ', error.message);
        return null;
    }
}

export const downloadAndSaveInvoice = async (invoiceId) => {
    const facturapi = facturapiService.getFacturapi();

    // Definir carpeta de destino (ej: backend/public/invoices)
    const invoicesDir = path.join(__dirname, '../../public/invoices');

    // Crear carpeta si no existe
    if (!fs.existsSync(invoicesDir)) {
        fs.mkdirSync(invoicesDir, { recursive: true });
    }

    try {
        // Descargar PDF
        const pdfStream = await facturapi.invoices.downloadPdf(invoiceId);
        const pdfFileName = `${invoiceId}.pdf`;
        const pdfPath = path.join(invoicesDir, pdfFileName);
        const pdfWrite = fs.createWriteStream(pdfPath);

        // Descargar XML
        const xmlStream = await facturapi.invoices.downloadXml(invoiceId);
        const xmlFileName = `${invoiceId}.xml`;
        const xmlPath = path.join(invoicesDir, xmlFileName);
        const xmlWrite = fs.createWriteStream(xmlPath);

        // Pipe streams (guardado asíncrono)
        pdfStream.pipe(pdfWrite);
        xmlStream.pipe(xmlWrite);

        // Esperar a que ambos archivos se terminen de escribir
        await new Promise((resolve, reject) => {
            let finished = 0;
            const checkFinished = () => {
                finished++;
                if (finished === 2) resolve();
            };
            pdfWrite.on('finish', checkFinished);
            xmlWrite.on('finish', checkFinished);
            pdfWrite.on('error', reject);
            xmlWrite.on('error', reject);
        });

        // Retornar la ruta relativa para guardar en BD
        return {
            pdfUrl: `/invoices/${pdfFileName}`,
            xmlUrl: `/invoices/${xmlFileName}`
        };

    } catch (error) {
        console.error('❌ Error guardando archivos de factura:', error);
        return null;
    }
}

export const getProductInfoFacturapi = async (productId) => {
    const facturapi = facturapiService.getFacturapi();
    try {
        const product = await facturapi.products.retrieve(productId);
        return product;
    } catch (error) {
        console.error('❌ Error al obtener información del producto en Facturapi: ', error);
        return error;
    }
}