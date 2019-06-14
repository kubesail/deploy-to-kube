# Deploy Node App ![CircleCI](https://img.shields.io/circleci/build/github/kubesail/deploy-node-app.svg) [![npm version](https://img.shields.io/npm/v/deploy-node-app.svg)](https://www.npmjs.com/package/deploy-node-app)

Deploy your Node.js app and its dependencies to Kubernetes with a single command. No config required.

Supports any Kubernetes cluster, including the following:

- Google Kubernetes Engine
- Amazon EKS
- DigitalOcean Kubernetes
- KubeSail (**completely free Kubernetes hosting**)
- Custom Clusters

### Instructions

Just run `npx deploy-node-app` in your node project.

![Example](https://github.com/kubesail/deploy-node-app/raw/master/docs/terminal-example-1.svg?sanitize=true)

### Prerequisites

- [Docker](https://www.docker.com/get-started)
- [NodeJS / npm](https://nodejs.org/en/) - NPM includes the `npx` utility needed to run this package without being installed
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) - required for creating your deployment, and recommended for managing your deployment after created

### What does this tool do?

After answering a few questions about your app, this tool can:

1. Create a Dockerfile (if needed)
1. Build a Docker image
1. Create a Kubernetes deployment file
1. Deploy your app on a Kubernetes cluster
   - Configure a free namespace on KubeSail (if desired)
1. Deploy any depdencies ([meta-modules](https://github.com/nodeapp-meta-modules/documentation)) your app relies on

Deploy Node App is also able to generate a local development configuration for docker-compose, by passing `--format compose`

---

deploy-node-app is maintained by

[<img src="docs/kubesail-logo.png" alt="Kubesail" width="160">
<br/>
Kubesail - an easy, free way to try kubernetes](https://kubesail.com)

---

### Contributing

If you feel that this tool can be improved in any way, feel free to open an issue or pull request!
