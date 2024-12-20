/* import Image from "next/image"; */

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-7xl font-bold">lazydukk/home</h1>
        <p className="text-1xl text-grey-500">training for IOI</p>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/lazydukk"
          target="_blank"
          rel="noopener noreferrer"
        >
          github →
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://woogles.io/profile/lazydukk"
          target="_blank"
          rel="noopener noreferrer"
        >
          woogles →
        </a>
      </footer>
    </div>
  );
}
