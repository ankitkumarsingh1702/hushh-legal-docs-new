import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileText, Shield, CreditCard, Scale } from "lucide-react";
import { useLocation } from "wouter";
import type { Policy } from "@shared/schema";

interface SidebarProps {
  currentPolicy: string;
  onPolicyChange: (policy: string) => void;
  onClose: () => void;
}

const policyIcons = {
  "terms-of-service": FileText,
  "non-discrimination": Scale,
  "payment-terms": CreditCard,
  "privacy-policy": Shield,
};

export default function Sidebar({ currentPolicy, onPolicyChange, onClose }: SidebarProps) {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const { data: policies, isLoading } = useQuery<Policy[]>({
    queryKey: ["/api/policies"],
  });

  const handlePolicyChange = (policyType: string) => {
    onPolicyChange(policyType);
    setLocation(`/policy/${policyType}`);
    onClose();
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      try {
        const response = await fetch(`/api/policies/search/${encodeURIComponent(query)}`);
        if (response.ok) {
          const results = await response.json();
          setSearchResults(results);
        }
      } catch (error) {
        console.error("Search failed:", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  if (isLoading) {
    return (
      <aside className="w-64 bg-white shadow-lg h-full">
        <div className="p-6 border-b border-gray-200">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-64 bg-white shadow-lg h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Legal Center</h1>
        <p className="text-sm text-gray-600 mt-1">Policy Documentation</p>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search policies..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-2 max-h-32 overflow-y-auto bg-gray-50 rounded-lg p-2">
            {searchResults.map((result, index) => (
              <button
                key={index}
                onClick={() => handlePolicyChange(result.policy.type)}
                className="w-full text-left p-2 hover:bg-white rounded text-xs"
              >
                <div className="font-medium text-blue-600">{result.policy.title}</div>
                <div className="text-gray-600 truncate">{result.context}</div>
                <div className="text-gray-500">{result.matches} matches</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-4">
          {policies?.map((policy) => {
            const IconComponent = policyIcons[policy.type as keyof typeof policyIcons];
            const isActive = currentPolicy === policy.type;
            
            return (
              <li key={policy.type}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start h-auto py-3 px-4 ${
                    isActive 
                      ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600" 
                      : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                  }`}
                  onClick={() => handlePolicyChange(policy.type)}
                >
                  {IconComponent && (
                    <IconComponent className={`w-5 h-5 mr-3 ${
                      isActive ? "text-blue-600" : "text-gray-400"
                    }`} />
                  )}
                  <span className="font-medium">{policy.title}</span>
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <p className="text-xs text-gray-500">
          Last updated: <span className="font-medium">January 2024</span>
        </p>
      </div>
    </aside>
  );
}
