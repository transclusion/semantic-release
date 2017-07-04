// @flow

import type {Context} from '../types'

type Opts = {
  registry: string,
  packageName: string
}

const getLastNpmRelease = (ctx: Context, opts: Opts) => {
  const uri = `${opts.registry}/${opts.packageName.replace('/', '%2F')}`
  const params = {timeout: 1000}

  return new Promise((resolve, reject) => {
    ctx.npm.get(uri, params, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data['dist-tags'].latest)
      }
    })
  })
}

export default getLastNpmRelease
