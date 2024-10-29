let notes = JSON.parse(localStorage.getItem('notes')) || [];
let editingNoteIndex = null;

// Initialize the app
function init() {
  const isEditPage = document.getElementById('noteContent');
  if (isEditPage) initializeEditPage();
  else {
    displayNotes();
    document.getElementById('welcomeModal').style.display = 'flex';
  }
}

// Close Welcome Modal
function closeModal() {
  document.getElementById('welcomeModal').style.display = 'none';
}

// Toggle Dark Mode
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

// Navigate to Edit Page
function navigateToEditPage(index = null) {
  editingNoteIndex = index;
  if (index !== null) {
    localStorage.setItem('editingNoteContent', notes[index].content);
  } else {
    localStorage.removeItem('editingNoteContent');
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
  localStorage.setItem('notes', JSON.stringify(notes));
  goBack();
}

// Display Notes
function displayNotes() {
  const notesList = document.getElementById('notesList');
  notesList.innerHTML = notes.map((note, index) => `
    <div>
      <h3 tabindex="0" onclick="showNoteContent(${index})">${note.content.substring(0, 20)}...</h3>
      <button onclick="navigateToEditPage(${index})">Edit</button>
      <button onclick="deleteNoteConfirm(${index})">Delete</button>
    </div>
  `).join('');
}

// Show Note Content
function showNoteContent(index) {
  const note = notes[index];
  const contentLines = note.content.split('\n');
  const contentDisplay = contentLines.map(line => `<p>${line}</p>`).join('');
  document.getElementById('notesList').innerHTML = `
    <div>
      <button onclick="displayNotes()">Back</button>
      <div>${contentDisplay}</div>
    </div>
  `;
}

// Delete Note with Confirmation
function deleteNoteConfirm(index) {
  if (confirm("Are you sure you want to delete this note?")) {
    notes.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    displayNotes();
  }
}

// Sort Notes
function sortNotes() {
  const sortOption = document.getElementById('sortOptions').value;
  if (sortOption === 'alphabetical') {
    notes.sort((a, b) => a.content.localeCompare(b.content));
  } else if (sortOption === 'recentlyCreated') {
    notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sortOption === 'lastEdited') {
    notes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }
  displayNotes();
}

// Search Notes
function searchNotes() {
  const query = document.getElementById('searchBar').value.toLowerCase();
  const filteredNotes = notes.filter(note => note.content.toLowerCase().includes(query));
  document.getElementById('notesList').innerHTML = filteredNotes.map((note, index) => `
    <div>
      <h3 tabindex="0" onclick="showNoteContent(${index})">${note.content.substring(0, 20)}...</h3>
      <button onclick="navigateToEditPage(${index})">Edit</button>
      <button onclick="deleteNoteConfirm(${index})">Delete</button>
    </div>
  `).join('');
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
