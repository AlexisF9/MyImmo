import { useState } from "react";
import { destroyCookie, setCookie } from "nookies";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

export default function FormRegister({ urlRegister }) {
  const router = useRouter();

  const { register, handleSubmit } = useForm();

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
        {...register("username", { required: true })}
        placeholder="Nom d'utilisateur"
      />
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
      <button type="submit">S'inscrire</button>
    </form>
  );
}
