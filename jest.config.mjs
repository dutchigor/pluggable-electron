export default {
  projects: [
    {
      preset: "rollup-jest",
      runner: "@kayahr/jest-electron-runner/main",
      testEnvironment: "node",
      roots: [
        "<rootDir>/execution",
        "<rootDir>/pluginMgr",
      ],
    },
    {
      preset: "rollup-jest",
      roots: [
        "<rootDir>/facade",
      ],
    }
  ]
}