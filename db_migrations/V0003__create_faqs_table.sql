CREATE TABLE IF NOT EXISTS t_p98795140_minecraft_anarchy_si.faqs (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO t_p98795140_minecraft_anarchy_si.faqs (question, answer, order_index) VALUES
('Как зайти на сервер?', 'Используйте IP адрес: play.anarchist-empire.ru в вашем клиенте Minecraft', 1),
('Какая версия Minecraft поддерживается?', 'Сервер поддерживает последнюю версию Minecraft Java Edition', 2),
('Есть ли правила на сервере?', 'Нет! Это сервер анархии - никаких правил и ограничений', 3),
('Как купить привилегию?', 'Привилегии появятся на сайте. Следите за обновлениями!', 4);