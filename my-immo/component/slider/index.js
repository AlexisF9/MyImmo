import { useState } from "react";
import css from "./index.module.scss";

export default function Slider({ pictures }) {
  const [indexPicture, setIndexPicture] = useState(0);

  const indexPictures = (e, max) => {
    const newIndex = indexPicture + e;
    if (newIndex < 0 || newIndex > max) {
      return;
    } else {
      setIndexPicture(newIndex);
    }
  };

  return (
    <div className={css.cardImage}>
      <div className={css.arrows}>
        <img
          onClick={() => indexPictures(-1, pictures.length - 1)}
          src="./left-arrow.png"
        />
        <img
          onClick={() => indexPictures(+1, pictures.length - 1)}
          src="./right-arrow.png"
        />
      </div>
      <div>
        {pictures.map((item, i) => {
          return (
            <img
              key={i}
              style={{
                transform: `translateX(-${indexPicture * 100}%)`,
              }}
              src={"http://localhost:1337" + item.attributes.url}
            />
          );
        })}
      </div>
    </div>
  );
}
