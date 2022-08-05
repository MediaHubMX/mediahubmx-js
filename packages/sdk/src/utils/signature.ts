import * as crypto from "crypto";

const publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDRGLGD6gly5Ut0N34CsLwZJaxG
msFqWH3fnOwJiirzC4mfDyyjXuID3o6oSUiN7BNOz4oyt76ldC/XP3BqBJvhmoo7
wD3jzuxhWM+1zqzhuJKgedoL/slQtPHnpcAaZ2E2hEEyyHALoejyy/6ZxInZdILI
rl2iXzVO8gXUw97fDwIDAQAB
-----END PUBLIC KEY-----`;

/**
 * Verifies the MediaHubMX signature
 * @param sig Base64 encoded string
 */
export const validateSignature = (sig: string): any => {
  if (!sig) {
    throw new Error("Missing MediaHubMX signature");
  }

  const decodedSig = Buffer.from(sig, "base64").toString();
  try {
    JSON.parse(decodedSig);
  } catch {
    throw new Error("Malformed MediaHubMX signature");
  }

  const { data, signature } = JSON.parse(decodedSig);

  const verifier = crypto.createVerify("SHA256");
  verifier.update(data);
  const isValid = verifier.verify(publicKey, signature, "base64");
  if (!isValid) {
    throw new Error("Invalid MediaHubMX signature");
  }

  const result = JSON.parse(data);
  if (new Date(result.validUntil) < new Date()) {
    throw new Error("MediaHubMX signature timed out");
  }

  return result;
};
