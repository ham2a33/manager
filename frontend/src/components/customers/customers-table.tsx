"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ChannelBadge, StatusBadge } from "@/components/shared/badges";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCustomers } from "@/hooks/useCustomers";
import { formatDate, initialsFromText } from "@/lib/utils";

export function CustomersTable() {
  const { customers, isLoading } = useCustomers();
  const [query, setQuery] = useState("");
  const [channel, setChannel] = useState<string>("all");

  const filtered = useMemo(() => {
    return customers.filter((customer) => {
      const matchesQuery = query.trim()
        ? customer.customer_external_id.toLowerCase().includes(query.toLowerCase())
        : true;
      const matchesChannel = channel === "all" ? true : customer.channel === channel;
      return matchesQuery && matchesChannel;
    });
  }, [customers, query, channel]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по идентификатору клиента"
            className="pl-8"
          />
        </div>
        <Select value={channel} onValueChange={setChannel}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Канал" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все каналы</SelectItem>
            <SelectItem value="telegram">Telegram</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="whatsapp">WhatsApp</SelectItem>
            <SelectItem value="website">Website</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Клиент</TableHead>
            <TableHead>Канал</TableHead>
            <TableHead>Диалогов</TableHead>
            <TableHead>Последний статус</TableHead>
            <TableHead>Последняя активность</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={5}>
                  <Skeleton className="h-8 w-full" />
                </TableCell>
              </TableRow>
            ))}

          {!isLoading && filtered.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                Клиенты не найдены
              </TableCell>
            </TableRow>
          )}

          {filtered.map((customer) => (
            <TableRow key={customer.key}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{initialsFromText(customer.customer_external_id)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{customer.customer_external_id}</span>
                </div>
              </TableCell>
              <TableCell>
                <ChannelBadge channel={customer.channel} />
              </TableCell>
              <TableCell>{customer.conversations_count}</TableCell>
              <TableCell>
                <StatusBadge status={customer.last_status} />
              </TableCell>
              <TableCell className="text-muted-foreground">{formatDate(customer.last_activity)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
