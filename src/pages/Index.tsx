import { useState } from "react";
import Icon from "@/components/ui/icon";

type Section = "chats" | "contacts" | "groups" | "files" | "search" | "settings" | "profile";
type Chat = { id: number; name: string; last: string; time: string; unread?: number; online?: boolean; group?: boolean; avatar: string };
type Message = { id: number; text: string; out: boolean; time: string; file?: { name: string; size: string } };

const CHATS: Chat[] = [
  { id: 1, name: "Анна Петрова", last: "Отправила документы ✓", time: "14:32", unread: 3, online: true, avatar: "АП" },
  { id: 2, name: "Команда проекта", last: "Иван: Принято, спасибо!", time: "13:15", unread: 7, group: true, avatar: "КП" },
  { id: 3, name: "Дмитрий Краснов", last: "Ок, договорились 👍", time: "11:40", online: false, avatar: "ДК" },
  { id: 4, name: "Маркетинг", last: "Презентация готова", time: "Вчера", group: true, avatar: "МА" },
  { id: 5, name: "Елена Волкова", last: "Когда встретимся?", time: "Вчера", unread: 1, online: true, avatar: "ЕВ" },
  { id: 6, name: "Сергей Морозов", last: "Файл получен", time: "Пн", avatar: "СМ" },
  { id: 7, name: "Разработка", last: "Деплой прошёл успешно 🚀", time: "Пн", group: true, avatar: "РЗ" },
];

const MESSAGES: Record<number, Message[]> = {
  1: [
    { id: 1, text: "Привет! Можешь прислать договор?", out: false, time: "14:10" },
    { id: 2, text: "Конечно, минуту!", out: true, time: "14:11" },
    { id: 3, text: "", out: true, time: "14:12", file: { name: "Договор_2024.pdf", size: "2.4 МБ" } },
    { id: 4, text: "Отправила документы ✓", out: false, time: "14:32" },
  ],
  2: [
    { id: 1, text: "Дедлайн завтра в 18:00", out: false, time: "12:00" },
    { id: 2, text: "Успеем, не переживайте", out: true, time: "12:05" },
    { id: 3, text: "Иван: Принято, спасибо!", out: false, time: "13:15" },
  ],
  3: [
    { id: 1, text: "Встреча в пятницу?", out: true, time: "10:00" },
    { id: 2, text: "Да, в 15:00 подойдёт", out: false, time: "10:30" },
    { id: 3, text: "Ок, договорились 👍", out: false, time: "11:40" },
  ],
};

const CONTACTS = [
  { id: 1, name: "Анна Петрова", status: "В сети", avatar: "АП", online: true },
  { id: 2, name: "Дмитрий Краснов", status: "Был(а) час назад", avatar: "ДК", online: false },
  { id: 3, name: "Елена Волкова", status: "В сети", avatar: "ЕВ", online: true },
  { id: 4, name: "Иван Сидоров", status: "Был(а) вчера", avatar: "ИС", online: false },
  { id: 5, name: "Мария Кузнецова", status: "В сети", avatar: "МК", online: true },
  { id: 6, name: "Сергей Морозов", status: "Не беспокоить", avatar: "СМ", online: false },
];

const FILES = [
  { id: 1, name: "Договор_2024.pdf", size: "2.4 МБ", from: "Анна Петрова", date: "Сегодня", icon: "FileText" },
  { id: 2, name: "Презентация_Q4.pptx", size: "8.1 МБ", from: "Маркетинг", date: "Вчера", icon: "Presentation" },
  { id: 3, name: "Фото_встречи.zip", size: "45 МБ", from: "Иван Сидоров", date: "Пн", icon: "Archive" },
  { id: 4, name: "Бюджет_2025.xlsx", size: "1.2 МБ", from: "Дмитрий Краснов", date: "Пн", icon: "FileSpreadsheet" },
  { id: 5, name: "Логотип_финал.png", size: "0.8 МБ", from: "Маркетинг", date: "28 мар", icon: "Image" },
];

const AVATAR_COLORS: Record<string, string> = {
  "АП": "#2196a8", "КП": "#7c5cbf", "ДК": "#2e7d5e", "МА": "#c0622a",
  "ЕВ": "#9c4a7a", "СМ": "#4a6fa5", "РЗ": "#2d8a4e", "ИС": "#a05c3e", "МК": "#5a7abf",
};

