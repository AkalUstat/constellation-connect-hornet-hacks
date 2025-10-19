import type { Route } from "./+types/home";
// import { Welcome } from "../welcome/welcome";
import StarMap from "../Components/StarMap";
import ModalDemo from "../Components/ModalDemo";
import Chat from "../Components/Chat";


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function meta(_args: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <>
      <StarMap />

      <div className="absolute top-4 right-4 z-50">
          <ModalDemo />
      </div>

      <div className="fixed bottom-4 right-4 z-50 w-[350px]">
        <Chat />
      </div>
    </>
    
  );
}
