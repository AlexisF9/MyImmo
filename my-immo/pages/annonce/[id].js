import css from "./index.module.scss";
import Slider from "../../component/slider";

export default function Annonce({ property }) {
  return (
    <div className={css.container}>
      <div>
        <p>{property.data.attributes.title}</p>
        <Slider pictures={property.data.attributes.pictures.data} />
      </div>
    </div>
  );
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
      `http://localhost:1337/api/properties/${params.id}?populate=*`
    );
    const property = await rep.json();
    return {
      props: {
        property,
      },
    };
  }
}
