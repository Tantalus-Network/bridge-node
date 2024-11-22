# Celestia Client

## How to Start

```bash
npm run start
```

---

## Starting Celestia Node (Mocha Testnet)

```bash
docker run --name celestia-node -e NODE_TYPE=light -e P2P_NETWORK=mocha -p 26658:26658 \
ghcr.io/celestiaorg/celestia-node:v0.20.2-mocha celestia light start \
--core.ip rpc-mocha.pops.one --p2p.network mocha --rpc.skip-auth
```

If it is already exists: `docker rm -f celestia-node` and then try again.

## Find Auth Key

We will use --rpc.skip-auth for now.

```bash
docker exec -it <container-id> /bin/bash
```

There is a key folder which is including your authentication key.
