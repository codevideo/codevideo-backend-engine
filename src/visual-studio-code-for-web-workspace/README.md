This folder represents the workspace that is used for launching visual studio in the web, via command:


```shell
code serve-web \
  --user-data-dir=/Users/chris/enterprise/codevideo/codevideo-backend-engine/src/visual-studio-code-for-web-workspace/data \
  --extensions-dir=/Users/chris/enterprise/codevideo/codevideo-backend-engine/src/visual-studio-code-for-web-workspace/ext \
  --server-data-dir=/Users/chris/enterprise/codevideo/codevideo-backend-engine/src/visual-studio-code-for-web-workspace/server \
  --accept-server-license-terms \
  --without-connection-token \
  --port=9000
```

Then we navigate to `http://localhost:8000/?folder=/<absolute-path-to-folder-here>` and start automating and recording.

Try for example `http://localhost:8000/?folder=/Users/chris/enterprise/codevideo/codevideo-backend-engine/workspaces/generic-sort-function-with-typescript`

Currently the `data/User/settings.json` file is prefilled with sensible defaults for a code lesson:

```json
{
    "workbench.startupEditor": "none",
    "workbench.colorTheme": "Default Dark Modern",
    "editor.fontSize": 16,
    "terminal.integrated.fontSize": 16,
    "files.autoSave": "afterDelay",
    "workbench.tree.indent": 16,
    "editor.minimap.enabled": false,
    "terminal.integrated.open": true,
    "terminal.integrated.defaultLocation": "bottom",
    "workbench.panel.defaultLocation": "bottom",
    "terminal.integrated.shellIntegration.enabled": true,
    "terminal.integrated.defaultProfile.osx": "zsh",
    "terminal.integrated.defaultProfile.linux": "bash",
    "terminal.integrated.profiles.osx": {
        "zsh": {
            "path": "/bin/zsh"
        }
    },
    "terminal.integrated.profiles.linux": {
        "bash": {
            "path": "/bin/bash"
        }
    },
    "security.workspace.trust.enabled": false,
    "security.workspace.trust.startupPrompt": "never",
    "security.workspace.trust.emptyWindow": true,
    "git.openRepositoryInParentFolders": "never"
}
```