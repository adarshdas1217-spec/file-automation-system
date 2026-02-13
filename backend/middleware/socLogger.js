const axios = require("axios");

function sendToSOC(req, res, next) {

   res.on("finish", async () => {
      try {

         const clientIP =
            req.headers["x-forwarded-for"]?.split(",")[0] ||
            req.socket.remoteAddress;

         await axios.post(
            "https://soc-backend-production.up.railway.app/api/logs",
            {
               source: "redcross",
               ip: clientIP,
               method: req.method,
               endpoint: req.originalUrl,
               statusCode: res.statusCode,
               userAgent: req.headers["user-agent"]
            }
         );

      } catch (err) {
         console.log("SOC logging failed");
      }
   });

   next();
}

module.exports = sendToSOC;
