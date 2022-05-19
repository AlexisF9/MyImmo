import { useState } from "react";
import css from "./index.module.scss";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

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
      const rep = await fetch(
        `http://localhost:1337/api/auth/local`,
        requestOptions
      );

      const response = await rep.json();
      Cookies.set("authToken", response.jwt, { expires: 5 });
      Cookies.set("username", response.user.username, { expires: 5 });
      Cookies.set("idUser", response.user.id, { expires: 5 });
      setIdentifier("");
      setPassword("");
      router.push("/");
    } catch (e) {
      //error.current.classList.add(css.alertError);
      console.log(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      action={handleSubmit}
      className={css.formLogin}
    >
      <input
        type="email"
        name="identifier"
        value={identifier}
        onChange={(e) => {
          setIdentifier(e.currentTarget.value);
        }}
      />
      <input
        type="password"
        name="password"
        value={password}
        onChange={(e) => {
          setPassword(e.currentTarget.value);
        }}
      />
      <button type="submit">Se connecter</button>
    </form>
  );
}
