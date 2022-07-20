import { createRef, useContext, useEffect, useRef, useState } from "react";
import { useSearch } from "../../contexte/search";
import CardProperty from "../cardProperty";
import css from "./index.module.scss";

export default function Search({ urlAPI, category }) {
  const [loading, setLoading] = useState(true);
  // const { search, setSearch } = useSearch(); // import du context

  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [categories, setCategories] = useState("");
  const [pieces, setPieces] = useState("");
  const [surface, setSurface] = useState("");

  const [oldSearch, setOldSearch] = useState();
  const [property, setProperty] = useState();

  useEffect(() => {
    setOldSearch(JSON.parse(localStorage.getItem("search")));
  }, []);

  useEffect(() => {
    if (oldSearch) {
      setCity(oldSearch.city);
      setType(oldSearch.type);
      setCategories(oldSearch.categories);
      setPieces(oldSearch.pieces);
      setSurface(oldSearch.surface);
    }
  }, [oldSearch]);

  console.log(oldSearch);

  const handleSearch = async (event) => {
    event.preventDefault();

    try {
      setProperty("");

      const rep = await fetch(
        `${urlAPI}?filters[type][title][$eq]=${type}&filters[location][title][$eq]=${city}&filters[category][title][$eq]=${categories}&filters[pieces][$gte]=${pieces}&filters[surface][$gte]=${surface}&populate=*`
      );
      const response = await rep.json();

      let newItems = {
        city: city,
        type: type,
        categories: categories,
        pieces: pieces,
        surface: surface,
      };

      localStorage.setItem("search", JSON.stringify(newItems));

      setLoading(false);
      setProperty(response);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className={css.containerSearch}>
      <div className={css.formSearch}>
        <div className={css.overlay}></div>
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
            value={categories}
            onChange={(e) => {
              setCategories(e.currentTarget.value);
            }}
          >
            <option value="" hidden>
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
            value={type}
            onChange={(e) => {
              setType(e.currentTarget.value);
            }}
          >
            <option value="" hidden>
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
                value={pieces}
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
                value={surface}
                onChange={(e) => {
                  // let newSearch = { ...search };
                  // newSearch.surface = e.currentTarget.value;
                  // setSearch(newSearch);
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

            {property.data.map((item) => {
              return <CardProperty key={item.id} dataInfo={item} />;
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
