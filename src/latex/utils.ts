import { INode, ITag } from "../parser/types"


export function latexCommand(command_name: string, arg: string): string {
    return ["\\", command_name, "{", arg, "}\n"].join("")
}

export function latexCommandArgOption(command_name: string, arg: string, option: string): string {
    return ["\\", command_name, "{", arg, "}[", option, "]\n"].join("")
}

export function latexCommandOptionArg(command_name: string, option: string, arg: string): string {
    return ["\\", command_name, "[", option, "]{", arg, "}\n"].join("")
}

export function latexCommandMulti(command_name: string, args: string[]): string {
    var command_list = ["\\", command_name]
    for (let arg of args) {
        command_list.push(["{", arg, "}"].join(""))
    }
    command_list.push("\n")
    return command_list.join("")
}

export function renderLabel(node: ITag, ctx) {
    if (node.attributeMap.label)
        ctx.push(latexCommand("label", [node.name, "-", node.attributeMap.label].join("")))
}