class Routes {
    static #instance = null;

    static getInstance() {
        if(this.#instance === null){
            this.#instance = new Routes();
        }
        return this.#instance;
    }

    routeState = "welcome";

    show() {
        this.clear();
        switch(this.routeState) {
            case "welcome":
                const welcomePage = document.querySelector(".welcome-page-container");
                welcomePage.classList.remove("invisible");
                break;
            case "todolist":
                const todolistPage = document.querySelector(".todolist-page-container");
                todolistPage.classList.remove("invisible");
                break;
        }
    }

    clear() {
        const pages = document.querySelectorAll(".main-container > div");
        pages.forEach(page => {
            page.classList.add("invisible");
        });
    }
}