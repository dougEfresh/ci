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
        name: 'dummy',
        linux: {
          arm64: true,
          amd64: true,
        },
        win: false,
        mac: true,
      },
    })
    .disableSanitizers()
    .build();
}
