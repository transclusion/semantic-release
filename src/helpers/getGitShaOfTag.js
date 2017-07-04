// @flow

import type {Context} from '../types'

const getGitShaOfTag = (ctx: Context, tag: string) =>
  ctx.cli
    .exec(`git rev-list -n 1 ${tag}`)
    .then(stdout => stdout.toString().trim())

export default getGitShaOfTag
