const API = (function () {
    const API_URL = "http://localhost:3000/events";

    const getEvents = async () => {
        const response = await fetch(API_URL);
        return await response.json()
    }

    const addEvent = async (newEvent) => {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newEvent)
        });
        return await response.json();
    }

    const removeEvent = async (id) => {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
    }

    const editEvent = async (newEvent, id) => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                eventName: newEvent.eventName,
                startDate: newEvent.startDate,
                endDate: newEvent.endDate,
            })
        });
        return await response.json();
    }

    return {
        getEvents,
        addEvent,
        removeEvent,
        editEvent
    }
})()

class EventModel {
    #events = [];
    constructor() {}

    getEvents() {
        return this.#events;
    }

    async fetchEvents() {
        this.#events = await API.getEvents();
    }

    async addEvent(newEvent) {
        const event = await API.addEvent(newEvent);
        this.#events.push(event);
        return event;
    }

    async removeEvent(id) {
        await API.removeEvent(id);
        this.#events = this.#events.filter((todo) => todo.id != id);
    }

    async editEvent(event, id) {
        const newEvent = await API.editEvent(event, id);
        let editEvent= this.#events.filter((event) => event.id == id)[0];
        let idx = this.#events.indexOf(editEvent);
        this.#events[idx].eventName = event.eventName;
        this.#events[idx].eventName = event.startDate; 
        this.#events[idx].eventName = event.endDate; 
        // console.log(this.#todos)
        return newEvent;
    }
}

class EventView {
    constructor() {
        this.table = document.getElementById("event__container");
        this.addBtn = document.getElementById("addBtn");
        this.eventNameInput = document.getElementById("event__event-name");
        this.startDateInput = document.getElementById("event__start-date");
        this.endDateInput = document.getElementById("event__end-date");
    }

    initRenderEvents(events) {
        this.table.innerHTML = "";
        let content = `
            <tr>
                <th>Event</th>
                <th>Start</th>
                <th>End</th>
                <th>Actions</th>
            </tr>
        `;
        this.table.insertAdjacentHTML('beforeend', content);
        events.forEach(event => {
            this.appendEvent(event);
        });
    }

    appendEvent(event) {
        const evenElem = this.createEventElem(event);
        this.table.appendChild(evenElem);
    }

    createEventElem(event) {
        const eventElem = document.createElement("tr");
        eventElem.setAttribute("id", `event${event.id}`);
        eventElem.classList.add("rows"); 
        const content = `
            <td id="name${event.id}">${event.eventName}</td>
            <td id="start${event.id}" >${event.startDate}</td>
            <td id="end${event.id}">${event.endDate}</td>
            <td>
                <div class="btns">
                    <svg editId="${event.id}" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="EditIcon" aria-label="fontSize small"><path id="editIcon" editid="${event.id}" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>
                    <svg deletedId="${event.id}" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteIcon" aria-label="fontSize small"><path id="deleteIcon" deleteid="${event.id}" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
                </div>
            </td>
        `;

        eventElem.insertAdjacentHTML('beforeend', content);
        return eventElem;
    }

    createNewInput() {
        const input = document.createElement("tr");
        // input.setAttribute("id", `event${event.id}`);
        const content = `
            <td><input type="text" id="event__event-name"></td>
            <td><input type="date" id="event__start-date"></td>
            <td><input type="date" id="event__end-date"></td>
            <td>
                <div class="btns">
                    <svg id="saveIcon" focusable="false" aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path id="editIcon" editid=""d="M21,20V8.414a1,1,0,0,0-.293-.707L16.293,3.293A1,1,0,0,0,15.586,3H4A1,1,0,0,0,3,4V20a1,1,0,0,0,1,1H20A1,1,0,0,0,21,20ZM9,8h4a1,1,0,0,1,0,2H9A1,1,0,0,1,9,8Zm7,11H8V15a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1Z"/></svg>
                    <svg id="cancelIcon" focusable="false" aria-hidden="true" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><path id="deleteIcon" editid="" d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"></path></svg>
                </div>
            </td>
        `;
        input.insertAdjacentHTML('beforeend', content);
        this.table.appendChild(input);
        // console.log(input);
        return input;
    }

    saveEventElem(event) {
        const id = event.id;
        const saveIcon = document.getElementById("saveIcon");
        const cancelIcon = document.getElementById("cancelIcon")
        const input = saveIcon.parentElement.parentElement.parentElement;
        input.setAttribute("id", `event${id}`);
        saveIcon.remove();
        cancelIcon.remove();
        const btns = `
            <td>
                <div class="btns">
                    <svg id="editIcon" editId="" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="EditIcon" aria-label="fontSize small"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>
                    <svg id="deleteIcon" deleteId="" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteIcon" aria-label="fontSize small"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
                </div>
            </td>
        `;
        // const eventElem = this.createEventElem(event);
        input.remove();
        // input.insertAdjacentHTML(btns);
        this.appendEvent(event);
    }

    removeEvent(id) {
        const event = document.getElementById(`event${id}`);
        // console.log(event);
        event.remove();
    }

