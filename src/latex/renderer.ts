
import { INode, ITag, SyntaxKind } from '../parser/types';
import { renderText } from './render_text';
import { renderAlgorithm, renderEquation, renderFigure, renderList, renderQuote, renderRemark, renderSection } from './render_misc';
import { EvnKind, RenderCtx } from './types';


const inlineTags = ["link", "cite", "ref"]
export function renderInline(node: INode, ctx: RenderCtx): RenderCtx {
    if (node.type === SyntaxKind.Tag) {
        switch (node.name) {
            default:
        }
    } else {
        renderText(node, ctx)
    }
    return ctx
}


const componentRendererMap = {
    "fig": renderFigure,
    "figs": renderFigure,
    "equ": renderEquation,
    "ol": renderList,
    "ul": renderList
}
const componentTags = Object.keys(componentRendererMap)

export function renderComponent(node: INode, ctx: RenderCtx): RenderCtx {
    if (node.type === SyntaxKind.Tag) {
        componentRendererMap[node.name](node, ctx)
    } else {
        renderText(node, ctx)
    }
    return ctx
}


const structureRendererMap = {
    "section": renderSection,
    "subsection": renderSection,
    "subsubsection": renderSection,
    "remark": renderRemark,
    "alg": renderAlgorithm,
    "quote": renderQuote
}
const structureTags = Object.keys(structureRendererMap)

export function renderStructure(node: INode, ctx: RenderCtx): RenderCtx {
    if (node.type === SyntaxKind.Tag) {
        structureRendererMap[node.name](node, ctx)
    } else {
        renderText(node, ctx)
    }
    return ctx
}

export function renderNodesBy(ast: INode[], renderer: (Node) => string) {
    return ast.map(renderer).join("")
}
export function renderInEnv(ast: INode[], ctx: RenderCtx, env: EvnKind) {
    let temp = ctx.env
    ctx.env = env
    renderAny(ast,ctx)
    ctx.env = temp
}

export function renderAsInline(ast: INode[], ctx: RenderCtx) {
    renderInEnv(ast,ctx,EvnKind.Inline)
}

export function renderAsComponent(ast: INode[], ctx: RenderCtx) {
    renderInEnv(ast,ctx,EvnKind.Component)
}

export function renderAny(ast: INode[], ctx: RenderCtx): RenderCtx {
    for (let node of ast) {
        if (node.type === SyntaxKind.Tag) {
            if (componentTags.indexOf(node.name) > -1 && ctx.env <= EvnKind.Component)
                renderComponent(node, ctx)
            else if (inlineTags.indexOf(node.name) > -1 && ctx.env <= EvnKind.Inline)
                renderInline(node, ctx)
            else if (structureTags.indexOf(node.name) > -1)
                renderStructure(node, ctx)
            else
                throw new Error("Tag '" + node.name + "' is invalid in current env")
        }
        else
            renderText(node, ctx)
    }
    return ctx
}


export function renderFromRoot(ast: INode[], env:EvnKind = EvnKind.All): string {
    let ctx = new RenderCtx()
    ctx.env=env
    return renderAny(ast, ctx).stringify()
}