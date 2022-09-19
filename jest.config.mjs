export default {
  preset: "rollup-jest",
  runner: "@kayahr/jest-electron-runner/main",
  testEnvironment: "node",
  roots: [
    "<rootDir>/execution",
    "<rootDir>/facade",
    "<rootDir>/pluginMgr",
  ]
}