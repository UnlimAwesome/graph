const myGraph = document.getElementById('graph');

const points = ['2022-05-26 00:00', '2022-05-26 1:00', '2022-05-26 2:00', '2022-05-26 3:00', '2022-05-26 4:00',
    '2022-05-26 5:00', '2022-05-26 6:00', '2022-05-26 7:00', '2022-05-26 8:00', '2022-05-26 9:00', '2022-05-26 10:00',
    '2022-05-26 11:00', '2022-05-26 12:00', '2022-05-26 13:00', '2022-05-26 14:00', '2022-05-26 15:00', '2022-05-26 16:00',
    '2022-05-26 17:00', '2022-05-26 18:00', '2022-05-26 19:00', '2022-05-26 20:00', '2022-05-26 21:00', '2022-05-26 22:00',
    '2022-05-26 23:00', '2022-05-27 00:00']
let timestamps = ['2022-05-26 12:00', '2022-05-26 13:00', '2022-05-26 14:00', '2022-05-26 15:00'];
let predict_points, predict_color;
let product = [10, 20, 6, 4];
let plan = 100;
let summary = [];
let prediction = [];

Array.prototype.insert = function (timestamp) {
    let datetime = new Date(timestamp);
    for (let i = 0; i < timestamps.length; i++) {
        if (datetime < new Date(timestamps[i])) {
            this.splice(i, 0, timestamp);
            return [i, false];
        }
        if (datetime === new Date(timestamps[i])) {
            return [i, true];
        }
    }
    this.splice(timestamp.length, 0, timestamp);
    return [timestamp.length - 1, false];
};

function close_form(button) {
    let dialog = button.closest('.active_form');
    let form = button.closest('.active_form>form');
    let inputs = form.querySelectorAll('input');
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].value = ''
    }
    dialog.classList.remove('active_form');
}

function add_new_point(form) {
    let time_input = form.querySelector('[name="time"]');
    let product_input = form.querySelector('[name="product"]');
    let time = time_input.value.split(":", 1), amount = product_input.value;
    time = '2022-05-26 ' + (Number(time) + 1) + ':00';
    time_input.value = "";
    product_input.value = "";
    let [index, flag] = timestamps.insert(time);

    if (flag) {
        product[index] += amount;
    } else {
        product.splice(index, 0, Number(amount));
    }

    form.closest('.active_form').classList.remove('active_form');
    data = init_data();
    draw();
}

function add_new_plan(form) {
    let product_input = form.querySelector('[name="product"]');
    plan = product_input.value;
    product_input.value = "";
    form.closest('.active_form').classList.remove('active_form');
    data = init_data();
    draw();
}

function draw() {
    Plotly.newPlot('graph', data, layout, config);

    myGraph.on('plotly_click', function () {
        let new_point = document.getElementById("new_point");
        new_point.classList.add("active_form");
    })

    myGraph.on('plotly_legendclick', function () {
        let new_plan = document.getElementById("new_plan");
        new_plan.classList.add("active_form");
        return false;
    })
}

function init_data() {
    prediction = [];
    predict_points = points;
    predict_points = predict_points.filter((item) => (new Date(item) >= new Date(timestamps[timestamps.length - 1])));
    console.log(predict_points);

    for (let i = 0; i < predict_points.length; i++) {
        prediction[i] = 0;
    }

    let average = 0;
    for (let i = 0; i < timestamps.length; i++) {
        average += product[i];
        summary[i] = 0;
        for (let j = 0; j <= i; j++) {
            summary[i] += product[j];
        }
    }
    average /= timestamps.length;

    for (let i = 0; i < prediction.length; i++) {
        if (i === 0) {
            prediction[i] = summary[summary.length - 1];
            continue;
        }
        if (prediction[i] === 0) {
            prediction[i] = prediction[i - 1] + average;
        }
    }

    predict_color = Number(plan) < prediction[prediction.length - 1] ? 'green' : 'brown';

    console.log(Number(plan) < prediction[prediction.length - 1]);
    console.log(plan);
    console.log(prediction);

    let plan_line = {
        x: [points[0], points[points.length - 1]],
        y: [plan, plan],
        name: 'План добычи',
        fill: 'tozeroy',
        line: {
            color: '#4FA8FC',
        },
        fillcolor: 'rgba(222,240,255,0.5)',
        type: 'scatter',
    };

    let predict_line = {
        x: predict_points,
        y: prediction,
        name: 'Прогноз добычи',
        line: {
            color: predict_color,
            dash: 'dot',
            width: 4
        }
    };

    let product_summary = {
        type: 'scatter',
        x: timestamps,
        y: summary,
        name: 'Добыто (сутки)',
        line: {
            color: 'violet',
            width: 5
        },
        marker: {
            color: '#C8A2C8',
            line: {
                width: 2.5
            }
        }
    };

    let product_per_hour = {
        type: 'bar',
        x: timestamps,
        y: product,
        fill: 'tozeroy',
        fillcolor: 'green',
        name: 'Добыто (час)',
        marker: {
            width: 2.5,
            color: '#8EED84',
        }
    };


    return [plan_line, product_per_hour, predict_line, product_summary];
}

data = init_data();

let layout = {
    title: 'Скважина 1-1!',
    legend: {
        x: 0.25,
        y: -0.1,
        "orientation": "h",
    },
    font: {size: 18},
    yaxis: {
        title: {
            text: 'Дебит',
        },
        tickmode: 'linear',
        dtick: 20,
        ticksuffix: ' тыс.м',
        tick0: 0,
        rangemode: 'tozero',
        automargin: true,
    },
    xaxis: {
        type: 'date',
        tickmode: 'linear',
        tick0: '2022-05-26',
        dtick: 1000 * 60 * 60,
        range: ['2022-05-26', '2022-05-27'],
        fixedrange: true,
        automargin: true,
        rangebreaks: {
            bounds: ['2022-05-26', '2022-05-27'],
            templateitemname: 'name',
        },
    },
};

let config = {responsive: true}
draw();


