// @flow

import createMockCLI from './mocks/createMockCLI'
import createMockNpmClient from './mocks/createMockNpmClient'
import semanticRelease from '../src/main'
import parseCommitLog from '../src/helpers/parseCommitLog'

test('should release', () => {
  const mockNpmClient = createMockNpmClient({
    'https://npmjs.mock/@transclusion%2Fsemantic-release': {
      'dist-tags': {
        latest: '0.1.0'
      }
    }
  })

  const mockCLI = createMockCLI({
    'git rev-list -n 1 0.1.0': '12345',
    'git log -E --format=%H==SPLIT==%B==END== 12345..HEAD': `56780==SPLIT==feat(scope): short 1

long 1
==END==
12345==SPLIT==chore(scope): short 2

long 2

Closes #1.
==END==
`,
    'npm --no-git-tag-version version minor': 'v0.2.0',
    'echo 0.2.0': '0.2.0',
    'git add .': '',
    'git commit -m "v0.2.0"': `[master 12345] v0.2.0
1 file changed, 1 insertion(+), 1 deletion(-)`,
    'git tag v0.2.0': '',
    'npm publish --registry "https://npmjs.mock"':
      '+ @transclusion/semantic-release@0.2.0'
  })

  return semanticRelease({
    registry: 'https://npmjs.mock',
    npmClient: mockNpmClient,
    cli: mockCLI,
    versionHook: 'echo %s'
  }).then(() => {
    expect(mockNpmClient.log[0][0]).toEqual(
      'https://npmjs.mock/@transclusion%2Fsemantic-release'
    )
    expect(mockNpmClient.log[0][1].timeout).toEqual(1000)
    // expect(mockCLI.log[6]).toEqual('git tag v0.2.0')
    // expect(mockCLI.log[7]).toEqual(
    //   'npm publish --registry "https://npmjs.mock"'
    // )
  })
})

test('should parse commits', () => {
  const commits = parseCommitLog(`67890==SPLIT==feat(scope): short 1

long 1

BREAKING CHANGE: test 1
==END==
12345==SPLIT==chore(scope): short 2

long 2

Closes #1.
BREAKING CHANGE: test 2
==END==
`)

  expect(commits.length).toEqual(2)
  expect(commits[0].hash).toEqual('67890')
  expect(commits[0].message.type).toEqual('feat')
  expect(commits[0].message.scope).toEqual('scope')
  expect(commits[0].message.subject).toEqual('short 1')
  expect(commits[0].message.body).toEqual('long 1')
  expect(commits[0].message.footer).toEqual('BREAKING CHANGE: test 1')
  expect(commits[0].message.notes.length).toEqual(1)
  expect(commits[0].message.notes[0].title).toEqual('BREAKING CHANGE')
  expect(commits[0].message.notes[0].text).toEqual('test 1')
  expect(commits[1].hash).toEqual('12345')
  expect(commits[1].message.references.length).toEqual(1)
  expect(commits[1].message.references[0].action).toEqual('Closes')
  expect(commits[1].message.references[0].issue).toEqual('1')
})
