const root = document.querySelector("#root");

function link(label, path) {
  const a = document.createElement("a");
  const textA = document.createTextNode(label);
  a.appendChild(textA);
  a.href = path;
  a.addEventListener("click", (e) => {
    e.preventDefault();
    history.pushState({ title: label }, label, path);
    root.dispatchEvent(new Event("rerender"));
  });
  return a;
}

function Page1() {
  const div = document.createElement("div");
  div.appendChild(link("Page 2", "/page2"));
  const table = document.createElement("table");
  const tbody = document.createElement("tbody");

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

  for (let i = 0; i < 5; ++i) {
    const tr = document.createElement("tr");
    for (let j = 0; j < 5; ++j) {
      const td = document.createElement("td");
      td.dataset.position = `${i}-${j}`;
      const text = document.createTextNode(
        data[`${i}-${j}`] ?? `Cell ${i}-${j}`
      );
      td.appendChild(text);
      tr.appendChild(td);
      td.addEventListener("click", tdClickHandler);
    }
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  div.appendChild(table);
  return div;
}

function Page2() {
  const h1 = document.createElement("h1");
  const text = document.createTextNode("Page 2");
  h1.appendChild(text);
  h1.appendChild(link("Page 1", "/page1"));
  return h1;
}

function generatePage() {
  document.title = history.state.title;
  const currentPath = window.location.pathname;
  let elem;
  switch (currentPath) {
    case "/page1":
      elem = Page1();
      break;
    case "/page2":
      elem = Page2();
      break;
  }
  if (root.childNodes.length) {
    root.replaceChild(elem, root.firstChild);
  } else {
    root.appendChild(elem);
  }
}

root.addEventListener("rerender", generatePage);

window.onpopstate = () => root.dispatchEvent(new Event("rerender"));

root.dispatchEvent(new Event("rerender"));
root.appendChild(Page2());
