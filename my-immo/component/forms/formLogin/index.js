import { useRouter } from "next/router";
import { createRef, useState } from "react";
import css from "./index.module.scss";
import { destroyCookie, setCookie } from "nookies";
import { useForm } from "react-hook-form";

export default function FormLogin({ urlLogin }) {
  const { register, handleSubmit } = useForm();

  const router = useRouter();
  const error = createRef();

  const onSubmit = async (data) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      identifier: data.identifier,
      password: data.password,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const rep = await fetch(urlLogin, requestOptions);

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
      error.current.classList.add(css.activeError);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p ref={error} className={css.error}>
        Identifiants de connexion incorrect
      </p>
      <input
        type="email"
        {...register("identifier", { required: true })}
        placeholder="Email"
      />
      <input
        type="password"
        {...register("password", { required: true })}
        placeholder="Mot de passe"
      />

      <button type="submit">Se connecter</button>
    </form>
  );
}
