
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Define risk levels
export type RiskLevel = "none" | "mild" | "moderate" | "proliferate" | "severe";

interface RiskGaugeProps {
  riskLevel: RiskLevel;
  confidence: number;
  date?: string;
}

const RiskGaugeInfo: Record<RiskLevel, { title: string; color: string; description: string }> = {
  none: {
    title: "No Risk",
    color: "risk-none",
    description: "No detectable risk factors in retinal scan."
  },
  mild: {
    title: "Mild Risk",
    color: "risk-mild",
    description: "Early signs of risk factors detected, monitoring recommended."
  },
  moderate: {
    title: "Moderate Risk",
    color: "risk-moderate",
    description: "Significant risk factors detected, consultation recommended."
  },
  proliferate: {
    title: "Proliferative Risk",
    color: "risk-proliferate",
    description: "Advanced risk factors detected, medical attention required."
  },
  severe: {
    title: "Severe Risk",
    color: "risk-severe",
    description: "Critical risk level detected, immediate medical attention required."
  }
};

const RiskGauge: React.FC<RiskGaugeProps> = ({ riskLevel, confidence, date }) => {
  const { title, color, description } = RiskGaugeInfo[riskLevel];

  // Get risk level index for gauge position
  const riskLevels: RiskLevel[] = ["none", "mild", "moderate", "proliferate", "severe"];
  const riskIndex = riskLevels.indexOf(riskLevel);
  const gaugePercentage = (riskIndex / (riskLevels.length - 1)) * 100;

  return (
    <Card className={`risk-card risk-card-${riskLevel} overflow-visible`}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{title}</span>
          {date && <span className="text-sm font-normal text-muted-foreground">{date}</span>}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Risk Level Gauge with enhanced gradient */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Low Risk</span>
              <span>High Risk</span>
            </div>
            <div className="h-3 w-full rounded-full overflow-hidden bg-muted relative">
              {/* Full gradient background - no change needed as it's already using the gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-risk-none via-risk-mild via-risk-moderate via-risk-proliferate to-risk-severe" />

              {/* Overlay mask for unfilled part */}
              <div
                className="absolute inset-0 bg-muted transition-all duration-500"
                style={{
                  width: `${100 - gaugePercentage}%`,
                  left: `${gaugePercentage}%`
                }}
              />

              {/* Indicator marker */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-white border border-gray-300"
                style={{
                  left: `${gaugePercentage}%`,
                  transform: 'translateX(-50%)'
                }}
              />
            </div>
          </div>

          {/* Confidence Level - enhanced to match the risk level color */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Confidence Level</span>
              <span className="text-sm font-bold">{confidence}%</span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full bg-primary`}
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center">
            <span className={`inline-block w-3 h-3 rounded-full bg-${color} mr-2`}></span>
            <span className="text-sm font-medium">Risk Level {riskIndex + 1}/5</span>
          </div>
          <div className="text-sm text-muted-foreground">
            AI & ML Analysis
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RiskGauge;
