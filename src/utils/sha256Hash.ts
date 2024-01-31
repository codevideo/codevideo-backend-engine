import crypto from "crypto";

export const sha256Hash = (data: any) => {
  const hash = crypto.createHash("sha256");
  hash.update(data);
  return hash.digest("hex");
};