function Avatar({ initials, size = "md", online }: { initials: string; size?: "sm" | "md" | "lg"; online?: boolean }) {
  const sizes = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-14 h-14 text-lg" };
  const dotSizes = { sm: "w-2 h-2", md: "w-2.5 h-2.5", lg: "w-3 h-3" };
  return (
    <div className="relative flex-shrink-0">
      <div
        className={`${sizes[size]} rounded-full flex items-center justify-center font-semibold text-white`}
        style={{ background: AVATAR_COLORS[initials] || "#4a6fa5" }}
      >
        {initials}
      </div>
      {online !== undefined && (
        <div className={`absolute bottom-0 right-0 ${dotSizes[size]} rounded-full border-2 border-[hsl(220,16%,8%)] ${online ? "bg-[hsl(142,70%,45%)]" : "bg-[hsl(215,12%,35%)]"}`} />
      )}
    </div>
  );
}

export default function Index() {
  const [section, setSection] = useState<Section>("chats");
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Record<number, Message[]>>(MESSAGES);
  const [searchQuery, setSearchQuery] = useState("");

  const navItems: { key: Section; icon: string; label: string }[] = [
    { key: "chats", icon: "MessageSquare", label: "Чаты" },
    { key: "contacts", icon: "Users", label: "Контакты" },
    { key: "groups", icon: "UsersRound", label: "Группы" },
    { key: "files", icon: "FolderOpen", label: "Файлы" },
    { key: "search", icon: "Search", label: "Поиск" },
    { key: "settings", icon: "Settings", label: "Настройки" },
    { key: "profile", icon: "CircleUser", label: "Профиль" },
  ];

  const sendMessage = () => {
    if (!input.trim() || !activeChat) return;
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    const prev = messages[activeChat.id] || [];
    setMessages({ ...messages, [activeChat.id]: [...prev, { id: Date.now(), text: input.trim(), out: true, time }] });
    setInput("");
  };

  const filteredChats = searchQuery
    ? CHATS.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.last.toLowerCase().includes(searchQuery.toLowerCase()))
    : CHATS;

  const allMessages = Object.entries(messages).flatMap(([chatId, msgs]) =>
    msgs.filter(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()) && searchQuery.length > 0).map(m => ({
      ...m, chatName: CHATS.find(c => c.id === Number(chatId))?.name || ""
    }))
  );

  return (
    <div className="h-screen flex bg-[hsl(220,16%,8%)] overflow-hidden" style={{ fontFamily: "'Golos Text', sans-serif" }}>

      {/* Боковая навигация */}
      <div className="w-16 flex flex-col items-center py-4 gap-1 bg-[hsl(220,16%,6%)] border-r border-[hsl(220,12%,14%)]">
        <div className="w-9 h-9 rounded-xl bg-[hsl(199,80%,52%)] flex items-center justify-center mb-4">
          <Icon name="Shield" size={18} className="text-[hsl(220,16%,8%)]" />
        </div>
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => { setSection(item.key); setActiveChat(null); }}
            className={`nav-item w-full ${section === item.key ? "active" : ""}`}
          >
            <Icon name={item.icon} size={20} />
            <span>{item.label}</span>
          </button>
        ))}
        <div className="flex-1" />
        <Avatar initials="ВЫ" size="sm" online />
      </div>

      {/* Список (панель) */}
      <div className="w-72 flex flex-col border-r border-[hsl(220,12%,14%)] bg-[hsl(220,14%,9%)]">

        {/* Заголовок секции */}
        <div className="px-4 pt-5 pb-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-[hsl(210,20%,92%)]">
              {navItems.find(n => n.key === section)?.label}
            </h2>
            {section === "chats" && (
              <button className="w-7 h-7 rounded-lg bg-[hsl(199,80%,52%,0.15)] hover:bg-[hsl(199,80%,52%,0.25)] flex items-center justify-center transition-colors">
                <Icon name="Plus" size={15} className="text-[hsl(199,80%,52%)]" />
              </button>
            )}
            {section === "contacts" && (
              <button className="w-7 h-7 rounded-lg bg-[hsl(199,80%,52%,0.15)] hover:bg-[hsl(199,80%,52%,0.25)] flex items-center justify-center transition-colors">
                <Icon name="UserPlus" size={15} className="text-[hsl(199,80%,52%)]" />
              </button>
            )}
          </div>

          {(section === "chats" || section === "search") && (
            <div className="relative">
              <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(215,12%,45%)]" />
              <input
                className="w-full bg-[hsl(220,12%,14%)] border border-[hsl(220,12%,18%)] rounded-xl pl-8 pr-3 py-2 text-sm text-[hsl(210,20%,85%)] placeholder:text-[hsl(215,12%,40%)] outline-none focus:border-[hsl(199,80%,52%)] transition-colors"
                placeholder="Поиск..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Контент списка */}
        <div className="flex-1 overflow-y-auto px-2 pb-4">

          {/* ЧАТЫ */}
          {section === "chats" && filteredChats.map((chat, i) => (
            <div
              key={chat.id}
              onClick={() => setActiveChat(chat)}
              className={`chat-item animate-fade-in ${activeChat?.id === chat.id ? "active" : ""}`}
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <Avatar initials={chat.avatar} size="md" online={chat.online} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-sm font-medium text-[hsl(210,20%,92%)] truncate flex items-center gap-1">
                    {chat.group && <Icon name="Users" size={12} className="text-[hsl(215,12%,45%)]" />}
                    {chat.name}
                  </span>
                  <span className="text-[10px] text-[hsl(215,12%,40%)] flex-shrink-0 ml-2">{chat.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[hsl(215,12%,50%)] truncate">{chat.last}</span>
                  {chat.unread && (
                    <span className="ml-2 flex-shrink-0 min-w-[18px] h-[18px] rounded-full bg-[hsl(199,80%,52%)] text-[hsl(220,16%,8%)] text-[10px] font-bold flex items-center justify-center px-1">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* КОНТАКТЫ */}
          {section === "contacts" && CONTACTS.map((c, i) => (
            <div key={c.id} className="chat-item animate-fade-in" style={{ animationDelay: `${i * 0.04}s` }}>
              <Avatar initials={c.avatar} size="md" online={c.online} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-[hsl(210,20%,92%)]">{c.name}</div>
                <div className="text-xs text-[hsl(215,12%,50%)]">{c.status}</div>
              </div>
              <button className="w-7 h-7 rounded-lg hover:bg-[hsl(220,12%,18%)] flex items-center justify-center transition-colors">
                <Icon name="MessageSquare" size={15} className="text-[hsl(215,12%,45%)]" />
              </button>
            </div>
          ))}

          {/* ГРУППЫ */}
          {section === "groups" && CHATS.filter(c => c.group).map((chat, i) => (
            <div key={chat.id} onClick={() => { setActiveChat(chat); setSection("chats"); }} className="chat-item animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
              <Avatar initials={chat.avatar} size="md" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-[hsl(210,20%,92%)]">{chat.name}</div>
                <div className="text-xs text-[hsl(215,12%,50%)]">{chat.last}</div>
              </div>
              {chat.unread && (
                <span className="min-w-[18px] h-[18px] rounded-full bg-[hsl(199,80%,52%)] text-[hsl(220,16%,8%)] text-[10px] font-bold flex items-center justify-center px-1">
                  {chat.unread}
                </span>
              )}
            </div>
          ))}

          {/* ФАЙЛЫ */}
          {section === "files" && FILES.map((f, i) => (
            <div key={f.id} className="chat-item animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="w-10 h-10 rounded-xl bg-[hsl(199,80%,52%,0.12)] flex items-center justify-center flex-shrink-0">
                <Icon name={f.icon} size={20} className="text-[hsl(199,80%,52%)]" fallback="File" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-[hsl(210,20%,92%)] truncate">{f.name}</div>
                <div className="text-xs text-[hsl(215,12%,50%)]">{f.size} · {f.from}</div>
              </div>
              <button className="w-7 h-7 rounded-lg hover:bg-[hsl(220,12%,18%)] flex items-center justify-center transition-colors">
                <Icon name="Download" size={14} className="text-[hsl(215,12%,45%)]" />
              </button>
            </div>
          ))}

          {/* ПОИСК */}
          {section === "search" && (
            <div className="mt-2">
              {searchQuery.length === 0 ? (
                <div className="flex flex-col items-center py-10 gap-3 opacity-40">
                  <Icon name="Search" size={36} className="text-[hsl(215,12%,45%)]" />
                  <p className="text-sm text-[hsl(215,12%,45%)]">Введите запрос для поиска</p>
                </div>
              ) : allMessages.length === 0 ? (
                <div className="flex flex-col items-center py-10 gap-3 opacity-40">
                  <Icon name="SearchX" size={36} className="text-[hsl(215,12%,45%)]" />
                  <p className="text-sm text-[hsl(215,12%,45%)]">Ничего не найдено</p>
                </div>
              ) : allMessages.map((m, i) => (
                <div key={i} className="chat-item animate-fade-in flex-col items-start gap-1" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="text-[10px] text-[hsl(199,80%,52%)] font-medium">{m.chatName}</div>
                  <div className="text-sm text-[hsl(210,20%,85%)]">{m.text}</div>
                  <div className="text-[10px] text-[hsl(215,12%,45%)]">{m.time}</div>
                </div>
              ))}
            </div>
          )}

          {/* НАСТРОЙКИ */}
          {section === "settings" && (
            <div className="mt-2 space-y-1">
              {[
                { icon: "Bell", label: "Уведомления", desc: "Звуки и вибрация" },
                { icon: "Shield", label: "Конфиденциальность", desc: "Блокировки и разрешения" },
                { icon: "Lock", label: "Безопасность", desc: "Двойная аутентификация" },
                { icon: "Palette", label: "Оформление", desc: "Тема и шрифт" },
                { icon: "Database", label: "Данные", desc: "Хранилище и кэш" },
                { icon: "HelpCircle", label: "Помощь", desc: "FAQ и поддержка" },
                { icon: "Info", label: "О приложении", desc: "Версия 1.0.0" },
              ].map((item, i) => (
                <button key={i} className="chat-item w-full text-left animate-fade-in" style={{ animationDelay: `${i * 0.04}s` }}>
                  <div className="w-9 h-9 rounded-xl bg-[hsl(220,12%,16%)] flex items-center justify-center flex-shrink-0">
                    <Icon name={item.icon} size={17} className="text-[hsl(215,12%,55%)]" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-[hsl(210,20%,90%)]">{item.label}</div>
                    <div className="text-xs text-[hsl(215,12%,50%)]">{item.desc}</div>
                  </div>
                  <Icon name="ChevronRight" size={15} className="text-[hsl(215,12%,35%)]" />
                </button>
              ))}
            </div>
          )}

          {/* ПРОФИЛЬ */}
          {section === "profile" && (
            <div className="mt-2 animate-fade-in">
              <div className="flex flex-col items-center py-6 gap-3">
                <div className="w-16 h-16 rounded-2xl bg-[hsl(199,80%,52%)] flex items-center justify-center text-xl font-bold text-[hsl(220,16%,8%)]">ВЫ</div>
                <div className="text-center">
                  <div className="font-semibold text-[hsl(210,20%,92%)]">Ваше Имя</div>
                  <div className="text-xs text-[hsl(215,12%,50%)] mt-0.5">+7 (999) 123-45-67</div>
                </div>
                <div className="encrypt-badge">
                  <Icon name="Lock" size={10} />
                  Профиль зашифрован
                </div>
              </div>
              <div className="space-y-1 mt-2">
                {[
                  { icon: "Edit3", label: "Редактировать профиль" },
                  { icon: "Key", label: "Мои ключи шифрования" },
                  { icon: "Smartphone", label: "Связанные устройства" },
                  { icon: "LogOut", label: "Выйти" },
                ].map((item, i) => (
                  <button key={i} className="chat-item w-full text-left">
                    <Icon name={item.icon} size={17} className="text-[hsl(215,12%,50%)] flex-shrink-0" />
                    <span className="text-sm text-[hsl(210,20%,88%)]">{item.label}</span>
                    <Icon name="ChevronRight" size={14} className="ml-auto text-[hsl(215,12%,35%)]" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Основная область */}
      <div className="flex-1 flex flex-col min-w-0">
        {activeChat ? (
          <>
            {/* Шапка чата */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-[hsl(220,12%,14%)] bg-[hsl(220,14%,10%)]">
              <Avatar initials={activeChat.avatar} size="md" online={activeChat.online} />
              <div className="flex-1">
                <div className="font-semibold text-[hsl(210,20%,92%)] flex items-center gap-2">
                  {activeChat.name}
                  {activeChat.group && <Icon name="Users" size={13} className="text-[hsl(215,12%,45%)]" />}
                </div>
                <div className="text-xs text-[hsl(215,12%,50%)] flex items-center gap-2 mt-0.5">
                  <span className="encrypt-badge"><Icon name="Lock" size={10} />Сквозное шифрование</span>
                  {activeChat.online && <span className="text-[hsl(142,70%,45%)]">● В сети</span>}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 rounded-xl hover:bg-[hsl(220,12%,16%)] flex items-center justify-center transition-colors">
                  <Icon name="Search" size={17} className="text-[hsl(215,12%,50%)]" />
                </button>
                <button className="w-8 h-8 rounded-xl hover:bg-[hsl(220,12%,16%)] flex items-center justify-center transition-colors">
                  <Icon name="Phone" size={17} className="text-[hsl(215,12%,50%)]" />
                </button>
                <button className="w-8 h-8 rounded-xl hover:bg-[hsl(220,12%,16%)] flex items-center justify-center transition-colors">
                  <Icon name="MoreVertical" size={17} className="text-[hsl(215,12%,50%)]" />
                </button>
              </div>
            </div>

            {/* Сообщения */}
            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-2">
              {(messages[activeChat.id] || []).map((msg, i) => (
                <div key={msg.id} className={`flex ${msg.out ? "justify-end" : "justify-start"} animate-slide-up`} style={{ animationDelay: `${i * 0.03}s` }}>
                  <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${msg.out ? "msg-bubble-out" : "msg-bubble-in"} px-4 py-2.5`}>
                    {msg.file ? (
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[hsl(199,80%,52%,0.15)] flex items-center justify-center flex-shrink-0">
                          <Icon name="FileText" size={18} className="text-[hsl(199,80%,52%)]" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-[hsl(210,20%,92%)]">{msg.file.name}</div>
                          <div className="text-xs text-[hsl(215,12%,55%)]">{msg.file.size}</div>
                        </div>
                        <Icon name="Download" size={16} className="text-[hsl(215,12%,50%)] cursor-pointer hover:text-[hsl(199,80%,52%)] transition-colors" />
                      </div>
                    ) : (
                      <p className="text-sm text-[hsl(210,20%,90%)] leading-relaxed">{msg.text}</p>
                    )}
                    <div className={`text-[10px] mt-1 flex items-center gap-1 ${msg.out ? "justify-end text-[hsl(199,50%,65%)]" : "text-[hsl(215,12%,45%)]"}`}>
                      {msg.time}
                      {msg.out && <Icon name="CheckCheck" size={12} className="text-[hsl(199,70%,60%)]" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Ввод сообщения */}
            <div className="px-6 py-4 border-t border-[hsl(220,12%,14%)] bg-[hsl(220,14%,10%)]">
              <div className="flex items-end gap-3">
                <button className="w-9 h-9 rounded-xl hover:bg-[hsl(220,12%,16%)] flex items-center justify-center flex-shrink-0 transition-colors mb-0.5">
                  <Icon name="Paperclip" size={18} className="text-[hsl(215,12%,50%)]" />
                </button>
                <div className="flex-1 bg-[hsl(220,12%,14%)] border border-[hsl(220,12%,18%)] rounded-2xl px-4 py-2.5 flex items-end gap-2 focus-within:border-[hsl(199,80%,52%)] transition-colors">
                  <textarea
                    className="flex-1 bg-transparent text-sm text-[hsl(210,20%,90%)] placeholder:text-[hsl(215,12%,38%)] outline-none resize-none max-h-32 leading-relaxed"
                    placeholder="Сообщение (зашифровано)..."
                    rows={1}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  />
                  <button className="flex-shrink-0">
                    <Icon name="Smile" size={18} className="text-[hsl(215,12%,45%)] hover:text-[hsl(199,80%,52%)] transition-colors cursor-pointer" />
                  </button>
                </div>
                <button
                  onClick={sendMessage}
                  className="w-9 h-9 rounded-xl bg-[hsl(199,80%,52%)] hover:bg-[hsl(199,80%,45%)] flex items-center justify-center flex-shrink-0 transition-colors mb-0.5"
                >
                  <Icon name="Send" size={16} className="text-[hsl(220,16%,8%)]" />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Пустое состояние */
          <div className="flex-1 flex flex-col items-center justify-center gap-4 animate-fade-in">
            <div className="w-20 h-20 rounded-3xl bg-[hsl(199,80%,52%,0.1)] border border-[hsl(199,80%,52%,0.2)] flex items-center justify-center">
              <Icon name="Shield" size={36} className="text-[hsl(199,80%,52%)]" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-[hsl(210,20%,75%)] mb-1">Защищённый мессенджер</h3>
              <p className="text-sm text-[hsl(215,12%,42%)] max-w-xs leading-relaxed">
                Все сообщения и файлы защищены сквозным шифрованием. Только вы и получатель можете их прочитать.
              </p>
            </div>
            <div className="encrypt-badge mt-2">
              <Icon name="Lock" size={11} />
              End-to-end encryption enabled
            </div>
          </div>
        )}
      </div>
    </div>
  );
}