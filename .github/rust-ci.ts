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
      assets: [
        { glob: 'docs/**', archiveName: 'docs.tar.gz' },
        { glob: './.github/workflows/**', archiveName: 'workflows.tar.gz' },
        { glob: 'devnull/**', archiveName: 'devnull.tar.gz' },
      ],
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
