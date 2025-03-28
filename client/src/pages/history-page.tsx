import { useQuery } from "@tanstack/react-query";
import { History } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { Link } from "wouter";
import { Fragment } from "react";

export default function HistoryPage() {
  const { data: historyItems, isLoading } = useQuery<History[]>({
    queryKey: ["/api/history"],
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-center">История клуба</h1>
      
      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 bg-primary/20"></div>
        
        {historyItems?.map((item, index) => (
          <Fragment key={item.id}>
            <div className={`relative flex items-center mb-12 ${
              index % 2 === 0 ? "flex-row" : "flex-row-reverse"
            }`}>
              {/* Timeline dot */}
              <div className="absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-primary z-10"></div>
              
              {/* Year marker */}
              <div className={`absolute left-1/2 ${
                index % 2 === 0 ? "-translate-x-[5.5rem]" : "translate-x-[3.5rem]"
              } -translate-y-8 bg-background px-2 z-10`}>
                <span className="text-2xl font-bold text-primary">{item.year}</span>
              </div>
              
              {/* Content */}
              <div className={`w-5/12 ${
                index % 2 === 0 ? "pr-16" : "pl-16"
              }`}></div>
              
              <div className={`w-5/12 ${
                index % 2 === 0 ? "pl-16" : "pr-16"
              }`}>
                <div className={`p-6 rounded-lg shadow-lg ${
                  item.importance === 3 ? "bg-primary/10 border-2 border-primary" : 
                  item.importance === 2 ? "bg-background border border-primary/50" : 
                  "bg-background border border-border"
                }`}>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  
                  {item.imageUrl && (
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-40 object-cover rounded-md mb-4"
                    />
                  )}
                  
                  <p>{item.description}</p>
                </div>
              </div>
            </div>
          </Fragment>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <Link href="/" className="text-primary hover:underline">
          На главную
        </Link>
      </div>
    </div>
  );
}