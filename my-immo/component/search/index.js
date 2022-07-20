import { createRef, useContext, useState } from "react";
import { useSearch } from "../../contexte/search";
import CardProperty from "../cardProperty";
import css from "./index.module.scss";

export default function Search({ urlAPI, category }) {
  const [loading, setLoading] = useState(true);

  const { search, setSearch } = useSearch(); // import du context

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
        `${urlAPI}?filters[type][title][$eq]=${search.type}&filters[location][title][$eq]=${search.city}&filters[category][title][$eq]=${search.categories}&filters[pieces][$gte]=${search.pieces}&filters[surface][$gte]=${search.surface}&populate=*`
      );
      // const rep = await fetch("http://localhost:1337/" + "graphql", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     query: `query {
      //     properties {
      //       data {
      //         id
      //         attributes {
      //           title
      //           price
      //           free
      //           description
      //           publishedAt
      //           honoraires
      //           garantie
      //           pieces
      //           surface
      //           pictures {
      //             data {
      //               attributes {
      //                 url
      //               }
      //             }
      //           }
      //           users_permissions_user {
      //             data {
      //               id
      //               attributes {
      //                 username
      //               }
      //             }
      //           }
      //           tags {
      //             data {
      //               attributes {
      //                 title
      //               }
      //             }
      //           }
      //           type {
      //             data {
      //               attributes {
      //                 title
      //               }
      //             }
      //           }
      //           location {
      //             data {
      //               attributes {
      //                 title
      //               }
      //             }
      //           }
      //           category {
      //             data {
      //               attributes {
      //                 title
      //               }
      //             }
      //           }
      //           users {
      //             data {
      //               id
      //               attributes {
      //                 username
      //               }
      //             }
      //           }
      //         }
      //       }
      //     }
      //   }`,
      //   }),
      // });
      const response = await rep.json();
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
              let newSearch = { ...search }; // on garde les autres states
              newSearch.city = e.currentTarget.value.toLowerCase(); // ajout de la nouvelle valeur
              setSearch(newSearch); // on met à jour le state
            }}
            name="location"
            value={search.city} // dernière valeur enregistré
          />

          <select
            required
            defaultValue={search.categories}
            onChange={(e) => {
              let newSearch = { ...search };
              newSearch.categories = e.currentTarget.value;
              setSearch(newSearch);
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
            defaultValue={search.type}
            onChange={(e) => {
              let newSearch = { ...search };
              newSearch.type = e.currentTarget.value;
              setSearch(newSearch);
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
                value={search.pieces}
                onChange={(e) => {
                  let newSearch = { ...search };
                  newSearch.pieces = e.currentTarget.value;
                  setSearch(newSearch);
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
                value={search.surface}
                onChange={(e) => {
                  let newSearch = { ...search };
                  newSearch.surface = e.currentTarget.value;
                  setSearch(newSearch);
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
