## Key Design Principles
- TypeScript-based CI config generation (not traditional YAML)
- Config flows: User TS → JSON generation → Workflow consumption
- Focus on logical errors and unintended consequences, not design critique, unless your critique reduces maintenance cost or greater flexibility


Note, this is a personal action / tool. It isn't meant for widespread use.
It isn't perfect, nor will this ever be perfect.


Review README.md for design flow

## GitHub Workflow

**Note**: This section only applies when running in GitHub Actions context (when `CI` environment variable is set). Ignore otherwise.

### Validation Prompt Detection

Before performing code review, verify that `.github/agents/additional-prompt.md` was successfully injected into your prompt context:

1. **Self-check**: Check if `.github/agents/additional-prompt.md` is present in your context/prompt
2. **Report status**:
   - ✅ If found: Proceed with validation tasks defined in that file
   - ❌ If not found: Report "Validation prompt not loaded - skipping QA checks" and continue with standard code review only

This ensures the action's prompt generation step (`action.yml` → `prompt` step) executed correctly.


### Validate Bash Tool Access

This project uses settings.json file as defined in typescript file ./src/defaults.ts, see `DEFAULT_AI` const. Please validate the `claude_settings` field.
JSON Schema for settings.json is located in file ./schemas/claude-code-settings.json

See URL https://code.claude.com/docs/en/settings and https://code.claude.com/docs/en/permissions for official documentation


Checklist of commands to verify execution:

- `cargo --version`
- `bun --version`
- `tsgo --version`
- `codecov --version`
- `jq --version`


Feel free to recommend addition settings that you find useful
