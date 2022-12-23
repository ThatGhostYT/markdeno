## MarkDeno

[![ci](https://github.com/ThatGhostYT/markdeno/actions/workflows/ci.yml/badge.svg)](https://github.com/ThatGhostYT/markdeno/actions/workflows/ci.yml)

        

MarkDeno is a library that turns your code into markdown documentation.

        

> **MarkDeno is a work in progress, so be patient as new tags and kinds are added.**

```ts

import * as MarkDeno from "https://deno.land/x/markdeno/mod.ts";

MarkDeno.writeMarkdown("input.ts","output.md");

```

### Supported JSDoc Tags (more coming soon)

> **1.** `param`

> **2.** `example`

> **3.** `returns`

### Supported Kinds (more coming soon)

> **1.** `function`

> **2.** `interface`

> **3.** `variable`

> **4.** `import`

## Documentation

interface **Config**{

	**displayOrigin**: *boolean*

	Show the line and collumn where the declaration of the item can be found. Default: true.

	Declared at: `mod.ts:3:0`

	**additionalInfo**: *typeLiteral*

	Additional info to add to teh beginning or end of the markdown file.

	Declared at: `mod.ts:3:0`

	**defaultLanguage**: *string*

	Default language for code blocks. If not provided, then it will be the language of the file being documented. Default: File Extension.

	Declared at: `mod.ts:3:0`

}

Declared at: `mod.ts:3:0`

async function **getDocumentationJSON**(**input**: *string*)

Returns a parsed version of the json object returned by `deno doc --json`

> @param {*string*} **input** *File to document.*

> @returns {*Promise<denoDoc.DocNode[]>*} 

> @example

```ts

const json = await MarkDeno.getDocumentationJSON("file.ts");

```

Declared at: `mod.ts:42:0`

async function **getDocumentationJSONString**(**input**: *string*)

Returns an unparsed version of the json object returned by `deno doc --json`

> @param {*string*} **input** *File to document.*

> @returns {*Promise<string>*} 

> @example

```ts

const json = await MarkDeno.getDocumentationJSONString("file.ts");

```

Declared at: `mod.ts:60:0`

async function **getDenoDocResult**(**input**: *string*)

Returns the result of `deno doc` without color. Note that `deno doc` does NOT return markdown.

> @param {*string*} **input** *File to document.*

> @returns {*Promise<string>*} 

> @example

```ts

console.log(await MarkDeno.getDenoDocResult("file.ts"));

```

Declared at: `mod.ts:76:0`

function **amplifyNewlines**(**markdown**: *string*)

Amplifies new lines so that no new lines are ignored.

> @param {*string*} **markdown** *Markdown to amplify new lines in.*

> @returns {*string*} 

> @example

```ts

Deno.writeFile("output.md",amplifyNewlines(`## Amplified Newlines

> Amplifies new lines.

> So that **none** of them are ignored.

`));

```

Declared at: `mod.ts:96:0`

async function **writeMarkdown**(**input**: *string*,**output**: *string*,**config**?: *Config*)

Analyzes an input file and writes to a specified output file.

> @param {*string*} **input** *Input file to analyze.*

> @param {*string*} **out** *Output file to write markdown too.*

> @param {*Config*} **config** *Optional configurations for the parser.*

> @returns {*Promise<void>*} 

> @example

```ts

MarkDeno.writeMarkdown("file.ts","output.md");

```

Declared at: `mod.ts:109:0`

import "[**https://deno.land/x/deno_doc@0.51.0/lib/types.d.ts**](https://deno.land/x/deno_doc@0.51.0/lib/types.d.ts)"

Declared at: `mod.ts:1:0`

> **Documentation Generated with MarkDeno.**