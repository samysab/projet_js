import { type_check_v2 } from "../modules/typecheck.js";

String.prototype.interpolate = function(animal) {
    let maChaine = this;
    let result = null;
  
    /*
    * Je check si un input a du texte avec {{}}
    * Si oui je recupere son contenu et fait appelle a prop_access
    */
    if(this.includes("{") || this.includes("{ ")){
      let objectSplited = maChaine.split("{");
  
      let myObject = objectSplited[2];
      let temp = myObject.split("}}")
  
      let tempSplit = temp[0].split("}}");
      maChaine = tempSplit[0];
      result = animal.prop_access(maChaine);
    }
    return this.replace("{{"+maChaine+"}}", result);
}

Object.prototype.prop_access = function(path) {
    let obj = this;
      if (path === null || path === '') return obj;
      let chemin = path.split('.')
      for (let i = 0; i < chemin.length; ++i) {
        if (obj === null || obj[chemin[i]] === undefined) return console.log(path + ' not exist.');
        else obj = obj[chemin[i]];
      }
    return obj;
}

  


export const MiniReact = {
    Component: class Component {
  
      props = null;
      newProps;
  
      constructor(props){
        this.props = props;
      }
  
      display(newProps){
        if(this.shouldUpdate(newProps)){
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
  
    createElement(type, attributes, children) {
        let node;
        if (typeof(type) === "string"){
            node = document.createElement(type);
            if (attributes) {
                for (let attName in attributes) {
                    if (/on([A-Z].*)/.test(attName)) {
                        const eventName = attName.match(/on([A-Z].*)/)[1].toLowerCase();
                        node.addEventListener(eventName, attributes[attName]);
                    } else {
                        node.setAttribute(attName, attributes[attName]);
                    }
                }
            }
  
            if (children){
                for (let child of children) {
                    if (child === undefined) continue;
                    if (typeof child === "string") {
                        node.appendChild(
                            document.createTextNode(child.interpolate(attributes))
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
        if(type_check_v2(attributes,type.propTypes)){
            const comp = new type(attributes);
            return comp.display();
        }else{
            throw new TypeError();
        }

      }  
      return node;
    },

    render(domElement, rootElement) {
        rootElement.appendChild(domElement);
    }

  };
  