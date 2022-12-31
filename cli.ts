import {Command} from "https://deno.land/x/cliffy@v0.25.6/command/mod.ts";
import * as MarkDeno from "./mod.ts";

await new Command()
    .name("markdeno")
    .version("0.0.3")
    .description("Deno library to generate documentation markdown.")
    .command("doc <input:string> <output:string>","Generates markdown based on an input file.")
    .option("-c, --config <config:string>","Configuration file for documentation generation.")
    .action(({config},input,output) => {
        if(config){
            const file: MarkDeno.Config = JSON.parse(new TextDecoder().decode(Deno.readFileSync(config)));

            MarkDeno.writeMarkdown(input,output,file);
        } else MarkDeno.writeMarkdown(input,output);
    })
    .command("denoDoc <input:string>","Returns the uncolored result of deno doc.")
    .option("-o, --output <output:string>","Optional output to write to.")
    .option("-j, --json","Whether to write the deno doc json to a file or not.",{
        depends: ["output"]
    })
    .action(async ({output,json},input) => {
        if(json){
            const result = await MarkDeno.getDocumentationJSONString(input);
            Deno.writeFile(output!,new TextEncoder().encode(result));
        } else{
            const result = await MarkDeno.getDenoDocResult(input);
            if(!output){
                console.log(result);
            } else Deno.writeFile(output,new TextEncoder().encode(result));
        }
    })
    .command("reinstall","Reinstalls the markdeno cli.")
    .option("-r, --release <release:string>","Release to install, if not provided then it will install the most recent one.")
    .action(async ({release}) => {
        if(!release){
            console.log("> deno install --allow-run --allow-write --allow-read -n markdeno -rf https://deno.land/x/markdeno/cli.ts");

            const p = Deno.run({
                cmd: ["deno","install","--allow-run","--allow-write","--allow-read","-n","markdeno","-rf","https://deno.land/x/markdeno/cli.ts"],
                stdout: "piped"
            });

            console.log(new TextDecoder().decode(await p.output()));
        } else{
            console.log(`> deno install --allow-run --allow-write --allow-read -n markdeno -f https://deno.land/x/markdeno@v${release}/cli.ts`);

            const p = Deno.run({
                cmd: ["deno","install","--allow-run","--allow-write","--allow-read","-n","markdeno","-f",`https://deno.land/x/markdeno@v${release}/cli.ts`],
                stdout: "piped"
            });

            console.log(new TextDecoder().decode(await p.output()));
        }
    })
    .command("uninstall","Uninstalls the markdeno cli.")
    .action(async () => {
        console.log("> deno uninstall markdeno");

        const p = Deno.run({
            cmd: ["deno","uninstall","markdeno"],
            stdout: "piped"
        });

        console.log(new TextDecoder().decode(await p.output()));
    })
    .parse(Deno.args);