<div>
  <p>
    <a href='https://github.com/erqeweew/hyprdb/actions/workflows/npm.yml'><img src='https://github.com/erffy/hyprdb/actions/workflows/npm.yml/badge.svg'/></a>
    <a href='https://github.com/erqeweew/hyprdb/actions/workflows/github-code-scanning/codeql'><img src='https://github.com/erqeweew/hyprdb/actions/workflows/github-code-scanning/codeql/badge.svg'/></a>
    <br/>
    <a href='https://npmjs.com/hypr.db'><img src='https://img.shields.io/npm/v/hypr.db'/></a>
    <a href='https://npmjs.com/hypr.db'><img src='https://img.shields.io/npm/l/hypr.db'/></a>
    <!-- <a href='https://socket.dev/npm/package/hypr.db/issues'><img src='https://socket.dev/api/badge/npm/package/hypr.db'/></a> -->
    <br/>
    <a href='https://npmjs.com/hypr.db'><img src='https://img.shields.io/github/issues/erqeweew/hyprdb'/></a>
  </p>
</div>

# Hyper Database

- Faster, Lightweight and Small advanced Database.

## Installation

- This part has been moved to [GitHub Wiki](https://github.com/erqeweew/hyprdb/wiki)
- Full ChangeLog: [Click Here](https://github.com/erqeweew/hyprdb/wiki/Updates)

## Usage
- [Snappify](https://snappify.com/embed/ec1c6ac6-dda8-4c92-99f0-a2d49c2bf834?responsive=1)

## ChangeLog
#### IMPORTANT
- In v7 version, all drivers have been removed. We only use JSON, because we now write into it in hex and json format using the '.vstore' and '.json' extension.
  * If you want to use other drivers please use v6.
  
> News
- Added '.vstore' for hex encoding. If you want to enable, pass the 'useHexEncoding: true' in database driver options.
- DatabaseError removed.
- Some improvements.
- Some driver functions are now 'protected' instead of 'public': read and save.
- 'value' is now required argument.
- Experimental Save method (tested and) changed with old save method.
  * If you want to use old save method pass the 'useOldSaveMethod: true' option in driver options.
    * Note: This option will be removed in future v7 releases.
> Fixes
- Some typing bugs are fixed.
- Some bugs are fixed.
