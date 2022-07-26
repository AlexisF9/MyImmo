import { useState } from "react";
import { destroyCookie, setCookie } from "nookies";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import css from "./index.module.scss";

export default function FormRegister({ urlRegister }) {
  const router = useRouter();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  // const [username, setUsername] = useState("");
  // const [identifier, setIdentifier] = useState("");
  // const [password, setPassword] = useState("");

  const onSubmit = async (data) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      username: data.username,
      email: data.identifier,
      password: data.password,
      role: "Authenticated",
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const rep = await fetch(urlRegister, requestOptions);

      const response = await rep.json();

      setCookie(null, "authToken", response.jwt, {
        maxAge: 30 * 24 * 60 * 60,
      });
      setCookie(null, "username", response.user.username, {
        maxAge: 30 * 24 * 60 * 60,
      });
      setCookie(null, "idUser", response.user.id, {
        maxAge: 30 * 24 * 60 * 60,
      });

      router.push("/");
    } catch (e) {
      destroyCookie(null, "authToken");
      //error.current.classList.add(css.alertError);
      console.log(e);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="text"
        {...register("username", {
          required: "Entrer votre nom d'utilisateur",
        })}
        placeholder="Nom d'utilisateur"
      />
      {errors.username && (
        <p className={css.errorMessage}>
          <span className="material-symbols-outlined">info</span>
          {errors.username.message}
        </p>
      )}

      <input
        type="email"
        {...register("identifier", { required: "Entrer un email valide" })}
        placeholder="Email"
      />
      {errors.identifier && (
        <p className={css.errorMessage}>
          <span className="material-symbols-outlined">info</span>
          {errors.identifier.message}
        </p>
      )}

      <input
        type="password"
        {...register("password", { required: "Entrer votre mot de passe" })}
        placeholder="Mot de passe"
      />
      {errors.password && (
        <p className={css.errorMessage}>
          <span className="material-symbols-outlined">info</span>
          {errors.password.message}
        </p>
      )}

      <button type="submit">S'inscrire</button>
    </form>
  );
}
