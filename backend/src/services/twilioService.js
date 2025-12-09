import twilio from "twilio";

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendConfirmationOrderSMS = async (phoneNumber, messageBody) => {

    const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+52${phoneNumber}`;

    try {
        await client.messages.create({
            body: messageBody,
            from: process.env.TWILIO_SMS_NUMBER, 
            to: formattedNumber, 
        });
        console.log(`✅ SMS de confirmación enviado a: ${phoneNumber}`);
        return true;
    } catch (error) {
        console.error("❌ Error enviando SMS:", error);
        return false;
    }
}