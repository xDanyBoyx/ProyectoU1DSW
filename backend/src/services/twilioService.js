import twilio from "twilio";

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendConfirmationOrderSMS = async (number) => {

    const messageBody = "PRUEBA DE ENVIO DE SMS";

    try {
        const message = await client.messages.create({
            body: messageBody,
            from: process.env.TWILIO_SMS_NUMBER, 
            to: number, 
        });
        console.log(`✅ SMS de confirmación enviado a: ${number}`);
        return true;
    } catch (error) {
        console.error("❌ Error enviando SMS:", error);
        return false;
    }
}