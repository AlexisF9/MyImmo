import css from "../styles/Home.module.scss";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useSession } from "../contexte/session";

export default function Home({ user }) {
  const session = useSession();
  const [loading, setLoading] = useState(true);

  const [city, setCity] = useState();
  const [property, setProperty] = useState();

  const handleSearch = async (event) => {
    event.preventDefault();

    try {
      const rep = await fetch(
        `http://localhost:1337/api/locations?[filters][title][$eq]=${city}&[populate][properties][sort][0]=id%3Adesc`
      );
      const response = await rep.json();
      setProperty(response.data[0]);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className={css.container}>
      {session ? (
        <p>coucou</p>
      ) : (
        <form onSubmit={handleSearch} action={handleSearch}>
          <input
            type="text"
            onChange={(e) => {
              setCity(e.currentTarget.value);
            }}
            name="location"
            value={city}
          />
          <button type="submit">Rechercher</button>
        </form>
      )}

      {!loading && <p>{property.attributes.code}</p>}
    </div>
  );
}
