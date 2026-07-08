"use client";

import { Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TodoBackendNotice } from "@/components/shared/todo-backend-notice";
import { useCompany } from "@/hooks/useCompany";

export function CompanySettingsForm() {
  const { data: company, isLoading } = useCompany();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Building2 className="h-4 w-4" />
        </div>
        <div>
          <CardTitle>Компания</CardTitle>
          <CardDescription>Данные берутся из GET /companies/{"{id}"}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="company-name">Название</Label>
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Input id="company-name" value={company?.name ?? ""} readOnly disabled />
          )}
          <p className="text-xs text-muted-foreground">
            Название сейчас только для чтения — на backend нет PATCH /companies/{"{id}"}.
          </p>
        </div>

        <TodoBackendNotice>
          TODO(backend): модель <code>Company</code> в{" "}
          <code>app/database/models/domain.py</code> не содержит полей email, phone, language или
          prompt, а эндпоинта для обновления компании тоже нет. Поля ниже задизейблены до появления
          соответствующего API.
        </TodoBackendNotice>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Email компании</Label>
            <Input placeholder="Пока недоступно" disabled />
          </div>
          <div className="space-y-2">
            <Label>Телефон</Label>
            <Input placeholder="Пока недоступно" disabled />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Язык ответов AI</Label>
          <Input placeholder="Пока недоступно" disabled />
        </div>

        <div className="space-y-2">
          <Label>Системный промпт</Label>
          <Textarea placeholder="Пока недоступно" disabled rows={4} />
        </div>

        <div className="flex justify-end">
          <Button disabled title="Нет PATCH /companies/{id} на backend">
            Сохранить
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
