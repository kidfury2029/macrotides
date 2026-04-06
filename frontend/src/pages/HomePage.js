import Header from '../components/Header';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import AboutSection from '../components/AboutSection';
import FAQSection from '../components/FAQSection';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background" data-testid="home-page">
      <Header />
      <main>
        <Hero />
        <ProductGrid />
        <AboutSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
