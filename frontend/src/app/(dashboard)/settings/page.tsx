"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CompanySettingsForm } from "@/components/settings/company-settings-form";
import { ChannelSettings } from "@/components/settings/channel-settings";

export default function SettingsPage() {
  return (
    <Tabs defaultValue="company" className="space-y-4">
      <TabsList>
        <TabsTrigger value="company">Компания</TabsTrigger>
        <TabsTrigger value="channels">Каналы</TabsTrigger>
      </TabsList>

      <TabsContent value="company">
        <CompanySettingsForm />
      </TabsContent>

      <TabsContent value="channels">
        <ChannelSettings />
      </TabsContent>
    </Tabs>
  );
}
