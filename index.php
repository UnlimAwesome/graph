<head>
    <title>graph</title>
    <script src="https://cdn.plot.ly/plotly-2.12.1.min.js"></script>
    <link rel="stylesheet" href="style.css">
</head>
<body>
<header></header>
<main>
    <div id="graph" style=""></div>
    <script src="graph.js"></script>
    <div id="new_point">
        <form onsubmit="add_new_point(this); return false;">
            <h1>Добавить новую точку</h1>
            <h2>Добыто (тыс.м/час)</h2>
            <input name="product">
            <h2>Время</h2>
            <input type="time" name="time" pattern="[0-9]{2}\:[0-9]{2}">
            <div class="buttons">
                <button type="submit" class="submit_button">Ок</button>
                <button type="button" onclick="close_form(this);">Отмена</button>
            </div>
        </form>
    </div>
    <div id="new_plan">
        <form onsubmit="add_new_plan(this); return false;">
            <h1>Изменить план добычи</h1>
            <input name="product" pattern="[0-9]{,5}">
            <div class="buttons">
                <button type="submit" class="submit_button">Ок</button>
                <button type="button" onclick="close_form(this);">Отмена</button>
            </div>
        </form>
    </div>
</main>
<footer></footer>
</body>