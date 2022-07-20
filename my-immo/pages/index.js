import css from "../styles/Home.module.scss";
import { useEffect, useState } from "react";
import { useSession } from "../contexte/session";
import Search from "../component/search";
import { parseCookies } from "nookies";

export default function Home(props) {
  const session = useSession();

  return (
    <div className={css.container}>
      <Search urlAPI={props.API} category={props.categorie} />
    </div>
  );
}

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
