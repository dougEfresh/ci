import { createRustWorkflow } from '@dougefresh/ci';

export default function () {
  return createRustWorkflow()
    .enableMdBook()
    .extraJob('test-extra', { run: 'echo hello' })
    .semver(false)
    .withRelease({
      profile: 'release',
      publish: false,
      debian: false,
      bin: {
        name: 'blah',
        linux: {
          arm64: true,
          amd64: false,
        },
        win: false,
        mac: false,
      },
    })
    .disableSanitizers()
    .build();
}
