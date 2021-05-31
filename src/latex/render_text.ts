import { IText } from "../parser/types";
import { RenderCtx } from "./types";


export function normalizeTextLine(text: string): string {
    var normal = text.trim()
    return normal + "\n"
}

const cmd_map = { ref: "autoref" }
const cmd_map_regex = new RegExp(Object.keys(cmd_map).join("|"), "gi");
const newline_regex = /[\\n]{3,}/gi

export function renderText(node: IText, ctx: RenderCtx) {
    var rendered = node.value.trim()
    rendered = rendered.replace(cmd_map_regex, function (matched) { return cmd_map[matched]; });
    rendered = rendered.replace(newline_regex, function (matched) { return "\n\n\n" });
    ctx.push(rendered + "\n")
}