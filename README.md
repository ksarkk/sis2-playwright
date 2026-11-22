# SIS 2 · Playwright CI

[![Playwright Tests](https://github.com/ksarkk/sis2-playwright/actions/workflows/playwright.yml/badge.svg?branch=main)](https://github.com/ksarkk/sis2-playwright/actions/workflows/playwright.yml)

Eight independent Chromium tests exercise a local task list. They cover keyboard submission, input validation, completion counts, reopening tasks, deletion and persistence across reloads. Playwright starts the Node server automatically.

## Running locally

Use Node 22 and run these commands from the repository root.

```sh
npm ci
npx playwright install --with-deps chromium
npm test
npx playwright show-report
```

## CI

GitHub Actions provides parallel hosted runners and shows results directly on each pull request. Every push and pull request runs the entire suite across four shards. Each job restores the npm download cache, installs the locked dependencies and Chromium, and runs its shard with two workers. CI rejects focused tests, retries failures up to twice, and records a trace on the first retry. Screenshots are captured on failure.

Each shard uploads JUnit XML and available failure evidence as test-results-N. A final job merges blob reports into playwright-report (HTML) and junit-report (XML). These artifacts remain available for 14 days. Intermediate blob reports expire after one day.

### Runtime

| Configuration | Total workflow time | Test step (slowest shard) | Actions run |
| --- | --- | --- | --- |
| One shard, including merge | Pending | Pending | Pending |
| Four shards, including merge | Pending | Pending | Pending |

For a comparable baseline, set both matrix entries to [1] on a benchmark branch. Run that version and the four-shard version three times each with the same tests and warmed npm cache. Record median workflow duration and median slowest test-step duration and link the runs. Compare elapsed time including setup and merging. Measurements require hosted runs.
