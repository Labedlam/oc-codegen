## Open API Specification

The [OpenAPI Specification](https://swagger.io/docs/specification/about/) formerly known as the Swagger Specification is a standard for describing, consuming and visualizing RESTful APIs. The OrderCloud API publishes a new definition of itself every time a new version is released. This enables OrderCloud developers to generate SDKs, API documentation, and even the [Devcenter](https://developer.ordercloud.io).

This tool takes in an OrderCloud OpenAPI spec along with a set of templates and generates an output. In our case, that output is a set of javascript SDKs but it really could be anything that needs data about the OrderCloud API. Our hope is that outside developers might find some use for it as well, perhaps for an SDK in another language not familiar to us.

## Install

```shell
npm install @ordercloud/oc-codegen
```

or

```shell
yarn add @ordercloud/oc-codegen
```

## Usage

### With the command-line interface

```shell
oc-codegen --help

Usage: oc-codegen [options]

A codegen tool for the OrderCloud API

Options:
-v, --version output the version number
-i, --input-spec <path> (required) path to valid openapi spec v3.0.0+
-t, --templates-folder <folder> (required) where to locate handlebars templates
-o, --output-folder <folder> where to write the generated files (defaults to current directory)
-b, --handlebars-extensions <filepath> path to external handlebars extensions file (defaults to empty)
-c, --clean cleans directory before generating
-d, --debug prints formatted spec passed to handlebars
-h, --help output usage information
```

#### Examples

The shortest possible syntax

<!--
TODO: make input spec an optional parameter when
we have this deployed somewhere (default to prod api spec url)
-->

```shell
oc-codegen -i './path/to/oc-spec.json' -t './path/to/templates-folder';
```

This will feed the formatted swagger spec to your handlebars templates and output the content to the current directory

### As a module in your project

#### Using imports

<!--
TODO: make input spec an optional parameter when
we have this deployed somewhere (default to prod api spec url)
-->

```javascript
import path from 'path';
import codegen from '@ordercloud/oc-codegen';

codegen
  .generate({
    inputSpec: path.resolve(__dirname, 'path/to/oc-spec.json'),
    templatesFolder: path.resolve(__dirname, 'path/to/templates-folder'),
    outputFolder: null, // default: current directory
    handlebarsExtensions: null,
    clean: true,
    debug: false,
  })
  .then(function() {
    console.log('Done!');
  })
  .catch(function(err) {
    console.error('Something went wrong: ' + err.message);
  });
```

#### Using requires

```javascript
const codegen = require('@ordercloud/oc-codegen');
const path = require('path');

codegen.default
  .generate({
    inputSpec: path.resolve(__dirname, '/path/to/oc-spec.json'),
    templatesFolder: path.resolve(__dirname, '/path/to/templates-folder'),
    outputFolder: null, // default: current directory
    handlebarsExtensions: null,
    clean: true,
    debug: false,
  })
  .then(function() {
    console.log('Done!');
  })
  .catch(function(err) {
    console.error('Something went wrong: ' + err.message);
  });
```

## Creating your own templates

Templates define the skeleton for how your code will be generated. We use [handlebars](https://handlebarsjs.com/) for the templating engine. There are three different types of files that can exist in your templates directory:

1. Static - copied over as-is with no dynamic content
2. Static Template - copied over once and processed by handlebars
3. Contextual Template - generates multiple files with one handlebars template where each file is a different context (resource, model, or operation)

### Template Data

Each template has access to the [formatted ordercloud spec](../src/models/formattedSpec.model.ts). Additionally, contextual templates get injected with data for each context (operation, resource, or model)

The debug option will print the formatted spec to stdout which you can then pipe into a file. For example:

<!--
TODO: make input spec an optional parameter when
we have this deployed somewhere (default to prod api spec url)
-->

```shell
oc-codegen -i './path/to/oc-spec.json' -d > formattedSpec.json
```

### Example Templates Directory

Consider the following directory

```shell
templates
│   README.md.hbs
│
└───models
    │   _MODEL_.js.hbs
    │   ExtraModel.js
```

`README.md.hbs` is a static template and as such will generate one `README.md` file but will have context from the formatted spec to add dynamic data. For example we might want to set API version in the readme.

`_MODEL_.js.hbs` is a contextual template. The `_MODEL_` piece will be replaced by the current model being generated and have context injected for that model. To generate a contextual resource template include `_RESOURCE_` in the file name and similarly for contextual operation templates include `_OPERATION_` in the file name.

`ExtraModel.js` is a static file that will simply get copied over as-is during code generation

### Custom Handlebars Helpers

Its very likely you'll need to format the data from the spec for your templates. In addition to the standard handlebars helpers you can define your own custom helpers to accomplish this.

First create a file in your project like this and put your handlebars helpers in there

```javascript
function handlebarsExt(Handlebars) {
  /**
   * Function to append 'bar' to the end of a word
   */
  Handlebars.registerHelper('appendBar', word => {
    return word + 'bar';
  });
}
module.exports = handlebarsExt;
```

Now simply use the helper in your handlebars template and then when you call the cli pass it the path to the extensions file so that the cli can register the helpers prior to compilation.

<!--
TODO: make input spec an optional parameter when
we have this deployed somewhere (default to prod api spec url)
-->

```shell
oc-codegen -i './path/to/oc-spec.json' -t './path/to/templates-folder' -b './path/to/handlebars-extensions';
```

<!-- TODO: ADD LINKS once SDKs are done
### Real Examples

- Javascript SDK
- AngularJS SDK
- Angular SDK
 -->
