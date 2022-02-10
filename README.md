![](https://img.shields.io/badge/Node.js-v14.16.0-green)
[![codecov](https://codecov.io/gh/n1md7/card-game/branch/master/graph/badge.svg?token=CSKCUSBWWY)](https://codecov.io/gh/n1md7/card-game)
[![Docker](https://github.com/n1md7/card-game/actions/workflows/docker-publish.yml/badge.svg)](https://github.com/n1md7/card-game/actions/workflows/docker-publish.yml)
![](https://byob.yarr.is/n1md7/card-game/time/shields/shields.json)

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
