
export interface TagEngine{
    counter:Record<string,number>
}
export interface SectionTagEngine{
    current_level : number
    prefix : string
    counter : Array<number>
}
export enum EvnKind {
    All = 0,
    Component = 10,
    Inline = 20
}
export class RenderCtx{
    rendered : string[]
    env : EvnKind
    constructor() { 
        this.rendered = []
        this.env = EvnKind.All 
    }
    stringify():string{
        return this.rendered.join("")
    }
    push(token:string){
        this.rendered.push(token)
    }
}