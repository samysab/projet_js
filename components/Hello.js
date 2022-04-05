import { MiniReact } from "../src/React.js";

export class Hello extends MiniReact.Component{
    
    constructor(props){
        super(props);
    }

    render(){
        return MiniReact.createElement('h1', null, [
            MiniReact.createElement('button', {onClick: () => linkPage('Page 1', '/page1')}, 'Page 1'),
            MiniReact.createElement('button', {onClick: () => linkPage('Page 3', '/page3')}, 'Page 3'),
            MiniReact.createElement('button', {onClick: () => console.log('test')}, 'Test')
        ]);
    }

}