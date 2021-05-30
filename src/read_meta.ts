import { parse } from 'yaml'
import * as fs from 'fs';

function mapAffiliation(affiliations:any){
    return (item:string):string=>{
        if(item[0]!="$")
            return item
        else{
            return affiliations[item.substring(1)]
        }
    }
}

function replaceAuthor(meta_dict: any) {
    if (!meta_dict.author)
        throw new Error(`There must be at least one author`);
    let affiliations = meta_dict.affiliation
    for(let author of meta_dict.author){
        if(author.affiliation)
            author.affiliation=author.affiliation.map(mapAffiliation(affiliations))
    }
}

export function readMetaInfo(path: string): any {
    let meta = fs.readFileSync(path, 'utf8')
    return parseMetaInfo(meta)
}

export function parseMetaInfo(meta: string): any {
    var meta_dict = parse(meta)
    //processAuthor(meta_dict)
    return meta_dict
}