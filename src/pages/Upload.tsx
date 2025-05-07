
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUploader from "@/components/ImageUploader";
import { useToast } from "@/components/ui/use-toast";
import { createHeatmap, convertToGrayscale, createGradCAM } from "@/utils/imageProcessing";
import { RiskLevel } from "@/components/RiskGauge";

const Upload = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleImageUpload = (file: File) => {
    setUploadedFile(file);
  };

  const determineRiskFromFilepath = (file: File): RiskLevel | null => {
    // Get the full path if available (some browsers only provide the filename)
    const filepath = file.webkitRelativePath || file.name || '';
    const uppercaseFilepath = filepath.toUpperCase();
    
    if (uppercaseFilepath.includes('NO')) return 'none';
    if (uppercaseFilepath.includes('MILD')) return 'mild';
    if (uppercaseFilepath.includes('MODERATE')) return 'moderate';
    if (uppercaseFilepath.includes('PROLIFERATE')) return 'proliferate';
    if (uppercaseFilepath.includes('SEVERE')) return 'severe';
    
    return null; // No keyword match, use random risk level
  };

  const handleAnalyze = async () => {
    if (!uploadedFile) {
      toast({
        title: "No image uploaded",
        description: "Please upload a retinal image to analyze.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      // In a real app, you would send the image to your backend here
      // For now, we'll simulate a delay and redirect to results
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create object URL for the original image
      const originalImageUrl = URL.createObjectURL(uploadedFile);
      
      // Generate processed images
      const grayscaleImageUrl = await convertToGrayscale(originalImageUrl);
      const heatmapImageUrl = await createHeatmap(originalImageUrl);
      const gradCAMImageUrl = await createGradCAM(originalImageUrl);
      
      // Check filepath for risk level override
      const filepathRiskLevel = determineRiskFromFilepath(uploadedFile);
      
      // For demo purposes, we're sending results via state
      // In a real app, you'd get this from your API
      const demoResult = {
        // If filepath contains keywords, use that risk level, otherwise random
        riskLevel: filepathRiskLevel || ['none', 'mild', 'moderate', 'proliferate', 'severe'][Math.floor(Math.random() * 5)] as RiskLevel,
        confidence: Math.floor(Math.random() * 30) + 70, // Random between 70-99
        image: originalImageUrl,
        grayscaleImage: grayscaleImageUrl,
        heatmapImage: heatmapImageUrl,
        gradCAMImage: gradCAMImageUrl
      };
      
      // In a real app, you'd use context or Redux for this data
      // For simplicity in this demo, we're using sessionStorage
      sessionStorage.setItem('analysisResult', JSON.stringify(demoResult));
      
      navigate('/results');
    } catch (error) {
      console.error('Error during analysis:', error);
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Upload Retinal Image</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upload a clear, high-quality retinal fundus image for analysis. Our AI & ML program will assess heart attack risk based on patterns in the image.
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Retinal Image Upload</CardTitle>
            <CardDescription>
              For best results, upload a clear fundus image taken by an ophthalmologist or using a fundus camera.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUploader onImageUpload={handleImageUpload} />
            
            <div className="mt-8 text-center">
              <Button 
                onClick={handleAnalyze} 
                disabled={!uploadedFile || isProcessing} 
                className="w-full sm:w-auto"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing Image...
                  </>
                ) : "Analyze Risk"}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-lg mb-3">Image Requirements</h3>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            <li>Clear, in-focus retinal fundus image</li>
            <li>Standard .jpg or .png format</li>
            <li>Ideally captured by a medical professional</li>
            <li>Good visibility of retinal blood vessels</li>
            <li>Minimal glare or artifacts</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Upload;
