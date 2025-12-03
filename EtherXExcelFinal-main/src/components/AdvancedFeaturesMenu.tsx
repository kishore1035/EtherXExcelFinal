import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Sparkles,
  Bot,
  Workflow,
  Database,
  TableIcon,
  LayoutDashboard,
  Clock,
  Zap,
} from "lucide-react";
import { Badge } from "./ui/badge";

interface AdvancedFeaturesMenuProps {
  onAIChatbot: () => void;
  onPowerQuery: () => void;
  onDataModel: () => void;
  onPivotTable: () => void;
  onDashboard: () => void;
  onVersionHistory: () => void;
  onFlashFill: () => void;
}

export function AdvancedFeaturesMenu({
  onAIChatbot,
  onPowerQuery,
  onDataModel,
  onPivotTable,
  onDashboard,
  onVersionHistory,
  onFlashFill,
}: AdvancedFeaturesMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2">
          <Sparkles className="w-4 h-4" />
          <span className="hidden md:inline">Advanced</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-80">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Advanced Features
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="p-2 space-y-1">
          <DropdownMenuItem onClick={onAIChatbot} className="p-3 cursor-pointer">
            <div className="flex items-start gap-3 w-full">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">AI Assistant</span>
                  <Badge variant="secondary" className="text-xs">AI</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Get help with formulas and data analysis
                </p>
              </div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={onPowerQuery} className="p-3 cursor-pointer">
            <div className="flex items-start gap-3 w-full">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{background: 'linear-gradient(135deg, #FFFACD 0%, #FFD700 25%, #FFFACD 50%, #FFD700 75%, #FFFACD 100%)'}}>
                <Workflow className="w-4 h-4 text-black" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">Power Query</span>
                  <Badge variant="secondary" className="text-xs">Pro</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Transform and clean your data
                </p>
              </div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={onDataModel} className="p-3 cursor-pointer">
            <div className="flex items-start gap-3 w-full">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{background: 'linear-gradient(135deg, #FFFACD 0%, #FFD700 25%, #FFFACD 50%, #FFD700 75%, #FFFACD 100%)'}}>
                <Database className="w-4 h-4 text-black" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">Data Model</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Visualize table relationships
                </p>
              </div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={onPivotTable} className="p-3 cursor-pointer">
            <div className="flex items-start gap-3 w-full">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{background: 'linear-gradient(135deg, #FFFACD 0%, #FFD700 25%, #FFFACD 50%, #FFD700 75%, #FFFACD 100%)'}}>
                <TableIcon className="w-4 h-4 text-black" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">PivotTable Builder</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Create powerful data summaries
                </p>
              </div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={onDashboard} className="p-3 cursor-pointer">
            <div className="flex items-start gap-3 w-full">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                <LayoutDashboard className="w-4 h-4 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">Dashboard Builder</span>
                  <Badge variant="secondary" className="text-xs">New</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Design interactive visualizations
                </p>
              </div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={onFlashFill} className="p-3 cursor-pointer">
            <div className="flex items-start gap-3 w-full">
              <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4 text-yellow-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">Flash Fill</span>
                  <Badge variant="secondary" className="text-xs">AI</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Auto-detect and fill patterns
                </p>
              </div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={onVersionHistory} className="p-3 cursor-pointer">
            <div className="flex items-start gap-3 w-full">
              <div className="w-8 h-8 rounded-lg bg-slate-500/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-slate-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">Version History</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  View and restore past versions
                </p>
              </div>
            </div>
          </DropdownMenuItem>
        </div>

        <div className="p-2 pt-1">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-lg p-3 border border-blue-500/20">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 mt-0.5" style={{color: '#FFD700'}} />
              <div>
                <p className="text-xs font-medium">Pro Tip</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Use keyboard shortcuts to access features faster
                </p>
              </div>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
