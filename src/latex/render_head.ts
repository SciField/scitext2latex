import * as fs from 'fs';
import { latexCommand, latexCommandMulti, latexCommandOptionArg } from './utils';

function renderDocumentClass(config, rendered: Array<string>) {
    let documentType = config.latex.documentType
    rendered.push(latexCommandOptionArg("documentclass", documentType.documentClassOption.join(","), documentType["documentClass"]))
}

const capitalize = (s:string) => s.charAt(0).toUpperCase() + s.slice(1)
const defaultRemarkType = ["Theorem","Remark", "Lemma", "Definition", "Proposition", "Corollary"]
function renderRemarkDefine(config, rendered: Array<string>) {
    let remark_names = new Set<string>(config.additionalRemarkName)
    rendered.push("% For Remark environments\n")
    defaultRemarkType.forEach(remark => remark_names.add(remark))
    remark_names.forEach((remark: string) => {
        let normalized_remark = remark.toLowerCase()
        rendered.push(latexCommandMulti("newtheorem", ["my" + normalized_remark, capitalize(normalized_remark)]))
    })
}

function renderLinkColor(config, rendered: Array<string>) {
    let linkColor = config.latex.linkColor
    rendered.push("% For hyperlink color\n")
    rendered.push(latexCommand("hypersetup", ["colorlinks=true,", "linkcolor=", linkColor.ref, ",citecolor=", linkColor.cite, ",urlcolor=", linkColor.url].join("")))
}

export function renderHead(config): string {
    let rendered = []
    renderDocumentClass(config, rendered)
    rendered.push(fs.readFileSync("./src/latex/template/default_packages.tex", "utf-8"))
    renderRemarkDefine(config, rendered)
    renderLinkColor(config, rendered)
    return rendered.join("")
}