
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import RiskGauge, { RiskLevel } from "@/components/RiskGauge";
import { toast } from "@/hooks/use-toast";
import { jsPDF } from "jspdf"; 
import { Download, Eye } from "lucide-react"; // Import icons

interface AnalysisResult {
  riskLevel: RiskLevel;
  confidence: number;
  image: string;
  grayscaleImage?: string;
  heatmapImage?: string;
  gradCAMImage?: string;
}

const ResultsPage = () => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeImage, setActiveImage] = useState<'original' | 'grayscale' | 'heatmap' | 'gradcam'>('original');
  const [isDownloading, setIsDownloading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedResult = sessionStorage.getItem('analysisResult');
    
    if (storedResult) {
      try {
        setResult(JSON.parse(storedResult));
      } catch (error) {
        console.error('Error parsing stored result:', error);
        toast({
          title: "Error loading results",
          description: "Could not load analysis results. Please try again.",
          variant: "destructive",
        });
        navigate('/upload');
      }
    } else {
      // No results found, redirect to upload
      toast({
        title: "No analysis results",
        description: "Please upload an image to get results.",
      });
      navigate('/upload');
    }
  }, [navigate]);

  const handleDownloadReport = async () => {
    if (!result) return;

    try {
      setIsDownloading(true);
      
      // Create a new PDF document
      const doc = new jsPDF();

      // Add a title
      doc.setFontSize(18);
      doc.text("Heart Risk Assessment Report", 20, 20);

      // Add patient information (risk level, confidence, date)
      doc.setFontSize(12);
      doc.text(`Risk Level: ${result.riskLevel}`, 20, 40);
      doc.text(`Confidence: ${result.confidence}%`, 20, 50);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 60);

      // Add recommendations
      const recommendations = getRecommendations(result.riskLevel);
      doc.text("Recommendations:", 20, 80);
      recommendations.forEach((rec, index) => {
        doc.text(`- ${rec}`, 20, 90 + index * 10);
      });

      // Preload all the images before adding to PDF
      const originalImg = new Image();
      originalImg.src = result.image;
      
      await new Promise((resolve) => {
        originalImg.onload = resolve;
      });
      
      // Add retinal image to PDF
      doc.addImage(originalImg, "JPEG", 20, 120, 80, 60);
      doc.text("Original Retinal Image", 20, 190);
      
      // Add grayscale image if available
      if (result.grayscaleImage) {
        const grayscaleImg = new Image();
        grayscaleImg.src = result.grayscaleImage;
        
        await new Promise((resolve) => {
          grayscaleImg.onload = resolve;
        });
        
        doc.addImage(grayscaleImg, "JPEG", 110, 120, 80, 60);
        doc.text("Grayscale Analysis", 110, 190);
      }
      
      // Add new page for heatmap and Grad-CAM
      doc.addPage();
      doc.setFontSize(16);
      doc.text("Advanced Image Analysis", 20, 20);
      
      // Add heatmap if available
      if (result.heatmapImage) {
        const heatmapImg = new Image();
        heatmapImg.src = result.heatmapImage;
        
        await new Promise((resolve) => {
          heatmapImg.onload = resolve;
        });
        
        doc.addImage(heatmapImg, "JPEG", 20, 30, 80, 60);
        doc.text("Vessel Heatmap", 20, 100);
        
        // Add explanation for heatmap
        doc.setFontSize(10);
        doc.text("Highlights vessel patterns with color coding.", 20, 110);
        doc.text("Red areas indicate higher risk patterns.", 20, 116);
        doc.setFontSize(16);
      }
      
      // Add Grad-CAM if available
      if (result.gradCAMImage) {
        const gradCAMImg = new Image();
        gradCAMImg.src = result.gradCAMImage;
        
        await new Promise((resolve) => {
          gradCAMImg.onload = resolve;
        });
        
        doc.addImage(gradCAMImg, "JPEG", 110, 30, 80, 60);
        doc.text("Grad-CAM Analysis", 110, 100);
        
        // Add explanation for Grad-CAM
        doc.setFontSize(10);
        doc.text("AI-generated attention map showing regions", 110, 110);
        doc.text("most influential to the risk assessment.", 110, 116);
      }

      // Save the PDF
      doc.save("Heart_Risk_Assessment_Report.pdf");

      toast({
        title: "Report downloaded",
        description: "Your heart risk assessment report has been downloaded.",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Download failed",
        description: "Could not generate the PDF report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const getRecommendations = (riskLevel: RiskLevel) => {
    const recommendations = {
      none: [
        "Continue routine annual health check-ups",
        "Maintain a heart-healthy diet rich in fruits, vegetables, and whole grains",
        "Engage in at least 150 minutes of moderate aerobic activity per week",
        "Avoid tobacco use and limit alcohol consumption",
        "Monitor weight and ensure a healthy BMI",
        "Maintain good sleep hygiene (7–9 hours per night)"
      ],
      
      mild: [
        "Schedule a follow-up with your primary care physician for personalized advice",
        "Begin regular monitoring of blood pressure and blood sugar levels",
        "Consider cholesterol and lipid profile testing every 6–12 months",
        "Enhance your diet with heart-protective foods (e.g., omega-3 rich fish, nuts)",
        "Incorporate stress-reducing activities such as meditation, yoga, or journaling",
        "Avoid sedentary behavior; take breaks during prolonged sitting"
      ],
      
      moderate: [
        "Consult a cardiologist within the next 3 months for a comprehensive cardiovascular evaluation",
        "Undergo a complete lipid panel, ECG, and stress test if advised",
        "Initiate or intensify lifestyle changes: diet, exercise, and smoking cessation",
        "Monitor key metrics: blood pressure, fasting glucose, BMI, and cholesterol",
        "Evaluate family history of heart disease with your doctor to assess hereditary risks",
        "Explore preventive medications if recommended by your provider"
      ],
      
      proliferate: [
        "Schedule a cardiologist appointment within 1 month for in-depth diagnostics",
        "Undergo advanced tests (e.g., echocardiogram, coronary calcium scan, treadmill test)",
        "Begin regular tracking of medication efficacy and side effects (if already prescribed)",
        "Discuss medication adjustments or new prescriptions to manage risk factors",
        "Implement structured lifestyle interventions under medical supervision (dietitian, fitness coach, etc.)",
        "Limit high-risk behaviors: smoking, excessive alcohol, unmanaged stress"
      ],
      
      severe: [
        "Seek immediate evaluation by a cardiologist or emergency department if symptomatic",
        "Undergo urgent diagnostic testing (ECG, blood markers, cardiac imaging)",
        "Prepare for possible hospitalization or procedural intervention based on evaluation",
        "Begin close, supervised monitoring of vital parameters and medication response",
        "Coordinate with a multidisciplinary team (cardiologist, dietitian, physiotherapist)",
        "Follow strict lifestyle protocols with limited physical exertion until cleared by a doctor"
      ]
      
    };
    
    return recommendations[riskLevel] || recommendations.moderate;
  };

  if (!result) {
    return (
      <div className="container mx-auto px-4 py-24 flex justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-2/3 bg-gray-200 rounded mb-6"></div>
          <div className="h-64 w-full max-w-md bg-gray-200 rounded mb-6"></div>
          <div className="h-8 w-1/2 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const recommendations = getRecommendations(result.riskLevel);

  // Function to get the currently active image URL
  const getActiveImageUrl = () => {
    switch (activeImage) {
      case 'grayscale':
        return result?.grayscaleImage || result?.image;
      case 'heatmap':
        return result?.heatmapImage || result?.image;
      case 'gradcam':
        return result?.gradCAMImage || result?.image;
      case 'original':
      default:
        return result?.image;
    }
  };

  // Function to get title for the active image
  const getActiveImageTitle = () => {
    switch (activeImage) {
      case 'grayscale':
        return "Grayscale Analysis";
      case 'heatmap':
        return "Vessel Heatmap";
      case 'gradcam':
        return "Grad-CAM Heatmap";
      case 'original':
      default:
        return "Original Retinal Image";
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Your Risk Assessment Results</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Based on your retinal scan, our AI & ML has analyzed potential indicators for heart attack risk.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Preview */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">{getActiveImageTitle()}</h2>
                  
                  {/* Image type selector */}
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant={activeImage === 'original' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setActiveImage('original')}
                    >
                      Original
                    </Button>
                    <Button 
                      variant={activeImage === 'grayscale' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setActiveImage('grayscale')}
                      disabled={!result?.grayscaleImage}
                    >
                      Grayscale
                    </Button>
                    <Button 
                      variant={activeImage === 'heatmap' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setActiveImage('heatmap')}
                      disabled={!result?.heatmapImage}
                    >
                      Heatmap
                    </Button>
                    <Button 
                      variant={activeImage === 'gradcam' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setActiveImage('gradcam')}
                      disabled={!result?.gradCAMImage}
                    >
                      Grad-CAM
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <img 
                    src={getActiveImageUrl()} 
                    alt={`${getActiveImageTitle()} retinal scan`}
                    className="w-full h-auto object-cover"
                  />
                </div>
                <p className="text-sm text-muted-foreground flex items-center justify-between">
                  <span>Analysis date: {new Date().toLocaleDateString()}</span>
                  <Button variant="ghost" size="sm" onClick={() => setActiveImage('original')}>
                    <Eye className="h-4 w-4 mr-1" /> View Original
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Risk Assessment */}
          <div>
            <RiskGauge 
              riskLevel={result.riskLevel} 
              confidence={result.confidence} 
              date={new Date().toLocaleDateString()} 
            />
          </div>
        </div>

        {/* Recommendations Section */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
            <ul className="space-y-2">
              {recommendations.map((rec, index) => (
                <li key={index} className="flex items-start">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="18" 
                    height="18" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="mr-2 text-primary flex-shrink-0 mt-0.5"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
            
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground mb-4">
                <strong>Disclaimer:</strong> This assessment is based on AI & ML analysis of retinal images and should not be 
                considered a medical diagnosis. Always consult with a healthcare professional for proper 
                medical advice and diagnosis.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Button 
            onClick={handleDownloadReport} 
            disabled={isDownloading}
            className="flex items-center"
          >
            {isDownloading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="mr-2 h-5 w-5" />
                Download Report
              </>
            )}
          </Button>
          <Button variant="outline" asChild>
            <Link to="/upload">Upload New Image</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
