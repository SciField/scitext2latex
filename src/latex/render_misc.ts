import { INode, ITag, IText, SyntaxKind } from '../html5parser/types';
import { renderAny, renderAsComponents, renderAsInline } from './renderer';
import { normalizeTextLine } from './render_text';
import { latexCommand, latexCommandArgOption, renderLabel } from './utils';

export function renderSection(node: ITag): string {
    let title = node.attributeMap.title
    let label = node.attributeMap.label
    var rendered = "\\" + node.name
    if (title) {
        rendered += "{".concat(title, "}\n")
    }
    if (label) {
        rendered += "\\label{".concat(node.name, "-", label, "}\n")
    }
    return rendered
}

export function renderFigure(node: ITag): string {
    let rendered = [latexCommandArgOption("begin", "figure", "htb")]
    renderLabel(rendered,node)
    rendered.push("\\centering\n")
    rendered.push(latexCommand("includegraphics[width=\\linewidth]", node.attributeMap.src))
    if (node.body)
        rendered.push(latexCommand("caption", renderAsInline(node.body).trim()))
    rendered.push(latexCommand("end", "figure"))
    return rendered.join("")
}

export function renderEquation(node: ITag): string {
    let label = node.attributeMap.label
    let rendered = [latexCommand("begin", "equation")]
    renderLabel(rendered,node)
    rendered.push(renderAsInline(node.body))
    rendered.push(latexCommand("end", "equation"))
    return normalizeTextLine(rendered.join(""))
}

export function renderList(node: ITag): string {
    let rendered=[]
    let latex_tag_name = node.name=="ul"?"itemize":"enumerate"
    rendered.push(latexCommand("begin",latex_tag_name))

    for(let subnode of node.body){
        if(subnode.type!=SyntaxKind.Tag || subnode.name!="li")
            continue
        else{
            rendered.push("\\item ")
            rendered.push(renderAsComponents(subnode.body))
        }
    }

    rendered.push(latexCommand("end",latex_tag_name))
    return rendered.join("")
}

export function renderRemark(node: ITag): string {
    let rendered=[]
    let remarkName = node.attributeMap.type ?? "theorem"
    remarkName = "my"+remarkName.toLowerCase()
    if(node.attributeMap.title)
        rendered.push(latexCommandArgOption("begin",remarkName,node.attributeMap.title))
    else
        rendered.push(latexCommand("begin",remarkName))
    renderLabel(rendered,node)
    rendered.push(renderAsComponents(node.body))
    rendered.push(latexCommand("end",remarkName))
    return rendered.join("")
}
function renderProof(node:ITag):string{
    let rendered=[]
    rendered.push(latexCommand("begin","proof"))
    rendered.push(renderAsComponents(node.body))
    rendered.push(latexCommand("end","proof"))
    return rendered.join("")
}
export function renderQuote(node: ITag): string{
    switch(node.attributeMap.type){
        case "proof":
            return renderProof(node)
        default:
            throw new Error("Not allowed type '"+node.attributeMap.type+"' for <quote>")
    }
}

export function renderAlgorithm(node: ITag): string {
    return ""
}