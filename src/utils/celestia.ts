import { sha256 } from "js-sha256";

export const generateRandomNamespace = (): string => {
    const seed = Math.random().toString();
    const namespaceVersionByte = Buffer.from([0x00]);

    const leadingZeroBytes = Buffer.alloc(18, 0);

    const IdHash = sha256(seed);
    const slicedIdHash = Buffer.from(IdHash).subarray(0, 10);

    const namespaceIdentifier = Buffer.concat([
        namespaceVersionByte,
        leadingZeroBytes,
        slicedIdHash,
    ]).toString("base64");

    return namespaceIdentifier;
};
