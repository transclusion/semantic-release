// @flow

import type {Context} from '../types'

const getGitCommitLogSince = (ctx: Context, gitSha: string) =>
  ctx.cli.exec(
    `git log -E --format=%H==SPLIT==%B==END== ${gitSha
      ? `${gitSha}..HEAD`
      : 'HEAD'}`
  )

export default getGitCommitLogSince
