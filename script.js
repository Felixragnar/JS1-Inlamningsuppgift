const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

async function addTask() {
    if (inputBox.value === '') {//returns message when input is empty
        alert("You must write something!");
    }
    else {
        const userInput = inputBox.value;
        const inputObject = {
            "title": userInput
        }
        const textInputString = JSON.stringify(inputObject);
        const result = await createRemoteTodo(textInputString);

        if (result) {
            const todoTitle = result['title'];
            const todoId = result['_id'];
            const completed = result['completed'];
            updateTodoList(todoTitle, todoId, completed);
        } else {
            alert("Something went wrong!");
        }
    }
    inputBox.value = ""; //empties the input-box
}
  
async function getAllTodos() {
    const response = await fetch("https://js1-todo-api.vercel.app/api/todos?apikey=633dfecc-345d-41cd-9d95-c7e7eff95016", {
        method: "GET"
    });

    return await response.json();
}

function populateTodoList(todoJson) {
    console.log(todoJson);
    //const todoElementsArray = JSON.parse(todoJson);


    todoJson.forEach(item => {
        updateTodoList(item.title, item._id, item.completed); //iterates through the data from the API and takes the title string and parses it to the updateTodoList fucntion
    });
}

async function createRemoteTodo(RemoteTodo) {
    const response = await fetch("https://js1-todo-api.vercel.app/api/todos?apikey=633dfecc-345d-41cd-9d95-c7e7eff95016", {
        method: "POST",
        body: RemoteTodo
    });
    if (await response.status === 201) {
        return await response.json();
    }
    else {
        return false
    }
}

async function deleteRemoteTodo(id) {
    const response = await fetch(`https://js1-todo-api.vercel.app/api/todos/${id}?apikey=633dfecc-345d-41cd-9d95-c7e7eff95016`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error(`Failed to delete todo, status: ${response.status}`);
    }

    const statuscode = response.status;
    return statuscode;
}

function updateTodoList(todoTitle, todoId, todoCompleted) {
    let li = document.createElement("li");
    li.innerHTML = todoTitle; //stores the user input in the list
    li.dataset.id = todoId;
    li.dataset.completed = todoCompleted;
    listContainer.appendChild(li);
    //makes an X that is used to delete list items
    let span = document.createElement("span");
    span.innerHTML = "\u00d7"
    li.appendChild(span); //makes the X visible
}

listContainer.addEventListener("click", async function (e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        saveData();
    }
    else if (e.target.tagName === "SPAN") {
        const currentTodo = e.target.parentElement;
        const todoId = currentTodo.dataset.id;

        const deleteTodoStatus =  await deleteRemoteTodo(todoId);

        if (deleteTodoStatus === 200) {
            currentTodo.remove();
        }

    }
}, false);

async function onPageLoad() {
    const todoListJsonFromApi = await getAllTodos();
    populateTodoList(todoListJsonFromApi);
}

onPageLoad();