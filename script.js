const CLIENT_ID = '455548840988-s4vll97i9q38ro6htvgb7ps6uqu8n0ak.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBqP7XOLV2mOidzqv_eWc-7ZYGWeaMK_7Y';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

function handleClientLoad() {
    gapi.load("client:auth2", initClient);
}

function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(() => {
        const authorizeButton = document.getElementById('authorize_button');
        const signoutButton = document.getElementById('signout_button');
        const createEventButton = document.getElementById('create_event_button');

        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;

        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    }, error => {
        console.error(JSON.stringify(error, null, 2));
    });
}

function updateSigninStatus(isSignedIn) {
    const authorizeButton = document.getElementById('authorize_button');
    const signoutButton = document.getElementById('signout_button');
    const createEventButton = document.getElementById('create_event_button');

    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        createEventButton.style.display = 'block';
        createEventButton.onclick = createEvent;
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
        createEventButton.style.display = 'none';
    }
}

function handleAuthClick() {
    gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick() {
    gapi.auth2.getAuthInstance().signOut();
}

function createEvent() {
    const event = {
        'summary': 'Washing Machine Reservation',
        'location': 'Your Location',
        'description': 'Reserved for washing machine use.',
        'start': {
            'dateTime': '2024-09-17T10:00:00-07:00', // Update with your desired start time
            'timeZone': 'America/Los_Angeles'
        },
        'end': {
            'dateTime': '2024-09-17T10:40:00-07:00', // Update with your desired end time
            'timeZone': 'America/Los_Angeles'
        },
        'reminders': {
            'useDefault': false,
            'overrides': [
                {'method': 'email', 'minutes': 10},
                {'method': 'popup', 'minutes': 10}
            ]
        }
    };

    const request = gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': event
    });

    request.execute(event => {
        console.log('Event created: ' + event.htmlLink);
        alert('Event created: ' + event.htmlLink);
    });
}

document.addEventListener('DOMContentLoaded', handleClientLoad);