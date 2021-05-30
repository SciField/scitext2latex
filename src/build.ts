import * as fs from 'fs';
import { parse as xmlparse } from './html5parser/parse';
import { renderAny, renderAsInline } from "./latex/renderer";
import { readProjectConfigs } from "./read_config";
import { renderHead } from './latex/render_head';
import { renderMeta } from './latex/render_meta';
import { latexCommand } from './latex/utils';

function finalizeLatex(head: string, meta: string, abstract: string, main: string): string {
    let rendered = [head, "\n\\begin{document}\n\n", meta]
    //rendered.push.apply(rendered,[])
    if (abstract) {
        rendered.push(latexCommand("begin", "abstract"))
        rendered.push(abstract)
        rendered.push(latexCommand("end", "abstract"))
    }
    else {
        console.log("Abstract not found")
    }
    rendered.push.apply(rendered, ["\\maketitle\n\n", main, "\n\\end{document}"])
    return rendered.join("")
}

function readFile(path) {
    return fs.readFileSync(path, "utf-8")
}

export function build(path) {
    let project = readProjectConfigs(path)
    let rendered_head = renderHead(project["config"])
    let rendered_meta = renderMeta(project["meta"])

    var main_text
    var rendered_abs = null
    if (fs.existsSync(path + "/main.stex"))
        main_text = readFile(path + "/main.stex")
    else
        throw new Error("Main file './main.stex' not found")
    if (fs.existsSync(path + "/abstract.stex")) {
        let abstract_text = readFile(path + "/abstract.stex")
        rendered_abs = renderAsInline(xmlparse(abstract_text)) 
    }
    let rendered_main = renderAny(xmlparse(main_text))
    let rendered_latex = finalizeLatex(rendered_head, rendered_meta, rendered_abs, rendered_main)
    fs.writeFileSync(path + "/public.tex", rendered_latex)
}
