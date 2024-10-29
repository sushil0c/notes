let notes = JSON.parse(localStorage.getItem('notes')) || [];
let editingNoteIndex = null;

// Initialize the app
function init() {
  const isEditPage = document.getElementById('noteContent');
  if (isEditPage) {
    initializeEditPage();
  } else {
    displayNotes();
  }
}

// Navigate to Edit Page
function navigateToEditPage(index = null) {
  editingNoteIndex = index;
  if (index !== null) {
    localStorage.setItem('editingNoteContent', notes[index].content);
  }
  window.location.href = "edit.html";
}

// Back to Main Page
function goBack() {
  window.location.href = "index.html";
}

// Save Note
function saveNote() {
  const content = document.getElementById('noteContent').value.trim();
  if (!content) {
    alert("Note cannot be empty.");
    return;
  }
  const timestamp = new Date().toISOString();
  
  if (editingNoteIndex !== null) {
    notes[editingNoteIndex].content = content;
    notes[editingNoteIndex].updatedAt = timestamp;
  } else {
    notes.push({ content, createdAt: timestamp, updatedAt: timestamp });
  }

  // Save notes to local storage
  localStorage.setItem('notes', JSON.stringify(notes));
  goBack(); // Navigate back to main page
}

// Display Notes
function displayNotes() {
  const notesList = document.getElementById('notesList');
  notesList.innerHTML = notes.map((note, index) => `
    <div>
      <h3 onclick="showNoteContent(${index})">${note.content.substring(0, 20)}...</h3>
      <button onclick="navigateToEditPage(${index})">Edit</button>
      <button onclick="deleteNoteConfirm(${index})">Delete</button>
    </div>
  `).join('');
}

// Show Note Content
function showNoteContent(index) {
  const note = notes[index];
  const contentDisplay = `
    <div>
      <h3>Note Content:</h3>
      <p>${note.content}</p>
      <button onclick="displayNotes()">Back</button>
    </div>`;
  document.getElementById('notesList').innerHTML = contentDisplay;
}

// Delete Note with Confirmation
function deleteNoteConfirm(index) {
  if (confirm("Are you sure you want to delete this note?")) {
    notes.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(notes)); // Update local storage
    displayNotes(); // Refresh note display
  }
}

// Initialize Edit Page content if editing a note
function initializeEditPage() {
  const noteContent = localStorage.getItem('editingNoteContent');
  if (noteContent) {
    document.getElementById('noteContent').value = noteContent;
    localStorage.removeItem('editingNoteContent'); // Clear temp storage after loading content
  }
}

// Initialize the app on page load
document.addEventListener('DOMContentLoaded', init);
