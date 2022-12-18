import {writeMarkdown} from "./mod.ts";

writeMarkdown("mod.ts","README.md",{
    additionalInfo: {
        title: "MarkDeno",
        content: `MarkDeno is a library that turns your code into markdown documentation.
        
> **MarkDeno is a work in progress, so be patient as new tags and kinds are added.**

### Supported JSDoc Tags (more coming soon)
> **1.** \`param\`
> **2.** \`example\`

### Supported Kinds (more coming soon)
> **1.** \`function\``
    }
});