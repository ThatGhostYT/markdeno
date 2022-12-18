interface Config{
    /**
     * Show the line and collumn where the declaration of the item can be found. Default: true.
     */
    displayOrigin?: boolean;

    /**
     * Additional info to add to teh beginning or end of the markdown file.
     */
    additionalInfo?: {
        /**
         * Content to be displayed. Markdown works.
         */
        content?: string;

        /**
         * Where to place the content, at the start or end of the file. Default: start.
         */
        placement?: "start" | "end";

        /**
         * What to display as the title for the additional information. Default: "Additional Information".
         */
        title?: string
    }

    /**
     * Default language for code blocks. If not provided, then it will be the language of the file being documented. Default: File Extension.
     */
    defaultLanguage?: string;
}

/**
 * Returns a parsed version of the json object returned by `deno doc --json`
 * @param {string} input File to document.
 * @example
 * const json = await MarkDeno.getDocumentationJSON("file.ts");
 */
export async function getDocumentationJSON(input: string){
    const p = Deno.run({
        cmd: ["deno","doc","--json",input],
        stdout: "piped"
    });

    const cmdout = new TextDecoder().decode(await p.output());

    return JSON.parse(cmdout);
}

/**
 * Returns an unparsed version of the json object returned by `deno doc --json`
 * @param {string} input File to document.
 * @example
 * const json = await MarkDeno.getDocumentationJSONString("file.ts");
 */
export async function getDocumentationJSONString(input: string){
    const p = Deno.run({
        cmd: ["deno","doc","--json",input],
        stdout: "piped"
    });

    return new TextDecoder().decode(await p.output());
}

/**
 * Returns the result of `deno doc` without color. Note that `deno doc` does NOT return markdown.
 * @param {string} input File to document.
 * @example
 * console.log(await MarkDeno.getDenoDocResult("file.ts"));
 */
export async function getDenoDocResult(input: string){
    const p = Deno.run({
        cmd: ["deno","doc",input],
        stdout: "piped"
    });

    return (new TextDecoder().decode(await p.output())).replace(/\[[0-9]*(?:;[0-9]*)*?m/g,"");
}

/**
 * Analyzes an input file and writes to a specified output file.
 * @param {string} input Input file to analyze.
 * @param {string} out Output file to write markdown too.
 * @param {Config} config Optional configurations for the parser.
 * @example
 * MarkDeno.writeMarkdown("file.ts","output.md");
 */
export async function writeMarkdown(input: string,output: string,config?: Config): Promise<void>{
    const json = await getDocumentationJSON(input);
    
    const s = input.split(".");
    
    const con = {
        displayOrigin: config?.displayOrigin || true,
        additionalInfo: {
            content: config?.additionalInfo?.content || "",
            placement: config?.additionalInfo?.placement || "start",
            title: config?.additionalInfo?.title || "Additional Info"
        },
        defaultLanguage: config?.defaultLanguage || s[s.length - 1]
    }

    // deno-lint-ignore no-explicit-any
    function parseJSDOC(tag: any){
        let res = "";
        switch(tag.kind){
            case "param": {
                res += `\n> @param ${tag.type ? `{*${tag.type}*} ` : ""}**${tag.name}**${tag.doc !== undefined ? ` *${tag.doc}*` : ""}`;
                break;
            }

            case "example": {
                if(/```.*?\n(?:.|\n)+\n```/g.test(tag.doc)){
                    res += `\n> @example\n${tag.doc}\n`;
                } else{
                    res += `\n> @example\n\`\`\`${con.defaultLanguage}\n${tag.doc}\n\`\`\``
                }
                break;
            }

            default: {
                res += `\n> @${tag.kind}`;
            }
        }
        return res;
    }

    let code = "## Documentation\n\n";
    let increment = 0;
    for(const i of json){
        increment++;
        switch(i.kind){
            case "function": {
                // deno-lint-ignore no-explicit-any
                if("jsDoc" in i && "tags" in i.jsDoc && i.jsDoc.tags.map((v: any) => v.kind).includes("deprecated")) code += `${i.declarationKind} ${i.functionDef.isAsync ? "async" : ""}function ~~${i.name}~~(`;
                else code += `${i.functionDef.isAsync ? "async " : ""}function **${i.name}**(`;

                let inc = 0;
                for(const param of i.functionDef.params){
                    inc++;
                    code += `**${param.name ? param.name : param.kind}**${param.optional ? "?" : ""}: *${param.tsType !== null ? param.tsType.repr : "any"}*`;
                    if(i.functionDef.params.length !== inc) code += ",";
                }

                code += ")";
                if("jsDoc" in i && "doc" in i.jsDoc) code += "\n\n" + i.jsDoc.doc;
                
                if("jsDoc" in i && "tags" in i.jsDoc && i.jsDoc.tags.length > 0){
                    for(const tag of i.jsDoc.tags){
                        code += parseJSDOC(tag);
                    }
                }
                break;
            }
        }

        if(con.displayOrigin) code += `\n\nDeclared at: \`${input}:${i.location.line}:${i.location.col}\``;
        if(json.length !== increment) code += "\n\n";
    }

    if(con.additionalInfo.content){
        if(con.additionalInfo.placement === "start") code = `${"## " + con.additionalInfo.title}\n\n${con.additionalInfo.content}\n\n${code}`;
        else code += `\n\n${"## " + con.additionalInfo.title}\n\n${con.additionalInfo.content}`;
    }

    code += "\n\n> **Documentation Generated with MarkDeno.**"

    Deno.writeFile(output,new TextEncoder().encode(code));
}