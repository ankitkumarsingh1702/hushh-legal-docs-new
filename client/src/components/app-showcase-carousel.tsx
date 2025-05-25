import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Smartphone, ShoppingBag, Receipt, Search } from "lucide-react";
import image1 from "@assets/image_1748208452799.png";
import image2 from "@assets/image_1748208474088.png";
import image3 from "@assets/image_1748208496182.png";
import image4 from "@assets/image_1748208516973.png";

const carouselData = [
  {
    id: 1,
    image: image1,
    title: "Your Data, Your Business",
    description: "Take control of your personal data and turn it into valuable business opportunities with Hushh.",
    icon: Smartphone,
    color: "from-purple-600 to-blue-600"
  },
  {
    id: 2,
    image: image2,
    title: "Your Brands, Your Way",
    description: "Create custom brand cards to share your style and preferences with your favorite stores. Unlock personalized offers, early access, and more.",
    icon: ShoppingBag,
    color: "from-orange-500 to-pink-500"
  },
  {
    id: 3,
    image: image3,
    title: "Effortless Earnings: Turn Receipts into Rewards",
    description: "Tired of losing track of your receipts? Let Receipt Radar do the work! We'll automatically scan your inbox for purchase receipts and award you points every day.",
    icon: Receipt,
    color: "from-green-500 to-teal-500"
  },
  {
    id: 4,
    image: image4,
    title: "Shop Your Style: Discover Brands You'll Love",
    description: "Card Market simplifies your shopping journey. Tell us your preferences, and we'll create a personalized feed of brands that match your style and interests.",
    icon: Search,
    color: "from-red-500 to-purple-500"
  }
];

export default function AppShowcaseCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === carouselData.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(currentIndex === 0 ? carouselData.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(currentIndex === carouselData.length - 1 ? 0 : currentIndex + 1);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  const currentSlide = carouselData[currentIndex];
  const IconComponent = currentSlide.icon;

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Card className="card-gradient border-border/50 overflow-hidden">
        {/* Header */}
        <div className="bg-primary/5 border-b border-border/50 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <Smartphone className="text-primary w-5 h-5" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gradient">Discover Hushh App</h3>
              <p className="text-muted-foreground">Experience the future of personal data management</p>
            </div>
          </div>
        </div>

        {/* Carousel Content */}
        <div className="relative p-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Text Content */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 bg-gradient-to-r ${currentSlide.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <IconComponent className="text-white w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-foreground">{currentSlide.title}</h4>
                </div>
              </div>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                {currentSlide.description}
              </p>

              {/* Navigation Dots */}
              <div className="flex space-x-2">
                {carouselData.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'bg-primary scale-125' 
                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                  />
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={goToPrevious}
                  className="border-primary/30 hover:bg-primary/10 transition-all duration-200"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  onClick={goToNext}
                  className="border-primary/30 hover:bg-primary/10 transition-all duration-200"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Image Display */}
            <div className="relative">
              <div className="relative mx-auto max-w-sm">
                {/* Phone Frame */}
                <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] p-2 shadow-2xl">
                  <div className="bg-black rounded-[2.5rem] overflow-hidden">
                    <img
                      src={currentSlide.image}
                      alt={currentSlide.title}
                      className="w-full h-auto object-cover transition-all duration-500 transform hover:scale-105"
                    />
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary/20 rounded-full animate-pulse" />
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-green-400/20 rounded-full animate-pulse delay-1000" />
              </div>
            </div>
          </div>

          {/* Auto-play Indicator */}
          {isAutoPlaying && (
            <div className="absolute top-4 right-4">
              <div className="flex items-center space-x-2 text-xs text-muted-foreground bg-background/50 backdrop-blur-sm rounded-full px-3 py-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Auto-playing</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-primary/5 border-t border-border/50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} of {carouselData.length}
            </span>
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              {isAutoPlaying ? 'Pause Auto-play' : 'Resume Auto-play'}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}