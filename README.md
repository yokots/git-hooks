## USAGE

- ```npm i @yokots/git-hooks -D```

- Add the following fields to your `package.json`
  ```json
  {
    "husky": {
      "hooks": {
        "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
        "pre-commit": "lint-staged",
        "prepare-commit-msg": "exec < /dev/tty && git cz --hook || true"
      }
    },
    "commitlint": {
      "extends": ["@commitlint/config-conventional"]
    },
    "lint-staged": {
      "*.{css,scss}": ["stylelint --fix", "git add"],
      "*.ts": ["tslint --fix", "git add"]
    },
    "config": {
      "commitizen": {
        "path": "cz-conventional-changelog"
      }
    }
  }
  ```

- If you use in angular project, ```ng add @yokots/git-hooks```


## Resources

- [husky](https://github.com/typicode/husky)

- [commitlint](https://github.com/conventional-changelog/commitlint)

- [lint-staged](https://github.com/okonet/lint-staged)

- [commitizen](https://github.com/commitizen/cz-cli)
