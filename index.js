#!/usr/bin/env node
// @flow

// USAGE: deploy-node-app [env]

const KUBESAIL_WEBSOCKET_HOST = 'wss://localhost:4000'
const KUBESAIL_WWW_HOST = 'https://localhost:3000'

const inquirer = require('inquirer')
//TODO use inquirer-fuzzy-path for entrypoint question
const fs = require('fs')
const url = require('url')
const uuidv4 = require('uuid/v4')
const opn = require('opn')
const WebSocket = require('ws')
const ansiStyles = require('ansi-styles')
const errArrows = `${ansiStyles.red.open}>>${ansiStyles.red.close}`

const homedir = require('os').homedir()
const path = require('path')

// Default to production environment
const env = process.argv[2] || 'production'
try {
  const packageJson = fs.readFileSync('package.json')
} catch (err) {
  process.stderr.write(
    `${errArrows} This doesn\'t appear to be a Node.js application - run \'npm init\'?\n`
  )
  process.exit(1)
}

async function DeployNodeApp () {
  // TODO: dont prompt for the above if answers exist in package.json?
  const answer = await inquirer.prompt([
    {
      name: 'env',
      type: 'input',
      message: 'Which environment are you deploying to?',
      default: env,
      validate: function (input) {
        if (input !== input.toLowerCase()) return 'environment names must be lowercase'
        if (input.length < 3) return 'environment names must be longer than 2 characters'
        if (!input.match(/^[a-zA-Z0-9-_]+$/)) {
          return 'environment names need to be numbers, letters, and dashes only'
        }
        return true
      }
    },
    {
      name: 'port',
      type: 'input',
      message: 'What port does your application listen on?',
      default: '3000',
      validate: function (input) {
        if (isNaN(parseInt(input, 10))) return 'ports must be numbers!'
        return true
      }
    },
    {
      name: 'protocol',
      type: 'list',
      message: 'Which protocol does your application speak?',
      default: 'http',
      choices: ['http', 'https', 'tcp']
    },
    {
      name: 'entrypoint',
      type: 'input',
      message: 'Where is your application\'s entrypoint?',
      default: 'index.js',
      validate: function (input) {
        if (!fs.existsSync(input)) return 'That file doesn\'t seem to exist'
        return true
      }
    }
  ])

  // Read local .docker configuration to see if the user has container registries already
  let containerRegistries = []
  const dockerConfigPath = path.join(homedir, '.docker', 'config.json')
  if (fs.existsSync(dockerConfigPath)) {
    try {
      const dockerConfig = JSON.parse(fs.readFileSync(dockerConfigPath))
      containerRegistries = containerRegistries.concat(
        Object.keys(dockerConfig.auths).map(key => {
          return url.parse(key).host
        })
      )
    } catch (err) {
      process.stderr.write(
        `${errArrows} It seems you have a Docker config.json file at ${dockerConfigPath}, but it is not valid json, or unreadable!\n`
      )
      process.exit(1)
    }
  }

  containerRegistries.push('registry.kubesail.io')

  // TODO: add kubesail to containerRegistries here
  const registry = await inquirer.prompt([
    {
      name: 'registry',
      type: 'list',
      message: 'Which docker registry do you want to use?',
      default: containerRegistries[0],
      choices: containerRegistries,
      validate: function (registry) {
        if (!registry.match(/^([a-z0-9]+\.)+[a-z0-9]$/i)) {
          return 'You must provide a valid hostname for a docker registry'
        }
        return true
      }
    }
  ])

  // 1. TODO: detect docker binary / help user install if not present
  // 2. TODO: detect docker server / help user setup if not present
  // 3. TODO: detect kubectl binary
  // 4. TODO: detect ~/.kube/config, prompt user to signup for kubesail if not exists
  //    if it does exist, prompt which context to use, add list item for kubesail sign up
  // 5. TODO: check for docker registry credentials, prompt user to use kubesail registry if not exists
  // if it does exist, prompt which to use, add list item for kubesail sign up
  // TODO: write config from above into package.json
  // 6. TODO: docker build
  // 7. TODO: docker push
  // TODO: create kube documents
  // 8. TODO: kubectl deploy

  connectKubeSail()
}

function connectKubeSail () {
  let ws
  const connect = function () {
    ws = new WebSocket(`${KUBESAIL_WEBSOCKET_HOST}/socket.io/`)
    ws.on('open', function () {
      console.log('socket open')
    })
    ws.on('error', function () {
      console.log('socket error')
    })
    ws.on('close', function () {
      console.log('socket close')
      setTimeout(connect, 250)
    })
  }
  connect()

  ws.on('connect', function () {
    console.log('connected')
  })

  const session = uuidv4()
  opn(`${KUBESAIL_WWW_HOST}/register?session=${session}`)
}

DeployNodeApp()
