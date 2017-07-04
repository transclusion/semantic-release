// @flow

import type {Commit} from '../types'

const getSemverChange = (commits: Commit[]) => {
  let type = null
  let breaking = false

  commits.forEach(commit => {
    const message = commit.message

    message.notes.forEach(note => {
      if (note.title === 'BREAKING CHANGE') {
        breaking = true
      }
    })

    if (breaking) {
      type = 'major'
      return
    }

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

    switch (message.type) {
      case 'feat':
        type = 'minor'
        break

      case 'fix':
        type = 'patch'
        break
    }
  })

  return type
}

export default getSemverChange
