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
        if(!output){
            console.log(result);
        } else Deno.writeFile(output,new TextEncoder().encode(result));
    })
    .command("reinstall","Reinstalls the markdeno cli.")
    .option("-r, --release <version:string>","Version to install, if not provided then it will install the most recent.")
    .action(async ({release}) => {
        if(!release){
            console.log("> deno install --allow-run --allow-write -n markdeno -f https://deno.land/x/markdeno/cli.ts");

            const p = Deno.run({
                cmd: ["deno","install","--allow-run","--allow-write","-n","markdeno","-f","https://deno.land/x/markdeno/cli.ts"],
                stdout: "piped"
            });

            console.log(new TextDecoder().decode(await p.output()));
        } else{
            console.log(`> deno install --allow-run --allow-write -n markdeno -f https://deno.land/x/markdeno@${release}/cli.ts`);

            const p = Deno.run({
                cmd: ["deno","install","--allow-run","--allow-write","-n","markdeno","-f",`https://deno.land/x/markdeno@${release}/cli.ts`],
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