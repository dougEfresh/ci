import {
  DEFAULT_AI,
  DEFAULT_CARGO_SORT,
  DEFAULT_CLIPPY,
  DEFAULT_COVERAGE,
  DEFAULT_DEPENDENCIES,
  DEFAULT_DOC_CHECK,
  DEFAULT_EXTRA,
  DEFAULT_FMT,
  DEFAULT_HACK,
  DEFAULT_PAGES,
  DEFAULT_SANITIZERS,
  DEFAULT_SEMVER,
  osToTarget,
} from './defaults';
import {
  type AiJob,
  type Clippy,
  type Coverage,
  type Global,
  Os,
  type PageJobs,
  type Release,
  type RustJobs,
} from './types';

export * from './defaults';
export * from './types';

export const JobDefaults: RustJobs = {
  fmt: DEFAULT_FMT,
  semver: DEFAULT_SEMVER,
  hack: DEFAULT_HACK,
  docCheck: DEFAULT_DOC_CHECK,
  cargoSort: DEFAULT_CARGO_SORT,
  dependencies: DEFAULT_DEPENDENCIES,
  sanitizers: DEFAULT_SANITIZERS,
  coverage: DEFAULT_COVERAGE,
  clippy: DEFAULT_CLIPPY,
  extra: DEFAULT_EXTRA,
};

export class RustWorkflow {
  private jobs: RustJobs;
  private global: Global;
  private release: Release;
  private ai: AiJob;
  private pages: PageJobs;

  constructor() {
    this.jobs = {
      fmt: JobDefaults.fmt,
      docCheck: JobDefaults.docCheck,
      semver: JobDefaults.semver,
      dependencies: JobDefaults.dependencies,
      hack: JobDefaults.hack,
      cargoSort: JobDefaults.cargoSort,
      sanitizers: JobDefaults.sanitizers,
      clippy: JobDefaults.clippy,
      coverage: JobDefaults.coverage,
      extra: JobDefaults.extra,
    };

    this.global = { packages: {} };
    this.release = {
      publish: true,
      bin: false,
      debian: false,
      profile: 'release',
      os: [Os.LINUX_AMD64],
      homebrew: {
        if: false,
        repo: '',
      },
    };
    this.ai = DEFAULT_AI;
    this.pages = DEFAULT_PAGES;
  }

  linuxPackages(packages: string[]) {
    this.global.packages.Linux = packages.join(',');
    return this;
  }
  disableFmt() {
    this.jobs.fmt.if = false;
    return this;
  }
  disableDocCheck() {
    this.jobs.docCheck.if = false;
    return this;
  }
  disableDependencies() {
    this.jobs.dependencies.if = false;
    return this;
  }
  disableHack() {
    this.jobs.hack.if = false;
    return this;
  }
  disableCargoSort() {
    this.jobs.cargoSort.if = false;
    return this;
  }
  disableClippy() {
    this.jobs.clippy.if = false;
    return this;
  }
  disableSemver(enable: boolean) {
    this.jobs.semver.if = enable;
    return this;
  }
  semver(enable: boolean) {
    this.jobs.semver.if = enable;
    return this;
  }

  disableCoverage() {
    this.jobs.coverage.if = true;
    return this;
  }
  extra(name: string, run: string, cache?: { cargoTools?: string[]; paths?: string[] }) {
    this.jobs.extra.if = true;
    this.jobs.extra.name = name;
    this.jobs.extra.run = run;
    if (cache) {
      this.jobs.extra.cache = cache;
    }
    return this;
  }

  withRelease(r: Release) {
    this.release = r;
    return this;
  }

  enableMdBook() {
    this.pages.mdbook.if = true;
    return this;
  }

  configPages(config: PageJobs) {
    this.pages = config;
    return this;
  }

  coverage(opts?: Partial<Coverage>) {
    if (opts?.run) this.jobs.coverage.run = opts.run;
    if (opts?.if !== undefined) this.jobs.coverage.if = opts.if;
    if (opts?.continueOnError !== undefined) this.jobs.coverage.continueOnError = opts.continueOnError;
    if (opts?.matrix) {
      if (opts.matrix.toolchains) this.jobs.coverage.matrix.toolchains = opts.matrix.toolchains;
      if (opts.matrix.features) this.jobs.coverage.matrix.features = opts.matrix.features;
      if (opts.matrix.os) this.jobs.coverage.matrix.os = opts.matrix.os;
    }
    return this;
  }
  clippy(opts?: Partial<Clippy>) {
    if (opts?.flags) this.jobs.clippy.flags = opts.flags;
    if (opts?.run) this.jobs.clippy.run = opts.run;
    if (opts?.if !== undefined) this.jobs.clippy.if = opts.if;
    if (opts?.continueOnError !== undefined) this.jobs.clippy.continueOnError = opts.continueOnError;
    if (opts?.matrix) {
      if (opts.matrix.toolchains) this.jobs.clippy.matrix.toolchains = opts.matrix.toolchains;
      if (opts.matrix.features) this.jobs.clippy.matrix.features = opts.matrix.features;
      if (opts.matrix.os) this.jobs.clippy.matrix.os = opts.matrix.os;
    }
    return this;
  }

  disableSanitizers() {
    this.jobs.sanitizers.enabled = false;
    return this;
  }

  disableAi() {
    this.ai.enabled = false;
    return this;
  }

  configureAi(config: AiJob) {
    this.ai = config;
    return this;
  }

  configureRelease(config: Release) {
    this.release = config;
    return this;
  }

  build() {
    const target = this.release.os.map((a) => osToTarget(a));
    return {
      ai: this.ai,
      pages: this.pages,
      release: {
        bin: this.release.bin,
        publish: this.release.publish,
        debian: this.release.debian,
        profile: this.release.profile,
        matrix: {
          os: this.release.os,
          target,
        },
        homebrew: this.release.homebrew,
      },
      global: this.global,
      jobs: this.jobs,
    };
  }
}

export function createRustWorkflow(): RustWorkflow {
  return new RustWorkflow();
}
