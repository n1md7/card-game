![](https://img.shields.io/badge/Node.js-v14.16.0-green)

# Card Game

Read more about the game [here](https://github.com/n1md7/card-game/wiki)

## Project run

```bash
# Install dependencies
$ npm install

# Start development
$ npm run dev
```

```bash
# If you would like to run them separately use commands below

# ClientApp
$ npm run client:start:dev

# Server
$ npm run server:start:dev
```

### Use Docker image

```bash
# Pull image from the command line
$ docker pull docker.pkg.github.com/n1md7/card-game/phurti:latest

# Use as base image in DockerFile:
FROM docker.pkg.github.com/n1md7/card-game/phurti:latest
```
