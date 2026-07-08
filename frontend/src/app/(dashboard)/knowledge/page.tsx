import { KnowledgeList } from "@/components/knowledge/knowledge-list";
import { TodoBackendNotice } from "@/components/shared/todo-backend-notice";

export default function KnowledgePage() {
  return (
    <div className="space-y-6">
      <TodoBackendNotice>
        TODO(backend): нет <code>DELETE /knowledge/{"{id}"}</code> — кнопка удаления отключена.
        Загрузка файла работает через <code>POST /knowledge</code> (только текст: title + content),
        отдельного endpoint для бинарных файлов на backend нет.
      </TodoBackendNotice>
      <KnowledgeList />
    </div>
  );
}
