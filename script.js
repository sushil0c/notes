const addBtn = document.querySelector("#addBtn");
const main = document.querySelector("#main");

let notes = JSON.parse(localStorage.getItem("notes")) || [];
let selectedColor = "#ffffff"; // Default color

const saveNotes = () => {
    localStorage.setItem("notes", JSON.stringify(notes));
    loadNotes();
};

const loadNotes = () => {
    main.innerHTML = "";
    notes.forEach((note, index) => {
        addNoteToDOM(note, index);
    });
};

// Add a new note
const addNote = (title = "", content = "", color = "#ffffff") => {
    const note = { title, content, color };
    notes.push(note);
    saveNotes();
};

// Display note in the DOM
const addNoteToDOM = (note, index) => {
    const noteDiv = document.createElement("div");
    noteDiv.classList.add("note");
    noteDiv.style.backgroundColor = note.color;

    noteDiv.innerHTML = `
        <div class="icons">
            <i class="fas fa-save" style="color: red;"></i>
            <i class="fas fa-trash" style="color: yellow;"></i>
        </div>
        <div class="note-title" onclick="toggleContent(${index})">${note.title}</div>
        <div class="note-content collapsed" id="content-${index}">
            ${marked(note.content)}
        </div>
        <textarea class="note-title-textarea" placeholder="Write the title...">${note.title}</textarea>
        <textarea class="note-content-textarea" placeholder="Note content...">${note.content}</textarea>
    `;

    const saveButton = noteDiv.querySelector(".fa-save");
    const deleteButton = noteDiv.querySelector(".fa-trash");
    const titleTextarea = noteDiv.querySelector(".note-title-textarea");
    const contentTextarea = noteDiv.querySelector(".note-content-textarea");

    saveButton.addEventListener("click", () => {
        note.title = titleTextarea.value;
        note.content = contentTextarea.value;
        saveNotes();
    });

    deleteButton.addEventListener("click", () => {
        notes.splice(index, 1);
        saveNotes();
    });

    main.appendChild(noteDiv);
};

// Toggle note content visibility
const toggleContent = (index) => {
    const contentDiv = document.getElementById(`content-${index}`);
    contentDiv.classList.toggle("collapsed");
};

// Add a new note when the "Add Note" button is clicked
addBtn.addEventListener("click", () => {
    addNote("", "", selectedColor);
});

// Select background color for notes
document.querySelector("#colorRed").addEventListener("click", () => {
    selectedColor = "#ff0000";
    alert("Background color changed to red");
});

document.querySelector("#colorBlue").addEventListener("click", () => {
    selectedColor = "#0000ff";
    alert("Background color changed to blue");
});

document.querySelector("#colorGreen").addEventListener("click", () => {
    selectedColor = "#008000";
    alert("Background color changed to green");
});

document.querySelector("#colorYellow").addEventListener("click", () => {
    selectedColor = "#ffff00";
    alert("Background color changed to yellow");
});

// Initial load of notes from local storage
loadNotes();