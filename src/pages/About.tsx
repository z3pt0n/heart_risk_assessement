
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">About RetinaRisk</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Learn about our technology and approach to heart attack risk assessment through retinal Imaging analysis.
          </p>
        </div>

        {/* Technology Overview */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Our Technology</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-primary">The Science Behind RetinaRisk</h3>
              <p className="text-gray-700">
                Our technology leverages the fact that retinal blood vessels provide a unique window into the cardiovascular system. 
                The patterns, thickness, and health of these vessels can indicate early signs of heart disease before clinical symptoms appear.
              </p>
              <p className="text-gray-700">
                Through machine learning algorithms trained on thousands of retinal images, our system can identify subtle patterns and 
                changes that correlate with increased heart attack risk.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
            <img 
              src="/Retina_Blood.jpg" 
              alt="Retinal blood vessels" 
              className="w-full h-full object-cover"
            />
          </div>

          </div>
        </section>

        {/* Model Information */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Our AI & ML Model</h2>
          <Card>
            <CardHeader>
              <CardTitle>Technical Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Model Architecture</dt>
                  <dd className="text-base font-semibold">ResNet50 with Custom Layers</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Training Dataset</dt>
                  <dd className="text-base font-semibold">6,000+ Annotated Retinal Images</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Validation Accuracy</dt>
                  <dd className="text-base font-semibold">85%</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Sensitivity</dt>
                  <dd className="text-base font-semibold">87%</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Specificity</dt>
                  <dd className="text-base font-semibold">83%</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Risk Classification</dt>
                  <dd className="text-base font-semibold">5 Severity Levels</dd>
                </div>
              </dl>
              
              <div className="mt-8 bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Research Basis</h4>
                <p className="text-sm text-gray-600">
                  Our model is based on peer-reviewed research establishing correlations between retinal vascular patterns 
                  and cardiovascular disease risk. Multiple studies have demonstrated that microvascular changes in the retina 
                  can precede clinical manifestations of heart disease.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Privacy Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Privacy & Security</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p className="text-gray-700">
                  At RetinaRisk, we take your privacy and data security seriously. All uploaded images and personal information are:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Encrypted using industry-standard protocols</li>
                  <li>Stored securely with limited access</li>
                  <li>Used solely for the purpose of risk assessment</li>
                  <li>Never shared with third parties without explicit consent</li>
                  <li>Protected in accordance with healthcare privacy regulations</li>
                </ul>
                <p className="text-gray-700">
                  Our platform is designed with privacy-by-design principles, ensuring your sensitive health data remains protected at all times.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Medical Disclaimer */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Medical Disclaimer</h2>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <p className="text-gray-700">
              The RetinaRisk platform is designed as a screening tool and risk assessment aid, not as a diagnostic device. 
              The results provided should be interpreted by healthcare professionals and should not replace medical consultation, 
              diagnosis, or treatment.
            </p>
            <p className="text-gray-700 mt-4">
              Always consult with a qualified healthcare provider regarding any medical concerns or conditions. The risk assessment 
              provided by our platform is meant to supplement, not replace, professional medical advice and care.
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Assess Your Risk?</h2>
          <p className="text-gray-600 mb-6">
            Upload your retinal image now to receive a comprehensive heart attack risk assessment.
          </p>
          <Button asChild size="lg">
            <Link to="/upload">Upload Retinal Image</Link>
          </Button>
        </section>
      </div>
    </div>
  );
};

export default About;
