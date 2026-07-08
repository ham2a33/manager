"use client";

import { MessagesSquare, Mail, DoorOpen, Layers } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatisticsCharts } from "@/components/statistics/statistics-charts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TodoBackendNotice } from "@/components/shared/todo-backend-notice";
import { useStatisticsOverview } from "@/hooks/useStatistics";
import { useCurrentSubscription } from "@/hooks/useStatistics";

export default function StatisticsPage() {
  const { data: overview, isLoading } = useStatisticsOverview();
  const { data: subscription } = useCurrentSubscription();

  return (
    <div className="space-y-6">
      <TodoBackendNotice>
        TODO(backend): <code>GET /statistics/overview</code> отдаёт только 3 показателя (диалоги,
        сообщения, открытые диалоги) без временных рядов. Графики динамики по дням появятся, когда
        backend добавит агрегацию по датам в <code>app/api/v1/statistics.py</code>.
      </TodoBackendNotice>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Диалоги"
          value={overview?.conversations ?? 0}
          icon={MessagesSquare}
          isLoading={isLoading}
        />
        <StatCard
          label="Сообщения"
          value={overview?.messages ?? 0}
          icon={Mail}
          accent="muted"
          isLoading={isLoading}
        />
        <StatCard
          label="Открытые диалоги"
          value={overview?.open_conversations ?? 0}
          icon={DoorOpen}
          accent="success"
          isLoading={isLoading}
        />
        <StatCard
          label="Лимит по плану"
          value={subscription?.limits.conversations ?? "—"}
          icon={Layers}
          accent="muted"
        />
      </div>

      <StatisticsCharts />

      {subscription && (
        <Card>
          <CardHeader>
            <CardTitle>Текущий тариф</CardTitle>
            <CardDescription>GET /subscriptions/current</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary" className="text-sm capitalize">
              {subscription.plan}
            </Badge>
            <Badge variant={subscription.status === "active" ? "success" : "muted"}>
              {subscription.status}
            </Badge>
            <span className="text-sm text-muted-foreground">
              до {subscription.limits.conversations} диалогов · до{" "}
              {subscription.limits.knowledge_documents} документов знаний
            </span>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
