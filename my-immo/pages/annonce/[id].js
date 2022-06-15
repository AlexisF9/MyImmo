export default function Annonce({ property }) {
  return <p>{property.data.attributes.title}</p>;
}

export async function getServerSideProps({ params, req }) {
  if (!req.cookies.username) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  } else {
    const rep = await fetch(
      `http://localhost:1337/api/properties/${params.id}`
    );
    const property = await rep.json();
    return {
      props: {
        property,
      },
    };
  }
}
