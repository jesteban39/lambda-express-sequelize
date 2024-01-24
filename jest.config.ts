import {pathsToModuleNameMapper} from 'ts-jest'
import type {Config} from '@jest/types'
import {compilerOptions} from './tsconfig.json'

const jestConfig: Config.InitialOptions = {
  verbose: true,
  testTimeout: 90000,
  detectOpenHandles: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['dist/', 'node_modules/','coverage/'],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths)
}

export default jestConfig
