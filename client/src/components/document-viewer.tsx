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
        return <h2 key={index} className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200 mt-12 first:mt-0">{line.replace('# ', '')}</h2>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={index} className="text-xl font-semibold text-gray-900 mb-3 mt-8">{line.replace('## ', '')}</h3>;
      }
      if (line.startsWith('### ')) {
        return <h4 key={index} className="text-lg font-semibold text-gray-900 mb-2 mt-6">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('#### ')) {
        return <h5 key={index} className="text-base font-semibold text-gray-900 mb-2 mt-4">{line.replace('#### ', '')}</h5>;
      }
      if (line.startsWith('- ')) {
        return (
          <li key={index} className="text-gray-700 mb-1 ml-4">
            {line.replace('- ', '')}
          </li>
        );
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      
      // Handle links and emphasized text
      const formattedLine = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
      
      return (
        <p key={index} className="text-gray-700 leading-relaxed mb-4" 
           dangerouslySetInnerHTML={{ __html: formattedLine }} />
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-8">
      {/* Document Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className={`w-12 h-12 bg-${colorClass}-100 rounded-lg flex items-center justify-center mr-4`}>
            <IconComponent className={`text-${colorClass}-600 text-xl w-6 h-6`} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{policy.title}</h1>
            <p className="text-gray-600">
              Effective Date: <span className="font-medium">{policy.effectiveDate}</span>
              <span className="mx-2">•</span>
              Last Updated: <span className="font-medium">{policy.lastUpdated}</span>
            </p>
          </div>
        </div>

        {/* Quick Navigation */}
        {quickNavSections.length > 0 && (
          <Card className="bg-blue-50 border-blue-200 p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Quick Navigation</h3>
            <div className="flex flex-wrap gap-2">
              {quickNavSections.map((section, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-white border-blue-200 text-blue-700 hover:bg-blue-100 cursor-pointer"
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
        <div className="space-y-4">
          {formatContent(policy.content)}
        </div>
      </div>

      {/* Your Rights Section for Privacy Policy */}
      {policy.type === 'privacy-policy' && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Your Rights and Choices</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Card className="text-center p-4 bg-blue-50 border-blue-200">
              <Eye className="text-blue-600 text-2xl mb-2 w-8 h-8 mx-auto" />
              <h4 className="font-semibold text-blue-900">Access</h4>
              <p className="text-blue-800 text-sm">View the personal information we have about you</p>
            </Card>
            
            <Card className="text-center p-4 bg-green-50 border-green-200">
              <Edit className="text-green-600 text-2xl mb-2 w-8 h-8 mx-auto" />
              <h4 className="font-semibold text-green-900">Correct</h4>
              <p className="text-green-800 text-sm">Update or correct your personal information</p>
            </Card>
            
            <Card className="text-center p-4 bg-red-50 border-red-200">
              <Trash2 className="text-red-600 text-2xl mb-2 w-8 h-8 mx-auto" />
              <h4 className="font-semibold text-red-900">Delete</h4>
              <p className="text-red-800 text-sm">Request deletion of your personal data</p>
            </Card>
          </div>
        </div>
      )}

      {/* Document Footer */}
      <div className="border-t border-gray-200 pt-6 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600">
              This document was last updated on{" "}
              <span className="font-medium">{policy.lastUpdated}</span>
            </p>
          </div>
          <div className="flex space-x-4">
            <Button variant="outline" size="sm" className="text-sm">
              <Printer className="w-4 h-4 mr-1" />
              Print
            </Button>
            <Button variant="outline" size="sm" className="text-sm">
              <Download className="w-4 h-4 mr-1" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
