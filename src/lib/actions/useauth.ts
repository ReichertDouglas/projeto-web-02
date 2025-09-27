"use server";

import { auth, db } from "../firebase/firebaseconfig";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { LoginFormData, SignupFormData } from "../validation/loginschema";
import { googleProvider, githubProvider } from "../firebase/firebaseconfig";
import { signInWithPopup } from "firebase/auth";

// ✅ CADASTRO SEGURO
export const signUpWithEmailAndPassword = async (data: SignupFormData) => {
  try {
    // ✅ Log seguro (sem expor dados sensíveis)
    console.log("Tentativa de cadastro para:", data.email);
    
    // ✅ Validar dados antes de enviar para o Firebase
    if (!data.email || !data.password) {
      return { success: false, error: "Email e senha são obrigatórios." };
    }

    // ✅ Criar usuário no Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    const user = userCredential.user;

    // ✅ Atualizar perfil com nome (se existir)
    if (data.name) {
      await updateProfile(user, {
        displayName: data.name
      });
    }

    // ✅ Enviar verificação de email
    await sendEmailVerification(user);

    // ✅ SALVAR DADOS NO FIRESTORE (SEM SENHA!)
    await setDoc(doc(db, "users", user.uid), {
      email: data.email,
      name: data.name || "",
      emailVerified: false,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      provider: "email",
      updatedAt: serverTimestamp()
    }, { merge: true });

    // ✅ Log de sucesso seguro
    console.log("Usuário cadastrado com sucesso:", user.uid);

    return { 
      success: true, 
      message: "Conta criada com sucesso! Verifique seu e-mail." 
    };

  } catch (error) {
    // ✅ Log de erro seguro
    console.error("Erro no cadastro:", error instanceof Error ? error.message : "Erro desconhecido");

    let errorMessage = "Ocorreu um erro ao criar a conta.";

    if (error instanceof FirebaseError) {
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Este e-mail já está em uso.";
          break;
        case "auth/weak-password":
          errorMessage = "A senha é muito fraca. Use pelo menos 6 caracteres.";
          break;
        case "auth/invalid-email":
          errorMessage = "O e-mail informado é inválido.";
          break;
        case "auth/operation-not-allowed":
          errorMessage = "Operação não permitida. Contate o suporte.";
          break;
        case "auth/network-request-failed":
          errorMessage = "Erro de conexão. Verifique sua internet.";
          break;
        default:
          errorMessage = `Erro: ${error.code}`;
      }
    }

    return { success: false, error: errorMessage };
  }
};

// ✅ LOGIN SEGURO
export const signInAction = async (data: LoginFormData) => {
  try {
    // ✅ Validar dados
    if (!data.email || !data.password) {
      return { success: false, error: "Email e senha são obrigatórios." };
    }

    const userCredential = await signInWithEmailAndPassword(
      auth, 
      data.email, 
      data.password
    );

    const user = userCredential.user;

    // ✅ Atualizar último login no Firestore
    await setDoc(doc(db, "users", user.uid), {
      lastLogin: serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge: true });

    // ✅ Verificar se o email foi verificado
    if (!user.emailVerified) {
      console.log("Usuário logado mas email não verificado:", user.uid);
      // Você pode optar por não permitir login sem verificação
      // return { success: false, error: "Verifique seu email antes de fazer login." };
    }

    return { 
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        emailVerified: user.emailVerified
      }
    };

  } catch (error) {
    console.error("Erro no login:", error instanceof Error ? error.message : "Erro desconhecido");

    let errorMessage = "Ocorreu um erro ao tentar fazer login.";

    if (error instanceof FirebaseError) {
      switch (error.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
          errorMessage = "E-mail ou senha inválidos.";
          break;
        case "auth/user-disabled":
          errorMessage = "Esta conta foi desativada.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Muitas tentativas. Tente novamente em alguns minutos.";
          break;
        case "auth/invalid-email":
          errorMessage = "O e-mail informado é inválido.";
          break;
        case "auth/network-request-failed":
          errorMessage = "Erro de conexão. Verifique sua internet.";
          break;
        default:
          errorMessage = `Erro: ${error.code}`;
      }
    }

    return { success: false, error: errorMessage };
  }
};

// ✅ REDEFINIÇÃO DE SENHA SEGURA
export const sendPasswordResetAction = async (email: string) => {
  try {
    // ✅ Validar email
    if (!email || !email.includes('@')) {
      return { success: false, error: "Por favor, informe um e-mail válido." };
    }

    await sendPasswordResetEmail(auth, email);

    // ✅ Log seguro
    console.log("Email de redefinição enviado para:", email);

    return { 
      success: true, 
      message: "E-mail de redefinição enviado! Verifique sua caixa de entrada." 
    };

  } catch (error) {
    console.error("Erro ao enviar redefinição:", error);

    let errorMessage = "Não foi possível enviar o e-mail de redefinição.";

    if (error instanceof FirebaseError) {
      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "Nenhuma conta encontrada com este e-mail.";
          break;
        case "auth/invalid-email":
          errorMessage = "O e-mail informado é inválido.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Muitas tentativas. Tente novamente mais tarde.";
          break;
        default:
          errorMessage = "Erro ao enviar e-mail de redefinição. Tente novamente.";
      }
    }

    return { success: false, error: errorMessage };
  }
};

// ✅ LOGOUT SEGURO
export const signOutAction = async () => {
  try {
    await signOut(auth);
    
    // ✅ Log seguro
    console.log("Usuário deslogado com sucesso");
    
    return { success: true };

  } catch (error) {
    console.error("Erro no logout:", error);

    let errorMessage = "Erro ao fazer logout.";

    if (error instanceof FirebaseError) {
      errorMessage = `Erro: ${error.code}`;
    }

    return { success: false, error: errorMessage };
  }
};

// ✅ LOGIN COM GOOGLE
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // ✅ Salvar/atualizar usuário no Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      name: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      provider: "google",
      lastLogin: serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge: true });

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified
      }
    };

  } catch (error) {
    console.error("Erro no login com Google:", error);

    let errorMessage = "Erro ao fazer login com Google.";

    if (error instanceof FirebaseError) {
      switch (error.code) {
        case "auth/popup-closed-by-user":
          errorMessage = "Login cancelado pelo usuário.";
          break;
        case "auth/popup-blocked":
          errorMessage = "Popup bloqueado. Permita popups para este site.";
          break;
        case "auth/account-exists-with-different-credential":
          errorMessage = "Já existe uma conta com este e-mail.";
          break;
      }
    }

    return { success: false, error: errorMessage };
  }
};

// ✅ LOGIN COM GITHUB
export const signInWithGitHub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    const user = result.user;

    // ✅ Salvar/atualizar usuário no Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      name: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      provider: "github",
      lastLogin: serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge: true });

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified
      }
    };

  } catch (error) {
    console.error("Erro no login com GitHub:", error);

    let errorMessage = "Erro ao fazer login com GitHub.";

    if (error instanceof FirebaseError) {
      switch (error.code) {
        case "auth/popup-closed-by-user":
          errorMessage = "Login cancelado pelo usuário.";
          break;
        case "auth/popup-blocked":
          errorMessage = "Popup bloqueado. Permita popups para este site.";
          break;
        case "auth/account-exists-with-different-credential":
          errorMessage = "Já existe uma conta com este e-mail.";
          break;
      }
    }

    return { success: false, error: errorMessage };
  }
};