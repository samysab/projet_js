import { MiniReact } from "../src/React.js";
import { Hello } from "./Hello.js";

export class App extends MiniReact.Component{
    
    constructor(props){
        super(props);
    }

    render()
    {
        return MiniReact.createElement("div", null, [
            MiniReact.createElement(Hello, {name:"Toto"}),
            MiniReact.createElement(Hello,),
        ]);
    }
}