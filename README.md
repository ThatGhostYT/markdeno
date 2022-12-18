## MarkDeno

MarkDeno is a library that turns your code into markdown documentation.
        
> **MarkDeno is a work in progress, so be patient as new tags and kinds are added.**

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

Declared at: `mod.ts:39:0`

async function **getDocumentationJSONString**(**input**: *string*)

Returns an unparsed version of the json object returned by `deno doc --json`
> @param {*string*} **input** *File to document.*
> @example
```ts
const json = await MarkDeno.getDocumentationJSONString("file.ts");
```

Declared at: `mod.ts:56:0`

async function **getDenoDocResult**(**input**: *string*)

Returns the result of `deno doc` without color. Note that `deno doc` does NOT return markdown.
> @param {*string*} **input** *File to document.*
> @example
```ts
console.log(await MarkDeno.getDenoDocResult("file.ts"));
```

Declared at: `mod.ts:71:0`

async function **writeMarkdown**(**input**: *string*,**output**: *string*,**config**?: *Config*)

Analyzes an input file and writes to a specified output file.
> @param {*string*} **input** *Input file to analyze.*
> @param {*string*} **out** *Output file to write markdown too.*
> @param {*Config*} **config** *Optional configurations for the parser.*
> @example
```ts
MarkDeno.writeMarkdown("file.ts","output.md");
```

Declared at: `mod.ts:88:0`

> **Documentation Generated with MarkDeno.**