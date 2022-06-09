//import Login from "../component/login";
//import css from "../styles/auth.module.scss";

export default function Register() {
  return <p>Register</p>;
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
