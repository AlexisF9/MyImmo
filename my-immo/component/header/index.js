import css from "./index.module.scss";
import Link from "next/link";
import { useSession } from "../../contexte/session";

export default function Header() {
  const session = useSession();

  return (
    <header className={css.container}>
      <div className={css.content}>
        <h1>My Immo</h1>
        <div className={css.links}>
          <Link href={"/"}>
            <a>Accueil</a>
          </Link>
          {session === true ? (
            <p>Logout</p>
          ) : (
            <Link href={"/auth"}>
              <a>Connexion</a>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
