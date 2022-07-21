import { useEffect, useState } from "react";
import Slider from "../slider";

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
        <div>
          <p>{property.data.attributes.title}</p>
          <Slider pictures={property.data.attributes.pictures.data} />
        </div>
      )}
    </>
  );
}
