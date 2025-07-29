import { useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { bannerService, Banner } from '@/services/bannerService';
import { ArrowRight } from 'lucide-react';

export const BannerSlider = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const data = await bannerService.getBanners();
        setBanners(data);
      } catch (error) {
        console.error('Failed to load banners:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBanners();
  }, []);

  if (loading) {
    return (
      <div className="relative w-full h-[500px] bg-gradient-to-r from-primary/10 to-secondary/10 animate-pulse rounded-lg" />
    );
  }

  if (banners.length === 0) {
    return (
      <div className="relative w-full h-[500px] bg-gradient-to-r from-primary to-primary-foreground flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to Youth Nexus
          </h1>
          <p className="text-xl mb-8">
            Empowering the next generation through opportunities
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <Carousel className="w-full" opts={{ loop: true }}>
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id}>
              <div className="relative w-full h-[500px] overflow-hidden rounded-lg">
                <img
                  src={banner.image_url}
                  alt={banner.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white px-4 max-w-4xl">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
                      {banner.title}
                    </h1>
                    {banner.subtitle && (
                      <p className="text-xl md:text-2xl mb-8 animate-fade-in">
                        {banner.subtitle}
                      </p>
                    )}
                    {banner.link_url && (
                      <Button
                        asChild
                        size="lg"
                        className="animate-fade-in bg-primary hover:bg-primary/90"
                      >
                        <a href={banner.link_url} target="_blank" rel="noopener noreferrer">
                          Learn More
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {banners.length > 1 && (
          <>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </>
        )}
      </Carousel>
    </div>
  );
};