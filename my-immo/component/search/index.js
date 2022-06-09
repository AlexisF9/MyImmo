import { useState } from "react";
import CardProperty from "../cardProperty";
import css from "./index.module.scss";

export default function Search() {
  const [loading, setLoading] = useState(true);

  const [city, setCity] = useState();
  const [type, setType] = useState();
  const [dispo, setDispo] = useState();

  const [property, setProperty] = useState();

  const handleSearch = async (event) => {
    event.preventDefault();

    try {
      setProperty("");

      if (dispo === "all") {
        const rep = await fetch(
          `http://localhost:1337/api/properties?[filters][type][title][$eq]=${type}&[filters][location][title][$eq]=${city}&[filters][free][$eq]=true&[filters][free][$eq]=false&[sort][0]=id%3Adesc&populate=*`
        );
        const response = await rep.json();
        setProperty(response);
      } else {
        const rep = await fetch(
          `http://localhost:1337/api/properties?[filters][type][title][$eq]=${type}&[filters][location][title][$eq]=${city}&[filters][free][$eq]=${free}&[sort][0]=id%3Adesc&populate=*`
        );
        const response = await rep.json();
        setProperty(response);
      }

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
        <select
          onChange={(e) => {
            setType(e.currentTarget.value);
          }}
        >
          <option selected disabled value="">
            Choisir un type
          </option>
          <option value="Acheter">Acheter</option>
          <option value="Louer">Louer</option>
        </select>

        <select
          onChange={(e) => {
            setDispo(e.currentTarget.value);
          }}
        >
          <option selected disabled value="">
            Choisir une disponibilité
          </option>
          <option value="true">Disponible tout de suite</option>
          <option value="false">Pas encore disponible</option>
          <option value="all">Disponible ou non</option>
        </select>

        <button type="submit">Rechercher</button>
      </form>

      {!loading && property ? (
        <div className={css.listProperty}>
          {property.data.length > 1 ? (
            <p>{property.data.length} annonces</p>
          ) : (
            <p>{property.data.length} annonce</p>
          )}

          {property.data.map((item, i) => {
            return <CardProperty key={i} data={item.attributes.title} />;
          })}
        </div>
      ) : null}
    </div>
  );
}
