
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import FeatureSection from "@/components/FeatureSection";
import HowItWorks from "@/components/HowItWorks";

const Index = () => {
  // Feature section data
  const features = [
    {
      title: "Early Detection",
      description: "Identify potential heart disease risk factors before symptoms appear through non-invasive retinal scans.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      ),
    },
    {
      title: "AI & ML Powered Analysis",
      description: "Our advanced neural networks have been trained on thousands of retinal images to detect subtle patterns linked to heart disease.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2"></rect>
          <path d="M7 7h.01"></path>
          <path d="M17 7h.01"></path>
          <path d="M7 17h.01"></path>
          <path d="M17 17h.01"></path>
        </svg>
      ),
    },
    {
      title: "Detailed Risk Reports",
      description: "Receive comprehensive risk assessments with severity levels and confidence scores to better understand your health status.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <path d="M14 2v6h6"></path>
          <path d="M16 13H8"></path>
          <path d="M16 17H8"></path>
          <path d="M10 9H8"></path>
        </svg>
      ),
    },
    {
      title: "Medical Guidance",
      description: "Get actionable recommendations based on your risk assessment to help you take control of your heart health.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
        </svg>
      ),
    },
    {
      title: "Privacy & Security",
      description: "Your health data is protected with state-of-the-art encryption and complies with healthcare privacy regulations.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      ),
    },
    {
      title: "Track Progress",
      description: "Monitor your heart health over time with sequential assessments and progress tracking.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18"></path>
          <path d="m19 9-5 5-4-4-3 3"></path>
        </svg>
      ),
    },
  ];

  return (
    <>
      <HeroSection />
      
      <HowItWorks />
      
      <FeatureSection 
        title="Key Features" 
        description="Our platform combines cutting-edge AI & ML technology with medical expertise to provide comprehensive heart health risk assessments."
        features={features}
      />
      
      {/* Testimonials or Statistics Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-brand-blue to-primary rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 md:p-12 bg-white/10 backdrop-blur-sm text-white">
                <h2 className="text-3xl font-bold mb-6">Proven Results</h2>
                <div className="space-y-6">
                  <div>
                    <p className="text-4xl font-bold">85%</p>
                    <p className="text-sm mt-1 opacity-80">Accuracy Rate</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold">6,000+</p>
                    <p className="text-sm mt-1 opacity-80">Images Analyzed</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold">Early</p>
                    <p className="text-sm mt-1 opacity-80">Risk Detection</p>
                  </div>
                </div>
              </div>
              <div className="p-8 md:p-12 bg-white">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Take Control of Your Heart Health</h3>
                <p className="text-gray-600 mb-6">
                  Our technology enables the early detection of heart disease risk factors, allowing for timely intervention and prevention strategies.
                </p>
                <Button asChild size="lg" className="w-full">
                  <Link to="/upload">Upload Your Retinal Image</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQs or Additional Info */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Upload your retinal image now to receive a comprehensive heart attack risk assessment.
            </p>
          </div>
          <div className="flex justify-center">
            <Button asChild size="lg" className="mr-4">
              <Link to="/upload">Upload Image</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
