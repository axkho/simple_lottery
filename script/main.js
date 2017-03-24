document.addEventListener("DOMContentLoaded", function(event) { init(); });

function getElement(selector) {
  return document.querySelector(selector);
}

function getElements(selector) {
  return document.querySelectorAll(selector);
}

function init() {
  document.getElementById('registration_form').addEventListener('submit', addParticipant);
  populateTable();
}

function getParticipants(){
  var db = [];
  try {
    db = JSON.parse(localStorage.getItem('participants')) || [];
  }
  catch (e) { }
  return db;
}

function populateTable() {
  var participants = getParticipants();
  if(participants.length) {
    for(var i=0; i<participants.length; i++){
      addToTable(participants[i]);
    }
  }
}

function addParticipant(e){
  e.preventDefault();

  var participants = getParticipants();
  var participant = {
    name: getElement("#firstname").value,
    lastname: getElement("#lastname").value,
    email: getElement("#email").value,
    phone: getElement("#phone").value,
    dob: getElement("#dob").value
  };
  participants.push(participant);

  updateDB(participants);
  addToTable(participant);

  getElement("#registration_form").reset();
}

function addToTable(object){
  var table = getElement("#participants_table");
  var row = table.insertRow(1);
  var editRemoveCell = row.insertCell(0);
  var nameCell = row.insertCell(1);
  var lastnameCell = row.insertCell(2);
  var emailCell = row.insertCell(3);
  var phoneCell = row.insertCell(4);
  var dobCell = row.insertCell(5);

  editRemoveCell.innerHTML = '<input type="button" class="delete_btn" onclick="deleteParticipant(this)" >';
  editRemoveCell.innerHTML += '<input type="button" class="save_btn" onclick="saveEdit(this)" >';

  nameCell.innerHTML = '<input type="text" pattern="[a-zA-Z]*" class="form-control" maxlength="15" value="'+object.name+'" />';

  lastnameCell.innerHTML = '<input type="text" class="form-control" maxlength="15" value="'+object.lastname+'" />';

  emailCell.innerHTML = '<input type="text" class="form-control" maxlength="25" value="'+object.email+'" />';

  phoneCell.innerHTML = '<input type="text" maxlength="10" class="form-control" value="'+object.phone+'" />';

  dobCell.innerHTML = '<input type="text" maxlength="10"  class="form-control" value="'+object.dob+'" />';
}

function deleteParticipant(btn){
  var row = btn.parentNode.parentNode;
  deleteFromDB(row.rowIndex);
  row.parentNode.removeChild(row);
}

function deleteFromDB(rowIndex) {
  var db = getParticipants();
  var index = db.length - rowIndex;
  db.splice(index, 1);
  updateDB(db);
}

function saveEdit(btn){
  var row = getElement("#participants_table").rows[btn.parentNode.parentNode.rowIndex];

  var participants = getParticipants();
  var index = participants.length - row.rowIndex;
  var participant = participants[index];

  participant.name = row.cells[1].firstChild.value;
  participant.lastname = row.cells[2].firstChild.value;
  participant.email = row.cells[3].firstChild.value;
  participant.phone = row.cells[4].firstChild.value;
  participant.dob = row.cells[5].firstChild.value;

  if(checkEdit(participant, row)){
    participants[index] = participant;
    removeValidationErrors(row);
    updateDB(participants);
  }
}

function checkEdit(participant, row) {
  if(!checkName(participant.name)){
    validationError(row.cells[1]);
  }
  else if(!checkName(participant.lastname)){
    validationError(row.cells[2]);
  }
  else if(!checkEmail(participant.email)){
    validationError(row.cells[3]);
  }
  else if(participant.phone && !checkPhone(participant.phone)){
    validationError(row.cells[4]);
  }
  else if(participant.dob && !checkDob(participant.dob)){
    validationError(row.cells[5]);
  }
  else {
    return true;
  }
}

function determineWinner(){
  var participants = getParticipants();
  var index = Math.floor(Math.random() * (participants.length - 0)) + 0;
  getElement("#winner").innerHTML = participants[index].name + " " + participants[index].lastname;
}

function updateDB(db) {
  localStorage.setItem('participants', JSON.stringify(db));
}

/******/
function validationError(target) {
  target.firstChild.className += " invalid_table_field";
}

function removeValidationErrors(row) {
  for(var i=1; i<=5; i++){
    row.cells[i].firstChild.classList.remove("invalid_table_field");
  }
}

function checkName(string) {
  return /^[A-Za-z ]+$/.test(string);
}

function checkEmail(string) {
  return /^[^@]+@[^@]+\.[a-zA-Z]{2,6}/.test(string);
}

function checkPhone(string) {
  return /^[0-9]{10}/.test(string);
}

function checkDob(string) {
  return /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/.test(string);
}
