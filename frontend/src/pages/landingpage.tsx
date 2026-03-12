import GradientBarsPreview from '../components/mvpblocks/gradient-bars-preview';
import Footer from '../components/Footer';
import FAQ from '../components/FAQ';
import BentoGrid from '../components/BentoGrid';
import ImageCard from '../components/ImageCard';
import Navbar from '../components/Navbar';

export default function LandingPage() {
  return (
    <>
    <Navbar/>
    <GradientBarsPreview/>
      <div className="bg-gradient-to-b from-[#e60a64] via-gray-950 to-gray-950 min-h-screen w-full flex flex-col items-center justify-start">
      <BentoGrid />
      <FAQ />
      <ImageCard/>
      <Footer />
    </div>
    </>
  )
}
