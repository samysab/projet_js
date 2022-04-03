import { MiniReact } from "../src/React.js";

export class Test extends MiniReact.Component{
    
    render(){
        return MiniReact.createElement("h1",null,"Test");
    }

}