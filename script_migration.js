import {type_check} from "./modules/typecheck.js";
import * as prototypes from "../prototypes/prototypes.js";

const root = document.getElementById("root");


const MiniReact = {
    Component: class Component {

        props = null;
        newProps;

        constructor(props) {
            this.props = props;
        }


        display(newProps) {

            if (this.shouldUpdate()) {
                if (newProps != null) {
                    this.props = newProps;
                }
                return this.render()
            }
            return this.render();
        }

        shouldUpdate() {
            if (JSON.stringify(this.props) != JSON.stringify(this.newProps)) {
                //TODO : si render invoque d'autres composants, le composant courant appelle la fonction display(compProps) des sous-composants
                return true;
            } else {
                return false;
            }
        }
    },


    createElement(type, props, children) {
        let node;
        if (typeof (type) === "string") {
            node = document.createElement(type);

            if (props) {
                if (props.attributes) {
                    for (let attName in props.attributes) {
                        if (/on([A-Z].*)/.test(attName)) {
                            const eventName = attName.match(/on([A-Z].*)/)[1].toLowerCase();
                            node.addEventListener(eventName, props.attributes[attName]);
                        } else {
                            node.setAttribute(attName, props.attributes[attName]);
                        }
                    }
                }

                if (props.dataset) {
                    for (let attName in props.dataset) {
                        node.dataset[attName] = props.dataset[attName];
                    }
                }
                for (let attName in props) {
                    if (/on([A-Z].*)/.test(attName)) {
                        const eventName = attName.match(/on([A-Z].*)/)[1].toLowerCase();
                        node.addEventListener(eventName, props[attName]);
                    } else {
                        node.setAttribute(attName, props[attName]);
                    }
                }
            }

            if (children) {
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
        } else {
            // Add Type Check V3
            // Example script_migration Hello Component => Hello.propTypes

            if (typeof (type.propTypes) !== 'undefined' && !type_check(props, type.propTypes)) {
                throw new TypeError();
            } else {

                const comp = new type(props);
                return comp.display();

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
    // return {
    //     type: "a",
    //     attributes: {
    //         href: path,
    //         onClick: (e) => {
    //             e.preventDefault();
    //             history.pushState({title: label}, label, path);
    //             root.dispatchEvent(new Event("rerender"));
    //         },
    //     },
    //     children: [label],
    // };

    return MiniReact.createElement("a", {
        attributes: {
            href: path,
            onClick: (e) => {
                e.preventDefault();
                history.pushState({title: label}, label, path);
                root.dispatchEvent(new Event("rerender"));
            }
        }
    }, [label])
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

    return MiniReact.createElement('div', null, [
        link("Page 2", "/page2"),
        MiniReact.createElement('table', null,
            [
                MiniReact.createElement('tbody', null,
                    new Array(5).fill().map((_, indexRow) => (
                        MiniReact.createElement('tr', null, new Array(5).fill().map((_, indexCol) => (
                            MiniReact.createElement('td', {
                                dataset: {
                                    position: `${indexRow}-${indexCol}`,
                                },
                                attributes: {
                                    onClick: tdClickHandler
                                }
                            }, [
                                data[`${indexRow}-${indexCol}`] ?? `Cell ${indexRow}-${indexCol}`
                            ])
                        )))
                    ))
                ),
            ]),
    ]);

    /*
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
    */
}

function Page2() {
    // return {
    //   type: "h1",
    //   children: ["Page 2", link("Page 1", "/page1"), "Page 3", link("Page 3", "/page3")],
    // };
    return MiniReact.createElement('h1', null, [
        MiniReact.createElement('button', {onClick: () => linkPage('Page 1', '/page1')}, 'Page 1'),
        MiniReact.createElement('button', {onClick: () => linkPage('Page 3', '/page3')}, 'Page 3'),
        MiniReact.createElement('button', {onClick: () => console.log('test')}, 'Test')
    ]);
}

function Page3() {
    return MiniReact.createElement('div', null, [
        MiniReact.createElement('p', null, 'Salut'),
        MiniReact.createElement('p', null, 'Test'),
        MiniReact.createElement('button', {onClick: () => console.log('test')}, 'Test')
    ]);
}

function linkPage(label, path) {
    history.pushState({title: label}, label, path);
    root.dispatchEvent(new Event("rerender"));
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


root.dispatchEvent(new Event("rerender"));


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
            MiniReact.createElement(UserList, {currentUser: this.props.toWhat}),
        ]);
    }
}

class UserList extends MiniReact.Component {
    state = {
        users: [1, 2, 3],
        currentUser: 2,
    };

    constructor() {
        super();
        this.state.currentUser = this.props.currentUser;
    }

    render() {
        return MiniReact.createElement(
            "ul",
            null,
            this.state.users.map((user) =>
                user === this.state.currentUser
                    ? undefined
                    : MiniReact.createElement(
                        "li",
                        {onClick: () => this.setState({currentUser: user})},
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
            MiniReact.createElement(Hello, {toWhat: user})
        );
        // A faire lors de la génération type_check(props, Hello.propTypes)
    }
}