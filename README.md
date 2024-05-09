
## Spustenie aplikácie

```bash
yarn dev
```

Aplikácia sa spustí v prehliadači na [http://localhost:3000](http://localhost:3000)

## Vybuildenie graphlql schémy

```bash
yarn build:nexus-typegen  
```

## Docker

```bash
docker build -t dp-frontend .  
 docker run -it -p 3000:3000 dp-frontend 
```

