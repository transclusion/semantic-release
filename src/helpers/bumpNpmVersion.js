// @flow

import type {Context} from '../types'

type ReleaseType =
  | 'major'
  | 'minor'
  | 'patch'
  | 'premajor'
  | 'preminor'
  | 'prepatch'
  | 'prerelease'
  | 'from-git'

const bumpNpmVersion = (ctx: Context, releaseType: ReleaseType) =>
  ctx.cli
    .exec(`npm --no-git-tag-version version ${releaseType}`)
    .then(stdout => stdout.toString().substr(1))

export default bumpNpmVersion
