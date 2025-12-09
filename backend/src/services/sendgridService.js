import sgMail from "@sendgrid/mail";
import fs from "fs"; // <--- IMPORTANTE: Necesario para leer los archivos
import path from "path"; // Para obtener el nombre del archivo limpio

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Ahora recibimos invoicePaths en lugar de invoiceUrl
export const sendOrderConfirmation = async (userEmail, cart, invoicePaths = { pdfUrl: null, xmlUrl: null }, itemsForEmail) => {

    // 1. Construimos el HTML (Le pasamos invoicePaths para saber si mostrar el aviso de adjuntos)
    const emailContent = buildEmailContent(cart, invoicePaths, itemsForEmail);

    const textSummary = `Hola ${cart.user.name}, gracias por tu compra. \n\n` +
                        `Tu pedido #${cart.id} ha sido confirmado.\n` +
                        `Total pagado: $${cart.total}\n\n` +
                        `Hemos adjuntado tu factura a este correo.`;

    // 2. Preparamos los adjuntos
    const attachments = [];

    try {
        // Adjuntar PDF si existe
        if (invoicePaths.pdfUrl && fs.existsSync(invoicePaths.pdfUrl)) {
            const pdfContent = fs.readFileSync(invoicePaths.pdfUrl).toString("base64");
            attachments.push({
                content: pdfContent,
                filename: path.basename(invoicePaths.pdfUrl), // Ej: "factura_123.pdf"
                type: "application/pdf",
                disposition: "attachment"
            });
        }

        // Adjuntar XML si existe
        if (invoicePaths.xmlUrl && fs.existsSync(invoicePaths.xmlUrl)) {
            const xmlContent = fs.readFileSync(invoicePaths.xmlUrl).toString("base64");
            attachments.push({
                content: xmlContent,
                filename: path.basename(invoicePaths.xmlUrl), // Ej: "factura_123.xml"
                type: "application/xml",
                disposition: "attachment"
            });
        }
    } catch (fileError) {
        console.error("⚠️ Error leyendo archivos para adjuntar en correo:", fileError);
        // No detenemos el envío, simplemente se irá sin adjuntos si falla la lectura
    }

    const msg = {
        to: userEmail,
        from: {
            email: process.env.FROM_EMAIL,
            name: "Tiendas 3B"
        },
        subject: `✅ Confirmación de tu pedido #${cart.id}`,
        text: textSummary,
        html: emailContent,
        attachments: attachments, // <--- Aquí van los archivos
    };

    try {
        await sgMail.send(msg);
        console.log(`✅ Correo de confirmación enviado a: ${userEmail}`);
        return true;
    } catch (error) {
        console.error("❌ Error enviando correo con SendGrid:", error.response ? error.response.body : error);
        return false;
    }
};

