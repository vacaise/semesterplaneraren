
import React from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Twitter, Facebook, Linkedin, Mail } from 'lucide-react';

const SocialShareButtons = () => {
  const shareUrl = window.location.href;
  const shareTitle = 'Check out my optimized vacation plan!';
  const shareText = 'I used Holiday Optimizer to maximize my time off - take a look at my schedule.';

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: shareTitle,
        text: shareText,
        url: shareUrl,
      }).catch((error) => console.log('Error sharing', error));
    }
  };

  const handleSocialShare = (platform: string) => {
    let url = '';
    
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'email':
        url = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
        break;
    }

    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Share your optimized schedule with friends and colleagues
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1.5"
            onClick={handleShare}
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Share</span>
          </Button>
        )}
        
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1.5 text-[#1DA1F2] hover:bg-[#1DA1F2]/10"
          onClick={() => handleSocialShare('twitter')}
        >
          <Twitter className="h-3.5 w-3.5" />
          <span>Twitter</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1.5 text-[#4267B2] hover:bg-[#4267B2]/10"
          onClick={() => handleSocialShare('facebook')}
        >
          <Facebook className="h-3.5 w-3.5" />
          <span>Facebook</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1.5 text-[#0A66C2] hover:bg-[#0A66C2]/10"
          onClick={() => handleSocialShare('linkedin')}
        >
          <Linkedin className="h-3.5 w-3.5" />
          <span>LinkedIn</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1.5"
          onClick={() => handleSocialShare('email')}
        >
          <Mail className="h-3.5 w-3.5" />
          <span>Email</span>
        </Button>
      </div>
    </div>
  );
};

export default SocialShareButtons;
