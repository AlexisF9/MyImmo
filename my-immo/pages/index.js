import css from "../styles/Home.module.scss";
import Search from "../component/search";
import { useState } from "react";
import CardProperty from "../component/cardProperty";

export default function Home(props) {
  const [property, setProperty] = useState();

  return (
    <div className={css.container}>
      <Search
        urlAPI={props.API}
        category={props.categorie}
        setProperty={setProperty}
      />
      {property && (
        <div className={css.listProperty}>
          {property.data.length > 1 ? (
            <p>{property.data.length} annonces</p>
          ) : (
            <p>{property.data.length} annonce</p>
          )}

          {property.data.map((item, i) => {
            return <CardProperty key={item.id} dataInfo={item} />;
          })}
        </div>
      )}
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
