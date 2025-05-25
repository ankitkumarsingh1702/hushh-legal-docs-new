import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileText, Shield, CreditCard, Scale, Mail, Phone, MapPin } from "lucide-react";
import { useLocation } from "wouter";
import { formatRealTimeDate } from "@/lib/utils";
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
          <div className="mt-3 max-h-36 overflow-y-auto card-gradient rounded-lg p-3 space-y-2 fade-in">
            {searchResults.map((result, index) => (
              <button
                key={index}
                onClick={() => handlePolicyChange(result.policy.type)}
                className="w-full text-left p-3 hover:bg-accent rounded-lg transition-all duration-200 text-sm group hover:scale-[1.02]"
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
        <div className="space-y-3">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Last updated: <span className="font-medium text-primary">{formatRealTimeDate()}</span>
            </p>
          </div>
          
          <div className="card-gradient p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-primary mb-3">Connect with Hushh</h4>
            <p className="text-xs text-muted-foreground mb-3">Say something to reach out to us</p>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2 group cursor-pointer">
                <Mail className="text-primary w-3 h-3 group-hover:scale-110 transition-transform" />
                <span className="text-foreground font-medium group-hover:text-primary transition-colors">info@hush1one.com</span>
              </div>
              <div className="flex items-center space-x-2 group cursor-pointer">
                <Phone className="text-primary w-3 h-3 group-hover:scale-110 transition-transform" />
                <span className="text-foreground font-medium group-hover:text-primary transition-colors">+14252969050</span>
              </div>
              <div className="flex items-start space-x-2 mt-3 group cursor-pointer">
                <MapPin className="text-primary w-3 h-3 mt-0.5 group-hover:scale-110 transition-transform" />
                <div className="text-foreground">
                  <div className="font-medium group-hover:text-primary transition-colors">Hushh.ai</div>
                  <div className="text-muted-foreground text-xs leading-relaxed">
                    1021 5th St W<br />
                    Kirkland, WA 98033
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
