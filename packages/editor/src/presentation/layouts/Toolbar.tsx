import { Button } from '@components/ui/button';
import { Save, Undo, Redo, Play } from 'lucide-react';

export function Toolbar() {
  return (
    <div className="h-16 border-b border-border bg-card px-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold text-card-foreground">HedgeWright Editor</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Undo className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Redo className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Save className="h-5 w-5" />
        </Button>
        <Button variant="secondary" size="icon">
          <Play className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
} 