    startEdit(event) {
        const eventElem = document.getElementById(`event${event.id}`);
        console.log(event);
        eventElem.innerHTML = `
            <td><input type="text" id="event__event-name" value="${event.eventName}"></td>
            <td><input type="date" id="event__start-date" value="${event.startDate}"></td>
            <td><input type="date" id="event__end-date" value="${event.endDate}"></td>
            <td>
                <div class="btns">
                    <svg id="saveIcon" focusable="false" aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path id="editIcon" editid=""d="M21,20V8.414a1,1,0,0,0-.293-.707L16.293,3.293A1,1,0,0,0,15.586,3H4A1,1,0,0,0,3,4V20a1,1,0,0,0,1,1H20A1,1,0,0,0,21,20ZM9,8h4a1,1,0,0,1,0,2H9A1,1,0,0,1,9,8Zm7,11H8V15a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1Z"/></svg>
                    <svg id="cancelIcon" focusable="false" aria-hidden="true" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><path id="deleteIcon" editid="" d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"></path></svg>
                </div>
            </td>
        `;
        return eventElem;
    }

    endEdit(event) {
        const eventElem = document.getElementById(`event${event.id}`);
        // console.log(event);
        eventElem.innerHTML = `
            <td id="name${event.id}">${event.eventName}</td>
            <td id="start${event.id}" >${event.startDate}</td>
            <td id="end${event.id}">${event.endDate}</td>
            <td>
                <div class="btns">
                    <svg editId="${event.id}" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="EditIcon" aria-label="fontSize small"><path id="editIcon" editid="${event.id}" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>
                    <svg deletedId="${event.id}" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteIcon" aria-label="fontSize small"><path id="deleteIcon" deleteid="${event.id}" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
                </div>
            </td>
        `;
        return eventElem;
    }



}

class EventController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.init();
    }

    async init() {
        this.setUpHandlers();
        await this.model.fetchEvents();
        this.view.initRenderEvents(this.model.getEvents());
    }

    setUpHandlers() {
        this.handleAdd();
        this.handleDelete();
        this.handelEdit();
    }

    handleAdd() {
        this.view.addBtn.addEventListener("click", () => {
        this.view.createNewInput();
        const saveIcon = document.getElementById("saveIcon");

        saveIcon.addEventListener("click", () => {
            const eventName = document.getElementById("event__event-name").value;
            const startDate = document.getElementById("event__start-date").value;
            const endDate = document.getElementById("event__end-date").value;
            console.log(eventName);
            console.log(typeof startDate)
            if ((eventName != null && eventName != '')
                && (startDate != null && startDate != '') 
                && (endDate != null && endDate != '')){
                    this.model.addEvent({
                        eventName,
                        startDate,
                        endDate
                    }).then(event => {
                        this.view.saveEventElem(event);
                    })
            } else {
                alert("Please check your input")
            }
            // console.log(input)
            })
        
        // const cancelIcon = document.getElementById("cancelIcon");
        // console.log(cancelIcon);
        // // cancelIcon.addEventListener("click", () => {
        // //     const eventName = document.getElementById("event__event-name").value;
        // //     const startDate = document.getElementById("event__start-date").value;
        // //     const endDate = document.getElementById("event__end-date").value;
        // //     const newEvent = {
        // //         eventName: eventName,
        // //         startDate: startDate,
        // //         endDate: endDate,
        // //     }

        // //     this.view.endEdit(newEvent);
        // // })
        
        })
    }

    // handleSave = function () {
        
        
    // }

    handleDelete() {
        document.addEventListener("click", (e) => {
            const isDeleteBtn = e.target.id == "deleteIcon";
            // const removeId = e.target.getAttribute("deleteid");
            // console.log(isDeleteBtn)
            // console.log(removeId)
            if (isDeleteBtn) {
                const removeId = e.target.getAttribute("deleteid");
                this.model.removeEvent(removeId).then(() => {
                    this.view.removeEvent(removeId);
                })
            }
        })
    }

    handelEdit() {
        document.addEventListener("click", (e) => {

            // this.model.editEvent(newEvent, id).then((event) => {
            //     this.view.editEvent(event);
            // })
            const isEditBtn = e.target.id == "editIcon";
            if (isEditBtn) {
                const id = e.target.getAttribute("editid");
                const event = {
                    eventName: document.getElementById(`name${id}`).innerText,
                    startDate: document.getElementById(`start${id}`).innerText,
                    endDate: document.getElementById(`end${id}`).innerText,
                    id : id
                }
                this.model.removeEvent(id);
                this.view.startEdit(event);
                const saveIcon = document.getElementById("saveIcon");
                saveIcon.addEventListener("click", () => {
                    const eventName = document.getElementById("event__event-name").value;
                    const startDate = document.getElementById("event__start-date").value;
                    const endDate = document.getElementById("event__end-date").value;
                    // console.log(eventName);
                    // console.log(typeof startDate)
                    if ((eventName != null && eventName != '')
                        && (startDate != null && startDate != '') 
                        && (endDate != null && endDate != '')){
                            this.model.addEvent({
                                eventName,
                                startDate,
                                endDate
                            }).then(event => {
                                this.view.saveEventElem(event);
                            })
                    } else {
                        alert("Please check your input")
                    }
                    // console.log(input)
                })
                
                // const cancelIcon = document.getElementById("cancelIcon");
                // console.log(cancelIcon)
                // cancelIcon.addEventListener("click", () => {
                //     this.view.endEdit();
                // })
            }
        })
    }

    
}

const model = new EventModel();
const view = new EventView();
const controller = new EventController(model, view);