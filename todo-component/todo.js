/**
 * Todo Component
 *
 * @author: Ankit Pandey
 */

const template = document.createElement("template");
// encapsulated style and html
template.innerHTML = `
<!-- style: start -->
<style>
.todo-container {
  width: 80%;
  margin: auto;
  margin-top: 20px;
  margin-bottom: 20px;
  padding-bottom: 40px;
  min-height: 450px;
  background-color: white;
}

.todo-container .todo-header {
  background-color: skyblue;
  padding: 10px;
  margin-bottom: 10px;
  color: white;
  font-size: x-large;
}

.todo-container .todo-body {
  display: flex;
  width: 70%;
  margin: auto;
}

.todo-container .todo-body .todo-content {
  max-height: 500px;
  margin: 4px;
  padding: 2px;
  flex: 1;
}

.todo-container .todo-body .todo-content > div:nth-child(1) {
  padding: 5px;
  background-color: skyblue;
  color: white;
}
.todo-container .todo-body .todo-content > div:nth-child(2) {
  border: 5px solid #f9f9f9;
  max-height: 300px;
  min-height: 100%;
  padding: 5px;
  overflow-y: auto;
}

.todo-container .todo-body .todo-content > div:nth-child(2) > div:hover {
  background: #f9f9f9;
}

.todo-container .todo-body .todo-content #todo > div,
.todo-container .todo-body .todo-content #inprogress > div,
.todo-container .todo-body .todo-content #finished > div {
  padding: 10px;
  border: 2px solid #f9f9f9;
  padding: 10px;
}

.todo-container .todo-body .todo-content #todo > div,
.todo-container .todo-body .todo-content #inprogress > div {
  cursor: move;
}

.no-selection {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently supported by Chrome and Opera */
}
/* Custom Scrollbar : Start */
.todo-container ::-webkit-scrollbar {
  width: 12px;
}

/* Track */
.todo-container ::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px skyblue;
  border-radius: 12px;
}

/* Handle */
.todo-container ::-webkit-scrollbar-thumb {
  background: rgba(135, 206, 235, 0.5);
  border-radius: 10px;
}

/* Handle on hover */
.todo-container ::-webkit-scrollbar-thumb:hover {
  background: rgba(135, 206, 235, 0.9);
}

/* Custom Scrollbar : End */
</style>
<!-- style: start -->
<!----------------------------------------------------  Template  --------------------------------------------->
<div class="todo-container">
  <div class="todo-header">
    <slot name="task-heading"></slot>
    <div><slot name="task-sub-heading"></slot></div>
  </div>

  <div class="todo-body no-selection">
    <div class="todo-content">
      <div><slot name="todo"></slot></div>
      <div id="todo" data-status="todo"></div>
    </div>

    <div class="todo-content">
      <div><slot name="inProgress"></slot></div>
      <div
        id="inprogress" data-status="inProgress">
      </div>
    </div>

    <div class="todo-content">
      <div><slot name="finished"></slot></div>
      <div id="finished" data-status="finished">
      </div>
    </div>
  </div>
</div>
`;

class TodoComponent extends HTMLElement {
  constructor() {
    super();
    // attaching shadow dom
    this.attachShadow({ mode: "open" });
    // attaching template to shadow root
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.todoElem = {};
    this.inProgressElem = {};
    this.finishedElem = {};
    this.isAllDragDrop = false;
  }

  /**
   * Connected Callback will call when element added to DOM
   */
  connectedCallback() {
    this.todoElem = this.shadowRoot.getElementById("todo");
    this.inProgressElem = this.shadowRoot.getElementById("inprogress");
    this.finishedElem = this.shadowRoot.getElementById("finished");

    this.isAllDragDrop = this.getAttribute("is-all-drag-drop");
    if (this.isAllDragDrop) {
      this.todoElem.addEventListener("drop", this.dropHandler.bind(this));
      this.todoElem.addEventListener("dragover", this.dragOverHandler);
      this.todoElem.addEventListener("dragleave", this.dragleaveHandler);
    }
    // adding event handler
    this.inProgressElem.addEventListener("drop", this.dropHandler.bind(this));
    this.inProgressElem.addEventListener("dragover", this.dragOverHandler);
    this.inProgressElem.addEventListener("dragleave", this.dragleaveHandler);

    this.finishedElem.addEventListener("drop", this.dropHandler.bind(this));
    this.finishedElem.addEventListener("dragover", this.dragOverHandler);
    this.finishedElem.addEventListener("dragleave", this.dragleaveHandler);
  }

