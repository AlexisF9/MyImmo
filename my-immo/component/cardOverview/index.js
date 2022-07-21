import { useEffect, useState } from "react";
import Slider from "../slider";
import Link from "next/link";
import css from "./index.module.scss";

export default function CardOverview({ data }) {
  const [property, setProperty] = useState();

  useEffect(() => {
    fetchData();
  }, []);

  console.log(property);

  const fetchData = async () => {
    const prop = await fetch(
      `http://localhost:1337/api/properties/${data.attributes.property.data.id}?populate=*`
    );
    const res = await prop.json();
    setProperty(res);
  };

  return (
    <>
      {property && (
        <div className={css.card}>
          <div className={css.cardInfo}>
            <h3>{property.data.attributes.title}</h3>
            <Link href={`/annonce/${property.data.id}`}>
              <a className={css.moreBtn}>Voir l'annonce</a>
            </Link>
          </div>
          <Slider pictures={property.data.attributes.pictures.data} />
        </div>
      )}
    </>
  );
}
