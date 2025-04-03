
import React from 'react';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';

const SocialShareButtons = () => {
  return (
    <div className="flex items-center justify-center gap-2">
      <Button 
        variant="outline" 
        size="sm"
        className="flex items-center gap-1.5"
        onClick={() => {
          if (navigator.share) {
            navigator.share({
              title: 'My Optimized Time Off Schedule',
              text: 'Check out my optimized vacation plan for maximum time off!',
              url: window.location.href,
            }).catch((error) => console.log('Error sharing', error));
          }
        }}
      >
        <Share2 className="h-3.5 w-3.5" />
        <span>Share Results</span>
      </Button>
    </div>
  );
};

export default SocialShareButtons;
