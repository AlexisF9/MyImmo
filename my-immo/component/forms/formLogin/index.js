import { useRouter } from "next/router";
import { createRef, useState } from "react";
import css from "./index.module.scss";
import { destroyCookie, setCookie } from "nookies";

export default function FormLogin({ urlLogin }) {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const error = createRef();

  const handleSubmit = async (event) => {
    event.preventDefault();

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      identifier: identifier,
      password: password,
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

      setIdentifier("");
      setPassword("");

      router.push("/");
    } catch (e) {
      destroyCookie(null, "authToken");
      error.current.classList.add(css.activeError);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <p ref={error} className={css.error}>
        Identifiants de connexion incorrect
      </p>
      <input
        type="email"
        name="identifier"
        placeholder="Email"
        value={identifier}
        onChange={(e) => {
          setIdentifier(e.currentTarget.value);
        }}
      />
      <input
        type="password"
        name="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => {
          setPassword(e.currentTarget.value);
        }}
      />

      <button type="submit">Se connecter</button>
    </form>
  );
}
