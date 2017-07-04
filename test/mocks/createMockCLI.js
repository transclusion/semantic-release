// @flow

type Data = {
  [key: string]: any
}

const createMockCLI = (data: Data) => {
  const log = []

  return {
    log,
    exec (cmd: string) {
      log.push(cmd)
      return Promise.resolve(data[cmd])
    },
    streamExec (cmd: string, args: string[]) {
      log.push(`${[cmd].concat(args).join(' ')}`)
      return Promise.resolve(data[[cmd].concat(args).join(' ')])
    }
  }
}

export default createMockCLI
