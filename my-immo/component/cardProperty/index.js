import { useEffect, useRef, useState } from "react";
import Slider from "../slider";
import css from "./index.module.scss";
import Link from "next/link";
import { useSession } from "../../contexte/session";
import { parseCookies } from "nookies";

export default function CardProperty({ dataInfo }) {
  const session = useSession();
  const [user, setUser] = useState();

  const [like, setLike] = useState(false);

  // const maDate = new Date(item.attributes.publishedAt);
  //             const date = maDate.toLocaleString("fr");

  useEffect(() => {
    searchLikes();
  }, []);

  const searchLikes = async () => {
    let useCookies = await parseCookies();
    let user = await useCookies.username;

    const rep = await fetch(
      `http://localhost:1337/api/likes?filters[users_permissions_user][username][$eq]=${user}&filters[property][title][$eq]=${dataInfo.attributes.title}&populate=*`
    );
    const response = await rep.json();
    //console.log(dataInfo.attributes.title, response.data.length);

    if (response.data.length === 1) {
      setLike(true);
    }
  };

  function addLike() {
    console.log("cc");
  }

  return (
    <>
      <div className={css.card}>
        {session != undefined && (
          <div
            className={css.like}
            onClick={() => {
              addLike();
            }}
          >
            {like ? <img src="./like-red.svg" /> : <img src="./like.svg" />}
          </div>
        )}

        <Slider pictures={dataInfo.attributes.pictures.data} />
        <div className={css.cardInfo}>
          <h3>{dataInfo.attributes.title}</h3>
          <p>{dataInfo.attributes.price} €</p>
          <p>
            {dataInfo.attributes.surface}m² - {dataInfo.attributes.pieces}{" "}
            pièces
          </p>
          {dataInfo.attributes.free ? (
            <p>Libre tout de suite</p>
          ) : (
            <p>Pas encore libre</p>
          )}
          <p>
            {dataInfo.attributes.location.data.attributes.title.toUpperCase()} -{" "}
            {dataInfo.attributes.location.data.attributes.code}
          </p>
          <ul>
            {dataInfo.attributes.tags.data.map((item, i) => {
              return <li key={i}>{item.attributes.title}</li>;
            })}
          </ul>
          {/* <p>Publié le {date}</p> */}

          <Link href={`/annonce/${dataInfo.id}`}>
            <a className={css.moreBtn}>Voir l'annonce</a>
          </Link>
        </div>
      </div>
    </>
  );
}
