import css from "../styles/Home.module.scss";
import { useEffect, useState } from "react";
import { useSession } from "../contexte/session";
import Search from "../component/search";
import { parseCookies } from "nookies";

export default function Home() {
  const session = useSession();
  const [user, setUser] = useState();

  useEffect(() => {
    const useCookies = parseCookies();
    setUser(useCookies.username);
  });

  return (
    <div className={css.container}>
      {session && <p>Bienvenue {user}</p>}
      <Search />
    </div>
  );
}

// Si PAS d'user connecter = redirige vers login
export function getServerSideProps({ req }) {
  if (!req.cookies.authToken) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return { props: {} };
}
