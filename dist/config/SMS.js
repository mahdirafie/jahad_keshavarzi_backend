export const smsConfig = {
    username: "miladloveboth",
    password: "0622176364Milad",
    baseUrl: "http://smspanel.trez.ir/SendMessageWithUrl.ashx",
    phoneNumber: "90002847", // Your sender number
    smsClass: "1" // SMS class parameter
};
export async function sendSMS({ phone, message }) {
    // Encode parameters for URL
    const params = new URLSearchParams({
        Username: smsConfig.username,
        Password: smsConfig.password,
        PhoneNumber: smsConfig.phoneNumber,
        MessageBody: encodeURIComponent(message),
        RecNumber: phone,
        Smsclass: smsConfig.smsClass
    });
    const url = `${smsConfig.baseUrl}?${params.toString()}`;
    try {
        const response = await fetch(url, {
            method: "GET", // Using GET request as parameters are in the URL
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        if (!response.ok) {
            const text = await response.text();
            throw new Error(`SMS request failed with status ${response.status}: ${text}`);
        }
        return await response.text();
    }
    catch (error) {
        console.error("SMS Request Error:", error);
        throw error;
    }
}
// Alternative version with POST method if preferred
export async function sendSMSWithPost({ phone, message }) {
    const formData = new URLSearchParams({
        Username: smsConfig.username,
        Password: smsConfig.password,
        PhoneNumber: smsConfig.phoneNumber,
        MessageBody: message,
        RecNumber: phone,
        Smsclass: smsConfig.smsClass
    });
    try {
        const response = await fetch(smsConfig.baseUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formData.toString(),
        });
        if (!response.ok) {
            const text = await response.text();
            throw new Error(`SMS request failed with status ${response.status}: ${text}`);
        }
        return await response.text();
    }
    catch (error) {
        console.error("SMS Request Error:", error);
        throw error;
    }
}
//# sourceMappingURL=SMS.js.map