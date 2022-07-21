import { useState } from "react";
import CardOverview from "../component/cardOverview/index.js";

export default function Profil({ user, likes }) {
  return (
    <div>
      <p>Hello {user.username}</p>
      {likes.data.map((item, index) => {
        return <CardOverview data={item} />;
      })}
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
      `http://localhost:1337/api/likes?filters[users_permissions_user][username][$eq]=${req.cookies.username}&populate=*`
    );
    const likes = await listeLikes.json();

    return { props: { user, likes } };
  }
}
