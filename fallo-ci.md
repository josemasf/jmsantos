The Netlify deploy errored, with the following guidance provided:

The build is failing because Corepack (bundled with Node.js v22.12.0) cannot verify the signature of the pnpm package manager. This is a known issue with older versions of Corepack failing to validate signatures against updated registry keys. The error at [line 22](#L22) (`Cannot find matching keyid`) repeats throughout the log, preventing pnpm from being installed.

**Solution:**

Add the `COREPACK_INTEGRITY_KEYS` environment variable to your Netlify build settings to bypass the signature check:

1. Go to your Netlify site's **Site configuration → Environment variables**
2. Add a new variable:
   - **Key:** `COREPACK_INTEGRITY_KEYS`
   - **Value:** `0`

This disables Corepack's integrity key verification, allowing pnpm to install successfully.

Alternatively, you can pin a specific pnpm version in your `package.json` using the `packageManager` field with an exact version (including hash), which can also resolve signature mismatches:

```json
{
  "packageManager": "pnpm@10.x.x+sha256.<hash>"
}
```

However, the environment variable approach is the quickest fix. If the issue persists, consider switching to a different Node.js version — see the [Netlify docs for changing Node versions](https://docs.netlify.com/configure-builds/manage-dependencies/#node-js-and-javascript).

The relevant error logs are:

Line 12: mise ~/.config/mise/config.toml tools: ruby@3.4.8
Line 13: mise ~/.config/mise/config.toml tools: go@1.26.2
Line 14: Attempting Node.js version '22.12.0' from .nvmrc
Line 15: Downloading and installing node v22.12.0...
Line 16: Downloading https://nodejs.org/dist/v22.12.0/node-v22.12.0-linux-x64.tar.xz...
Line 17: Computing checksum with sha256sum
Line 18: Checksums matched!
Line 19: Now using node v22.12.0 (npm v10.9.0)
Line 20: Enabling Node.js Corepack
Line 21: /opt/buildhome/.nvm/versions/node/v22.12.0/lib/node_modules/corepack/dist/lib/corepack.cjs:21535
Line 22: if (key == null || signature == null) throw new Error(`Cannot find matching keyid: ${JSON.stringify({ signatures, keys })}`);
Line 23: ^
Line 24: Error: Cannot find matching keyid: {"signatures":[{"sig":"MEYCIQDdn6aNm8C/qEga168q3oLGhCvQiX2NvwetnnJRY+7FxQIhAMf2AP25oWcjnlBxN8
Line 25: at verifySignature (/opt/buildhome/.nvm/versions/node/v22.12.0/lib/node_modules/corepack/dist/lib/corepack.cjs:21535:47)
Line 26: at installVersion (/opt/buildhome/.nvm/versions/node/v22.12.0/lib/node_modules/corepack/dist/lib/corepack.cjs:21882:7)
Line 27: at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
Line 28: at async Engine.ensurePackageManager (/opt/buildhome/.nvm/versions/node/v22.12.0/lib/node_modules/corepack/dist/lib/corepack
Line 29: at async Engine.executePackageManagerRequest (/opt/buildhome/.nvm/versions/node/v22.12.0/lib/node_modules/corepack/dist/lib/
Line 30: at async Object.runMain (/opt/buildhome/.nvm/versions/node/v22.12.0/lib/node_modules/corepack/dist/lib/corepack.cjs:23096:5)
Line 31: Node.js v22.12.0
Line 32: /opt/buildhome/.nvm/versions/node/v22.12.0/lib/node_modules/corepack/dist/lib/corepack.cjs:21535
Line 33: if (key == null || signature == null) throw new Error(`Cannot find matching keyid: ${JSON.stringify({ signatures, keys })}`);
Line 34: ^
Line 35: Error: Cannot find matching keyid: {"signatures":[{"sig":"MEYCIQDdn6aNm8C/qEga168q3oLGhCvQiX2NvwetnnJRY+7FxQIhAMf2AP25oWcjnlBxN8
Line 36: at verifySignature (/opt/buildhome/.nvm/versions/node/v22.12.0/lib/node_modules/corepack/dist/lib/corepack.cjs:21535:47)
Line 37: at installVersion (/opt/buildhome/.nvm/versions/node/v22.12.0/lib/node_modules/corepack/dist/lib/corepack.cjs:21882:7)
Line 38: at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
Line 39: at async Engine.ensurePackageManager (/opt/buildhome/.nvm/versions/node/v22.12.0/lib/node_modules/corepack/dist/lib/corepack
Line 40: at async Engine.executePackageManagerRequest (/opt/buildhome/.nvm/versions/node/v22.12.0/lib/node_modules/corepack/dist/lib/
Line 41: at async Object.runMain (/opt/buildhome/.nvm/versions/node/v22.12.0/lib/node_modules/corepack/dist/lib/corepack.cjs:23096:5)
Line 42: Node.js v22.12.0
Line 43: Found pnpm version () that doesn't match expected (10)
Line 44: Preparing pnpm@10 for immediate activation...
Line 45: /opt/buildhome/.nvm/versions/node/v22.12.0/lib/node_modules/corepack/dist/lib/corepack.cjs:21535
Line 46: if (key == null || signature == null) throw new Error(`Cannot find matching keyid: ${JSON.stringify({ signatures, keys })}`);
Line 47: ^
Line 48: Error: Cannot find matching keyid: {"signatures":[{"sig":"MEYCIQDdn6aNm8C/qEga168q3oLGhCvQiX2NvwetnnJRY+7FxQIhAMf2AP25oWcjnlBxN8
Line 49: at verifySignature (/opt/buildhome/.nvm/versions/node/v22.12.0/lib/node_modules/corepack/dist/lib/corepack.cjs:21535:47)
Line 50: at installVersion (/opt/buildhome/.nvm/versions/node/v22.12.0/lib/node_modules/corepack/dist/lib/corepack.cjs:21882:7)
Line 51: at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
Line 52: at async Engine.ensurePackageManager (/opt/buildhome/.nvm/versions/node/v22.12.0/lib/node_modules/corepack/dist/lib/corepack
Line 53: at async Engine.executePackageManagerRequest (/opt/buildhome/.nvm/versions/node/v22.12.0/lib/node_modules/corepack/dist/lib/
Line 54: at async Object.runMain (/opt/buildhome/.nvm/versions/node/v22.12.0/lib/node_modules/corepack/dist/lib/corepack.cjs:23096:5)
Line 55: Node.js v22.12.0
Line 56: /opt/build-bin/run-build-functions.sh: line 226: [: : integer expression expected
Line 57: pnpm workspaces detected
Line 58: /opt/buildhome/.nvm/versions/node/v22.12.0/lib/node_modules/corepack/dist/lib/corepack.cjs:21535
Line 59: if (key == null || signature == null) throw new Error(`Cannot find matching keyid: ${JSON.stringify({ signatures, keys })}`);
Line 60: ^
Line 61: Error: Cannot find matching keyid: {"signatures":[{"sig":"MEYCIQDdn6aNm8C/qEga168q3oLGhCvQiX2NvwetnnJRY+7FxQIhAMf2AP25oWcjnlBxN8
Line 62: at verifySignature (/opt/buildhome/.nvm/versions/node/v22.12.0/lib/node_modules/corepack/dist/lib/corepack.cjs:21535:47)
Line 63: at installVersion (/opt/buildhome/.nvm/versions/node/v22.12.0/lib/node_modules/corepack/dist/lib/corepack.cjs:21882:7)
Line 64: at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
Line 65: at async Engine.ensurePackageManager (/opt/buildhome/.nvm/versions/node/v22.12.0/lib/node_modules/corepack/dist/lib/corepack
Line 66: at async Engine.executePackageManagerRequest (/opt/buildhome/.nvm/versions/node/v22.12.0/lib/node_modules/corepack/dist/lib/
Line 67: at async Object.runMain (/opt/buildhome/.nvm/versions/node/v22.12.0/lib/node_modules/corepack/dist/lib/corepack.cjs:23096:5)
Line 68: Node.js v22.12.0
Line 69: Installing npm packages using pnpm version
Line 70: Failed during stage 'Install dependencies': dependency_installation script returned non-zero exit code: 1
Line 71: /opt/buildhome/.nvm/versions/node/v22.12.0/lib/node_modules/corepack/dist/lib/corepack.cjs:21535
Line 72: if (key == null || signature == null) throw new Error(`Cannot find matching keyid: ${JSON.stringify({ signatures, keys })}`);
Line 73: ^
Line 74: Error: Cannot find matching keyid: {"signatures":[{"sig":"MEYCIQDdn6aNm8C/qEga168q3oLGhCvQiX2NvwetnnJRY+7FxQIhAMf2AP25oWcjnlBxN8
Line 75: at verifySignature (/opt/buildhome/.nvm/versions/node/v22.12.0/lib/node_modules/corepack/dist/lib/corepack.cjs:21535:47)
Line 76: at installVersion (/opt/buildhome/.nvm/versions/node/v22.12.0/lib/node_modules/corepack/dist/lib/corepack.cjs:21882:7)
Line 77: at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
Line 78: at async Engine.ensurePackageManager (/opt/buildhome/.nvm/versions/node/v22.12.0/lib/node_modules/corepack/dist/lib/corepack
Line 79: at async Engine.executePackageManagerRequest (/opt/buildhome/.nvm/versions/node/v22.12.0/lib/node_modules/corepack/dist/lib/
Line 80: at async Object.runMain (/opt/buildhome/.nvm/versions/node/v22.12.0/lib/node_modules/corepack/dist/lib/corepack.cjs:23096:5)
Line 81: Node.js v22.12.0
Line 82: Error during pnpm install
Line 83: Failing build: Failed to install dependencies
Line 84: Finished processing build request in 17.948s
