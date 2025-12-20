// 🔹 Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getAuth,
    signInWithPhoneNumber,
    RecaptchaVerifier
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// 🔹 Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyAHoLQSQit3TXtp8t-HvLZFzj9zQF80QFg",
    authDomain: "stayvel-bacab.firebaseapp.com",
    projectId: "stayvel-bacab",
    storageBucket: "stayvel-bacab.firebasestorage.app",
    messagingSenderId: "399164249554",
    appId: "1:399164249554:web:f201cae46469652b82a40b"
};

// 🔹 Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 🔹 reCAPTCHA
window.recaptchaVerifier = new RecaptchaVerifier(
    auth,
    "recaptcha-container",
    {
        size: "invisible"
    }
);

// 🔹 SEND OTP
window.sendFirebaseOtp = async function (phoneNumber) {
    window.confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        window.recaptchaVerifier
    );
};

// 🔹 VERIFY OTP
window.verifyFirebaseOtp = async function (otp) {
    return await window.confirmationResult.confirm(otp);
};
