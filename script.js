// Function to save a link to localStorage
function saveLink(title, description, url) {
  var link = {
    title: title,
    description: description,
    url: url
  };
  
  // Retrieve existing saved links or initialize an empty array if none exists
  var savedLinks = JSON.parse(localStorage.getItem("savedLinks")) || [];
  
  // Add the new link to the array
  savedLinks.push(link);
  
  // Save the updated array back to localStorage
  localStorage.setItem("savedLinks", JSON.stringify(savedLinks));
}

// Function to display saved links on the main page
function displaySavedLinks() {
  var savedLinks = JSON.parse(localStorage.getItem("savedLinks")) || [];
  var savedLinksContainer = document.getElementById("savedLinks");
  
  // Clear the existing content
  savedLinksContainer.innerHTML = "";
  
  if (savedLinks.length === 0) {
    savedLinksContainer.innerHTML = "<p>No saved links yet.</p>";
  } else {
    savedLinks.forEach(function(link, index) {
      var linkElement = document.createElement("div");
      linkElement.classList.add("link");
      linkElement.innerHTML = "<h3>" + link.title + "</h3><p>" + link.description + "</p><p>URL: " + link.url + "</p><button onclick='openLink(\"" + link.url + "\")'>Visit Link</button>";
      savedLinksContainer.appendChild(linkElement);
    });
  }
}

// Function to initialize the main page
function init() {
  displaySavedLinks();
}

// Call init() when the main page loads
window.onload = init;

// Function to open the link
function openLink(url) {
  window.open(url, "_blank");
}

// Function to search saved links by title
function searchLinks() {
  var query = document.getElementById("searchQuery").value.toLowerCase();
  var savedLinks = JSON.parse(localStorage.getItem("savedLinks")) || [];
  var filteredLinks = savedLinks.filter(function(link) {
    return link.title.toLowerCase().includes(query);
  });
  displayFilteredLinks(filteredLinks);
}

// Function to display filtered links
function displayFilteredLinks(filteredLinks) {
  var savedLinksContainer = document.getElementById("savedLinks");
  savedLinksContainer.innerHTML = "";
  
  if (filteredLinks.length === 0) {
    savedLinksContainer.innerHTML = "<p>No matching links found.</p>";
  } else {
    filteredLinks.forEach(function(link, index) {
      var linkElement = document.createElement("div");
      linkElement.classList.add("link");
      linkElement.innerHTML = "<h3>" + link.title + "</h3><p>" + link.description + "</p><p>URL: " + link.url + "</p><button onclick='openLink(\"" + link.url + "\")'>Visit Link</button>";
      savedLinksContainer.appendChild(linkElement);
    });
  }
}