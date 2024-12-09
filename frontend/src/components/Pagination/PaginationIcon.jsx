export default function PaginationIcon({ isPrevious }) {
  return (
    <>
      {isPrevious ? (
        <ion-icon name="chevron-back-outline"></ion-icon>
      ) : (
        <ion-icon name="chevron-forward-outline"></ion-icon>
      )}
    </>
  );
}
