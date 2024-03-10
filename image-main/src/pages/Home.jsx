import Nav from "../components/Navb";
import Dandd from "../components/Dandd";
import Hero from "../components/hero";
import { useEffect, useState } from "react";

function Home() {
  const user = localStorage.getItem("token");
  return (
    <div className="flex flex-col gap-10 ">
      {user == null ? <Hero /> : <Dandd />}
    </div>
  );
}

export default Home;
