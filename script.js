// Initialize dark mode based on user preference
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.body.classList.add('dark-mode');
}

// Functions for Welcome Modal
function closeModal() {
  document.getElementById('welcomeModal').style.display = 'none';
}

// Dark Mode Toggle
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

// Notes Data Management
let notes = JSON.parse(localStorage.getItem('notes')) || [];
let editingNoteIndex = null;

// Navigation functions
function navigateToEditPage(index = null) {
  editingNoteIndex = index;
  if (index !== null) {
    localStorage.setItem('editingNoteContent', notes[index].content);
  } else {
    localStorage.removeItem('editingNoteContent');
  }
  window.location.href = "edit.html";
}

function goBack() {
  window.location.href = "index.html";
}

// Save note function
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

// Display notes on the main page
function displayNotes() {
  const notesList = document.getElementById('notesList');
  notesList.innerHTML = notes.map((note, index) => `
    <div>
      <h3 tabindex="0" onclick="showNoteContent(${index})" title="${note.content.substring(0, 100)}">${note.content.substring(0, 20)}</h3>
      <button onclick="navigateToEditPage(${index})">Edit</button>
      <button onclick="deleteNoteConfirm(${index})">Delete</button>
    </div>
  `).join('');
}

// Show note content line-by-line
function showNoteContent(index) {
  const note = notes[index];
  const contentLines = note.content.split('\n');
  const contentDisplay = contentLines.map(line => `<p>${line}</p>`).join('');
  const notesList = document.getElementById('notesList');
  notesList.innerHTML = `
    <div>
      <button onclick="displayNotes()">Back</button>
      <div>${contentDisplay}</div>
    </div>
  `;
}

// Sort notes
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

// Search notes
function searchNotes() {
  const searchQuery = document.getElementById('searchBar').value.toLowerCase();
  const filteredNotes = notes.filter(note => note.content.toLowerCase().includes(searchQuery));
  const notesList = document.getElementById('notesList');
  notesList.innerHTML = filteredNotes.map((note, index) => `
    <div>
      <h3 tabindex="0" onclick="showNoteContent(${index})" title="${note.content.substring(0, 100)}">${note.content.substring(0, 20)}</h3>
    </div>
  `).join('');
}

// Import and Export Notes
function exportNotes() {
  const dataStr = JSON.stringify(notes);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "notes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function importNotes() {
  const fileInput = document.getElementById('importNotes');
  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const importedNotes = JSON.parse(event.target.result);
    notes = [...notes, ...importedNotes];
    localStorage.setItem('notes', JSON.stringify(notes));
    displayNotes();
  };

  if (file) {
    reader.readAsText(file);
  }
}

// Save Feedback to Local Storage
function saveFeedback() {
  const feedback = document.getElementById('feedback').value;
  if (feedback) {
    const feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
    feedbacks.push(feedback);
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
    alert('Feedback saved locally!');
    document.getElementById('feedback').value = ''; // Clear feedback field
  } else {
    alert('Please enter feedback before submitting.');
  }
}

// Initialize the content on the edit page if editing an existing note
function initializeEditPage() {
  const noteContent = localStorage.get
