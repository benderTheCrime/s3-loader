## s3-loader
Load Webpack bundle dependencies from s3

This library allows you to pull s3 dependencies into your Webpack bundle from
s3 for control over assets across different environments, or to create local
"aliases" for files you would prefer not to store on your local machine.

### Usage
I recommend this package be used in a switch of some sort to control assets
coming from different buckets and different environments. Under no circumstance
should AWS information be checked into a Git repository. A useful tool in this
respect is [dotenv](https://github.com/motdotla/dotenv "dotenv").

#### File Configuration
First, we need a file to load. Create an arbitrary JSON file in the root of
your project, `index.json`. Then, from `index.js`, also in the root:

```javascript
import data from `index.json`;
```

By default, this loader will use only the name of the file as the key by which
to load content from s3, for additional path options, see
[Additional Options](#additional-options).

*NOTE: It is important to understand that this file still must exist on your
filesystem in order to bundle it. If you do not want to check this file into
your repository, touch it, and add it to `.gitignore`. You can use resolvers to
conditionally create these files for you.*

#### Webpack Configuration
We now configure our Webpack! In `webpack.config.js` (or wherever you add your
configuration):

```javascript
{
    module: {
        loaders: [
            {
                test: /\.json$/,
                loaders: 'json!s3'
            }
        ]
    }
}
```

I'm also guessing that your intent is not only to load text, but to use the
content from s3 in some capacity, which means that it will probably be used in
tandem with another loader. The above loader configuration specifies that the s3
loader should load file content from s3 and then the `json-loader` package
should load the content of the JSON into the bundle.

##### s3 Options
AWS keys and bucket names necessary to load data from s3 can be added to the
Webpack configuration in two ways, either through `s3Options` at the root of
your config:

```javascript
{
    s3Options: {
        accessKeyId: '',
        secretAccessKey: '',
        bucketName: ''
    }
}
```

Or as a loader query string:

```javascript
{
    module: {
        loaders: [
            {
                test: /\.json$/,
                loaders: 'json!s3?' + JSON.stringify({
                    accessKeyId: '',
                    secretAccessKey: '',
                    bucketName: ''
                })
            }
        ]
    }
}
```

##### Additional Options

| key       | description                                                                  |
|-----------|------------------------------------------------------------------------------|
| depth     | The number of additional "folders" to add to the s3 key from the filename    |
| prefix    | A string path to prefix on to the s3 key from the filename                   |
| overwrite | Whether or not to replace the file on the local filesystem with the s3 asset |