  // Getting list of observed attribute
  static get observedAttributes() {
    return ["data"];
  }

  /**
   * Attribute Changed Callback will call when attribute add/changed
   * @param {string} attrName
   * @param {json} oldValue
   * @param {json} newValue
   */
  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName == "data") {
      this.appData = JSON.parse(newValue);
      let states = Object.keys(this.appData);
      states.forEach((state) => {
        this.setHTML(state);
      });
    }
  }

  /**
   * Setting HTML
   * @param {string} key
   */
  setHTML(key) {
    let str = "";
    this.appData[key].forEach((data, index) => {
      switch (key) {
        case "todo":
          str += `<div 
                    id="todo${index}"
                    draggable="true" 
                    data-name="${data.name}" 
                    data-status="todo">
                      ${data.name}
                  </div>`;

          break;
        case "inProgress":
          str += `<div 
                    id="inProgress${index}"
                    draggable="true"
                    data-name="${data.name}" 
                    data-status="inProgress">
                      ${data.name}
                  </div>`;
          break;
        case "finished":
          if (this.isAllDragDrop) {
            str += `<div 
                      id="finished${index} 
                      data-name="${data.name}"
                      draggable=true
                      data-status="finished"
                      style="cursor:move">
                        ${data.name}
                    </div>`;
          } else {
            str += `<div 
                      id="finished${index}
                      draggable="false"                    
                      data-name="${data.name}"
                      data-status="finished"
                      style="cursor:not-allowed!important;">
                        ${data.name}
                    </div>`;
          }
      }
    });

    // dynamic html genration for column data
    if (key) {
      this[key + "Elem"].innerHTML = str;
      if (key === "todo") {
        // for todo dragstart
        let selector = `[id|="${key}"]`;
        // adding event
        this.shadowRoot.querySelectorAll(selector).forEach((rowElem) => {
          rowElem.addEventListener(
            "dragstart",
            this.dragStartHandeler.bind(this)
          );
        });
      } else if (key === "inProgress") {
        // for inProgress dragstart
        let selector = `[id|="${key.toLowerCase()}"]`;
        // adding event
        this.shadowRoot.querySelectorAll(selector).forEach((rowElem) => {
          rowElem.addEventListener(
            "dragstart",
            this.dragStartHandeler.bind(this)
          );
        });
      } else if (key === "finished" && this.isAllDragDrop) {
        // for finished dragstart
        let selector = `[id|="${key.toLowerCase()}"]`;
        // adding event
        this.shadowRoot.querySelectorAll(selector).forEach((rowElem) => {
          rowElem.addEventListener(
            "dragstart",
            this.dragStartHandeler.bind(this)
          );
        });
      }
    }
  }

  /**
   * On Drag start event handler
   * @param {object} e
   */
  dragStartHandeler(e) {
    let dragData = {
      status: e.target.getAttribute("data-status"),
      name: e.target.getAttribute("data-name"),
    };
    e.dataTransfer.setData("text", JSON.stringify(dragData));
  }

  /**
   * On Drop event havdler
   * @param {object} e - event
   */
  dropHandler(e) {
    try {
      let dragIndex, splicedData;
      let droppedStatus = e.target.getAttribute("data-status");
      let draggedData = JSON.parse(e.dataTransfer.getData("text"));
      if (draggedData.status !== droppedStatus) {
        // do not drop on same own status
        dragIndex = this.appData[draggedData.status].findIndex(
          (data) => data.name === draggedData.name
        );
        splicedData = this.appData[draggedData.status].splice(dragIndex, 1);
        this.appData[droppedStatus].push(splicedData[0]);

        e.target.style.boxShadow = "none";
        this.renderingHTML(droppedStatus, draggedData.status);
      }
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * On Drag over event handler
   * @param {object} e - event
   */
  dragOverHandler(e) {
    e.target.style.boxShadow = "10px 15px 20px whitesmoke";
    e.preventDefault();
  }

  /**
   * On Drag leave event handler
   * @param {object} e - event
   */
  dragleaveHandler(e) {
    e.target.style.boxShadow = "none";
  }

  /**
   * Re-rendering HTML
   * @param {string} droppedStatus
   * @param {string} draggedStatus
   */
  renderingHTML(droppedStatus, draggedStatus) {
    // rerendering html
    this.setHTML(droppedStatus);
    this.setHTML(draggedStatus);
  }
}

// creating custom element
window.customElements.define("task-manager", TodoComponent);
