
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function SocialShareButtons() {
  const [isMounted, setIsMounted] = useState(false);
  const [shareSupported, setShareSupported] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setShareSupported('share' in navigator);
  }, []);

  if (!isMounted) {
    return null;
  }

  const handleNativeShare = async () => {
    if (!shareSupported) {
      setShowButtons(true);
      return;
    }

    try {
      await navigator.share({
        title: 'My Optimized Holiday Schedule',
        text: 'Check out my optimized holiday schedule from Holiday Optimizer! I\'m maximizing my time off this year.',
        url: window.location.href,
      });
    } catch (error) {
      console.error('Error sharing:', error);
      setShowButtons(true);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="gap-2"
        onClick={handleNativeShare}
      >
        <Share2 className="h-4 w-4" />
        Share my optimized schedule
      </Button>
      
      {showButtons && (
        <div className="flex gap-2 mt-1">
          <Button
            variant="outline"
            size="icon"
            className="bg-blue-50 border-blue-100 hover:bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:border-blue-800 dark:hover:bg-blue-900/50 dark:text-blue-400"
            onClick={() => {
              window.open(
                `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  'I just optimized my holiday schedule with Holiday Optimizer! Check it out:'
                )}&url=${encodeURIComponent(window.location.href)}`,
                '_blank'
              );
            }}
            aria-label="Share on Twitter"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
            </svg>
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="bg-blue-50 border-blue-100 hover:bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:border-blue-800 dark:hover:bg-blue-900/50 dark:text-blue-400"
            onClick={() => {
              window.open(
                `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
                '_blank'
              );
            }}
            aria-label="Share on Facebook"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            </svg>
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="bg-green-50 border-green-100 hover:bg-green-100 text-green-600 dark:bg-green-900/30 dark:border-green-800 dark:hover:bg-green-900/50 dark:text-green-400"
            onClick={() => {
              window.open(
                `https://api.whatsapp.com/send?text=${encodeURIComponent(
                  'Check out my optimized holiday schedule from Holiday Optimizer: ' + window.location.href
                )}`,
                '_blank'
              );
            }}
            aria-label="Share on WhatsApp"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
          </Button>
        </div>
      )}
    </div>
  );
}
