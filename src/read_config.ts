import { parse, stringify } from 'yaml'
import * as fs from 'fs';

// follow https://stackoverflow.com/questions/9602449/a-javascript-design-pattern-for-options-with-default-values
function update_by_default(dict, key, default_dict) {
    dict[key] = Object.assign({}, default_dict, dict[key]);
}
const default_latex = {
    documentType: {
        documentClass: 'revtex4-1',
        documentClassOption: ['aps,pra,superscriptaddress,longbibliography', 'twocolumn']
    },
    linkColor:{
        ref: "blue",
        cite: "black",
        url: "red"
    }
}

export function readProjectConfigs(path) {
    let project = {}
    project["meta"] = parse(fs.readFileSync(path + "/meta.yml", 'utf8'))
    project["config"] = parse(fs.readFileSync(path + "/config.yml", 'utf8'))
    update_by_default(project["config"], "latex", default_latex)
    //console.log(project["config"])
    return project
}