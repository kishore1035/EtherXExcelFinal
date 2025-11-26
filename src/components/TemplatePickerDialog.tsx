import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  FileText, 
  CheckSquare, 
  ShoppingCart, 
  Package, 
  GraduationCap,
  X,
  Sparkles
} from "lucide-react";
import { getAllTemplates, generateTemplate, type Template } from "../services/templateService";

interface TemplatePickerDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectTemplate: (templateData: any) => void;
}

const ICON_MAP: Record<string, any> = {
  TrendingUp,
  Users,
  DollarSign,
  FileText,
  CheckSquare,
  ShoppingCart,
  Package,
  GraduationCap,
};

const CATEGORY_COLORS: Record<string, string> = {
  Business: 'bg-green-500',
  HR: 'bg-blue-500',
  Finance: 'bg-orange-500',
  'Project Management': 'bg-purple-500',
  Sales: 'bg-red-500',
  Operations: 'bg-amber-500',
  Education: 'bg-indigo-500',
};

export function TemplatePickerDialog({ open, onClose, onSelectTemplate }: TemplatePickerDialogProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      loadTemplates();
    }
  }, [open]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const fetchedTemplates = await getAllTemplates();
      setTemplates(fetchedTemplates);
    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTemplate = async (templateId: string) => {
    try {
      setGenerating(true);
      const templateData = await generateTemplate(templateId);
      onSelectTemplate(templateData);
      onClose();
    } catch (error) {
      console.error('Failed to generate template:', error);
      alert('Failed to load template. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const categories = Array.from(new Set(templates.map(t => t.category)));
  const filteredTemplates = selectedCategory 
    ? templates.filter(t => t.category === selectedCategory)
    : templates;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-6xl w-full mx-auto p-6 border-4"
        style={{
          borderImage: 'linear-gradient(135deg, #FFFACD 0%, #FFD700 25%, #FFFACD 50%, #FFD700 75%, #FFFACD 100%) 1'
        }}
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-yellow-500" />
                Choose a Template
              </DialogTitle>
              <DialogDescription className="mt-2">
                Select a professional template to get started quickly
              </DialogDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 pb-4 border-b">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All Templates
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Templates Horizontal Gallery */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto py-4 px-1">
            {filteredTemplates.map((template) => {
              const IconComponent = ICON_MAP[template.icon] || FileText;
              const categoryColor = CATEGORY_COLORS[template.category] || 'bg-amber-500';

              return (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="min-w-[320px] flex-shrink-0"
                >
                  <Card 
                    className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 h-full border-2"
                    style={{
                      borderImage: 'linear-gradient(135deg, #FFFACD 0%, #FFD700 50%, #FFFACD 100%) 1'
                    }}
                    onClick={() => handleSelectTemplate(template.id)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center"
                          style={{
                            background: 'linear-gradient(135deg, #FFFACD 0%, #FFD700 25%, #FFFACD 50%, #FFD700 75%, #FFFACD 100%)'
                          }}
                        >
                          <IconComponent className="h-6 w-6 text-black" />
                        </div>
                        <span className={`px-2 py-1 rounded-md text-xs font-medium text-white ${categoryColor}`}>
                          {template.category}
                        </span>
                      </div>
                      <CardTitle>{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full">
                        Use Template
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Loading Overlay */}
        {generating && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
            <div className="bg-white dark:bg-background p-6 rounded-lg flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-sm font-medium">Generating template...</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
