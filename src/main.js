// @flow

import type {Context, PreOpts} from './types'

import bumpNpmVersion from './helpers/bumpNpmVersion'
import cli from './helpers/cli'
import getGitShaOfTag from './helpers/getGitShaOfTag'
import getGitCommitLogSince from './helpers/getGitCommitLogSince'
import getLastNpmRelease from './helpers/getLastNpmRelease'
import getSemverChange from './helpers/getSemverChange'
import findConfig from 'find-config'
import npmlog from 'npmlog'
import parseCommitLog from './helpers/parseCommitLog'
import RegClient from 'npm-registry-client'

const getGitCommitsSinceTag = (ctx: Context, tag: string) => {
  return getGitShaOfTag(ctx, tag)
    .then(gitSha => getGitCommitLogSince(ctx, gitSha))
    .then(parseCommitLog)
}

const getLastRelease = (ctx: Context, {pkg, registry}) => {
  return getLastNpmRelease(ctx, {packageName: pkg.name, registry}).catch(
    () => null
  )
}

const getReleaseType = (ctx: Context, {pkg, registry}) =>
  getLastRelease(ctx, {pkg, registry: registry}).then(lastRelease => {
    if (lastRelease) {
      return getGitCommitsSinceTag(ctx, `v${lastRelease}`).then(getSemverChange)
    }

    return null
  })

const semanticRelease = (opts: PreOpts = {}) => {
  const ctx: Context = {
    npm: opts.npmClient || new RegClient({log: npmlog}),
    cli: opts.cli || cli
  }

  const registry = opts.registry || 'https://registry.npmjs.org'

  const pkg = findConfig.require('package.json', {cwd: process.cwd()})

  if (!pkg) return Promise.reject(new Error('Could not find package.json'))

  return getReleaseType(ctx, {pkg, registry})
    .then(releaseType => {
      if (releaseType) {
        return bumpNpmVersion(ctx, releaseType)
      }

      return pkg.version
    })
    .then((currentRelease: string) => {
      if (opts.versionHook) {
        const args = opts.versionHook.replace('%s', currentRelease).split(' ')
        const command = args.shift()

        return ctx.cli
          .streamExec(command, args, process)
          .then(() => currentRelease)
      }

      return currentRelease
    })
    .then((currentRelease: string) => {
      if (currentRelease && currentRelease !== pkg.version) {
        return ctx.cli
          .exec(`git add .`)
          .then(() => ctx.cli.exec(`git commit -m "${currentRelease}"`))
          .then(() => ctx.cli.exec(`git tag v${currentRelease}`))
          .then(() => currentRelease)
      }

      return currentRelease
    })
    .then(currentRelease => {
      return ctx.cli
        .exec(`npm publish --registry "${registry}"`)
        .then(() => currentRelease)
    })
}

export default semanticRelease
