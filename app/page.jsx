import Checkboxes from "@/components/Checkboxes";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Image from "next/image";

export default function Home() {

  return (
    <div className="container mx-auto text-center">
      <Header />
      <main>
        <h2 className="text-lg md:text-xl mb-4">
          Marque o seu progresso:
        </h2>
        <Checkboxes />
      </main>
      <Footer />
    </div>
  )
};