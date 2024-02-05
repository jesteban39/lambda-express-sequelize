import {pathsToModuleNameMapper} from 'ts-jest'
import {compilerOptions} from './tsconfig.json'
import type {Config} from '@jest/types'

const jestConfig: Config.InitialOptions = {
  verbose: true,
  testTimeout: 90000,
  watch: false,
  watchAll: false,
  detectOpenHandles: true,
  forceExit: true,
  preset: 'ts-jest',
  roots: ['<rootDir>/src/', '<rootDir>/tests/'],
  testEnvironment: 'node',
  testPathIgnorePatterns: ['dist/', 'node_modules/', 'coverage/'],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths)
}

export default jestConfig
