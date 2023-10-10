# Patch Notes

## v7
### 7.1.1
> News
- Updated README.

- Removed 'autoWrite' option from Database.

> Misc
- Some improvements.

> Fixes
- Interface-import based bugs are fixed.

### 7.1.0
> News
- Added DatabaseManager. (*)
- Added BSON driver.

- Removed 'useOldSaveMethod' option from Database.
- Removed 'useHexEncoding' option from Database.
- Removed 'ping' function from Database.
- Driver class is now abstract and protected.
- The 'concat' function is now public in Database.

> Misc
- Some improvements.

> Fixes
- Small bug fixed in 'all' function of database.

* Experimental feature

### 7.0.0
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

## v6

### 6.1.3
> Fixes
- tsconfig fixed.

### 6.1.0 & 6.1.1 & 6.1.2
> News
- New option added: 'experimentalFeatures' - This option currently changes save method. (Increases performance but this may damage your database.)
  * Updates your database before exiting the NodeJS Process.
- Some performance improvements.
- Drivers improved.
> Fixes
- Some typings are fixed.
- Some bugs are fixed.

### 6.0.2
> News
- DatabaseError added again.
- Some performance improvements.

### 6.0.1
> Fixes
- Some typing paths fixed in package.json file.

### 6.0.0
> News
- Rewritten with TypeScript.
- 'copy' function removed.
- 'concat' function is now static.
- Update notifier removed.
- DatabaseError removed.
> Fixes
- All known bugs are fixed.

## v5

### 5.1.9
> News
- Update notifier updated.
- 'checkUpdate' option added.
- 'ping' function improved.
> Fixes
- Some bugs fixed.

### 5.1.8
> News
- Added update notifier.

### 5.1.7
> News
- Some improvements.

### 5.1.6
> Fixes
- Some bugs fixed.

### 5.1.5 
> Fixes
- Some bugs fixed.

### 5.1.4
> News
- HJSON database removed.

### 5.1.3
> News
- Removed some unnecessary codes.
 
### 5.1.2
> News
- Some improvements.
- 'ping' function added.
- 'update' and 'partition' functions are removed.
> Fixes
- Some bugs fixed.
- Some typing bugs fixed.

### 5.1.1
> Fixes
- Some bugs fixed.

### 5.1.0
> News
- DatabaseError now shows error file and line.
> Fixes
- Some typings fixed.
- Some bugs fixed.

### 5.0.3
> Fixes
- Some typings fixed.

### 5.0.2
> News
- Some improvements.
> Fixes
- Some bugs fixed.
