import { createRustWorkflow } from '@dougefresh/ci';

export default function () {
  return createRustWorkflow()
    .enableMdBook()
    .extraJob('test-extra', { run: 'echo hello' })
    .semver(false)
    .disableSanitizers()
    .build();
}
