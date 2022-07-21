import { useEffect, useState } from "react";
import Slider from "../slider";
import css from "./index.module.scss";
import Link from "next/link";
import { useSession } from "../../contexte/session";
import { parseCookies } from "nookies";

export default function CardProperty({ dataInfo }) {
  const session = useSession();

  const [userToken, setUserToken] = useState();
  const [userId, setUserId] = useState();

  const [idLike, setIdLike] = useState();
  const [like, setLike] = useState(false);

  useEffect(() => {
    let cookie = parseCookies();
    setUserToken(cookie.authToken);
    setUserId(cookie.idUser);

    searchLikes();
  }, []);

  const searchLikes = async () => {
    let useCookies = await parseCookies();
    let user = await useCookies.username;

    const rep = await fetch(
      `http://localhost:1337/api/likes?filters[users_permissions_user][username][$eq]=${user}&filters[property][title][$eq]=${dataInfo.attributes.title}&populate=*`
    );
    const response = await rep.json();
    await setIdLike(response.data[0]);

    if (response.data.length === 1) {
      setLike(true);
    }
  };

  const handleLike = async (like, id) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + userToken);

    if (like) {
      var requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow",
      };

      try {
        const rep = await fetch(
          `http://localhost:1337/api/likes/${idLike.id}`,
          requestOptions
        );
        const response = await rep.json();
        setLike(false);
      } catch (e) {
        console.log(e);
      }
    } else {
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        data: {
          property: {
            id: id,
          },
          users_permissions_user: {
            id: userId,
          },
        },
      });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      try {
        const rep = await fetch(
          `http://localhost:1337/api/likes`,
          requestOptions
        );
        const response = await rep.json();
        searchLikes();
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <>
      <div className={css.card}>
        {session != undefined && (
          <div
            className={css.like}
            onClick={() => {
              handleLike(like, dataInfo.id);
            }}
          >
            {like ? (
              <img src="./like-red.svg" />
            ) : (
              <span className="material-symbols-outlined">favorite</span>
            )}
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
