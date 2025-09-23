const controller = require("./product.controller");
const Product = require("./product");

const baseOpts = {
  logLevel: "INFO",
  providerBaseUrl: "http://localhost:8080",
  providerVersion: process.env.GIT_COMMIT,
  providerVersionBranch: process.env.GIT_BRANCH, // the recommended way of publishing verification results with the branch property
  verbose: process.env.VERBOSE === "true",
};

// Setup provider server to verify

const setupServer = () => {
  const app = require("express")();
  const authMiddleware = require("../middleware/auth.middleware");
  app.use(authMiddleware);
  app.use(require("./product.routes"));
  const server = app.listen("8080");
  return server;
};

const stateHandlers = {
  "products exist": () => {
    controller.repository.products = new Map([
      ["09", new Product("09", "CREDIT_CARD", "Gem Visa", "v1")],
      ["10", new Product("10", "28 Degrees", 0.2)],
      ["11", new Product("11", "PERSONAL_LOAN", "MyFlexiPay", "v2")],
    ]);
  },
  "a product with ID 09 exists": () => {
    controller.repository.products = new Map([
      ["09", new Product("09", "CREDIT_CARD", "Gem Visa", "v1")],
    ]);
  },
  "a product with ID 10 exists": () => {
    controller.repository.products = new Map([
      ["10", new Product("10", "28 Degrees", 0.2)],
    ]);
  },
  "a product with ID 11 exists": () => {
    controller.repository.products = new Map([
      ["11", new Product("11", "PERSONAL_LOAN", "MyFlexiPay", "v2")],
    ]);
  },
  "a product with ID 12 does not exist": () => {
    controller.repository.products = new Map([
      ["09", new Product("09", "CREDIT_CARD", "Gem Visa", "v1")],
      ["10", new Product("10", "28 Degrees", 0.2)],
      ["11", new Product("11", "PERSONAL_LOAN", "MyFlexiPay", "v2")],
    ]);
  },
};

const requestFilter = (req, res, next) => {
  if (!req.headers["authorization"]) {
    next();
    return;
  }
  req.headers["authorization"] = `Bearer ${new Date().toISOString()}`;
  next();
};

module.exports = {
  baseOpts,
  setupServer,
  stateHandlers,
  requestFilter,
};
