import { redirect } from "next/navigation";

export default function RootPage() {
    redirect("/login"); 

  return (
    <div>
      <h1>Welcome to the Study App!</h1>
    </div>
  );
}