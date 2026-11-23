import Link from "next/link";
import { SignIn, UserButton } from "@clerk/nextjs";
import { authConfigured } from "@/lib/admin-policy";
export default function SignInPage() {
  return (
    <main id="contenido" className="container information-page">
      <h1>Acceso de administración</h1>
      {authConfigured() ? (
        <>
          <UserButton />
          <SignIn
            routing="path"
            path="/admin/ingresar"
            forceRedirectUrl="/admin"
          />
        </>
      ) : (
        <p>
          Completá las claves de desarrollo de Clerk en .env.local y reiniciá el
          servidor. Las credenciales no se ingresan en esta página.
        </p>
      )}
      <p>
        <Link href="/admin">Volver al panel</Link>
      </p>
    </main>
  );
}
