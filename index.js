const fs = require("fs");
const Jimp = require("jimp");
const QrCode = require("qrcode-reader");
const { authenticator } = require("otplib");
const parser = require("./decoder/index");

async function decodeQR(filePath) {
  const image = await Jimp.read(filePath);
  const qr = new QrCode();

  return new Promise((resolve, reject) => {
    qr.callback = (err, value) => {
      if (err) return reject(err);
      if (!value) return reject(new Error("No QR code found."));
      resolve(value.result);
    };
    qr.decode(image.bitmap);
  });
}

async function extractSecret(otpauthUrl) {
  const secrets = await parser(otpauthUrl);
  return secrets;
}

function startOTP(secrets) {
  const secretsArray = Array.isArray(secrets) ? secrets : [secrets];
  console.log("✅ Authenticator started.");

  secretsArray.forEach((secretObj) => {
    const label =
      typeof secretObj === "object" && secretObj !== null && secretObj.name
        ? secretObj.name
        : "OTP";
    console.log(`🔐 ${label}`);
  });

  console.log("⏱️ Time remaining");

  setInterval(() => {
    const secondsLeft = 30 - (Math.floor(Date.now() / 1000) % 30);

    process.stdout.write(`\x1b[${secretsArray.length + 1}A`);

    secretsArray.forEach((secretObj) => {
      const secretValue =
        typeof secretObj === "object" && secretObj !== null
          ? secretObj.secret || secretObj.key || Object.values(secretObj)[0]
          : secretObj;

      const otp = authenticator.generate(secretValue);
      const label =
        typeof secretObj === "object" && secretObj !== null && secretObj.name
          ? secretObj.name
          : "OTP";
      const provider =
        typeof secretObj === "object" && secretObj !== null && secretObj.issuer
          ? secretObj.issuer
          : "N/A";

      process.stdout.write(`\r\x1b[K🔐 ${provider}:${label} :: ${otp}\n`);
    });

    process.stdout.write(`\r\x1b[K⏱️ Expires in: ${secondsLeft}s   \n`);
  }, 1000);
}

(async () => {
  const filePath = process.argv[2];
  if (!filePath || !fs.existsSync(filePath)) {
    console.error("❌ Please provide a valid image path: `node app.js qr.png`");
    process.exit(1);
  }

  try {
    const otpauth = await decodeQR(filePath);
    if (!otpauth) throw new Error("Could not decode QR code.");

    const secrets = await extractSecret(otpauth);
    if (!secrets) throw new Error("Could not extract secret.");
    startOTP(secrets);
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
})();
