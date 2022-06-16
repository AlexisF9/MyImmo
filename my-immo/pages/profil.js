export default function Profil({ user }) {
  console.log(user);
  return <p>Bienvenue {user.username}</p>;
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
    return { props: { user } };
  }
}
