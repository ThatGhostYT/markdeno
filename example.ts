import {writeMarkdown} from "./mod.ts";

writeMarkdown("mod.ts","README.md",{
    additionalInfo: {
        title: "MarkDeno",
        content: `[![ci](https://github.com/ThatGhostYT/markdeno/actions/workflows/ci.yml/badge.svg)](https://github.com/ThatGhostYT/markdeno/actions/workflows/ci.yml)
        
MarkDeno is a library that turns your code into markdown documentation.
        
> **MarkDeno is a work in progress, so be patient as new tags and kinds are added.**

\`\`\`ts
import * as MarkDeno from "https://deno.land/x/markdeno/mod.ts";

MarkDeno.writeMarkdown("input.ts","output.md");
\`\`\`

### Supported JSDoc Tags (more coming soon)
> **1.** \`param\`
> **2.** \`example\`
> **3.** \`returns\`

### Supported Kinds (more coming soon)
> **1.** \`function\`
> **2.** \`interface\`
> **3.** \`variable\`
> **4.** \`import\``
    }
});