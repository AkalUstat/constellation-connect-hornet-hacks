// @ts-nocheck
// temporary disable typechecking for this file 
import logoDark from "./logo-dark.svg";
import logoLight from "./logo-light.svg";
import LineChart from "./d3.client"; // note the .client import


export function Welcome() {
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <header className="flex flex-col items-center gap-9">
          <div className="w-[500px] max-w-[100vw] p-4">
            <img src={logoLight} alt="React Router" className="block w-full dark:hidden" />
            <img src={logoDark} alt="React Router" className="hidden w-full dark:block" />
          </div>
        </header>

        <div className="w-[500px] max-w-[100vw] px-4">
          <LineChart />
        </div>
      </div>
    </main>
  );
}
