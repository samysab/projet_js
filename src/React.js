import { type_check } from "../modules/typecheck.js";
import * as prototypes from "../prototypes/prototypes.js";

export const MiniReact = {
    Component: class Component {
  
      props = null;
      newProps;
  
      constructor(props){
        this.props = props;
      }

  
      display(newProps){
        if(this.shouldUpdate(newProps)){

          this.props = newProps;
          return this.render()
        }
        return this.render();
      }
  
      shouldUpdate(newProps){
        if(JSON.stringify(this.props) != JSON.stringify(newProps)){
          //TODO : si render invoque d'autres composants, le composant courant appelle la fonction display(compProps) des sous-composants
          return true;
        }else{
          return false;
        }
      }
    },
  
    createElement(type, props, children) {
        let node;
        if (typeof(type) === "string"){
            node = document.createElement(type);
            if (props) {
                for (let attName in props) {
                    if (/on([A-Z].*)/.test(attName)) {
                        const eventName = attName.match(/on([A-Z].*)/)[1].toLowerCase();
                        node.addEventListener(eventName, props[attName]);
                    } else {
                        node.setAttribute(attName, props[attName]);
                    }
                }
            }
  
            if (children){
                for (let child of children) {
                    if (child === undefined) continue;
                    if (typeof child === "string") {
                        node.appendChild(
                            document.createTextNode(child.interpolate(props))
                        );
                    } else {
                        node.appendChild(child);
                    }
                }     
            } 
  
      //Component
      }else{
        // Add Type Check V3
        // Example script_migration Hello Component => Hello.propTypes

        if(typeof(type.propTypes) !== 'undefined' && !type_check(props,type.propTypes)){
            throw new TypeError();
        }else{
          
          const comp = new type(props);
          return comp.display();
            
        }

      }  
      return node;
    },

    render(domElement, rootElement) {
        rootElement.appendChild(domElement);
    }

  };
  