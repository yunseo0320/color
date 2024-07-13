<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Google Sheets API Example</title>
</head>
<body>
  <button id="authorize-button">Authorize</button>
  <button id="signout-button" style="display: none;">Sign Out</button>
  <div id="content"></div>

  <script>
    const CLIENT_ID = '990995478350-ea77rr1tdga60rgkbbo11ktrk2ecao87.apps.googleusercontent.com';
    const API_KEY = 'AIzaSyBDfmwnt75LMLSnfQEorK13YHXxQoNGHxY';
    const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
    const SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

    let authorizeButton = document.getElementById('authorize-button');
    let signoutButton = document.getElementById('signout-button');
    let content = document.getElementById('content');

    function handleClientLoad() {
      gapi.load('client:auth2', initClient);
    }

    function initClient() {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
      }).then(() => {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
      }).catch(error => {
        console.error('Error initializing client: ' + error.message);
      });
    }

    function updateSigninStatus(isSignedIn) {
      if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        listValues();
      } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
        content.innerHTML = '';
      }
    }

    function handleAuthClick() {
      gapi.auth2.getAuthInstance().signIn();
    }

    function handleSignoutClick() {
      gapi.auth2.getAuthInstance().signOut();
    }

    function listValues() {
      gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '1mexFXiMyPFM1oylhGVSjTWAvwJWSfvMRTbTx03JZAyI',
        range: 'Sheet1!A1:D10',
      }).then(response => {
        const range = response.result;
        if (range.values.length > 0) {
          let table = '<table border="1">';
          range.values.forEach(row => {
            table += '<tr>';
            row.forEach(cell => {
              table += `<td>${cell}</td>`;
            });
            table += '</tr>';
          });
          table += '</table>';
          content.innerHTML = table;
        } else {
          content.innerHTML = 'No data found.';
        }
      }).catch(error => {
        console.error('Error getting data from Google Sheets: ' + error.message);
      });
    }

    document.addEventListener('DOMContentLoaded', handleClientLoad);
  </script>

  <!-- Load the Google API Client Library -->
  <script src="https://apis.google.com/js/api.js"></script>
</body>
</html>
