import { Button } from '@components/ui/button';
import { ScrollArea } from '@components/ui/scroll-area';
import { Layers, MessageSquare, FileText, Box, Users, Briefcase } from 'lucide-react';

const sidebarItems = [
  { icon: Layers, label: 'Scènes' },
  { icon: MessageSquare, label: 'Dialogues' },
  { icon: FileText, label: 'Textes' },
  { icon: Box, label: 'Assets' },
  { icon: Users, label: 'Personnages' },
  { icon: Briefcase, label: 'Preuves' },
];

export function Sidebar() {
  return (
    <div className="w-64 border-r border-border bg-card">
      <ScrollArea className="h-full">
        <div className="space-y-4 py-4">
          {sidebarItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className="w-full justify-start gap-2 px-4"
            >
              <item.icon className="h-5 w-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
} 