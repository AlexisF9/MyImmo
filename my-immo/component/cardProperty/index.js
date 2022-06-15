import { useEffect, useState } from "react";
import Slider from "../slider";
import css from "./index.module.scss";
import Link from "next/link";

export default function CardProperty({ data }) {
  const [propertyInfos, setPropertyInfos] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    infoProperties();
  }, []);

  const infoProperties = async () => {
    try {
      const rep = await fetch(
        `http://localhost:1337/api/properties?[filters][title][$eq]=${data}&populate=*`
      );
      const response = await rep.json();
      setPropertyInfos(response);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      {loading
        ? null
        : propertyInfos.data.map((item, i) => {
            const maDate = new Date(item.attributes.publishedAt);
            const date = maDate.toLocaleString("fr");
            return (
              <div className={css.card} key={i}>
                <Slider pictures={item.attributes.pictures.data} />

                <div className={css.cardInfo}>
                  <h3>{item.attributes.title}</h3>
                  <p>{item.attributes.price} €</p>
                  <p>
                    {item.attributes.surface}m² - {item.attributes.pieces}{" "}
                    pièces
                  </p>
                  {item.attributes.free ? (
                    <p>Libre tout de suite</p>
                  ) : (
                    <p>Pas encore libre</p>
                  )}
                  <p>
                    {item.attributes.location.data.attributes.title.toUpperCase()}{" "}
                    - {item.attributes.location.data.attributes.code}
                  </p>
                  <ul>
                    {item.attributes.tags.data.map((item, i) => {
                      return <li key={i}>{item.attributes.title}</li>;
                    })}
                  </ul>
                  <p>Publié le {date}</p>
                  <Link href={`/annonce/${item.id}`}>
                    <a>En savoir plus</a>
                  </Link>
                </div>
              </div>
            );
          })}
    </>
  );
}
