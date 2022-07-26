// note-title
let noteTitle;

// note-textarea
let noteText;

// save-note
let saveNoteBtn;

// new-note
let newNoteBtn;

// list-group
let noteList;

let noteListItem;




// Show an element
const show = (elem) => {
  elem.style.display = 'inline';
};

// Hide an element
const hide = (elem) => {
  elem.style.display = 'none';
};

let activeNote = {};

const getNotes = async () => {
  let response = await fetch('/api/notes/db');
  let responseJson = await response.json();
  const parsedData = JSON.parse(responseJson);
  return parsedData;
};

const saveNote = async (note) => {
  await fetch('/api/notes/db', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  }).then(
    () => { return true; }
  )
};

const renderActiveNote = () => {
  hide(saveNoteBtn);

  if (activeNote.id) {
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else {
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};

const handleNoteSave = async () => {
  const currentData = await getNotes();
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
    id: currentData.length > 0 ? Number(currentData.length + 1) : 0,
  };
  currentData.push(newNote);
  await saveNote(currentData).then(() => {
    handleLoad();
    renderActiveNote();
  });
};

// Delete the clicked note
const handleNoteDelete = async (e) => {
  // Prevents the click listener for the list from being called when the button inside of it is clicked
  e.stopPropagation();

  const noteData = await getSelectedNoteData(e);
  if (activeNote.id === noteData.id) {
    activeNote = {};
  }

  let savedNotes = await getNotes();
  savedNotes = savedNotes.filter((note) => note.id !== noteData.id);

  await saveNote(savedNotes).then(() => {
    handleLoad();
    renderActiveNote();
  });
};

// Sets the activeNote and displays it
const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
};

// Sets the activeNote to and empty object and allows the user to enter a new note
const handleNewNoteView = (e) => {
  activeNote = {};
  renderActiveNote();
};

const handleRenderSaveBtn = () => {
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
};

// Render the list of note titles
const renderNoteList = async (notes) => {
  // let jsonNotes = await notes.json();
  let jsonNotes = notes;
  if (window.location.pathname === '/api/notes') {
    if (noteList && noteList.length > 0) {
      noteList.forEach((el) => (el.innerHTML = ''));
    }
  }

  let noteListItems = [];

  // Returns HTML element with or without a delete button
  const createLi = (text, delBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');

    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleNoteView);

    liEl.append(spanEl);

    if (delBtn) {
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      delBtnEl.addEventListener('click', handleNoteDelete);

      liEl.append(delBtnEl);
    }

    return liEl;
  };

  if (jsonNotes.length === 0) {
    noteListItems.push(createLi('No saved Notes', false));
  } else {
    jsonNotes.forEach((note) => {
      const li = createLi(note.title);
      li.dataset.note = JSON.stringify(note);

      noteListItems.push(li);
    });

    if (window.location.pathname === '/api/notes') {
      noteListItems.forEach((note) => noteList[0].append(note));
    }
  }
};

const getSelectedNoteData = async (e) => {
  return JSON.parse(e.target.parentElement.getAttribute('data-note'));
}



const handleListeners = async () => {
  if (window.location.pathname === '/api/notes') {
    try {
      noteTitle = document.querySelector('.note-title');
      noteTitle.addEventListener('keyup', handleRenderSaveBtn);

      noteText = document.querySelector('.note-textarea');
      noteText.addEventListener('keyup', handleRenderSaveBtn);

      saveNoteBtn = document.querySelector('.save-note');
      saveNoteBtn.addEventListener('click', handleNoteSave);

      newNoteBtn = document.querySelector('.new-note');
      newNoteBtn.addEventListener('click', handleNewNoteView);

      noteList = document.querySelectorAll('.list-container .list-group');
    } catch (err) {
      console.log(err);
    }
  }

}

const handleLoad = async () => {
  const savedNotes = await getNotes();
  await handleListeners();
  await renderNoteList(savedNotes);

}

handleLoad();
