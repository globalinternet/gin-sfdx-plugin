gin-sfdx-plugin
===============



[![Version](https://img.shields.io/npm/v/gin-sfdx-plugin.svg)](https://npmjs.org/package/gin-sfdx-plugin)
[![CircleCI](https://circleci.com/gh/dieffrei/gin-sfdx-plugin/tree/master.svg?style=shield)](https://circleci.com/gh/dieffrei/gin-sfdx-plugin/tree/master)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/dieffrei/gin-sfdx-plugin?branch=master&svg=true)](https://ci.appveyor.com/project/heroku/gin-sfdx-plugin/branch/master)
[![Codecov](https://codecov.io/gh/dieffrei/gin-sfdx-plugin/branch/master/graph/badge.svg)](https://codecov.io/gh/dieffrei/gin-sfdx-plugin)
[![Greenkeeper](https://badges.greenkeeper.io/dieffrei/gin-sfdx-plugin.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/dieffrei/gin-sfdx-plugin/badge.svg)](https://snyk.io/test/github/dieffrei/gin-sfdx-plugin)
[![Downloads/week](https://img.shields.io/npm/dw/gin-sfdx-plugin.svg)](https://npmjs.org/package/gin-sfdx-plugin)
[![License](https://img.shields.io/npm/l/gin-sfdx-plugin.svg)](https://github.com/dieffrei/gin-sfdx-plugin/blob/master/package.json)

<!-- toc -->
* [Debugging your plugin](#debugging-your-plugin)
<!-- tocstop -->
<!-- install -->
<!-- usage -->
```sh-session
$ npm install -g gin-sfdx-plugin
$ sfdx COMMAND
running command...
$ sfdx (-v|--version|version)
gin-sfdx-plugin/1.1.1 darwin-x64 node-v10.16.3
$ sfdx --help [COMMAND]
USAGE
  $ sfdx COMMAND
...
```
<!-- usagestop -->
<!-- commands -->
* [`sfdx gin:bourne:generateconfigfile [-f <filepath>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-ginbournegenerateconfigfile--f-filepath--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfdx gin:bourne:generatecustommetadata [-f <filepath>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-ginbournegeneratecustommetadata--f-filepath---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfdx gin:cpq:configure [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-gincpqconfigure--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfdx gin:sharing:suspend [-s <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-ginsharingsuspend--s-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfdx gin:sharing:waitready [-t <minutes>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-ginsharingwaitready--t-minutes--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfdx gin:source:trigger [-t <string>] [-m <string>] [-o <string>] [-h <string>] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-ginsourcetrigger--t-string--m-string--o-string--h-string--v-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfdx gin:user:activateusers -f <filepath> [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-ginuseractivateusers--f-filepath--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfdx gin:user:assignpsg -f <filepath> [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-ginuserassignpsg--f-filepath--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfdx gin:user:assignpsl [-f <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-ginuserassignpsl--f-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfdx gin:user:create -p <string> -e <string> [-a] [-d <string>] [-r <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-ginusercreate--p-string--e-string--a--d-string--r-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfdx gin:user:resetpassword -t <string> [-o <string>] [-n <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-ginuserresetpassword--t-string--o-string--n-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)

## `sfdx gin:bourne:generateconfigfile [-f <filepath>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Generates Bourne Config file based on Custom Metadata Type Records on the org

```
USAGE
  $ sfdx gin:bourne:generateconfigfile [-f <filepath>] [-u <string>] [--apiversion <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -f, --bournefile=bournefile                                                       [default:
                                                                                    ./scripts/cpq-export-template.json]
                                                                                    file name to generate

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  $ sfdx gin:bourne:generateconfigfile" 
       config file generated
```

_See code: [lib/commands/gin/bourne/generateconfigfile.js](https://github.com/globalinternet/gin-sfdx-plugin/blob/v1.1.1/lib/commands/gin/bourne/generateconfigfile.js)_

## `sfdx gin:bourne:generatecustommetadata [-f <filepath>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Waits until all Permission Set Groups are updated

```
USAGE
  $ sfdx gin:bourne:generatecustommetadata [-f <filepath>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -f, --bournefile=bournefile                                                       [default:
                                                                                    ./scripts/cpq-export-template.json]
                                                                                    file path to generate CMT from

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  $ sfdx gin:bourne:generatecustommetadata
       custom metadata generated
```

_See code: [lib/commands/gin/bourne/generatecustommetadata.js](https://github.com/globalinternet/gin-sfdx-plugin/blob/v1.1.1/lib/commands/gin/bourne/generatecustommetadata.js)_

## `sfdx gin:cpq:configure [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Suspend/Enable sharing calculation

```
USAGE
  $ sfdx gin:cpq:configure [-u <string>] [--apiversion <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  $ sfdx gin:cpq:configure -u username
```

_See code: [lib/commands/gin/cpq/configure.js](https://github.com/globalinternet/gin-sfdx-plugin/blob/v1.1.1/lib/commands/gin/cpq/configure.js)_

## `sfdx gin:sharing:suspend [-s <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Suspend/Enable sharing calculation

```
USAGE
  $ sfdx gin:sharing:suspend [-s <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -s, --scope=sharingRule|groupMembership                                           [default: sharingRule] scope...

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  $ sfdx gin:sharing:suspend" 
  Sharing calculations suspended
```

_See code: [lib/commands/gin/sharing/suspend.js](https://github.com/globalinternet/gin-sfdx-plugin/blob/v1.1.1/lib/commands/gin/sharing/suspend.js)_

## `sfdx gin:sharing:waitready [-t <minutes>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Waits until all Permission Set Groups are updated

```
USAGE
  $ sfdx gin:sharing:waitready [-t <minutes>] [-u <string>] [--apiversion <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -t, --timeout=timeout                                                             [default: [object Object]] During in
                                                                                    minutes before command fails

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  $ sfdx gin:sharing:waitReady" 
       all permission set groups were successfully updated
```

_See code: [lib/commands/gin/sharing/waitready.js](https://github.com/globalinternet/gin-sfdx-plugin/blob/v1.1.1/lib/commands/gin/sharing/waitready.js)_

## `sfdx gin:source:trigger [-t <string>] [-m <string>] [-o <string>] [-h <string>] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Code generation for Migration ids metadata

```
USAGE
  $ sfdx gin:source:trigger [-t <string>] [-m <string>] [-o <string>] [-h <string>] [-v <string>] [-u <string>] 
  [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -h, --triggerhnddir=triggerhnddir                                                 [default:
                                                                                    force-app/main/default/classes/adapt
                                                                                    er/trigger-handler] output directory
                                                                                    for trigger handlers

  -m, --metadatadir=metadatadir                                                     [default:
                                                                                    force-app/main/default/customMetadat
                                                                                    a] output directory for custom
                                                                                    metadata records

  -o, --objectdir=objectdir                                                         [default:
                                                                                    force-app/main/default/objects]
                                                                                    output directory for objects

  -t, --triggerdir=triggerdir                                                       [default:
                                                                                    force-app/main/default/triggers]
                                                                                    output directory for triggers

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  -v, --targetdevhubusername=targetdevhubusername                                   username or alias for the dev hub
                                                                                    org; overrides default dev hub org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  $ sfdx gin:source:trigger
```

_See code: [lib/commands/gin/source/trigger.js](https://github.com/globalinternet/gin-sfdx-plugin/blob/v1.1.1/lib/commands/gin/source/trigger.js)_

## `sfdx gin:user:activateusers -f <filepath> [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Acitvates Users based on User Names specified in the file

```
USAGE
  $ sfdx gin:user:activateusers -f <filepath> [-u <string>] [--apiversion <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -f, --permissionfile=permissionfile                                               (required) [default:
                                                                                    ./data-migration/psa.json] file with
                                                                                    permission set assignments

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

DESCRIPTION
  The file format:
  {
       "userName": "Tom Sanders",
       "groupName": "AwesomeAdmin"
  }

EXAMPLE
  $ sfdx gin:user:activateusers -f ./file/path.json -u target_org"
```

_See code: [lib/commands/gin/user/activateusers.js](https://github.com/globalinternet/gin-sfdx-plugin/blob/v1.1.1/lib/commands/gin/user/activateusers.js)_

## `sfdx gin:user:assignpsg -f <filepath> [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Inserts Permission Set Groups to Users based on User Names specified in the file

```
USAGE
  $ sfdx gin:user:assignpsg -f <filepath> [-u <string>] [--apiversion <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -f, --permissionfile=permissionfile                                               (required) [default:
                                                                                    ./data-migration/psa.json] file with
                                                                                    permission set assignments

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

DESCRIPTION
  The file format:
  {
       "userName": "Tom Sanders",
       "groupName": "AwesomeAdmin"
  }

EXAMPLE
  $ sfdx gin:user:assignpsg -f ./file/path.json -u target_org"
```

_See code: [lib/commands/gin/user/assignpsg.js](https://github.com/globalinternet/gin-sfdx-plugin/blob/v1.1.1/lib/commands/gin/user/assignpsg.js)_

## `sfdx gin:user:assignpsl [-f <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Inserts CPQ Permission Set License to Users

```
USAGE
  $ sfdx gin:user:assignpsl [-f <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -f, --userfilter=userfilter                                                       filter string for users

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  $ sfdx gin:user:assignpsl -u target_org"
```

_See code: [lib/commands/gin/user/assignpsl.js](https://github.com/globalinternet/gin-sfdx-plugin/blob/v1.1.1/lib/commands/gin/user/assignpsl.js)_

## `sfdx gin:user:create -p <string> -e <string> [-a] [-d <string>] [-r <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Creates user

```
USAGE
  $ sfdx gin:user:create -p <string> -e <string> [-a] [-d <string>] [-r <string>] [-u <string>] [--apiversion <string>] 
  [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -a, --generateuniqusername                                                        Generate a unique user name

  -d, --usernamedomain=usernamedomain                                               [default: globalinter.net] UserName
                                                                                    domain. E.g globalinter.net

  -e, --permissionsetnames=permissionsetnames                                       (required)
                                                                                    PermissionSet/PermissionSetGroup
                                                                                    names

  -p, --profilename=profilename                                                     (required) Profile name

  -r, --rolename=rolename                                                           Role name

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  $ sfdx gin:user:create --profilename Sales --permissionsetnames "Marketing, Sales" --roleName="SVP Manager"
```

_See code: [lib/commands/gin/user/create.js](https://github.com/globalinternet/gin-sfdx-plugin/blob/v1.1.1/lib/commands/gin/user/create.js)_

## `sfdx gin:user:resetpassword -t <string> [-o <string>] [-n <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Suspend/Enable sharing calculation

```
USAGE
  $ sfdx gin:user:resetpassword -t <string> [-o <string>] [-n <string>] [-u <string>] [--apiversion <string>] [--json] 
  [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -n, --password2=password2                                                         [default: GinTest@0@2!] New password

  -o, --password1=password1                                                         [default: GinTest@0@2!1] Temporary
                                                                                    password

  -t, --testusername=testusername                                                   (required) username to reset
                                                                                    password

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  $ sfdx gin:user:resetpassword -t testuser@example.test -u targetorg@org.test
```

_See code: [lib/commands/gin/user/resetpassword.js](https://github.com/globalinternet/gin-sfdx-plugin/blob/v1.1.1/lib/commands/gin/user/resetpassword.js)_
<!-- commandsstop -->
<!-- debugging-your-plugin -->
# Debugging your plugin
We recommend using the Visual Studio Code (VS Code) IDE for your plugin development. Included in the `.vscode` directory of this plugin is a `launch.json` config file, which allows you to attach a debugger to the node process when running your commands.

To debug the `hello:org` command: 
1. Start the inspector
  
If you linked your plugin to the sfdx cli, call your command with the `dev-suspend` switch: 
```sh-session
$ sfdx hello:org -u myOrg@example.com --dev-suspend
```
  
Alternatively, to call your command using the `bin/run` script, set the `NODE_OPTIONS` environment variable to `--inspect-brk` when starting the debugger:
```sh-session
$ NODE_OPTIONS=--inspect-brk bin/run hello:org -u myOrg@example.com
```

2. Set some breakpoints in your command code
3. Click on the Debug icon in the Activity Bar on the side of VS Code to open up the Debug view.
4. In the upper left hand corner of VS Code, verify that the "Attach to Remote" launch configuration has been chosen.
5. Hit the green play button to the left of the "Attach to Remote" launch configuration window. The debugger should now be suspended on the first line of the program. 
6. Hit the green play button at the top middle of VS Code (this play button will be to the right of the play button that you clicked in step #5).
<br><img src=".images/vscodeScreenshot.png" width="480" height="278"><br>
Congrats, you are debugging!
