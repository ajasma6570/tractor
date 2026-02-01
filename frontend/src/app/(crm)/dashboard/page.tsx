// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
export default function Page() {
  // const { data: session } = useSession();
  // const session = await getServerSession(authOptions);
  // console.log("Session in dashboard page:", session);
  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* <p>{session ? `Welcome, ${session.user?.name}` : "Not signed in"}</p> */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
      </div>
      <div className="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min" />
    </div>
  );
}
