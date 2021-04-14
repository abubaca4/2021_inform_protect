var a_data = document.getElementById('id_a_data');
var c_data = document.getElementById('id_c_data');
var interval_data = document.getElementById('id_interval_data');
var count_data = document.getElementById('id_count_data');
var p_data = document.getElementById('id_p_data');
var q_data = document.getElementById('id_q_data');
var x4_data = document.getElementById('id_x4_data');
var x3_data = document.getElementById('id_x3_data');
var x2_data = document.getElementById('id_x2_data');
var x_data = document.getElementById('id_x_data');
var b_data = document.getElementById('id_b_data');

function lcg_get_xn(a, xn, c, m) {
    return (a * xn + c) % m;
}

function get_lcg() {
    let result = [];
    let xn = 0;
    let a = parseInt(a_data.value);
    let c = parseInt(c_data.value);
    let interval = parseInt(interval_data.value);
    let count = parseInt(count_data.value);
    for (let i = 0; i < count; i++) {
        xn = lcg_get_xn(a, xn, c, interval);
        result.push(xn);
    }
    return result;
}

function show_gist(taget_div, data) {
    let trace = {
        x: data,
        type: 'histogram',
    };
    let parent_width = document.getElementById(taget_div).offsetWidth;
    let layout = {
        width: parent_width - 15,
        responsive: true,
        margin: { t: 0, b: 30, l: 15, r: 0 },
    }
    Plotly.newPlot(taget_div, [trace], layout);
}

function update_lcd() {
    let data = get_lcg();
    document.getElementById("lcg_text_result").innerHTML = data.join("<br/>");
    show_gist("lcg_gist_result", data);
}

update_lcd();

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function isCoprime(a, b) {
    for (let gcd = a; ; gcd = b, b = a % b, a = gcd)
        if (!b) return gcd == 1;
}

function bbs_get_xn(x, M) {
    return (x * x) % M;
}

function get_bbs() {
    let result = [];
    let p = parseInt(p_data.value);
    let q = parseInt(q_data.value);
    let interval = parseInt(interval_data.value);
    let count = parseInt(count_data.value);
    let power_of_two = Math.floor(Math.log(interval) / Math.log(2));
    let M = p * q;
    let x;
    do {
        x = getRandomInt(M);
    } while (isCoprime(x, M));
    x = bbs_get_xn(x, M);
    for (let i = 0; i < count; i++) {
        let xn = 0;
        for (let j = 0; j < power_of_two; j++) {
            x = bbs_get_xn(x, M);
            xn = xn << 1;
            xn += x % 2;
        }
        result.push(xn);
    }
    return result;
}

function update_bbs() {
    let data = get_bbs();
    document.getElementById("bbs_text_result").innerHTML = data.join("<br/>");
    show_gist("bbs_gist_result", data);
}

update_bbs();

function get_lfsr_mat() {
    let data = [];

}

a_data.addEventListener("change", update_lcd);
c_data.addEventListener("change", update_lcd);
interval_data.addEventListener("change", function () {
    update_lcd();
    update_bbs();
});
count_data.addEventListener("change", function () {
    update_lcd();
    update_bbs();
});
p_data.addEventListener("change", update_bbs);
q_data.addEventListener("change", update_bbs);