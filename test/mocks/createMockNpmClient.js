// @flow

type Data = {
  [key: string]: any
}

type NpmGetParams = {}

const createMockNpmClient = (data: Data) => {
  const log: any[] = []

  return {
    log,
    get (uri: string, params: NpmGetParams, cb: Function) {
      log.push([uri, params])
      cb(null, data[uri])
    }
  }
}

export default createMockNpmClient
