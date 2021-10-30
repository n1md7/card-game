# Card Game

## Project run

```bash
# Install dependencies

npm i
# or
npm install
```

Start front-emd builder and server runner

```bash
# Start development (both)
npm run dev

# If you would like to run them separately use commands below

# Game builder
npm run game:start:dev

# Server runner
npm run server:start:dev
```

### Using docker-compose

```bash
docker-compose up
```

This is not tested but should work 😀

Install dependencies

```bash
docker exec phurti_game npm install
docker exec phurti_server npm install
```
