import { MiniReact } from "../src/React.js";

export class Hello extends MiniReact.Component{
    
    constructor(props){
        super(props);
    }

    render(){
        return MiniReact.createElement("h1",null,"Test");
    }

}