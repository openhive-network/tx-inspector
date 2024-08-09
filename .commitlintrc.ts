export default {
  extends: [ '@commitlint/config-conventional' ],
  rules: {
    'type-case':  [ 2, 'always', 'lower-case' ],
    'type-enum':  [ 2, 'always', [ 'feat', 'fix', 'docs', 'ci', 'chore', 'style', 'refactor', 'perf', 'test' ] ],
    // 'scope-enum': [ 2, 'always', [ 'front', 'back' ] ],
    'scope-case': [ 2, 'always', 'lower-case'],
    'subject-case': [ 0 ],
    'body-max-line-length': [ 0 ]
  }
};