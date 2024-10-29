const noteContent = document.getElementById('noteContent');
const saveNoteBtn = document.getElementById('saveNoteBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');

let notes = JSON.parse(localStorage.getItem('notes')) || [];
let currentEditIndex = localStorage.getItem('currentEditIndex');

if (currentEditIndex !== null) {
    noteContent.value = notes[currentEditIndex];
    document.getElementById('modalTitle').textContent = 'Edit Note';
}

saveNoteBtn.onclick = () => {
    const content = noteContent.value;
    if (currentEditIndex !== null) {
        notes[currentEditIndex] = content; // Update existing note
        alert("Note updated successfully!"); // Feedback message
    } else {
        notes.push(content); // Add new note
        alert("Note added successfully!"); // Feedback message
    }
    localStorage.setItem('notes', JSON.stringify(notes));
    window.location.href = 'index.html'; // Redirect back to main page
};

cancelEditBtn.onclick = () => {
    localStorage.removeItem('currentEditIndex'); // Clear index
    window.location.href = 'index.html'; // Redirect back to main page
};
