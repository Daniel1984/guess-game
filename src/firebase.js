import * as firebase from 'firebase';

let db;

const config = {
  apiKey: 'AIzaSyCkYITWYTFC5CSzIpFWYKlGLhqUY2yDb2M',
  authDomain: 'guess-d3ac6.firebaseapp.com',
  databaseURL: 'https://guess-d3ac6.firebaseio.com',
  projectId: 'guess-d3ac6',
  storageBucket: '',
  messagingSenderId: '37585262707',
};

export function initDb() {
  firebase.initializeApp(config);
  firebase.auth().signInAnonymously();
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      db = firebase.database();
    }
  });
}

export function saveScore({ score, name, time }) {
  db.ref(`users/${firebase.auth().currentUser.uid}`).set({ name, score, time });
}
