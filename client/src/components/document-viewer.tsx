import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Shield, 
  CreditCard, 
  Scale, 
  Download, 
  Printer,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import type { Policy } from "@shared/schema";

interface DocumentViewerProps {
  policyType: string;
}

const policyIcons = {
  "terms-of-service": FileText,
  "non-discrimination": Scale,
  "payment-terms": CreditCard,
  "privacy-policy": Shield,
};

const policyColors = {
  "terms-of-service": "blue",
  "non-discrimination": "green", 
  "payment-terms": "purple",
  "privacy-policy": "blue",
};

export default function DocumentViewer({ policyType }: DocumentViewerProps) {
  const { data: policy, isLoading, error } = useQuery<Policy>({
    queryKey: [`/api/policies/${policyType}`],
    enabled: !!policyType,
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 lg:p-8">
        <div className="animate-pulse">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-gray-200 rounded-lg mr-4"></div>
            <div>
              <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-48"></div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !policy) {
    return (
      <div className="max-w-4xl mx-auto p-6 lg:p-8">
        <Card className="p-8 text-center">
          <div className="text-red-500 mb-4">
            <FileText className="w-12 h-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Document Not Found</h2>
          <p className="text-gray-600">The requested policy document could not be loaded.</p>
        </Card>
      </div>
    );
  }

  const IconComponent = policyIcons[policy.type as keyof typeof policyIcons] || FileText;
  const colorClass = policyColors[policy.type as keyof typeof policyColors] || "blue";

  // Parse content sections for quick navigation
  const sections = policy.content.split('\n# ').filter(section => section.trim());
  const quickNavSections = sections.slice(1, 5).map(section => {
    const title = section.split('\n')[0];
    return title.replace(/#+\s*/, '');
  });

  // Format content for display
  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return <h2 key={index} className="text-3xl font-bold text-gradient mb-6 pb-3 border-b border-border mt-12 first:mt-0">{line.replace('# ', '')}</h2>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={index} className="text-2xl font-semibold text-foreground mb-4 mt-10">{line.replace('## ', '')}</h3>;
      }
      if (line.startsWith('### ')) {
        return <h4 key={index} className="text-xl font-semibold text-primary mb-3 mt-8">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('#### ')) {
        return <h5 key={index} className="text-lg font-semibold text-foreground mb-3 mt-6">{line.replace('#### ', '')}</h5>;
      }
      if (line.startsWith('- ')) {
        return (
          <li key={index} className="text-muted-foreground mb-2 ml-6 relative before:content-['→'] before:absolute before:-left-4 before:text-primary">
            {line.replace('- ', '')}
          </li>
        );
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      
      // Handle links and emphasized text
      const formattedLine = line
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary font-semibold">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="text-foreground/90 italic">$1</em>');
      
      return (
        <p key={index} className="text-muted-foreground leading-relaxed mb-4 text-base" 
           dangerouslySetInnerHTML={{ __html: formattedLine }} />
      );
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-8">
      {/* Document Header */}
      <div className="mb-10">
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
            <IconComponent className="text-primary w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gradient mb-3">{policy.title}</h1>
            <p className="text-muted-foreground text-lg">
              Effective Date: <span className="font-semibold text-primary">{policy.effectiveDate}</span>
              <span className="mx-3">•</span>
              Last Updated: <span className="font-semibold text-primary">{policy.lastUpdated}</span>
            </p>
          </div>
        </div>

        {/* Quick Navigation */}
        {quickNavSections.length > 0 && (
          <Card className="card-gradient p-6 border-primary/20">
            <h3 className="font-semibold text-primary mb-4 text-lg">Quick Navigation</h3>
            <div className="flex flex-wrap gap-3">
              {quickNavSections.map((section, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-card/50 border-primary/30 text-foreground hover:bg-primary/10 cursor-pointer px-4 py-2 text-sm transition-all duration-200 hover:scale-105"
                  onClick={() => {
                    const element = document.querySelector(`h2:nth-of-type(${index + 1})`);
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {section}
                </Badge>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Document Content */}
      <div className="prose prose-lg max-w-none">
        <Card className="card-gradient p-8 border-border/50">
          <div className="space-y-6">
            {formatContent(policy.content)}
          </div>
        </Card>
      </div>

      {/* Your Rights Section for Privacy Policy */}
      {policy.type === 'privacy-policy' && (
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-gradient mb-6 pb-3 border-b border-border">Your Rights and Choices</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center p-6 card-gradient border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105">
              <Eye className="text-primary w-10 h-10 mx-auto mb-4" />
              <h4 className="font-semibold text-primary text-lg mb-2">Access</h4>
              <p className="text-muted-foreground">View the personal information we have about you</p>
            </Card>
            
            <Card className="text-center p-6 card-gradient border-green-500/20 hover:border-green-500/40 transition-all duration-300 hover:scale-105">
              <Edit className="text-green-400 w-10 h-10 mx-auto mb-4" />
              <h4 className="font-semibold text-green-400 text-lg mb-2">Correct</h4>
              <p className="text-muted-foreground">Update or correct your personal information</p>
            </Card>
            
            <Card className="text-center p-6 card-gradient border-red-500/20 hover:border-red-500/40 transition-all duration-300 hover:scale-105">
              <Trash2 className="text-red-400 w-10 h-10 mx-auto mb-4" />
              <h4 className="font-semibold text-red-400 text-lg mb-2">Delete</h4>
              <p className="text-muted-foreground">Request deletion of your personal data</p>
            </Card>
          </div>
        </div>
      )}

      {/* Document Footer */}
      <div className="border-t border-border pt-8 mt-16">
        <Card className="card-gradient p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-muted-foreground">
                This document was last updated on{" "}
                <span className="font-semibold text-primary">{policy.lastUpdated}</span>
              </p>
              <p className="text-sm text-muted-foreground/70 mt-2">
                For questions: <span className="text-primary">info@hush1one.com</span> | <span className="text-primary">+14252969050</span>
              </p>
            </div>
            <div className="flex space-x-4">
              <Button variant="outline" size="sm" className="border-primary/30 hover:bg-primary/10 transition-all duration-200">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm" className="border-primary/30 hover:bg-primary/10 transition-all duration-200">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
