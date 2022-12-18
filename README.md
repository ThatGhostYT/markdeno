## MarkDeno

MarkDeno is a library that turns your code into markdown documentation.
        
> **MarkDeno is a work in progress, so be patient as new tags and kinds are added.**

```ts
import * as MarkDeno from "https://deno.land/x/markdeno/mod.ts";

MarkDeno.writeMarkdown("input.ts","output.md");
```

### Supported JSDoc Tags (more coming soon)
> **1.** `param`
> **2.** `example`

### Supported Kinds (more coming soon)
> **1.** `function`

## Documentation

async function **getDocumentationJSON**(**input**: *string*)

Returns a parsed version of the json object returned by `deno doc --json`
> @param {*string*} **input** *File to document.*
> @example
```ts
const json = await MarkDeno.getDocumentationJSON("file.ts");
```

async function **getDocumentationJSONString**(**input**: *string*)

Returns an unparsed version of the json object returned by `deno doc --json`
> @param {*string*} **input** *File to document.*
> @example
```ts
const json = await MarkDeno.getDocumentationJSONString("file.ts");
```

async function **getDenoDocResult**(**input**: *string*)

Returns the result of `deno doc` without color. Note that `deno doc` does NOT return markdown.
> @param {*string*} **input** *File to document.*
> @example
```ts
console.log(await MarkDeno.getDenoDocResult("file.ts"));
```

async function **writeMarkdown**(**input**: *string*,**output**: *string*,**config**?: *Config*)

Analyzes an input file and writes to a specified output file.
> @param {*string*} **input** *Input file to analyze.*
> @param {*string*} **out** *Output file to write markdown too.*
> @param {*Config*} **config** *Optional configurations for the parser.*
> @example
```ts
MarkDeno.writeMarkdown("file.ts","output.md");
```

> **Documentation Generated with MarkDeno.**