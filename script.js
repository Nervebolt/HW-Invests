// Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBthNTm_idsh6DYhboVoO1VsjkRoDuRmNU",
    authDomain: "hw-invest.firebaseapp.com",
    projectId: "hw-invest",
    storageBucket: "hw-invest.appspot.com",
    messagingSenderId: "753726580226",
    appId: "1:753726580226:web:a45f55de10d096b33ce91b"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let currentUser;

// Toggle between sign in and sign up forms
function toggleAuth() {
    document.getElementById('login-form').style.display = document.getElementById('login-form').style.display === 'none' ? 'block' : 'none';
    document.getElementById('signup-form').style.display = document.getElementById('signup-form').style.display === 'none' ? 'block' : 'none';
}

// Sign Up function
function signUp() {
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Store user in Firestore
            currentUser = userCredential.user;
            db.collection('users').doc(currentUser.uid).set({
                email: currentUser.email,
                balance: 100
            });
            toggleToDashboard();
        })
        .catch((error) => {
            console.error(error);
            alert(error.message);
        });
}

// Sign In function
function signIn() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            currentUser = userCredential.user;
            toggleToDashboard();
        })
        .catch((error) => {
            console.error(error);
            alert(error.message);
        });
}

// Google Sign In
function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            currentUser = result.user;
            toggleToDashboard();
        })
        .catch((error) => {
            console.error(error);
            alert(error.message);
        });
}

// Google Sign Up
function signUpWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            currentUser = result.user;
            db.collection('users').doc(currentUser.uid).set({
                email: currentUser.email,
                balance: 100
            });
            toggleToDashboard();
        })
        .catch((error) => {
            console.error(error);
            alert(error.message);
        });
}

// Toggle to dashboard
function toggleToDashboard() {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('user-email').innerText = currentUser.email;
    db.collection('users').doc(currentUser.uid).get()
        .then((doc) => {
            document.getElementById('balance').innerText = doc.data().balance;
        });
}

// Sign Out
function signOut() {
    auth.signOut()
        .then(() => {
            document.getElementById('auth-section').style.display = 'block';
            document.getElementById('dashboard').style.display = 'none';
        })
        .catch((error) => {
            console.error(error);
            alert(error.message);
        });
}

// Redirect to investment page
function invest() {
    window.location.href = 'invest.html';
}

// Monitor auth state
auth.onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        toggleToDashboard();
    } else {
        document.getElementById('auth-section').style.display = 'block';
        document.getElementById('dashboard').style.display = 'none';
    }
});
