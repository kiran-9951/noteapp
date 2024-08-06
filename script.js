// Select DOM elements
const textarea = document.getElementById("text-field");
const input = document.getElementById("title");
const save_btn = document.getElementById("submit");
const add_btn = document.getElementById("add_note");
const return_btn = document.getElementById("return");
const notepad = document.querySelector(".notepad");
const categories = document.querySelectorAll(".categories");
const searchInput = document.getElementById("search");

// Define month and day names
const monthNames = [
  "jan", "feb", "mar", "apr", "may", "jun", 
  "jul", "aug", "sep", "oct", "nov", "dec"
];
const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

// Get current date
const date = new Date();
const day = date.getDate();
const month = date.getMonth();
const year = date.getFullYear();
const fullMonth = monthNames[month];
const day2 = days[date.getDay()];

let selectedCategory = "";

// Function to get note data
const getNoteData = () => ({
  Header: input.value,
  Body: textarea.value,
  category: selectedCategory || "Uncategorized",
  Dates: `${day2} ${fullMonth} ${year}`,
});

// Function to display a note
const displayNote = (note) => {
  let appendNote = document.createElement("div");
  appendNote.classList.add("note-content");
  appendNote.innerHTML = `
    <div class="notes" style="border-color: ${note.color || '#000'};">
      <div class="note-title">${note.Header}</div>
      <div class="note-body">${note.Body}</div>
      <div class="note-actions">
        <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(
          note.Body + " " + note.Header
        )}" rel="noopener" class="tweet_btn">Tweet</a>
        <span class="delete-btn material-symbols-outlined">delete</span>
      </div>
      <div class="category">${note.category}</div>
      <div class="date">${note.Dates}</div>
    </div>`;
  notepad.appendChild(appendNote);
};

// Function to filter notes based on search input
const filterNotes = () => {
  const searchTerm = searchInput.value.toLowerCase();
  const notes = document.querySelectorAll(".note-content");

  notes.forEach(note => {
    const noteTitle = note.querySelector(".note-title").textContent.toLowerCase();
    if (noteTitle.includes(searchTerm)) {
      note.style.display = "block"; // Show matching note
    } else {
      note.style.display = "none"; // Hide non-matching note
    }
  });
};

// Save button event listener
save_btn.addEventListener("click", () => {
  const note = getNoteData();
  if (note.Header && note.Body) { // Check if header and body are not empty
    displayNote(note);

    // Store notes in localStorage
    let storedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    storedNotes.push(note);
    localStorage.setItem("notes", JSON.stringify(storedNotes));

    Swal.fire("Note saved successfully!");

    console.log("Note saved successfully");
    setTimeout(() => {
      document.querySelector(".container").style.display = "none";
      document.querySelector(".wrapper").style.display = "block";
      // Clear input fields after saving
      input.value = '';
      textarea.value = '';
      selectedCategory = '';
      categories.forEach(cat => cat.classList.remove("selected"));
      filterNotes(); // Apply search filter after adding a new note
    }, 1000);
  } else {
    Swal.fire("Please fill in both the title and body of the note.");
  }
});

// Load notes from localStorage on page load
window.addEventListener("load", () => {
  if (document.querySelector(".wrapper")) {
    const storedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    storedNotes.forEach((note) => {
      displayNote(note);
    });
    filterNotes(); // Apply search filter on load
  }
});

// Event listener for deleting notes
notepad.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-btn")) {
    // Remove the note element from the DOM
    const noteElement = event.target.closest(".note-content");
    const noteTitle = noteElement.querySelector(".note-title").textContent;
    const noteBody = noteElement.querySelector(".note-body").textContent;
    noteElement.remove();

    // Update localStorage to reflect the deletion
    let storedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    storedNotes = storedNotes.filter((note) => {
      return !(note.Header === noteTitle && note.Body === noteBody);
    });
    localStorage.setItem("notes", JSON.stringify(storedNotes));
    console.log("Note deleted and localStorage updated.");
  }
});

// Category selection event listener
categories.forEach((category) => {
  category.addEventListener("click", () => {
    selectedCategory = category.textContent;
    categories.forEach((cat) => cat.classList.remove("selected"));
    category.classList.add("selected");
  });
});

// Add note button event listener
add_btn.addEventListener("click", () => {
  document.querySelector(".container").style.display = "block";
  document.querySelector(".wrapper").style.display = "none";
});

// Return button event listener
return_btn.addEventListener("click", () => {
  document.querySelector(".container").style.display = "none";
  document.querySelector(".wrapper").style.display = "block";
});

// Event listener for search input
searchInput.addEventListener("input", filterNotes);
