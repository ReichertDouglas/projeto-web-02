import Link from "next/link";

export const Navbar = () => {
  return (
    <div className="w-full min-h-fit text-xl rounded-xl font-semibold bg-black/20 text-emerald-800 flex p-4 mb-10">
      <div className="flex gap-10 w-full justify-center">
        <Link href="/home" className="w-2/12 py-1 hover:bg-black/10 rounded-xl text-center">
          Home
        </Link>
        <Link href="/dashboard" className="w-2/12 py-1 hover:bg-black/10 rounded-xl text-center">
          Dashboard
        </Link>
        <Link href="/profile" className="w-2/12 py-1 hover:bg-black/10 rounded-xl text-center">Perfil</Link>
      </div>
      <Link href="/logout" className="w-2/12 py-1 bg-emerald-800 rounded-xl text-center text-white">
        Logout
      </Link>
    </div>
  );
};
