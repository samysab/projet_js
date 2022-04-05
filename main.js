import { MiniReact } from "./src/React.js";
import { App } from "./components/App.js";
import { Hello } from "./components/Hello.js";


const root = document.getElementById("root");



function generatePage() {
    document.title = history?.state?.title;
    const currentPath = window.location.pathname;
    let elem;
    switch (currentPath) {
        case "/":
            return MiniReact.render(MiniReact.createElement(Hello), root);
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
}

generatePage();





