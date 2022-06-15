import css from "../styles/Home.module.scss";
import { useEffect, useState } from "react";
import { useSession } from "../contexte/session";
import Search from "../component/search";
import { parseCookies } from "nookies";

export default function Home(props) {
  const session = useSession();
  const [user, setUser] = useState();

  useEffect(() => {
    const useCookies = parseCookies();
    setUser(useCookies.username);
  });

  return (
    <div className={css.container}>
      <Search urlAPI={props.API} category={props.categorie} />
    </div>
  );
}

// Si PAS d'user connecter = redirige vers login
// export function getServerSideProps({ req }) {
//   if (!req.cookies.username) {
//     return {
//       redirect: {
//         destination: "/login",
//         permanent: false,
//       },
//     };
//   }
//   return { props: {} };
// }

export async function getServerSideProps() {
  const API = process.env.API_PROPERTIES;

  const cat = await fetch("http://localhost:1337/api/categories");
  const categorie = await cat.json();

  return {
    props: {
      API,
      categorie,
    },
  };
}
