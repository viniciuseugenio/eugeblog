export default function BaseError({ title, children }) {
  return (
    <>
      <main className="m-auto text-center">
        <span className="flex items-center justify-center text-[4rem] text-red-500">
          <ion-icon name="alert-circle-outline"></ion-icon>
        </span>
        <h1 className="mb-3 text-4xl font-bold">{title}</h1>
        {children}
      </main>
    </>
  );
}
