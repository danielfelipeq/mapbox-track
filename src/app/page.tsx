import GeoComponent from "@/component/Map";
// import MapboxExample from "@/component/MapBowNew";
import "mapbox-gl/dist/mapbox-gl.css";

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-white flex flex-col">
      <main className="w-full h-[700px] flex flex-col justify-center">
        {/* <section className="w-full md:max-w-[800px] h-full">
          <MapboxExample />
        </section> */}
        <section>
          <GeoComponent/>
        </section>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <p>Footer...</p>
      </footer>
    </div>
  );
}
