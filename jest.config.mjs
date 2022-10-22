export default {
  projects: [
    {
      preset: "rollup-jest",
      runner: "@kayahr/jest-electron-runner/main",
      testEnvironment: "node",
      roots: [
        "<rootDir>/pluginMgr",
      ],
    },
    {
      preset: "rollup-jest",
      roots: [
        "<rootDir>/execution",
        "<rootDir>/facade",
      ],
    }
  ]
}