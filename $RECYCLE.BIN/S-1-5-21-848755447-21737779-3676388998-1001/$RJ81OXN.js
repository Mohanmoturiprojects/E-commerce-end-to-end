import axios from "axios";

export const sendOTP = async (phone, otp) => {
  try {
    // ✅ Validate mobile number
    if (!/^\d{10}$/.test(phone)) {
      throw new Error("Invalid phone number format. Must be 10 digits.");
    }

    const response = await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        route: "q",
        sender_id: "TXTIND",
        message: `Your OTP is ${otp}`,
        language: "english",
        numbers: phone,
        flash: 0,
      },
      {
        headers: {
          authorization: "a84cdc2b-b335-11f0-bdde-0200cd936042",
        },
      }
    );

    console.log("✅ SMS Response:", response.data);
    return response.data;
  } catch (err) {
    console.error("❌ Error sending SMS:", err.response?.data || err.message);
    throw err;
  }
};
