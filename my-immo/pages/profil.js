import CardProperty from "../component/cardProperty";

export default function Profil({ user, likes }) {
  console.log(likes);
  return (
    <div>
      <p>Hello {user.username}</p>
      {likes.data.map((item, index) => {
        return (
          <p key={index}>{item.attributes.property.data.attributes.title}</p>
        );
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
