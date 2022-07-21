import { useEffect, useState } from "react";
import Slider from "../slider";
import Link from "next/link";
import css from "./index.module.scss";

export default function CardOverview({ data }) {
  const [property, setProperty] = useState();

  useEffect(() => {
    fetchData();
  }, []);

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
          <div className={css.content}>
            <h3>{property.data.attributes.title}</h3>
            <Slider pictures={property.data.attributes.pictures.data} />
          </div>

          <Link href={`/annonce/${property.data.id}`}>
            <a className={css.moreBtn}>Voir l'annonce</a>
          </Link>
        </div>
      )}
    </>
  );
}
