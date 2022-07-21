import css from "../styles/auth.module.scss";
import FormLogin from "../component/forms/formLogin";

export default function Login({ urlLogin }) {
  return (
    <div className={css.login}>
      <div className={css.formLogin}>
        <h2>Se connecter</h2>
        <FormLogin urlLogin={urlLogin} />
      </div>
      <div className={css.overlay}></div>
    </div>
  );
}

export function getServerSideProps({ req }) {
  const urlLogin = process.env.API_LOGIN;
  if (req.cookies.username) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return { props: { urlLogin } };
}
