
import { INode, ITag, SyntaxKind } from '../html5parser/types';
import { renderText } from './render_text';
import { renderAlgorithm, renderEquation, renderFigure, renderList, renderQuote, renderRemark, renderSection } from './render_misc';


const inlineTags = ["link", "cite", "ref"]
export function renderInline(node: INode): string {
    if (node.type === SyntaxKind.Tag) {
        switch (node.name) {
            default:
                throw new Error("Tag "+node.name+" not allowed")
        }
    } else {
        return renderText(node)
    }
}

const componentTags = ["fig", "figs", "equ", "ol", "ul"]
export function renderComponent(node: INode): string {
    if (node.type === SyntaxKind.Tag) {
        switch (node.name) {
            case "equ":
                return renderEquation(node)
            case "fig":
                return renderFigure(node)
            case "ol":
                return renderList(node)
            case "ul":
                return renderList(node)
            default:
                return renderInline(node)
        }
    } else {
        return renderText(node)
    }
}

const structureTags = ["section", "subsection", "subsubsection", "remark", "alg","quote"]
export function renderStructure(node: INode): string {
    if (node.type === SyntaxKind.Tag) {
        switch (node.name) {
            case "section":
                return renderSection(node)
            case "subsection":
                return renderSection(node)
            case "subsubsection":
                return renderSection(node)
            case "remark":
                return renderRemark(node)
            case "alg":
                return renderAlgorithm(node)
            case "quote":
                return renderQuote(node)
            default:
                return renderComponent(node)
        }
    } else {
        return renderText(node)
    }
}

export function renderNodesBy(ast: INode[], renderer:(Node)=>string): string {
    return ast.map(renderer).join("")
}
export function renderAsComponents(ast: INode[]){
    return ast.map(renderComponent).join("")
}
export function renderAsInline(ast: INode[]){
    return ast.map(renderInline).join("")
}

export function renderAny(ast: INode[]): string {
    return ast.map((node) => {
        if (node.type === SyntaxKind.Tag) {
            if (componentTags.indexOf(node.name) > -1)
                return renderComponent(node)
            else if (inlineTags.indexOf(node.name) > -1)
                return renderInline(node)
            else if (structureTags.indexOf(node.name) > -1)
                return renderStructure(node)
            else 
                throw new Error("Invalid tag '"+node.name+"'")
        } else {
            return renderText(node)
        }
    }).join("")
}