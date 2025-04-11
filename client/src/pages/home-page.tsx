import React from "react";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import HeroSlider from "@/components/hero-slider";
import UpcomingMatches from "@/components/upcoming-matches";
import StandingsTable from "@/components/standings-table";
import TeamShowcase from "@/components/team-showcase";
import NewsSection from "@/components/news-section";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

const HomePage = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  const { data: news } = useQuery({
    queryKey: ["/api/news"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const { data: upcomingMatches } = useQuery({
    queryKey: ["/api/matches/upcoming", 3],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const { data: standings } = useQuery({
    queryKey: ["/api/standings"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const { data: players } = useQuery({
    queryKey: ["/api/players"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const { data: coaches } = useQuery({
    queryKey: ["/api/coaches"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  useEffect(() => {
    const checkScrollPosition = () => {
      if (window.pageYOffset > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", checkScrollPosition);
    return () => window.removeEventListener("scroll", checkScrollPosition);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SiteHeader />

      {/* Hero Slider */}
      <HeroSlider news={news} />

      {/* Matches Section */}
      <section id="matches" className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-roboto-condensed text-3xl font-bold text-primary">
              Ближайшие матчи
            </h2>
            <a
              href="/matches"
              className="text-secondary-blue hover:underline font-roboto-condensed"
            >
              Календарь игр <i className="fas fa-arrow-right ml-2"></i>
            </a>
          </div>

          <UpcomingMatches matches={upcomingMatches} />

          {/* Tournament Table Mini */}
          <StandingsTable standings={standings} />
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-roboto-condensed text-3xl font-bold text-primary">
              Состав команды
            </h2>
            <a
              href="/team"
              className="text-secondary-blue hover:underline font-roboto-condensed"
            >
              Все игроки <i className="fas fa-arrow-right ml-2"></i>
            </a>
          </div>

          <TeamShowcase players={players} coaches={coaches} />
        </div>
      </section>

      {/* News Section */}
      <section id="news" className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-roboto-condensed text-3xl font-bold text-primary">
              Новости
            </h2>
            <a
              href="/news"
              className="text-secondary-blue hover:underline font-roboto-condensed"
            >
              Все новости <i className="fas fa-arrow-right ml-2"></i>
            </a>
          </div>

          <NewsSection news={news} />
        </div>
      </section>

      <SiteFooter />

      {/* Back to top button */}
      {showScrollButton && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-primary hover:bg-secondary-blue text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors"
          size="icon"
        >
          <ChevronUp size={20} />
        </Button>
      )}
    </div>
  );
};

export default HomePage;