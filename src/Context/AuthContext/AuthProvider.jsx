import React, { Children, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../FIrebase/firebase.init";

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    console.log("signIn called, setting loading to true");
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = () => {
    console.log("signInWithGoogle called, setting loading to true");
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const Logout = () => {
    console.log("Logout called, setting loading to true");
    setLoading(true);
    return signOut(auth);
  };

  const updateUserProfile = (profileInfo) => {
    return updateProfile(auth.currentUser, profileInfo);
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currenUser) => {
      setUser(currenUser);

      setLoading(false);
    });

    return () => {
      console.log("AuthProvider useEffect cleanup running (unsubscribe).");
      unSubscribe();
    };
  }, []);

  const authInfo = {
    createUser,
    signIn,
    user,
    loading,
    Logout,
    signInWithGoogle,
    updateUserProfile,
  };

  console.log(
    "AuthProvider render complete. Providing - user:",
    user,
    "loading:",
    loading
  );
  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
