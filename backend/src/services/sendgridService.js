import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendOrderConfirmation = async (userEmail, cart, invoiceUrl = null) => {
    
}