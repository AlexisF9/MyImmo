import { createRef, useState } from "react";
import CardProperty from "../cardProperty";
import css from "./index.module.scss";

export default function Search({ urlAPI, category }) {
  const [loading, setLoading] = useState(true);

  const [city, setCity] = useState();
  const [type, setType] = useState();
  const [categories, setCategories] = useState();
  const [pieces, setPieces] = useState();
  const [surface, setSurface] = useState();

  const [property, setProperty] = useState();

  const handleSearch = async (event) => {
    event.preventDefault();

    try {
      setProperty("");

      const rep = await fetch(
        `${urlAPI}?[filters][type][title][$eq]=${type}&[filters][location][title][$eq]=${city}&[filters][category][title][$eq]=${categories}&[filters][pieces][$gte]=${pieces}&[filters][surface][$gte]=${surface}&[sort][0]=id%3Adesc&populate=*`
      );
      const response = await rep.json();

      setProperty(response);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className={css.containerSearch}>
      <div className={css.formSearch}>
        <form onSubmit={handleSearch}>
          <input
            required
            placeholder="Taper une ville"
            type="text"
            onChange={(e) => {
              setCity(e.currentTarget.value.toLowerCase());
            }}
            name="location"
            value={city}
          />

          <select
            required
            defaultValue=""
            onChange={(e) => {
              setCategories(e.currentTarget.value);
            }}
          >
            <option value="" disabled hidden>
              Choisir une catégorie
            </option>
            {category.data.map((item, i) => {
              return (
                <option key={i} value={item.attributes.title}>
                  {item.attributes.title}
                </option>
              );
            })}
          </select>

          <select
            required
            defaultValue=""
            onChange={(e) => {
              setType(e.currentTarget.value);
            }}
          >
            <option value="" disabled hidden>
              Choisir un type
            </option>
            <option value="Acheter">Acheter</option>
            <option value="Louer">Louer</option>
          </select>

          <div className={css.infoNumbers}>
            <div>
              <label htmlFor="piece">Nombre de pièces minimum</label>
              <input
                required
                type="number"
                id="piece"
                name="piece"
                onChange={(e) => {
                  setPieces(e.currentTarget.value);
                }}
              />
            </div>

            <div>
              <label htmlFor="surface">Surface minimum</label>
              <input
                required
                type="number"
                id="surface"
                name="surface"
                onChange={(e) => {
                  setSurface(e.currentTarget.value);
                }}
              />
            </div>
          </div>

          <button type="submit">Rechercher</button>
        </form>
      </div>

      <div className={css.listCards}>
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
    </div>
  );
}