const buildEmailContent = (cart, invoicePaths, itemsForEmail) => {

    // 1. Formatear la fecha de pago
    const orderDate = new Date(cart.paidAt || cart.createdAt).toLocaleDateString('es-MX', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });

    // 2. Extraer datos del usuario
    const user = cart.user || {};
    const address = user.domicile || {};
    const fullAddress = `${address.calle} ${address.numeroExt}, Col. ${address.colonia}, ${address.ciudad}, ${address.estado}, CP ${address.cp}`;

    // 3. Generar filas de productos
    const productsHtml = itemsForEmail.map((item) => {
        const product = item.infoProductBD;
        const cellStyle = "padding: 12px; border-bottom: 1px solid #eee; vertical-align: middle; color: #555;";

        return `
        <tr>
            <td style="${cellStyle} text-align: center; width: 60px;">
                <img src="${product.urlimg}" alt="Producto" style="width: 50px; height: 50px; border-radius: 4px; object-fit: cover;" />
            </td>
            <td style="${cellStyle}">
                <strong style="color: #333;">${product.name}</strong><br/>
                <span style="font-size: 12px; color: #888;">Marca: ${product.brand}</span>
            </td>
            <td style="${cellStyle} text-align: center;">${item.qty}</td>
            <td style="${cellStyle} text-align: right;">$${Number(product.price).toFixed(2)}</td>
            <td style="${cellStyle} text-align: right; font-weight: bold;">$${Number(item.subtotal).toFixed(2)}</td>
        </tr>
        `;
    }).join('');

    // Verificar si hay facturas para mostrar el mensaje en el HTML
    const hasInvoice = invoicePaths.pdfUrl || invoicePaths.xmlUrl;

    // 4. Construir el HTML completo
    const emailContent = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4; padding: 40px 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
            
            <div style="background-color: #2c3e50; padding: 30px; text-align: center; color: #ffffff;">
                <h1 style="margin: 0; font-size: 24px; font-weight: 300;">Confirmación de Pedido</h1>
                <p style="margin: 10px 0 0; opacity: 0.8;">Gracias por tu compra, ${user.name}</p>
            </div>

            <div style="padding: 30px; border-bottom: 1px solid #eee;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="width: 50%; vertical-align: top; padding-right: 20px;">
                            <h3 style="font-size: 14px; color: #999; text-transform: uppercase; margin-bottom: 10px;">Enviar a:</h3>
                            <p style="margin: 0; font-size: 15px; line-height: 1.5; color: #333;">
                                <strong>${user.name}</strong><br>
                                ${fullAddress}<br>
                                Tel: ${user.phone}<br>
                                ${user.mail}
                            </p>
                        </td>
                        <td style="width: 50%; vertical-align: top; padding-left: 20px; border-left: 1px solid #eee;">
                            <h3 style="font-size: 14px; color: #999; text-transform: uppercase; margin-bottom: 10px;">Detalles del Pedido:</h3>
                            <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #333;">
                                <strong>ID Pedido:</strong> <span style="font-family: monospace;">${cart.id}</span><br>
                                <strong>Fecha:</strong> ${orderDate}<br>
                                <strong>RFC:</strong> ${user.rfc || 'N/A'}<br>
                                <strong>Método:</strong> Tarjeta / Stripe
                            </p>
                        </td>
                    </tr>
                </table>
            </div>

            <div style="padding: 30px;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: #f8f9fa; font-size: 12px; text-transform: uppercase; color: #666;">
                            <th style="padding: 10px; text-align: center;">Img</th>
                            <th style="padding: 10px; text-align: left;">Producto</th>
                            <th style="padding: 10px; text-align: center;">Cant.</th>
                            <th style="padding: 10px; text-align: right;">Precio</th>
                            <th style="padding: 10px; text-align: right;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${productsHtml}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="4" style="padding: 12px; text-align: right; color: #666;">Subtotal:</td>
                            <td style="padding: 12px; text-align: right; color: #333;">$${Number(cart.subtotal).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colspan="4" style="padding: 5px 12px; text-align: right; color: #666;">IVA (16%):</td>
                            <td style="padding: 5px 12px; text-align: right; color: #333;">$${Number(cart.iva).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colspan="4" style="padding: 15px 12px; text-align: right; font-weight: bold; font-size: 16px; border-top: 2px solid #333;">Total Pagado:</td>
                            <td style="padding: 15px 12px; text-align: right; font-weight: bold; font-size: 18px; color: #2c3e50; border-top: 2px solid #333;">
                                $${Number(cart.total).toFixed(2)}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            ${hasInvoice ? `
            <div style="background-color: #eafbf0; padding: 20px; text-align: center; border-top: 1px solid #d4edda;">
                <p style="color: #155724; margin: 0; font-weight: bold;">
                    ✅ Factura Generada
                </p>
                <p style="color: #155724; font-size: 13px; margin-top: 5px;">
                    Hemos adjuntado los archivos PDF y XML en este correo.
                </p>
            </div>
            ` : ''}

            <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee;">
                <p style="margin: 0;">Si tienes alguna pregunta, responde a este correo o contáctanos al ${user.phone}.</p>
                <p style="margin: 5px 0 0;">&copy; ${new Date().getFullYear()} Tiendas 3B. Todos los derechos reservados.</p>
            </div>
        </div>
    </div>
    `;

    return emailContent;
}