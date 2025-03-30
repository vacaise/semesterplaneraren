
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

const Footer = () => {
  const isMobile = useIsMobile();
  const year = new Date().getFullYear();
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportForm, setReportForm] = useState({
    name: "",
    email: "",
    problem: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReportForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real implementation, this would send an email
    // For now, just show a success toast and close the dialog
    toast({
      title: "Rapport skickad",
      description: "Tack för din feedback! Vi kommer att titta på problemet så snart som möjligt.",
    });
    
    setReportForm({
      name: "",
      email: "",
      problem: ""
    });
    
    setReportDialogOpen(false);
  };
  
  return (
    <footer className={`mt-8 py-8 ${isMobile ? 'px-4' : 'px-8'} bg-gray-50 border-t border-gray-200`}>
      <div className="max-w-4xl mx-auto">
        <div className={`${isMobile ? 'flex flex-col gap-4' : 'flex justify-between'}`}>
          <div>
            <h2 className={`text-lg font-semibold mb-2 ${isMobile ? 'text-center' : ''}`}>vacai</h2>
            <p className={`text-gray-600 text-sm max-w-md ${isMobile ? 'text-center' : ''}`}>
              Optimera din semester för att maximera din ledighet. vacai hjälper dig att få ut mest möjligt av dina semesterdagar.
            </p>
          </div>
          
          <div className={`flex ${isMobile ? 'flex-row justify-center mt-4' : 'flex-col items-end'}`}>
            <div className={`flex ${isMobile ? 'gap-6' : 'gap-4'}`}>
              <a href="mailto:vacai.se@yahoo.com" className="text-gray-600 hover:text-gray-900 text-sm">Kontakt</a>
              <button 
                onClick={() => setReportDialogOpen(true)}
                className="text-gray-600 hover:text-gray-900 text-sm"
              >
                Rapportera ett problem
              </button>
            </div>
            {!isMobile && (
              <p className="text-gray-500 text-xs mt-4">
                &copy; {year} vacai.se. Alla rättigheter förbehållna.
              </p>
            )}
          </div>
        </div>
        
        {isMobile && (
          <p className="text-gray-500 text-xs mt-6 text-center">
            &copy; {year} vacai.se. Alla rättigheter förbehållna.
          </p>
        )}
      </div>

      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rapportera ett problem</DialogTitle>
            <DialogDescription>
              Beskriv problemet du upplevt och vi kommer att titta på det så snart som möjligt.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmitReport}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Namn
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={reportForm.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  E-post
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={reportForm.email}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="problem" className="text-right">
                  Problem
                </Label>
                <Textarea
                  id="problem"
                  name="problem"
                  value={reportForm.problem}
                  onChange={handleInputChange}
                  className="col-span-3"
                  rows={5}
                  required
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setReportDialogOpen(false)}>
                Avbryt
              </Button>
              <Button type="submit">Skicka rapport</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </footer>
  );
};

export default Footer;
