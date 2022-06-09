import { useState } from "react";
import css from "../styles/auth.module.scss";
import { useRouter } from "next/router";
import { destroyCookie, setCookie } from "nookies";

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
      //error.current.classList.add(css.alertError);
      console.log(e);
    }
  };

  return (
    <div className={css.login}>
      <div className={css.formLogin}>
        <h2>Se connecter</h2>
        <form onSubmit={handleSubmit} action={handleSubmit}>
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
      </div>
      <div className={css.overlay}></div>
    </div>
  );
}

export function getServerSideProps({ req }) {
  if (req.cookies.username) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return { props: {} };
}
