import { Link } from "react-router";

export default function BaseError({ title, children, status }) {
  return (
    <>
      <main className="m-auto flex flex-grow flex-col items-center justify-center">
        <span className="text-primary text-base font-semibold">{status}</span>
        <h1 className="mt-4 text-7xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-6 max-w-4xl text-center text-lg font-medium text-stone-500">
          {children}
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6 text-sm font-semibold">
          <Link
            to="/"
            className="bg-primary text-light rounded-md px-4 py-2.5 duration-300 hover:bg-[#5b4a3e]"
          >
            Go back home
          </Link>
          {status === 404 && (
            <Link className="flex gap-x-1">
              Contact support
              <span aria-hidden="true">&rarr;</span>
            </Link>
          )}
        </div>
      </main>
    </>
  );
}
