import { useRouter } from "next/router";
import FormRegister from "../component/forms/formRegister";
import css from "../styles/auth.module.scss";

export default function Register({ urlRegister }) {
  const router = useRouter();

  return (
    <div className={css.login}>
      <div className={css.formLogin}>
        <h2>S'inscrire</h2>
        <FormRegister urlRegister={urlRegister} />
      </div>
      <div className={css.overlay}></div>
    </div>
  );
}

export function getServerSideProps({ req }) {
  const urlRegister = process.env.API_REGISTER;

  if (req.cookies.authToken) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return { props: { urlRegister } };
}
