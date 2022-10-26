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
        "<rootDir>/facade",
      ],
    },
    {
      preset: "rollup-jest",
      runner: '@kayahr/jest-electron-runner',
      testEnvironment: '@kayahr/jest-electron-runner/environment',
      roots: [
        "<rootDir>/execution",
      ]
    }
  ]
}