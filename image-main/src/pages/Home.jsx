
import Dandd from "../components/Dandd";
import Hero from "../components/hero";


function Home() {
  const user = localStorage.getItem("token");
  return (
    <div className="flex flex-col gap-10 ">
      {user == null ? <Hero /> : <Dandd />}
    </div>
  );
}

export default Home;
