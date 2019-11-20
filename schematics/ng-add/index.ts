import { Rule, SchematicContext, Tree, SchematicsException, noop } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { name, version, config } from '../../package.json';

const husky = {
  hooks: {
    "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
    "pre-commit": "lint-staged",
    "prepare-commit-msg": "exec < /dev/tty && git cz --hook || true",
  },
};

const commitlint = {
  "extends": ["@commitlint/config-conventional"],
};

const lingStaged = {
  "*.{css,scss}": ["stylelint --fix", "git add"],
  "*.ts": ["tslint --fix", "git add"],
}

interface Dependencies {
  [key: string]: string;
}

function sortObjectByKeys(obj: Dependencies) {
  return Object.keys(obj).sort()
    .reduce<Dependencies>((result, key) => {
      result[key] = obj[key];
      return result;
    }, {});
}

export default function(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const workspaceConfig = tree.read('/angular.json');
    if (!workspaceConfig) {
      throw new SchematicsException('Could not find Angular workspace configuration');
    }

    const pkg = JSON.parse(tree.read('/package.json')!.toString());

    pkg.devDependencies[name] = `^${version}`;
    pkg.devDependencies = sortObjectByKeys(pkg.devDependencies);
    Reflect.deleteProperty(pkg.dependencies, name);

    pkg['husky']= husky;
    pkg['commitlint'] = commitlint;
    pkg['lint-staged'] = lingStaged;
    pkg['config'] = config;

    tree.overwrite('/package.json', JSON.stringify(pkg, null, 2));

    context.addTask(new NodePackageInstallTask());
    return noop();
  };
}
