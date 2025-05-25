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
    <aside className="w-72 glass-effect shadow-2xl h-full flex flex-col border-r border-border">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-gradient mb-1">Hushh Legal</h1>
        <p className="text-sm text-muted-foreground">Policy Documentation Center</p>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search policies..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 bg-card border-border focus:border-primary transition-colors"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-3 max-h-36 overflow-y-auto card-gradient rounded-lg p-3 space-y-2">
            {searchResults.map((result, index) => (
              <button
                key={index}
                onClick={() => handlePolicyChange(result.policy.type)}
                className="w-full text-left p-3 hover:bg-accent rounded-lg transition-all duration-200 text-sm group"
              >
                <div className="font-medium text-primary group-hover:text-primary/80">{result.policy.title}</div>
                <div className="text-muted-foreground truncate mt-1">{result.context}</div>
                <div className="text-xs text-muted-foreground/70 mt-1">{result.matches} matches found</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <ul className="space-y-2 px-4">
          {policies?.map((policy) => {
            const IconComponent = policyIcons[policy.type as keyof typeof policyIcons];
            const isActive = currentPolicy === policy.type;
            
            return (
              <li key={policy.type}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start h-auto py-4 px-4 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? "bg-primary/10 text-primary border-l-4 border-primary shadow-lg" 
                      : "text-foreground hover:bg-accent hover:text-primary hover:scale-[1.02]"
                  }`}
                  onClick={() => handlePolicyChange(policy.type)}
                >
                  {IconComponent && (
                    <IconComponent className={`w-5 h-5 mr-3 ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`} />
                  )}
                  <span className="font-medium text-left">{policy.title}</span>
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-2">
            Last updated: <span className="font-medium text-primary">May 26, 2025</span>
          </p>
          <div className="text-xs text-muted-foreground/70">
            <div>info@hush1one.com</div>
            <div>+14252969050</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
