window.onload = () => {
  // JavaScript
  // const rootElement = document.getElementById("root");
  // const ints = [1, 2, 3];

  // ints.forEach(i => {
  //   let li = document.createElement("li");
  //   li.innerHTML = i;
  //   rootElement.appendChild(li);
  // })

  //React
  const rootElement = document.getElementById("root");
  const ints = [1, 2, 3];

  const root = ReactDOM.createRoot(rootElement);
  
  const childrenElements = ints.map(id => {
    return React.createElement("li", { key: id }, id)
  })

  root.render(childrenElements);
};