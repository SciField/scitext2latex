import { INode, ITag, IText, SyntaxKind } from '../parser/types';
import { renderAny, renderAsComponent, renderAsInline, renderInEnv } from './renderer';
import { normalizeTextLine } from './render_text';
import { EvnKind, RenderCtx } from './types';
import { latexCommand, latexCommandArgOption, renderLabel } from './utils';

export function renderSection(node: ITag, ctx: RenderCtx) {
    let title = node.attributeMap.title
    let label = node.attributeMap.label
    var rendered = "\\" + node.name
    if (title) {
        rendered += "{".concat(title, "}\n")
    }
    if (label) {
        rendered += "\\label{".concat(node.name, "-", label, "}\n")
    }
    ctx.push(rendered)
}

export function renderFigure(node: ITag, ctx: RenderCtx) {
    ctx.push(latexCommandArgOption("begin", "figure", "htb"))
    renderLabel(node, ctx)
    ctx.push("\\centering\n")
    ctx.push(latexCommand("includegraphics[width=\\linewidth]", node.attributeMap.src))
    if (node.body) {
        ctx.push("\\caption{")
        renderInEnv(node.body, ctx, EvnKind.Inline)
        ctx.push("}")
    }
    ctx.push(latexCommand("end", "figure"))
}

export function renderEquation(node: ITag, ctx: RenderCtx) {
    ctx.push("\\begin{equation}\n")
    renderLabel(node, ctx)
    renderAsInline(node.body, ctx)
    ctx.push(latexCommand("end", "equation"))
    //return normalizeTextLine(rendered.join(""))
}

export function renderList(node: ITag, ctx: RenderCtx) {
    let latex_tag_name = node.name == "ul" ? "itemize" : "enumerate"
    ctx.push(latexCommand("begin", latex_tag_name))

    for (let subnode of node.body) {
        if (subnode.type != SyntaxKind.Tag || subnode.name != "li")
            continue
        else {
            ctx.push("\\item ")
            renderAsComponent(subnode.body, ctx)
        }
    }

    ctx.push(latexCommand("end", latex_tag_name))
}

export function renderRemark(node: ITag, ctx: RenderCtx) {
    let remarkName = node.attributeMap.type ?? "theorem"
    remarkName = "my" + remarkName.toLowerCase()
    if (node.attributeMap.title)
        ctx.push(latexCommandArgOption("begin", remarkName, node.attributeMap.title))
    else
        ctx.push(latexCommand("begin", remarkName))
    renderLabel(node, ctx)
    renderAsComponent(node.body, ctx)
    ctx.push(latexCommand("end", remarkName))
}

function renderProof(node: ITag, ctx: RenderCtx) {
    ctx.push(latexCommand("begin", "proof"))
    renderAsComponent(node.body, ctx)
    ctx.push(latexCommand("end", "proof"))
}
export function renderQuote(node: ITag, ctx: RenderCtx) {
    switch (node.attributeMap.type) {
        case "proof":
            renderProof(node, ctx)
            break
        default:
            throw new Error("Not allowed type '" + node.attributeMap.type + "' for <quote>")
    }
}

export function renderAlgorithm(node: ITag, ctx: RenderCtx) {
    let rendered = []
    return ""
}