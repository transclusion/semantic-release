// @flow

import childProcess from 'child_process'

const exec = (cmd: string) =>
  new Promise((resolve, reject) => {
    childProcess.exec(cmd, (err, stdout) => {
      if (err) reject(err)
      else resolve(stdout.toString().trim())
    })
  })

type StreamOpts = {
  stdout: any,
  stderr: any
}

const streamExec = (cmd: string, args: string[], opts: StreamOpts) => {
  return new Promise((resolve, reject) => {
    const p = childProcess.spawn(cmd, args)

    p.stdout.on('data', buf => {
      opts.stdout.write(buf)
    })

    p.stderr.on('data', buf => {
      opts.stderr.write(buf)
    })

    p.on('close', code => {
      if (code > 0) {
        reject(new Error(`Exited with code ${code}`))
      } else {
        resolve()
      }
    })
  })
}

export default {
  exec,
  streamExec
}
