import { useRouter } from "next/router";
import { useRef } from "react";
import css from "./index.module.scss";
import { destroyCookie, setCookie } from "nookies";
import { useForm } from "react-hook-form";

export default function FormLogin({ urlLogin }) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const router = useRouter();
  const error = useRef();

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
      console.log(e);
      destroyCookie(null, "authToken");
      error.current.classList.add(css.activeError);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p ref={error} className={css.error}>
        Informations de connexion incorrect
      </p>
      <input
        type="email"
        {...register("identifier", { required: "Entrer votre email" })}
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
        {...register("password", {
          required: "Entrer votre mot de passe",
        })}
        placeholder="Mot de passe"
      />
      {errors.password && (
        <p className={css.errorMessage}>
          <span className="material-symbols-outlined">info</span>
          {errors.password.message}
        </p>
      )}

      <button type="submit">Se connecter</button>
    </form>
  );
}
