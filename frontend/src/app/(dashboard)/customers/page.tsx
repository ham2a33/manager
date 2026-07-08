import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CustomersTable } from "@/components/customers/customers-table";
import { TodoBackendNotice } from "@/components/shared/todo-backend-notice";

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <TodoBackendNotice>
        TODO(backend): отдельного эндпоинта <code>GET /clients</code> пока нет (модель{" "}
        <code>Client</code> есть в БД, но роутер не подключён). Таблица ниже собрана из{" "}
        <code>GET /conversations</code> — как только backend добавит эндпоинт, замените{" "}
        <code>useCustomers</code> в <code>src/hooks/useCustomers.ts</code> на прямой запрос.
      </TodoBackendNotice>

      <Card>
        <CardHeader>
          <CardTitle>Клиенты</CardTitle>
          <CardDescription>Список клиентов, сгруппированный по диалогам</CardDescription>
        </CardHeader>
        <CardContent>
          <CustomersTable />
        </CardContent>
      </Card>
    </div>
  );
}
