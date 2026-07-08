"use client";

import Link from "next/link";
import { MessagesSquare, Users, Mail, ArrowUpRight } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChannelBadge, StatusBadge } from "@/components/shared/badges";
import { useStatisticsOverview } from "@/hooks/useStatistics";
import { useConversationsList } from "@/hooks/useConversations";
import { useCustomers } from "@/hooks/useCustomers";
import { formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const { data: overview, isLoading: overviewLoading } = useStatisticsOverview();
  const { data: conversations, isLoading: conversationsLoading } = useConversationsList();
  const { customers, isLoading: customersLoading } = useCustomers();

  const recent = [...(conversations ?? [])]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Количество диалогов"
          value={overview?.conversations ?? 0}
          icon={MessagesSquare}
          accent="primary"
          isLoading={overviewLoading}
        />
        <StatCard
          label="Количество клиентов"
          value={customers.length}
          icon={Users}
          accent="success"
          isLoading={customersLoading}
        />
        <StatCard
          label="Количество сообщений"
          value={overview?.messages ?? 0}
          icon={Mail}
          accent="muted"
          isLoading={overviewLoading}
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Последние диалоги</CardTitle>
          <Link
            href="/conversations"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Все диалоги <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </CardHeader>
        <CardContent className="space-y-2">
          {conversationsLoading &&
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}

          {!conversationsLoading && recent.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">Пока нет диалогов</p>
          )}

          {recent.map((conversation) => (
            <Link
              key={conversation.id}
              href={`/conversations/${conversation.id}`}
              className="flex items-center justify-between rounded-lg border border-transparent px-3 py-3 transition-colors hover:border-border hover:bg-accent"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{conversation.customer_external_id}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {conversation.summary || "Нет резюме диалога"}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3 pl-4">
                <ChannelBadge channel={conversation.channel} />
                <StatusBadge status={conversation.status} />
                <span className="hidden text-xs text-muted-foreground sm:inline">
                  {formatDate(conversation.updated_at)}
                </span>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
