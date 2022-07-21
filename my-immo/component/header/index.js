import css from "./index.module.scss";
import Link from "next/link";
import { useSession } from "../../contexte/session";
import { useRouter } from "next/router";
import { destroyCookie } from "nookies";

export default function Header() {
  const router = useRouter();
  const session = useSession();

  const logout = () => {
    destroyCookie(null, "authToken");
    destroyCookie(null, "username");
    destroyCookie(null, "idUser");
    router.push("/");
  };

  return (
    <header className={css.container}>
      <div className={css.content}>
        <Link href={"/"}>
          <a>
            <h1>My Immo</h1>
          </a>
        </Link>

        <div className={css.links}>
          {session != undefined ? (
            <>
              <Link href={"/profil"}>
                <a>Profil</a>
              </Link>
              <a className="material-symbols-outlined" onClick={logout}>
                logout
              </a>
            </>
          ) : (
            <Link href={"/login"}>
              <a>Connexion</a>
            </Link>
          )}
          {!session && (
            <Link href={"/register"}>
              <a className={css.registerBtn}>Inscription</a>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
