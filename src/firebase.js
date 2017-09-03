import { toArray } from 'lodash/fp';
import * as firebase from 'firebase';

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
}

export function saveScore({ score, name }) {
  return new Promise((resolve) => {
    firebase.database()
      .ref(`users/${firebase.auth().currentUser.uid}`)
      .set({ name, score })
      .on('value', snapshot => resolve(snapshot));
  });
}

export function getAllUsers() {
  return new Promise((resolve) => {
    firebase.database().ref('users/').on('value', (snapshot) => {
      resolve(
        toArray(snapshot.val()).sort((a, b) => a.score > b.score)
      );
    });
  });
}
