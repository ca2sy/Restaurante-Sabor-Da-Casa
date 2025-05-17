// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCDfSti0m1dV7Afswzk71knoTQfNMYoSr8",
  authDomain: "sabor-da-casa-restaurante.firebaseapp.com",
  projectId: "sabor-da-casa-restaurante",
  storageBucket: "sabor-da-casa-restaurante.appspot.com",
  messagingSenderId: "965279307045",
  appId: "1:965279307045:web:924f6768af8916c9fe76cc",
  measurementId: "G-M2D8BZ3NC7"
};

// Inicializando Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Exportando para usar no script.js
export { db };