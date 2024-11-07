
        const addBtn = document.querySelector("#addBtn");
        const noteContainer = document.querySelector("#noteContainer");
        const saveBtn = document.querySelector("#saveBtn");
        const noteTitle = document.querySelector("#noteTitle");
        const noteContent = document.querySelector("#noteContent");
        const noteTags = document.querySelector("#noteTags");
        const prioritySelect = document.querySelector("#prioritySelect");
        const clearBtn = document.querySelector("#clearBtn");
        const notesContainer = document.querySelector("#notesContainer");
        const dialogOverlay = document.querySelector("#dialogOverlay");
        const deleteDialog = document.querySelector("#deleteDialog");
        const confirmDeleteBtn = document.querySelector("#confirmDeleteBtn");
        const cancelDeleteBtn = document.querySelector("#cancelDeleteBtn");

        let notes = JSON.parse(localStorage.getItem("notes")) || [];

        // Show textarea when "Add a new note" button is clicked
        addBtn.addEventListener("click", () => {
            noteContainer.style.display = "block";  // Show the note container
        });

        // Save note when "Save Note" button is clicked
        saveBtn.addEventListener("click", () => {
            const title = noteTitle.value.trim();
            const content = noteContent.value.trim();
            const tags = noteTags.value.trim().split(",").map(tag => tag.trim());
            const priority = prioritySelect.value.trim();

            if (title && content) {
                const newNote = {
                    title: title,
                    content: content,
                    tags: tags,
                    priority: priority,
                    pinned: false,
                    expiry: "",
                };
                notes.push(newNote);
                localStorage.setItem("notes", JSON.stringify(notes));
                alert("Note saved!");
                noteTitle.value = ""; // Clear the title input after saving
                noteContent.value = ""; // Clear the textarea after saving
                noteTags.value = ""; // Clear tags input
                noteContainer.style.display = "none"; // Hide the note container after saving
                loadNotes(); // Reload notes
            } else {
                alert("Please provide a title and content for the note.");
            }
        });

        // Load notes from localStorage and display them
        const loadNotes = () => {
            notesContainer.innerHTML = ""; // Clear current notes before rendering new ones
            notes.forEach((note, index) => {
                const noteDiv = document.createElement("div");
                noteDiv.classList.add("note");
                noteDiv.style.borderLeft = `5px solid ${note.priority === 'High' ? 'red' : (note.priority === 'Medium' ? 'orange' : 'green')}`;

                noteDiv.innerHTML = `
                    <div class="note-title" onclick="toggleContent(${index})">${note.title}</div>
                    <div class="note-content collapsed" id="content-${index}">${note.content}</div>
                    <div>Priority: ${note.priority}</div>
                    <div>Tags: ${note.tags.join(", ")}</div>
                    <div class="note-actions">
                        <button onclick="editNote(${index})">Edit</button>
                        <button onclick="openDeleteDialog(${index})">Delete</button>
                        <button class="export-btn" onclick="exportNote(${index})">Export</button>
                    </div>
                `;
                notesContainer.appendChild(noteDiv);
            });
        };

        // Toggle note content visibility
        const toggleContent = (index) => {
            const contentDiv = document.getElementById(`content-${index}`);
            contentDiv.classList.toggle("collapsed");
        };

        // Open delete dialog
        const openDeleteDialog = (index) => {
            dialogOverlay.style.display = "block";
            deleteDialog.style.display = "block";
            
            // Confirm delete action
            confirmDeleteBtn.onclick = () => {
                deleteNote(index); // Delete the note
                dialogOverlay.style.display = "none";  // Hide the dialog overlay
                deleteDialog.style.display = "none";   // Hide the delete dialog
            };


// Cancel delete action
                cancelDeleteBtn.onclick = () => {
                    dialogOverlay.style.display = "none";  // Hide the dialog overlay
                    deleteDialog.style.display = "none";   // Hide the delete dialog
                };
        };

        // Delete the note from the array and update localStorage
        const deleteNote = (index) => {
            notes.splice(index, 1);
// Update localStorage after deletion
            localStorage.setItem("notes", JSON.stringify(notes));
            loadNotes();  // Reload the notes to reflect the deletion
            alert("Note deleted successfully!");
        };

        // Load notes when the page loads
        window.onload = () => {
            loadNotes();  // Load the saved notes from localStorage
        };

// Email Share Function
const emailShare = (index) => {
    const note = notes[index];
    const subject = encodeURIComponent("Note: " + note.title);
    const body = encodeURIComponent(`Title: ${note.title}\n\nContent: ${note.content}\n\nTags: ${note.tags.join(", ")}\n\nPriority: ${note.priority}`);
    
    // Create the email link
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;

    // Open the email client with the pre-filled note content
    window.location.href = mailtoLink;
};
// Save Notes Offline
if (!navigator.onLine) {
    // Save notes to IndexedDB or localStorage when offline
    localStorage.setItem("offlineNotes", JSON.stringify(notes));
}

// Sync Notes when Online
window.addEventListener("online", () => {
// Pin/Unpin Note
const pinNote = (index) => {
    const note = notes[index];
    note.pinned = !note.pinned;
    localStorage.setItem("notes", JSON.stringify(notes));
    loadNotes();
};

// Modify the Render Notes function to prioritize pinned notes
const renderNotes = (notesToRender) => {
    notesToRender.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)); // Move pinned notes to the top
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
                <button onclick="pinNote(${index})">${note.pinned ? 'Unpin' : 'Pin'}</button>
                <button onclick="editNote(${index})">Edit</button>
                <button onclick="deleteNote(${index})">Delete</button>
                <button class="export-btn" onclick="exportNote(${index})">Export</button>
            </div>
        `;
        notesContainer.appendChild(noteDiv);
    });
};
// Auto Save Drafts
const autoSaveDraft = () => {
    const draftNote = {
        title: noteTitle.value.trim(),
        content: noteContent.value.trim(),
        tags: noteTags.value.trim().split(",").map(tag => tag.trim()),
        priority: prioritySelect.value.trim(),
    };

    localStorage.setItem("draftNote", JSON.stringify(draftNote));
};

// Load Draft (if any)
const loadDraftNote = () => {
    const draftNote = JSON.parse(localStorage.getItem("draftNote"));
    if (draftNote) {
        noteTitle.value = draftNote.title;
        noteContent.value = draftNote.content;
        noteTags.value = draftNote.tags.join(", ");
        prioritySelect.value = draftNote.priority;
    }
};

// Save Draft every 5 seconds
setInterval(autoSaveDraft, 5000);
// Search Notes
const searchNotes = (query) => {
    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(query.toLowerCase()) ||
        note.content.toLowerCase().includes(query.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    renderNotes(filteredNotes);
};

        // Clear all notes functionality
        clearBtn.addEventListener("click", () => {
            if (confirm("Are you sure you want to delete all notes?")) {
                notes = [];  // Empty the notes array
                localStorage.setItem("notes", JSON.stringify(notes));  // Clear localStorage
                loadNotes();  // Reload notes (which will be empty)
                alert("All notes have been deleted.");
            }
        });
