import crypto from "crypto";

console.log(
  crypto
    .createHash("sha256")
    .update("123456", "utf8")
    .digest("hex")
);