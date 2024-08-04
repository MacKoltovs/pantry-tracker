// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCAGws5LiB03mtz_oUKI2I_JPomEhoh1O4',
  authDomain: 'pantry-tracker-792b2.firebaseapp.com',
  projectId: 'pantry-tracker-792b2',
  storageBucket: 'pantry-tracker-792b2.appspot.com',
  messagingSenderId: '1011651009258',
  appId: '1:1011651009258:web:80d72bcc7114aaeab69593',
  measurementId: 'G-WPD92S4KVT',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

const firestore = getFirestore(app)

export { firestore }
