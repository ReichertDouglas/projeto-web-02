"use server";

import { db } from "../firebase/firebaseconfig";
import { collection, addDoc } from "firebase/firestore";
import { type SignupFormData } from "../validation/loginschema";
import { FirebaseError } from "firebase/app";
import { signUpWithEmailAndPassword } from "./useauth";

export const submitUserForm = async (data: SignupFormData) => {
  try {
    const signUpResult = await signUpWithEmailAndPassword({
      name: data.name,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });

    if (!signUpResult.success) {
      return { success: false, error: signUpResult.error };
    }

    await addDoc(collection(db, "usuarios"), {
      email: data.email,
      password: data.password,
      createdAt: new Date(),
    });

    return { success: true, message: "Conta criada e dados salvos com sucesso!" };

  } catch (error) {
    let errorMessage = "Ocorreu um erro ao enviar o formulário.";
    if (error instanceof FirebaseError) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
};