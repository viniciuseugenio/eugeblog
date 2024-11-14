import { json, redirect } from "react-router-dom";

export async function action() {
  const response = await fetch("http://localhost:8000/accounts/api/logout/", {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw json(
      { message: "Something went wrong while logging out." },
      { status: response.status },
    );
  }

  return redirect("/");
}
