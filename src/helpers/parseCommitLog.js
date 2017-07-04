// @flow

import conventionalCommitsParser from 'conventional-commits-parser/lib/parser'
import conventionalCommitsRegex from 'conventional-commits-parser/lib/regex'

const opts = {
  headerPattern: /^(\w*)(?:\(([\w$.\-* ]*)\))?: (.*)$/,
  headerCorrespondence: ['type', 'scope', 'subject'],
  referenceActions: [
    'close',
    'closes',
    'closed',
    'fix',
    'fixes',
    'fixed',
    'resolve',
    'resolves',
    'resolved'
  ],
  issuePrefixes: ['#'],
  noteKeywords: ['BREAKING CHANGE'],
  fieldPattern: /^-(.*?)-$/,
  revertPattern: /^Revert\s"([\s\S]*)"\s*This reverts commit (\w*)\./,
  revertCorrespondence: ['header', 'hash'],
  warn: function () {},
  mergePattern: null,
  mergeCorrespondence: null
}

const regex = conventionalCommitsRegex(opts)

const parseCommit = (raw: string) => {
  const data = raw.split('==SPLIT==')

  return {
    hash: data[0],
    message: conventionalCommitsParser(data[1], opts, regex)
  }
}

const parseCommitLog = (raw: string) => {
  return raw
    .split('==END==\n')
    .map(raw => raw.trim())
    .filter(raw => raw.length)
    .map(parseCommit)
}

export default parseCommitLog
