import { useState } from "react";
import CardOverview from "../component/cardOverview/index.js";
import css from "../styles/profil.module.scss";

export default function Profil({ user, likes }) {
  return (
    <div className={css.profil}>
      <div className={css.content}>
        <h2>Bienvenue sur votre profil {user.username}</h2>
      </div>

      <div className={css.listeLikes}>
        {likes.data.map((item, index) => {
          return <CardOverview key={index} data={item} />;
        })}
      </div>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  if (!req.cookies.username) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  } else {
    const profil = await fetch(
      `http://localhost:1337/api/users/${req.cookies.idUser}?populate=*`
    );
    const user = await profil.json();

    const listeLikes = await fetch(
      `http://localhost:1337/api/likes?filters[users_permissions_user][username][$eq]=${req.cookies.username}&sort[0]=createdAt%3Adesc&populate=*`
    );
    const likes = await listeLikes.json();

    return { props: { user, likes } };
  }
}
