"use client";

import { useEffect, useState } from "react";
import { Building2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCompany } from "@/hooks/useCompany";
import { updateCompanySettings } from "@/lib/api/companies";

export function CompanySettingsForm() {
  const queryClient = useQueryClient();
  const { data: company, isLoading } = useCompany();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [language, setLanguage] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (company) {
      setName(company.name ?? "");
      setEmail(company.email ?? "");
      setPhone(company.phone ?? "");
      setLanguage(company.language ?? "");
      setAiPrompt(company.ai_prompt ?? "");
    }
  }, [company]);

  const handleSubmit = async () => {
    if (!company) return;
    setIsSaving(true);
    try {
      await updateCompanySettings(company.id, {
        name,
        email,
        phone,
        language,
        ai_prompt: aiPrompt,
      });
      await queryClient.invalidateQueries({ queryKey: ["company", company.id] });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Building2 className="h-4 w-4" />
        </div>
        <div>
          <CardTitle>Компания</CardTitle>
          <CardDescription>Данные берутся из GET /companies/&#123;id&#125;</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="company-name">Название</Label>
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Input id="company-name" value={name} onChange={(e) => setName(e.target.value)} />
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="company-email">Email компании</Label>
            <Input id="company-email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company-phone">Телефон</Label>
            <Input id="company-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="company-language">Язык ответов AI</Label>
          <Input id="company-language" value={language} onChange={(e) => setLanguage(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company-prompt">Системный промпт</Label>
          <Textarea id="company-prompt" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} rows={4} />
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={isSaving || isLoading}>
            {isSaving ? "Сохранение..." : "Сохранить"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
