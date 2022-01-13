const root = document.querySelector("#root");


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


const MiniReact = {
  Component: class Component {

    display(newProps){
      //Je call shouldUpdate()
      shouldUpade()
    }

    shoulUpdate(){

    }
  },

  createElement(type, props, attributes, children) {
    const node = document.createElement(type);
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
    /*if (dataset) {
      for (let attName in dataset) {
        node.dataset[attName] = dataset[attName];
      }
    }*/
    if (children)
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

    return node;
  },
};

/*console.log(MiniReact.createElement("table", null, null, [
    MiniReact.createElement("tbody", null, null, new Array(5).fill().map((_, indexRow) => (
      MiniReact.createElement("tr", null, null, new Array(5).fill().map((_, indexCol) => (
        MiniReact.createElement("td", `${indexRow}-${indexCol}`, tdClickHandler, data[`${indexRow}-${indexCol}`] ??
            `Cell ${indexRow}-${indexCol}`)
      )),
    )),
  )),
],));*/



function link(label, path) {
  return {
    type: "a",
    attributes: {
      href: path,
      onClick: (e) => {
        e.preventDefault();
        history.pushState({ title: label }, label, path);
        root.dispatchEvent(new Event("rerender"));
      },
    },
    children: [label],
  };
}

function Page1() {
  const data = JSON.parse(localStorage.getItem("tableData") ?? "{}");

  const tdClickHandler = (e) => {
    const elem = e.currentTarget;
    const input = document.createElement("input");
    input.value = elem.textContent;
    elem.replaceChild(input, elem.firstChild);
    elem.removeEventListener("click", tdClickHandler);
    input.addEventListener("blur", inputBlurHandler);
  };

  const inputBlurHandler = (e) => {
    const input = e.currentTarget;
    const td = input.parentNode;
    const value = input.value;
    const text = document.createTextNode(value);
    const key = td.dataset.position;
    data[key] = value;
    localStorage.setItem("tableData", JSON.stringify(data));
    input.removeEventListener("blur", inputBlurHandler);
    td.replaceChild(text, input);
    td.addEventListener("click", tdClickHandler);
  };

  return {
    type: "div",
    children: [
      link("Page 2", "/page2"),
      {
        type: "table",
        children: [
          {
            type: "tbody",
            children: new Array(5).fill().map((_, indexRow) => ({
              type: "tr",
              children: new Array(5).fill().map((_, indexCol) => ({
                type: "td",
                dataset: {
                  position: `${indexRow}-${indexCol}`,
                },
                attributes: {
                  onClick: tdClickHandler,
                },
                children: [
                  data[`${indexRow}-${indexCol}`] ??
                    `Cell ${indexRow}-${indexCol}`,
                ],
              })),
            })),
          },
        ],
      },
    ],
  };
}

function Page2() {
  return {
    type: "h1",
    children: ["Page 2", link("Page 1", "/page1"), "Page 3", link("Page 3", "/page3")],
  };
}

function Page3() {
  return MiniReact.createElement('div', null, null, [
    MiniReact.createElement('p', null, null, 'Salut'),
    MiniReact.createElement('p', null, null, 'Test'),
    MiniReact.createElement('button', null, { onClick: () => console.log('test')}, 'Test')
  ]);
}

function generatePage() {
  document.title = history?.state?.title;
  const currentPath = window.location.pathname;
  let elem;
  switch (currentPath) {
    case "/page1":
      elem = Page1();
      break;
    case "/page2":
      elem = Page2();
      break;
    case "/page3":
      elem = Page3();
      break;
    default:
      elem = Page1();
      break;
  }
  if (root.firstChild) {
    root.replaceChild(elem, root.firstChild);
  } else {
    root.appendChild(elem);
  }
}

root.addEventListener("rerender", generatePage);

window.onpopstate = () => root.dispatchEvent(new Event("rerender"));
//root.appendChild(Page2());

const struct = {
  type: "div", // Hello : Function
  attributes: {
    id: "players",
  },
  children: [
    {
      type: "div", // Hello : Function
      attributes: {
        id: "playersList",
      },
    },
    {
      type: "ul", // Hello : Function
      attributes: {
        id: "playersList",
      },
      children: [
        {
          type: "li",
          dataset: {
            position: 1,
          },
          children: ["User1"],
        },
        {
          type: "li", //Hello,
          dataset: {
            position: 2,
          },
          children: ["User2"],
        },
      ],
    },
  ],
};

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


const generateStructure = (structure) => {
  const node = document.createElement(structure.type);
  if (structure.attributes) {
    for (let attName in structure.attributes) {
      if (/on([A-Z].*)/.test(attName)) {
        const eventName = attName.match(/on([A-Z].*)/)[1].toLowerCase();
        node.addEventListener(eventName, structure.attributes[attName]);
      } else {
        node.setAttribute(attName, structure.attributes[attName]);
      }
    }
  }
  if (structure.dataset) {
    for (let attName in structure.dataset) {
      node.dataset[attName] = structure.dataset[attName];
    }
  }
  if (structure.children)
    for (let child of structure.children) {
      if (child === undefined) continue;
      if (typeof child === "string") {
        node.appendChild(
          document.createTextNode(child.interpolate(structure.attributes))
        );
      } else {
        node.appendChild(generateStructure(child));
      }
    }
  structure.node = node;

  return node;
};
root.dispatchEvent(new Event("rerender"));
root.appendChild(generateStructure(struct));



class Hello extends MiniReact.Component {
  static propTypes = {
    properties: {
      toWhat: {
        type: "string",
      },
    },
  };
  render() {

    return MiniReact.createElement("div", null, [
      `Hello ${this.props.toWhat}`,
      MiniReact.createElement(UserList, { currentUser: this.props.toWhat }),
    ]);
    return {
      type: "div",
      attributes: null,
      children: [`Hello ${this.props.toWhat}`],
    };
  }
}

class UserList extends MiniReact.Component {
  constructor() {
    super();
    this.state.currentUser = this.props.currentUser;
  }
  state = {
    users: [1, 2, 3],
    currentUser: 2,
  };
  render() {
    return MiniReact.createElement(
      "ul",
      null,
      this.state.users.map((user) =>
        user === this.state.currentUser
          ? undefined
          : MiniReact.createElement(
              "li",
              { onClick: () => this.setState({ currentUser: user }) },
              [user]
            )
      )
    );
  }
}

class App extends MiniReact.Component {
  state = {
    users: [1, 2, 3],
  };
  render() {
    
    return this.state.users.map((user) =>
      MiniReact.createElement(Hello, { toWhat: user })
    );
    // A faire lors de la génération type_check(props, Hello.propTypes)
  }
}
