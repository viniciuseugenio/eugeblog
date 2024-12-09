export default function PaginationIcon({ isPrevious }) {
  return (
    <span className="flex h-full items-center justify-center rounded border border-[#E4E0E1] px-3 py-1 duration-300 hover:bg-[#D6C0B3]">
      {isPrevious ? (
        <ion-icon name="chevron-back-outline"></ion-icon>
      ) : (
        <ion-icon name="chevron-forward-outline"></ion-icon>
      )}
    </span>
  );
}
