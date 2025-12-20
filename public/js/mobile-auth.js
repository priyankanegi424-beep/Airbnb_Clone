console.log("mobile-auth.js loaded");


function showMobileBox() {
  document.getElementById("mobileBox").style.display = "block";
}

async function sendOtp() {
  try {
    let phone = document.getElementById("mobile").value.trim();
    phone = "+91" + phone;

    await window.sendFirebaseOtp(phone);
    alert("OTP sent successfully");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

async function verifyOtp() {
  try {
    const otp = document.getElementById("otp").value.trim();

    const result = await window.verifyFirebaseOtp(otp);

    // ✅ Firebase verified
    const phone = result.user.phoneNumber;

await fetch("/auth/phone/verify", {
    
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ phone })   // 👈 MUST be `phone`
  
});


    // 👉 send phone to backend
    const res = await fetch("/auth/mobile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: phoneNumber })
    });

    const data = await res.json();

    if (data.success) {
      window.location.href = data.redirect;
    } else {
      alert(data.message);
    }

  } catch (err) {
    console.error(err);
    alert("Invalid OTP");
  }
}

// SHOW MOBILE INPUT BOX
function showMobileBox() {
  const box = document.getElementById("mobileBox");
  if (!box) {
    console.error("mobileBox not found");
    return;
  }
  box.style.display = "block";
}

