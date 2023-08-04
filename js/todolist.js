const addTodoButtonOnClickHandle = () => {
    generateTodoObj();  //추가 버튼 클릭 이벤트
}

const addTodoOnKeyUpHandle = (event) => {
    if(event.keyCode === 13) {  //input에서 엔터 쳤을 때
        generateTodoObj();
    }
}

const checkedOnChangeHandle = (target) => {
    TodoListService.getInstance().setCompletStatus(target.value, target.checked);
}

const modifyTodoOnClickHandle = (target) => {
    openModal();
    modifyModal(TodoListService.getInstance().getTodoById(target.value));
}

const deleteTodoOnClickHandle = (target) => {
    TodoListService.getInstance().removeTodo(target.value);
}

const generateTodoObj = () => {
    const todoContent = document.querySelector(".todolist-header-items .text-input").value;
    if(!todoContent){
        return;
    }
    const todoObj = {
        id: 0,
        todoContent: todoContent,
        createDate: DateUtils.toStringByFormatting(new Date()),
        completStatus: false
    };

    TodoListService.getInstance().addTodo(todoObj);
} 

class TodoListService {
    static #instance = null;

    static getInstance() {
        if(this.#instance === null){
            this.#instance = new TodoListService();
        }
        return this.#instance;
    }

    todoList = null;
    todoIndex = 1;

    constructor() {
        this.loadTodoList();
    }
    
    // JSON.parse(제이슨 문자열) : 제이슨 문자열 -> 객체
    // JSON.stringify(객체) : 객체 -> 제이슨 문자열
    loadTodoList() {
        // 기존의 localStorage에 todoList가 있으면? 로컬 스토리지에 있는 제이슨 문자열을 객체로 바꿔줌
        // 없으면? 새로운 array 생성
        this.todoList = !!localStorage.getItem("todoList") ? JSON.parse(localStorage.getItem("todoList")) : new Array();
        // todoIndex : 배열의 마지막 인덱스 값 + 1 -> this.todoList[this.todoList.length - 1] + 1
        // 배열이 비어 있다면 null 값이 되어 오류가 남
        // ? : 값이 없다면 참조를 하지 않음
        // 마지막 인덱스 값이 있다면 todoIndex는 마지막 인덱스 값 + 1, 배열이 비어 있다면 1
        this.todoIndex = !!this.todoList[this.todoList.length - 1]?.id ? this.todoList[this.todoList.length - 1].id + 1 : 1;
    }

    saveLocalStorage() {
        // 객체를 제이슨 문자열로 바꿔서 로컬 스토리지에 저장
        localStorage.setItem("todoList", JSON.stringify(this.todoList));
    }

    getTodoById(id) {
        //filter로 해당 id인 것의 todo 리스트를 받아옴 -> 1개니까 0번 index를 받아오면 됨.
        return this.todoList.filter(todo => todo.id === parseInt(id))[0];
    }

    addTodo(todoObj) {
        const todo = {
            ...todoObj,         // ... : 객체 안에 있는 key:value를 그대로 복사해줌 (깊은 복사)
            id : this.todoIndex // id 값을 마지막 인덱스 값 + 1으로 바꿔 줌 (추가할 때 id: 0 으로 생성)
        }

        this.todoList.push(todo);

        console.log(this.todoList);

        this.saveLocalStorage();

        this.updateTodoList();

        this.todoIndex++;
    }

    setCompletStatus(id, status) {
        this.todoList.forEach((todo, index) => {
            if(todo.id === parseInt(id)) {
                this.todoList[index].completStatus = status;
            }
        });

        this.saveLocalStorage();
    }

    setTodo(todoObj) {
        // 수정할 todo에 덮어씌워줌
        for(let i = 0; i < this.todoList.length; i++){
            if(this.todoList[i].id === todoObj.id){
                this.todoList[i] = todoObj;
                break;
            }
        }
        this.saveLocalStorage();
        this.updateTodoList();
    }

    removeTodo(id) {
        // todoList에서 삭제할 id와 다른 것만 리스트에 담고 저장
        this.todoList = this.todoList.filter(todo => {
            return todo.id !== parseInt(id);
        });
        this.saveLocalStorage();
        this.updateTodoList();
    }

    updateTodoList() {
        const todolistMainContainer = document.querySelector(".todolist-main-container");

        // todoList에 있는 todo들을 todolist-main-container에 뿌려줌. (li 추가)
        // = 이므로 전에 있던 것들은 사라지고 새로 대입됨.
        todolistMainContainer.innerHTML = this.todoList.map(todo => {
            return `
                <li class="todolist-items">
                    <div class="item-left">
                        <input type="checkbox" id="complet-chkbox${todo.id}" 
                            class="complet-chkboxs" ${todo.completStatus ? "checked" : ""} 
                            value="${todo.id}" onchange="checkedOnChangeHandle(this)">
                        <label for="complet-chkbox${todo.id}"></label>
                    </div>
                    <div class="item-center">
                        <pre class="todolist-content">${todo.todoContent}</pre>
                    </div>
                    <div class="item-right">
                        <p class="todolist-date">${todo.createDate}</p>
                        <div class="todolist-item-buttons">
                            <button class="btn btn-edit" value="${todo.id}" onclick="modifyTodoOnClickHandle(this)">수정</button>
                            <button class="btn btn-remove" value="${todo.id}" onclick="deleteTodoOnClickHandle(this)">삭제</button>
                        </div>
                    </div>
                </li>
            `;
        }).join("");
    }
}