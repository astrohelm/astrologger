<h1 align="center">Astrologger init</h1>

### Last step: Save results

_WARNING !_ Update this file before moving throw this step.

Create a new package in [organization][https://github.com/astrohelm/] repository. Use next commands
to save you package.

```bash
git init
git remote add origin your-package-location
git branch -M main # if your default branch is not main
git add .
git commit -m "Repository init"
git push origin main
```

Return to your organization repository and do:

- Add keywords
- Update description
- Draft release with `release` tag and `v1.0.0` as a title and this file as description.

> If you creating library you may publish it now to npm with `npm publish` command.

Congratulations, package initialized 🚀

## About files & structure

This workspace have commonjs in use by default. You can switch it in package.json if you want.

- `dist` directory used for fronted package analog. You can use it if your package is multi-platform
  based.
- `eslint` astrohelm eslint rules
- `types` .d.ts library types exports
- `CHANGELOG.md` in use for project history documentation
- `Makefile` ultimate commands shortcuts creator
- `tests` here you can put all test coverage of your package
- `.github` github ci pipeline by default
- `lib` folder should contain all you library logic, _WARNING !_ Remove if you not writing library.
  Replace with src folder.

<h2 align="center">Copyright & contributors</h2>

<p align="center">
Copyright © 2023 <a href="https://github.com/LeadFisherSolutions/workspace-example/graphs/contributors">Leadfisher contributors</a>.
Workspace is <a href="./LICENSE">MIT licensed</a>.<br/>
Workspace is part of <a href="https://github.com/astrohelm">astrohelm ecosystem</a>.
</p>
