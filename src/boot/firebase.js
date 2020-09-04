import * as firebase from "firebase/app";
import "firebase/firestore";

// Agregar configuración firebase:
var firebaseConfig = {
  apiKey: "AIzaSyBn3MqnZPwQNqRhqZalN6NaT5hH4wZDxWw",
  authDomain: "todo-win-81846.firebaseapp.com",
  databaseURL: "https://todo-win-81846.firebaseio.com",
  projectId: "todo-win-81846",
  storageBucket: "todo-win-81846.appspot.com",
  messagingSenderId: "996215785825",
  appId: "1:996215785825:web:b62f2fe3b46e217c7e1d20",
  measurementId: "G-3WGGSYNXCQ"
};

let firebaseApp = firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();

export { db, firebase };
