const addBtn = document.querySelector("#addBtn");
const noteContainer = document.querySelector("#noteContainer");
const saveBtn = document.querySelector("#saveBtn");
const noteTitle = document.querySelector("#noteTitle");
const noteContent = document.querySelector("#noteContent");
const noteTags = document.querySelector("#noteTags");
const prioritySelect = document.querySelector("#prioritySelect");
const clearBtn = document.querySelector("#clearBtn");
const notesContainer = document.querySelector("#notesContainer");
const darkModeToggle = document.querySelector("#darkModeToggle");
const searchInput = document.querySelector("#searchInput");
const searchBtn = document.querySelector("#searchBtn");

let notes = JSON.parse(localStorage.getItem("notes")) || [];

// Toggle Dark Mode
darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
});

// Search Notes
searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) {
        searchNotes(query);
    }
});

// Show Add Note Container
addBtn.addEventListener("click", () => {
    noteContainer.style.display = "block";
});

// Save Note
saveBtn.addEventListener("click", () => {
    const title = noteTitle.value.trim();
    const content = noteContent.value.trim();
    const tags = noteTags.value.trim().split(",").map(tag => tag.trim());
    const priority = prioritySelect.value.trim();

    if (title && content) {
        const newNote = {
            title,
            content,
            tags,
            priority,
            pinned: false,
            expiry: "",
        };
        notes.push(newNote);
        localStorage.setItem("notes", JSON.stringify(notes));
        alert("Note saved!");
        noteTitle.value = "";
        noteContent.value = "";
        noteTags.value = "";
        noteContainer.style.display = "none";
        loadNotes();
    } else {
        alert("Please provide a title and content for the note.");
    }
});

// Load Notes
const loadNotes = () => {
    renderNotes(notes);
};

// Render Notes
const renderNotes = (notesToRender) => {
    notesContainer.innerHTML = "";
    notesToRender.forEach((note, index) => {
        const noteDiv = document.createElement("div");
        noteDiv.classList.add("note");
        noteDiv.id = `note-${index}`;
        noteDiv.style.borderLeft = `5px solid ${note.priority === 'High' ? 'red' : (note.priority === 'Medium' ? 'orange' : 'green')}`;
        noteDiv.innerHTML = `
            <div class="note-title" onclick="toggleContent(${index})">${note.title}</div>
            <div class="note-content collapsed" id="content-${index}">${note.content}</div>
            <div>Priority: ${note.priority}</div>
            <div>Tags: ${note.tags.join(", ")}</div>
            <div class="note-actions">
                <button onclick="editNote(${index})">Edit</button>
                <button onclick="deleteNote(${index})">Delete</button>
                <button class="export-btn" onclick="exportNote(${index})">Export</button>
            </div>
        `;
        notesContainer.appendChild(noteDiv);
    });
};

// Toggle Note Content Visibility
const toggleContent = (index) => {
    const contentDiv = document.getElementById(`content-${index}`);
    contentDiv.classList.toggle("collapsed");
};

// Edit Note
const editNote = (index) => {
    const note = notes[index];
    noteTitle.value = note.title;
    noteContent.value = note.content;
    noteTags.value = note.tags.join(", ");
    prioritySelect.value = note.priority;
    noteContainer.style.display = "block";
};

// Delete Note
const deleteNote = (index) => {
    notes.splice(index, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    loadNotes();
};

// Export Note
const exportNote = (index) => {
    const note = notes[index];
    const blob = new Blob([note.title + "\n\n" + note.content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${note.title}.txt`;
    link.click();
};

// Search Notes
const searchNotes = (query) => {
    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(query.toLowerCase()) ||
        note.content.toLowerCase().includes(query.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    renderNotes(filteredNotes);
};

// Clear All Notes
clearBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete all notes?")) {
        notes = [];
        localStorage.setItem("notes", JSON.stringify(notes));
        loadNotes();
    }
});

// Initialize Dark Mode from localStorage
if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
}

// Load Notes on Initial Page Load
loadNotes();