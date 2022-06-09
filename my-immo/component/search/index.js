import { useState } from "react";
import css from "./index.module.scss";

export default function Search() {
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
    <div className={css.containerSearch}>
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
      {!loading && property ? (
        <div>
          {property.attributes.properties.data.map((item, i) => {
            return <p>{item.attributes.title}</p>;
          })}
        </div>
      ) : (
        <p>Taper la ville de votre recherche</p>
      )}
    </div>
  );
}
