import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';

interface EditorContentProps {
  children?: React.ReactNode;
}

export function EditorContent({ children }: EditorContentProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Éditeur de niveau</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="properties" className="h-full">
          <TabsList>
            <TabsTrigger value="properties">Propriétés</TabsTrigger>
            <TabsTrigger value="preview">Aperçu</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          <TabsContent value="properties" className="h-[calc(100%-2.25rem)]">
            {children}
          </TabsContent>
          <TabsContent value="preview" className="h-[calc(100%-2.25rem)]">
            <div className="h-full rounded-md border border-border bg-background p-4">
              Aperçu du niveau
            </div>
          </TabsContent>
          <TabsContent value="code" className="h-[calc(100%-2.25rem)]">
            <div className="h-full rounded-md border border-border bg-background p-4">
              Code source du niveau
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 