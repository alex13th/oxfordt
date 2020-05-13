# Оксфордский тест анализа способностей

## Планируемые доработки:

1. Добавить выделение зон графика

        1	71      100
        3	21      70
        3	-40     20
        4	-100    -41
2. Выделение отдельных точек графика (для выделения **маник**);
3. Сохранение данных тестируемого в кэш браузера;
4. Сохранение результатов теста в кэше браузера;
5. Сохранение результатов теста локально. Тема пока не иследована, возможны сложности;
6. Сохранение результатов теста на сервере:
   1. Разработана принципиальная схема БД;
   2. Необходимо понимания способа хостинга и соответственно выбор метода реализации;
7. Добавить в график подзаголовок в столбец графика (Стабильный, счастье и т.д.);
8. Добавить в вывод результатов теста данные пользователя:
    * ФИО;
    * Возраст;
    * Пол;
    * Профессия.
9. Добавить в график подсветку значний точек при наведении на них курсора;
10. Добавить значения в questions.json;
11. Включить определение **МАНИК** при расчете результатов теста.

    * **Два трейта** могут быть отмечены волнистой линией **(трейт B и E)**, это объясняет в главе подсчета теста. 
    * **На трейте B, Счастье,** ставят волнистую линию, если на **вопрос #197** *(Бывают ли у Вас периоды подавленности и грусти без всякой видимой причины?)* был дан ответ "ДА". 
    * **На трейте E, Счастье,** ставят волнистую линию, если на **вопрос #22** *(Бывают ли у Вас периоды повышенной активности в течение нескольких дней подряд?)* был дан ответ "ДА". 
    * Обведенные трейты показывают соответствующий маник у человека, и необходимо вынуть нужные карточки (Маник B или Маник E).
