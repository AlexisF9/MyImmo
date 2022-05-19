import Login from "../component/login";
import css from "../styles/auth.module.scss";

export default function Auth() {
  return <Login />;
}

export function getServerSideProps({ req }) {
  if (req.cookies.authToken) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return { props: {} };
}
