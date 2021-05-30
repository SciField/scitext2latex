import { latexCommand, latexCommandMulti } from "./utils"


export function renderTitle(meta): string {
    let title = ""
    if (meta.title)
        title = meta.title
    else
        title = "Untitled"

    return [latexCommand("title", title), latexCommand("date", "\\today"),"\n"].join("")

}
export function renderAuthor(meta): string {
    var rendered = ""
    var rendered_affils = []
    for (let affil in meta.affiliation) {
        rendered_affils.push(latexCommandMulti("newcommand", ["\\affilAT" + affil, meta.affiliation[affil]]))
    }
    rendered_affils.push("\n")
    rendered += rendered_affils.join("")
    var rendered_authors = []
    for (let author of meta.author) {
        rendered_authors.push(latexCommand("author", [author.givenName, " ", author.familyName].join("")))
        if (author.email)
            rendered_authors.push(latexCommand("email", author.email))
        for (let affil of author.affiliation) {
            var affil_name = ""
            if (affil[0] == '$')
                affil_name = "\\affilAT" + affil.substring(1)
            else
                affil_name = affil
            rendered_authors.push(latexCommand("affiliation", affil_name))
        }
    }
    rendered_authors.push("\n")
    rendered += rendered_authors.join("")
    //console.log(rendered_authors.join(""))
    return rendered
}

export function renderMeta(meta) {
    return renderTitle(meta) + renderAuthor(meta)
}