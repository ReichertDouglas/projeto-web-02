import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-emerald-300 text-emerald-800 font-serif w-full min-h-dvh p-9">
      <header className="flex w-full text-lg justify-between">
        <h1 className="font-bold">Noble Finances</h1>
        <div className="flex gap-8">
          <button className="hover:cursor-pointer">Serviços</button>
          <Link
            href="/cadastro"
            className="bg-emerald-800 px-4 py-2 rounded-full text-white hover:cursor-pointer"
          >
            Cadastrar-se
          </Link>
        </div>
      </header>
      <section className="flex w-full">
        <div className="w-1/2 my-auto p-10">
          <h1 className="text-8xl">Suas Finaças</h1>
          <h1 className="text-8xl">Em Boas Mãos</h1>
          <p className="my-8 text-lg">
            Seu sistema de gestão financeira de maneira simples e descomplicada
          </p>
          <Link
            href="/cadastro"
            className="text-white bg-emerald-800 text-lg py-2 px-4 rounded-full hover:cursor-pointer"
          >
            Registre-se e comece a organizar suas finanças
          </Link>
        </div>
        <div className="w-1/2 flex justify-end p-10">
          <Image src="/globe.png" alt="globe" width={500} height={500} />
        </div>
      </section>
    </div>
  );
}
