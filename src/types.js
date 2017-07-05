// @flow

/*
  feat:     A new feature
  fix:      A bug fix
  docs:     Documentation only changes
  style:    Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
  refactor: A code change that neither fixes a bug nor adds a feature
  perf:     A code change that improves performance
  test:     Adding missing tests or correcting existing tests
  build:    Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
  ci:       Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
  chore:    Other changes that don't modify src or test files
  revert:   Reverts a previous commit
*/

export type Note = {
  title: 'BREAKING CHANGE'
}

export type Message = {
  type: | 'feat'
    | 'fix'
    | 'docs'
    | 'style'
    | 'refactor'
    | 'perf'
    | 'test'
    | 'build'
    | 'ci'
    | 'chore'
    | 'revert',
  notes: Note[]
}

export type Commit = {
  hash: string,
  message: Message
}

export type CLI = {
  exec: Function,
  streamExec: Function
}

export type PreOpts = {
  access?: 'restricted' | 'public',
  registry?: string,
  versionHook?: string,
  cli?: CLI
}

export type Context = {
  cli: CLI,
  npm: any
}
