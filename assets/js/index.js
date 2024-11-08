let codeArray = JSON.parse(localStorage.getItem("codes")) || [];
let editIndex = null;

document.addEventListener("keydown", function (e) {
  if (e.ctrlKey && e.key === "Enter") {
    addCode();
  }
});

function addCode() {
  const codeInput = document.getElementById("codeInput").value;
  if (codeInput.trim()) {
    const timestamp = new Date().toLocaleString();
    const codeData = { content: codeInput.trim(), timestamp };

    if (editIndex !== null) {
      codeArray[editIndex] = codeData;
      editIndex = null;
    } else {
      codeArray.push(codeData);
    }
    updateLocalStorage();
    renderCodes();
    document.getElementById("codeInput").value = "";
  }
}

function renderCodes() {
  const codeContainer = document.getElementById("codeContainer");
  codeContainer.innerHTML = "";
  codeArray.forEach((codeData, index) => {
    const codeBlock = document.createElement("div");
    codeBlock.classList.add("code-display");

    const header = document.createElement("div");
    header.classList.add("header");

    const timestamp = document.createElement("span");
    timestamp.classList.add("timestamp");
    timestamp.textContent = `Saved: ${codeData.timestamp}`;

    const buttons = document.createElement("div");
    buttons.classList.add("buttons");

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("edit-btn", "toggle-btn");
    editBtn.onclick = () => editCode(index);

    const copyBtn = document.createElement("button");
    copyBtn.textContent = "Copy";
    copyBtn.classList.add("copy-btn", "toggle-btn");
    copyBtn.onclick = () => copyCode(codeData.content);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn", "toggle-btn");
    deleteBtn.onclick = () => deleteCode(index);

    buttons.appendChild(editBtn);
    buttons.appendChild(copyBtn);
    buttons.appendChild(deleteBtn);

    header.appendChild(timestamp);
    header.appendChild(buttons);

    const content = document.createElement("pre");
    content.classList.add("content");
    content.innerHTML = `<code class="language-javascript">${Prism.highlight(
      codeData.content,
      Prism.languages.javascript,
      "javascript"
    )}</code>`;

    header.onclick = () => {
      content.style.display =
        content.style.display === "none" ? "block" : "none";
    };

    codeBlock.appendChild(header);
    codeBlock.appendChild(content);
    codeContainer.appendChild(codeBlock);
  });
}

function editCode(index) {
  document.getElementById("codeInput").value = codeArray[index].content;
  editIndex = index;
}

function deleteCode(index) {
  codeArray.splice(index, 1);
  updateLocalStorage();
  renderCodes();
}

function copyCode(content) {
  navigator.clipboard.writeText(content).then(() => {
    alert("Code copied to clipboard!");
  });
}

function updateLocalStorage() {
  localStorage.setItem("codes", JSON.stringify(codeArray));
}

renderCodes();
