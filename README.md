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

Median of three successful hosted runs per configuration. Total time is measured from run creation to completion, including runner queue time, setup and report merging. For each run the test-step measurement uses its slowest shard.

| Configuration | Total workflow time | Test step | GitHub Actions runs |
| --- | ---: | ---: | --- |
| One shard | 113 s | 3 s | [Run 1](https://github.com/ksarkk/sis2-playwright/actions/runs/45057276585), [Run 2](https://github.com/ksarkk/sis2-playwright/actions/runs/45057280093), [Run 3](https://github.com/ksarkk/sis2-playwright/actions/runs/45057515399) |
| Four shards | 175 s | 3 s | [Run 1](https://github.com/ksarkk/sis2-playwright/actions/runs/45057349153), [Run 2](https://github.com/ksarkk/sis2-playwright/actions/runs/45057500910), [Run 3](https://github.com/ksarkk/sis2-playwright/actions/runs/45057506374) |

With eight short tests the test command takes only a few seconds. Runner queueing, container startup and report merging account for most of the elapsed time.

### Verification

- [Push run](https://github.com/ksarkk/sis2-playwright/actions/runs/45057500910) and [pull request run](https://github.com/ksarkk/sis2-playwright/actions/runs/45057506374) exercise the four-shard workflow.
- [Cache restoration log](https://github.com/ksarkk/sis2-playwright/actions/runs/45057500910/job/137315875666) records a cache hit in setup-node.
- [Retry evidence](https://github.com/ksarkk/sis2-playwright/actions/runs/45057400309) uses a separate diagnostic branch. Download test-results-4 and open the nested trace.zip with Playwright Trace Viewer.
- [Focused-test rejection](https://github.com/ksarkk/sis2-playwright/actions/runs/45057455003) deliberately introduces test.only on a separate branch and demonstrates the CI failure.
