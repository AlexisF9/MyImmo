import { useState } from "react";
import { destroyCookie, setCookie } from "nookies";
import { useRouter } from "next/router";

export default function FormRegister({ urlRegister }) {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      username: username,
      email: identifier,
      password: password,
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

      setUsername("");
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
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        placeholder="Nom d'utilisateur"
        value={username}
        onChange={(e) => {
          setUsername(e.currentTarget.value);
        }}
      />
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
      <button type="submit">S'inscrire</button>
    </form>
  );
}
