import Link from "next/link";

export const Navbar = () => {
  return (
    <div className="w-full min-h-fit text-xl rounded-xl font-semibold bg-white/70 text-emerald-800 flex p-4 mb-10">
      <div className="flex gap-10 w-full justify-center">
        <Link href="/dashboard" className="w-3/12 py-1 hover:bg-black/10 rounded-xl text-center">
          Dashboard
        </Link>
        <Link href="/home" className="w-3/12 py-1 hover:bg-black/10 rounded-xl text-center">
          Receita/Despesa
        </Link>
        <Link href="/profile" className="w-3/12 py-1 hover:bg-black/10 rounded-xl text-center">Perfil</Link>
      </div>
      <Link href="/logout" className="w-3/12 py-1 bg-emerald-800 rounded-xl text-center text-white">
        Logout
      </Link>
    </div>
  );
};
