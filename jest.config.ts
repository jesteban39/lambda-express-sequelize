import {pathsToModuleNameMapper} from 'ts-jest'
import {compilerOptions} from './tsconfig.json'
import type {Config} from '@jest/types'

const jestConfig: Config.InitialOptions = {
  verbose: true,
  testTimeout: 90000,
  detectOpenHandles: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '/tests/.+\\.test\\.ts$',
  testPathIgnorePatterns: ['dist/', 'node_modules/','coverage/'],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths)
}

export default jestConfig
