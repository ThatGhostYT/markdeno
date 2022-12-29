import {Command} from "https://deno.land/x/cliffy@v0.25.6/command/mod.ts";
import * as MarkDeno from "./mod.ts";

await new Command()
    .name("markdeno")
    .version("0.0.1")
    .description("Deno library to generate documentation markdown.")
    .command("doc <input:string> <output:string>","Generates markdown based on an input file.")
    .action((_,input,output) => {
        MarkDeno.writeMarkdown(input,output);
    })
    .command("denoDoc <input:string>","Returns the uncolored result of deno doc.")
    .option("-o, --output <output:string>","Optional output to write to.")
    .action(async ({output},input) => {
        const result = await MarkDeno.getDenoDocResult(input);
        if(output == undefined){
            console.log(result);
        } else Deno.writeFile(output,new TextEncoder().encode(result));
    })
    .parse(Deno.args);