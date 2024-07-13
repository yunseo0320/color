const CLIENT_ID = 'goodchoiys@chauniv.ac.kr';
const API_KEY = 'AIzaSyBDfmwnt75LMLSnfQEorK13YHXxQoNGHxY';
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
const SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

let authorizeButton = document.getElementById('authorize-button');
let signoutButton = document.getElementById('signout-button');
let content = document.getElementById('content');

// Load the API and make an API call. Display the results on the screen.
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

// Initializes the API client library and sets up sign-in state listeners.
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(() => {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  }, error => {
    console.error(JSON.stringify(error, null, 2));
  });
}

// Called when the signed in status changes, to update the UI appropriately. After a sign-in, the API is called.
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    listValues();
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
  }
}

// Sign in the user upon button click.
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

// Sign out the user upon button click.
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

// List values from the Google Sheet
function listValues() {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: '1mexFXiMyPFM1oylhGVSjTWAvwJWSfvMRTbTx03JZAyI',
    range: 'Sheet1!A1:D10',
  }).then(response => {
    const range = response.result;
    if (range.values.length > 0) {
      let table = '<table border="1">';
      for (let i = 0; i < range.values.length; i++) {
        const row = range.values[i];
        table += '<tr>';
        for (let j = 0; j < row.length; j++) {
          table += `<td>${row[j]}</td>`;
        }
        table += '</tr>';
      }
      table += '</table>';
      content.innerHTML = table;
    } else {
      content.innerHTML = 'No data found.';
    }
  }, error => {
    console.error('Error: ' + error.result.error.message);
  });
}

document.addEventListener('DOMContentLoaded', handleClientLoad);
