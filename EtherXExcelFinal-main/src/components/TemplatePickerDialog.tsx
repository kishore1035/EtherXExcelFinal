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
  Sparkles,
} from "lucide-react";
import { getAllTemplates, generateTemplate, type Template } from "../services/templateService";

interface TemplatePickerDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectTemplate: (templateData: any) => void;
  isDarkMode?: boolean;
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
  Business: "bg-green-500",
  HR: "bg-blue-500",
  Finance: "bg-orange-500",
  "Project Management": "bg-purple-500",
  Sales: "bg-red-500",
  Operations: "bg-amber-500",
  Education: "bg-indigo-500",
};

export function TemplatePickerDialog({ open, onClose, onSelectTemplate, isDarkMode = false }: TemplatePickerDialogProps) {
  if (!open) return null;

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(8px)',
      }}
      onClick={onClose}
    >
      <div
        data-template-dialog
        className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl"
        style={{
          background: isDarkMode ? '#000000' : '#FFFFFF',
          border: '3px solid',
          borderImage: 'linear-gradient(135deg, #FFD700 0%, #FFFACD 100%) 1',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between"
          style={{
            background: isDarkMode ? 'linear-gradient(135deg, #000000 0%, #000000 100%)' : '#FFFFFF',
            borderBottom: '2px solid',
            borderColor: isDarkMode ? '#FFD700' : 'rgba(255, 215, 0, 0.3)',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #FFD700 100%)' }}>
              <Sparkles className="w-6 h-6" style={{ color: '#000' }} />
            </div>
            <div>
              <h2 className="text-2xl font-bold" style={{ color: isDarkMode ? '#FFD700' : '#222' }}>
                Choose a Template
              </h2>
              <p className="text-sm" style={{ color: isDarkMode ? '#FFFFFF' : '#666' }}>
                Select a professional template to get started quickly
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-all duration-200"
            style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #FFD700 100%)', color: '#000' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'linear-gradient(135deg, #FFFFFF 0%, #FFD700 100%)')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Box */}
        <div
          className="mx-6 mt-4 p-4 rounded-lg"
          style={{
            background: isDarkMode ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 165, 0, 0.05) 100%)' : '#FFFFFF',
            border: '1px solid',
            borderColor: isDarkMode ? 'rgba(255, 215, 0, 0.3)' : 'rgba(255, 215, 0, 0.3)',
          }}
        >
          <p className="text-sm" style={{ color: isDarkMode ? '#FFFFFF' : '#666' }}>
            <strong style={{ color: '#FFD700' }}>Browse templates:</strong> Pick a template by category or name. Click "Use Template" to instantly create a new spreadsheet with pre-built formatting, formulas, and charts.
          </p>
        </div>

        {/* Category Filter */}
        {/* Removed All Templates button and category filter area as requested */}

        {/* Templates List */}
        <div 
          className="px-6 pb-6 overflow-y-auto" 
          style={{ 
            maxHeight: 'calc(80vh - 220px)',
            background: isDarkMode ? '#000000' : '#FFFFFF'
          }}
        >
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <Sparkles className="w-16 h-16 mx-auto mb-4" style={{ color: '#FFD700' }} />
              <p className="text-lg font-medium" style={{ color: '#666666' }}>
                No templates found
              </p>
              <p className="text-sm mt-2" style={{ color: '#999999' }}>
                Try a different category or check your connection
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => {
                const IconComponent = ICON_MAP[template.icon] || FileText;
                return (
                  <div
                    key={template.id}
                    className="rounded-lg p-4 transition-all duration-200 cursor-pointer hover:shadow-lg hover:scale-105 border-2"
                    style={{
                      background: isDarkMode ? '#000000' : '#FFFFFF',
                      border: '2px solid',
                      borderImage: 'linear-gradient(135deg, #FFFFFF 0%, #FFD700 100%) 1',
                    }}
                    onClick={() => handleSelectTemplate(template.id)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #FFD700 100%)' }}>
                        <IconComponent className="h-6 w-6 text-black" />
                      </div>
                    </div>
                        {/* Removed category display as requested */}
                    <h3 className="font-bold text-lg" style={{ color: isDarkMode ? '#FFD700' : '#000' }}>{template.name}</h3>
                    <p className="text-sm mb-4" style={{ color: isDarkMode ? '#FFFFFF' : '#666' }}>{template.description}</p>
                    <Button className="w-full template-button-gradient" style={{ fontWeight: 'bold', boxShadow: '0 2px 8px rgba(255, 215, 0, 0.2)', border: '2px solid transparent' }}>
                      Use Template
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Loading Overlay */}
        {generating && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
            <div className="bg-white dark:bg-background p-6 rounded-lg flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-sm font-medium">Generating template...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
