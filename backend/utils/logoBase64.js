const fs = require("fs");
const path = require("path");

exports.getLogoBase64 = () => {
  const logoPath = path.join(
    __dirname,
    "../assets/logo.png"
  );

  const imageBuffer = fs.readFileSync(logoPath);
  return `data:image/png;base64,${imageBuffer.toString("base64")}`;
};
