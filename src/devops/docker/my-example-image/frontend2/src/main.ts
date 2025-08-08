const API_URL = window.APP_CONFIG.API_URL;

type Todo = {
  _id: string;
  content: string;
};

document.getElementById("addBtn")!.addEventListener("click", addItem);

async function fetchTodos() {
  const response = await fetch(`${API_URL}/todos`);
  const todos = (await response.json()) as Todo[];
  const list = document.getElementById("todoList")!;
  list.innerHTML = "";
  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.textContent = todo.content;
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => deleteItem(todo._id);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

async function addItem() {
  const input = document.getElementById("newItem")! as HTMLInputElement;
  if (input.value.trim() !== "") {
    await fetch(`${API_URL}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: input.value }),
    });
    input.value = "";
    fetchTodos();
  }
}

async function deleteItem(id: string) {
  await fetch(`${API_URL}/todos/${id}`, { method: "DELETE" });
  fetchTodos();
}

fetchTodos();
