import { useState } from "react";
import CardProperty from "../cardProperty";
import css from "./index.module.scss";

export default function Search() {
  const [loading, setLoading] = useState(true);

  const [city, setCity] = useState();
  const [property, setProperty] = useState();

  const handleSearch = async (event) => {
    event.preventDefault();

    try {
      setProperty("");
      const rep = await fetch(
        `http://localhost:1337/api/locations?[filters][title][$eq]=${city}&[populate][properties][sort][0]=id%3Adesc&populate=*`
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
          placeholder="Taper une ville"
          type="text"
          onChange={(e) => {
            setCity(e.currentTarget.value.toLowerCase());
          }}
          name="location"
          value={city}
        />
        <button type="submit">Rechercher</button>
      </form>
      {!loading && property ? (
        <div className={css.listProperty}>
          <p>{property.attributes.properties.data.length} annonce(s)</p>
          {property.attributes.properties.data.map((item, i) => {
            return <CardProperty key={i} data={item.attributes.title} />;
          })}
        </div>
      ) : null}
    </div>
  );
}
