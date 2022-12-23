import * as denoDoc from "https://deno.land/x/deno_doc@0.51.0/lib/types.d.ts";

export interface Config{
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

    /**
     * Whether to automatically amplify new lines or not.
     */
    amplifyNewlines?: boolean;
}

/**
 * Returns a parsed version of the json object returned by `deno doc --json`
 * @param {string} input File to document.
 * @returns {Promise<denoDoc.DocNode[]>}
 * @example
 * const json = await MarkDeno.getDocumentationJSON("file.ts");
 */
export async function getDocumentationJSON(input: string): Promise<denoDoc.DocNode[]>{
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
 * @returns {Promise<string>}
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
 * @returns {Promise<string>}
 * @example
 * console.log(await MarkDeno.getDenoDocResult("file.ts"));
 */
export async function getDenoDocResult(input: string){
    const p = Deno.run({
        cmd: ["deno","doc",input],
        stdout: "piped"
    });

    return (new TextDecoder().decode(await p.output())).replace(/\[[0-9]*(?:;[0-9]+)*?m/g,"");
}

/**
 * Amplifies new lines so that no new lines are ignored.
 * @param {string} markdown Markdown to amplify new lines in.
 * @returns {string}
 * @example
 * Deno.writeFile("output.md",amplifyNewlines(`## Amplified Newlines
 * 
 * > Amplifies new lines.
 * > So that **none** of them are ignored.
 * `));
 */
export function amplifyNewlines(markdown: string){
    return markdown.replace(/\n+/g,"\n\n");
}

/**
 * Analyzes an input file and writes to a specified output file.
 * @param {string} input Input file to analyze.
 * @param {string} out Output file to write markdown too.
 * @param {Config} config Optional configurations for the parser.
 * @returns {Promise<void>}
 * @example
 * MarkDeno.writeMarkdown("file.ts","output.md");
 */
export async function writeMarkdown(input: string,output: string,config?: Config): Promise<void>{
    const json = await getDocumentationJSON(input);
    
    const s = input.split(".");
    
    const con = {
        displayOrigin: config?.displayOrigin ?? true,
        additionalInfo: {
            content: config?.additionalInfo?.content || "",
            placement: config?.additionalInfo?.placement || "start",
            title: config?.additionalInfo?.title || "Additional Info"
        },
        defaultLanguage: config?.defaultLanguage || s[s.length - 1],
        amplifyNewlines: config?.amplifyNewlines ?? true
    }

    function parseJSDOC(tag: denoDoc.JsDocTag){
        let res = "";
        switch(tag.kind){
            case "param": {
                res += `\n> @param ${tag.type ? `{*${tag.type}*} ` : ""}**${tag.name}**${tag.doc !== undefined ? ` *${tag.doc}*` : ""}`;
                break;
            }

            case "example": {
                if(/```.*?\n(?:.|\n)+\n```/g.test(tag.doc!)){
                    res += `\n> @example\n${tag.doc}\n`;
                } else{
                    res += `\n> @example\n\`\`\`${con.defaultLanguage}\n${tag.doc}\n\`\`\``
                }
                break;
            }

            case "return": {
                res += `\n> @returns ${tag.type ? `{*${tag.type}*} ` : ""}${tag.doc ? ` *${tag.doc}*` : ""}`;
                break;
            }

            default: {
                res += `\n> @${tag.kind}`;
            }
        }
        return res;
    }

    function parseParam(param: denoDoc.ParamDef){
        let res = "";
        switch(param.kind){
            case "identifier": {
                res += `**${param.name ? param.name : param.kind}**${param.optional ? "?" : ""}: *${param.tsType !== null ? param.tsType!.repr : "any"}*`
                break;
            }

            case "assign": {
                res += parseParam(param.left);
                break;
            }

            case "array": {
                res += "[";
                let inc = 0;
                for(const elem of param.elements){
                    inc++;
                    res += parseParam(elem!);
                    if(param.elements.length !== inc) res += ", ";
                }
                res += "]";
                break;
            }

            case "object": {
                res += "{";
                let inc = 0;
                for(const elem of param.props){
                    inc++;
                    res += elem.kind === "keyValue" ? elem.key : "";
                    if(param.props.length !== inc) res += ", ";
                }
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
                if("jsDoc" in i && "tags" in i.jsDoc! && i.jsDoc.tags!.map((v) => v.kind).includes("deprecated")) code += `${i.declarationKind} ${i.functionDef.isAsync ? "async" : ""}function ~~${i.name}~~(`;
                else code += `${i.functionDef.isAsync ? "async " : ""}function **${i.name}**(`;

                let inc = 0;
                for(const param of i.functionDef.params){
                    inc++;
                    code += parseParam(param);
                    if(i.functionDef.params.length !== inc) code += ",";
                }

                code += ")";
                if("jsDoc" in i && "doc" in i.jsDoc!) code += "\n\n" + i.jsDoc.doc;
                
                if("jsDoc" in i && "tags" in i.jsDoc! && i.jsDoc.tags!.length > 0){
                    for(const tag of i.jsDoc.tags!){
                        code += parseJSDOC(tag);
                    }
                }
                break;
            }

            case "interface": {
                code += `interface **${i.name}**`;

                let inc = 0;
                for(const ex of i.interfaceDef.extends){
                    inc++;
                    if(inc === 1) code += " extends ";
                    code += ex.repr;
                    if(i.interfaceDef.extends.length !== inc) code += ",";
                }

                code += "{\n"

                inc = 0;
                for(const method of i.interfaceDef.methods){
                    inc++;
                    code += "\t";
                    if(method.kind === "getter") code += "*get*";
                    else if(method.kind === "setter") code += "*set*";

                    code += ` **${method.name}**(`;
                    
                    inc = 0;
                    for(const param of method.params){
                        inc++;
                        code += parseParam(param);
                        if(method.params.length !== inc) code += ",";
                    }

                    code += ")";

                    if("jsDoc" in method && "doc" in method.jsDoc!) code += "\n\n\t" + method.jsDoc.doc;
                
                    if("jsDoc" in method && "tags" in method.jsDoc! && method.jsDoc.tags!.length > 0){
                        for(const tag of method.jsDoc.tags!){
                            code += "\t" + parseJSDOC(tag);
                        }
                    }

                    if(con.displayOrigin) code += `\n\n\tDeclared at: \`${input}:${i.location.line}:${i.location.col}\``;
                    if(i.interfaceDef.methods.length + i.interfaceDef.properties.length !== inc) code += "\n\n";
                }

                for(const property of i.interfaceDef.properties){
                    inc++;
                    code += `\t**${property.name}**: *${property.tsType?.repr || property.tsType?.kind}*`;

                    if("jsDoc" in property && "doc" in property.jsDoc!) code += "\n\n\t" + property.jsDoc.doc;
                
                    if("jsDoc" in property && "tags" in property.jsDoc! && property.jsDoc.tags!.length > 0){
                        for(const tag of property.jsDoc.tags!){
                            code += "\t" + parseJSDOC(tag);
                        }
                    }

                    if(con.displayOrigin) code += `\n\n\tDeclared at: \`${input}:${i.location.line}:${i.location.col}\``;
                    if(i.interfaceDef.methods.length + i.interfaceDef.properties.length !== inc) code += "\n\n";
                }

                code += "\n}";
                break;
            }

            case "variable": {
                code += `${i.variableDef.kind} **${i.name}**: *${i.variableDef.tsType?.repr}*`
            
                if("jsDoc" in i && "doc" in i.jsDoc!) code += "\n\n" + i.jsDoc.doc;
                
                if("jsDoc" in i && "tags" in i.jsDoc! && i.jsDoc.tags!.length > 0){
                    for(const tag of i.jsDoc.tags!){
                        code += parseJSDOC(tag);
                    }
                }
                break;
            }

            case "import": {
                code += `import "[**${i.importDef.src}**](${i.importDef.src})"`
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

    Deno.writeFile(output,new TextEncoder().encode(
        con.amplifyNewlines
            ? amplifyNewlines(code)
            : code
    ));
}