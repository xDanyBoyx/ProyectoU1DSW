// services/facturapiService.js
import { createRequire } from 'module';
import dotenv from 'dotenv';

const require = createRequire(import.meta.url);
const Facturapi = require('facturapi').default;


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

            if (!apiKey) {
                throw new Error('TEST_SECRET_API_FACTURAPI no está configurado en las variables de entorno');
            }

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
        return null;
    }
};
