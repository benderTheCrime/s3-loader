# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

#### [1.4.1] - 2016-05-25
##### Added
- Added "filename" option, which allows passage of a function to the Webpack
config to allow for more flexible filename to s3 key transforms.

### [1.4.0] - 2016-05-25
#### Added
- Added "filename" option, which allows passage of a function to the Webpack
config to allow for more flexible filename to s3 key transforms.

### [1.3.0] - 2016-04-30
#### Added
- Added "filename" option, which allows passage of a function to the Webpack
config to allow for more flexible filename to s3 key transforms.

### [1.2.0] - 2016-04-21
#### Removed
- Added "root" to additional options, which allows definition of a top-level
directory to which the s3 key will be shortened (stripping off any higher-level
directories from the key)
- Removed "relativity" from additional options

### [1.1.0] - 2016-04-20
#### Added
- Added "relativity" as an option, which prevents any key-based relativity from
being removed from the front of the s3 key. (eg.: "../" or "~/")

#### [1.0.1] - 2016-03-20
##### Fixed
- Fixed an issue with depth properly being registered
- Fixed an issue with creating directories only after an error resulting from a
directory not existing was caught