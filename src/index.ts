import { Client } from "cntsc";

let client: Client = new Client("http://localhost:26658", "");

async function main() {
    let header = await client.Header.LocalHead();
    console.log(header);
}

main();
