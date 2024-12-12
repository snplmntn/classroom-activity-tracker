// // Signup function

// // Login function
// function login() {
//   const email = document.getElementById("login-email").value;
//   const password = document.getElementById("login-password").value;

//   if (email === "" || password === "") {
//     lError.textContent = "Please fill up all the needed information.";
//     logIn.classList.add("error-animation");
//   }
//   if (validate_email(email) == false) {
//     lError.textContent = "Email is not valid.";
//     logIn.classList.add("error-animation");
//     return;
//     // Don't continue running the code
//   }

//   signInWithEmailAndPassword(auth, email, password)
//     .then(function (userCredential) {
//       // Login successful
//       const user = auth.currentUser;
//       if (user) {
//         // Add this user to Firebase Database
//         const databaseRef = ref(database, "users/" + user.uid);
//         // Retrieve User data
//         get(databaseRef).then((user_data) => {
//           window.location.href = "main.html";
//         });
//         // Update last login time
//         update(databaseRef, { last_login: Date.now() });
//       }
//     })
//     .catch(function (error) {
//       // Handle errors
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       console.error(errorCode);
//       document.getElementById("login-error").innerHTML = errorMessage;
//     });
// }

const User = require("../../models/User");
const { initializeApp } = require("firebase/app");
const {
  getAuth,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} = require("firebase/auth");
const AppError = require("../../utilities/appError");
const catchAsync = require("../../utilities/catchAsync");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// firebase config
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth();

const post_sign_up = catchAsync(async (req, res, next) => {
  const { fullName, email, password, username } = req.body;

  if (!fullName || !email || !password || !username) {
    return next(
      new AppError("Please fill up all the needed information.", 400)
    );
  }

  // Check if user already exists
  const isUserEmail = await User.findOne({ email });

  if (isUserEmail) {
    return next(new AppError("Email already used.", 400));
  }

  const isUsername = await User.findOne({ username });

  if (isUsername) {
    return next(new AppError("Username already exists.", 400));
  }

  // Hash the password before saving
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await createUserWithEmailAndPassword(auth, email, hashedPassword)
    .then(async () => {
      
      // Sign up successful
      auth.signOut();

      // Create new user
      const userDetails = await User.create({
        fullName,
        email,
        username,
        password: hashedPassword, // Save the hashed password
      });

      return res
        .status(200)
        .json({ message: "Signed up successfully ", userDetails });
    })
    .catch(function (error) {
      return next(new AppError(error.message, error.code));
    });
});

module.exports = {
  post_sign_up,
};