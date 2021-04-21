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
    for (let i = 0; i < 5; i++) {
        data[i] = [];
        for (let j = 0; j < 5; j++) {
            if (i === j) {
                data[i][j] = 1;
            }
            else {
                data[i][j] = 0;
            }
        }
    }
    data[0][0] = parseInt(x4_data.value);
    data[0][1] = parseInt(x3_data.value);
    data[0][2] = parseInt(x2_data.value);
    data[0][3] = parseInt(x_data.value);
    data[0][4] = parseInt(b_data.value);
    return data;
}

function mat_x_vec(mat, vec) {
    let result = [];
    for (let index = 0; index < vec.length; index++) {
        result[index] = 0;
    }
    for (let index = 0; index < vec.length; index++) {
        for (let index_2 = 0; index_2 < mat.length; index_2++) {
            result[index] += mat[index][index_2] * vec[index_2];
        }
    }
    return result;
}

function get_lfsr() {
    let result = [];
    let mat = get_lfsr_mat();
    let x = [1, 0, 0, 0, 0];
    let count = parseInt(count_data.value);
    for (let i = 0; i < count; i++) {
        let temp = 0;
        x = mat_x_vec(mat, x);
        x.forEach(element => {
            temp = temp << 1;
            temp += element % 2;
        });
        result.push(temp);
    }
    return result;
}

function update_lfsr() {
    let data = get_lfsr();
    document.getElementById("lfsr_text_result").innerHTML = data.join("<br/>");
    show_gist("lfsr_gist_result", data);
}

update_lfsr();

a_data.addEventListener("change", update_lcd);
c_data.addEventListener("change", update_lcd);
interval_data.addEventListener("change", function () {
    update_lcd();
    update_bbs();
});
count_data.addEventListener("change", function () {
    update_lcd();
    update_bbs();
    update_lfsr();
});
p_data.addEventListener("change", update_bbs);
q_data.addEventListener("change", update_bbs);
x4_data.addEventListener("change", update_lfsr);
x3_data.addEventListener("change", update_lfsr);
x2_data.addEventListener("change", update_lfsr);
x_data.addEventListener("change", update_lfsr);
b_data.addEventListener("change", update_lfsr);