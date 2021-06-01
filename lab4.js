var p_data = document.getElementById('id_p_data');
var k_data = document.getElementById('id_k_data');

function to_bits(input) {
    let bits_arr = [];
    for (let index = 0; index < input.length; index++) {
        bits_arr.push(input.charCodeAt(index) - 'а'.charCodeAt(0));
    }
    return bits_arr;
}

function count_diff(a, b) {
    let diff = 0;
    for (let index = 0; index < a.length; index++) {
        let a_bin = (a[index] >>> 0).toString(2);
        let b_bin = (b[index] >>> 0).toString(2);
        if (a_bin.length > b_bin.length) {
            b_bin += '0'.repeat(a_bin.length - b_bin.length);
        }
        else {
            a_bin += '0'.repeat(b_bin.length - a_bin.length);
        }
        for (let i = 0; i < a_bin.length; i++) {
            if (a_bin[i] != b_bin[i]) {
                diff++;
            }
        }
    }
    return diff;
}

function to_chars(bits) {
    let s = "";
    bits.forEach(element => {
        s += String.fromCharCode(element + 'а'.charCodeAt(0));
    });
    return s;
}

function ecb(p, k) {
    let p_bits = to_bits(p);
    let k_bits = to_bits(k);
    let c = [];
    for (let index = 0; index < p_bits.length; index++) {
        c.push(p_bits[index] ^ k_bits[index % k_bits.length] ^ 1);
    }
    return c;
}

function cbc(p, k) {
    let p_bits = to_bits(p);
    let k_bits = to_bits(k);
    let c = [28];
    for (let index = 0; index < p_bits.length; index++) {
        c.push((p_bits[index] ^ c[c.length - 1]) ^ k_bits[index % k_bits.length] ^ 1);
    }
    return c.slice(1);
}

function ofb(p) {
    let p_bits = [0].concat(to_bits(p));
    let c = [28];
    for (let index = 1; index < p_bits.length; index++) {
        c.push(p_bits[index] ^ (p_bits[index - 1] ^ c[index - 1] ^ 1));
    }
    return c.slice(1);
}

function cfb(p) {
    let p_bits = to_bits(p);
    let c = [28];
    for (let index = 0; index < p_bits.length; index++) {
        c.push(p_bits[index] ^ (c[index - 1] ^ 1));
    }
    return c.slice(1);
}

function show_gist(taget_div, labels, data) {
    let barChart = new Chart(taget_div, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: data
        }
    });
}

function get_static(input) {
    let result = Array(32).fill(0);
    input.forEach(element => {
        result[element]++;
    });
    return result;
}

function sanitize_str(text) {
    return text.toLowerCase().replace('ё', 'е').replace(/[^а-я]/g, '');
}

function update_result() {
    let labels = 'а б в г д е ж з и й к л м н о п р с т у ф х ц ч ш щ ъ ы ь э ю я'.split(' ');
    let p = sanitize_str(p_data.value);
    let k = sanitize_str(k_data.value);
    let text_f = "";
    let p_bits = to_bits(p);
    text_f += to_chars(p_bits) + '<br>';
    let ecb_bits = ecb(p, k);
    let cbc_bits = cbc(p, k);
    let ofb_bits = ofb(p);
    let cfb_bits = cfb(p);
    text_f += `p_bits: ${p_bits}` + '<br>';
    text_f += `ecb_bits: ${ecb_bits}` + '<br>';
    text_f += `p_bits ^ ecb_bits: ${count_diff(p_bits, ecb_bits)}` + '<br>';
    text_f += `cbc_bits: ${cbc_bits}` + '<br>';
    text_f += `p_bits ^ cbc_bits: ${count_diff(p_bits, cbc_bits)}` + '<br>';
    text_f += `ofb_bits: ${ofb_bits}` + '<br>';
    text_f += `p_bits ^ ofb_bits: ${count_diff(p_bits, ofb_bits)}` + '<br>';
    text_f += `cfb_bits: ${cfb_bits}` + '<br>';
    text_f += `p_bits ^ cfb_bits: ${count_diff(p_bits, cfb_bits)}`;
    document.getElementById("text_result").innerHTML = text_f;
    console.log(labels);
    console.log(get_static(p_bits));
    show_gist(document.getElementById("p_hist"), labels, [{ label: 'P', data: get_static(p_bits), borderColor: 'rgb(25, 118, 210)', backgroundColor: 'rgb(25, 118, 210)' }]);
    show_gist(document.getElementById("ecb_hist"), labels, [{ label: 'ECB', data: get_static(ecb_bits), borderColor: 'rgb(255, 0, 0)', backgroundColor: 'rgb(255, 0, 0)' }]);
    show_gist(document.getElementById("cbc_hist"), labels, [{ label: 'CBC', data: get_static(cbc_bits), borderColor: 'rgb(255, 0, 0)', backgroundColor: 'rgb(255, 0, 0)' }]);
    show_gist(document.getElementById("ofb_hist"), labels, [{ label: 'OFB', data: get_static(ofb_bits), borderColor: 'rgb(255, 0, 0)', backgroundColor: 'rgb(255, 0, 0)' }]);
    show_gist(document.getElementById("cfb_hist"), labels, [{ label: 'CFB', data: get_static(cfb_bits), borderColor: 'rgb(255, 0, 0)', backgroundColor: 'rgb(255, 0, 0)' }]);
    show_gist(document.getElementById("p_ecb_hist"), labels, [{ label: 'P', data: get_static(p_bits), borderColor: 'rgb(25, 118, 210)', backgroundColor: 'rgb(25, 118, 210)' }, { label: 'ECB', data: get_static(ecb_bits), borderColor: 'rgb(255, 0, 0)', backgroundColor: 'rgb(255, 0, 0)' }]);
    show_gist(document.getElementById("p_cbc_hist"), labels, [{ label: 'P', data: get_static(p_bits), borderColor: 'rgb(25, 118, 210)', backgroundColor: 'rgb(25, 118, 210)' }, { label: 'CBC', data: get_static(cbc_bits), borderColor: 'rgb(255, 0, 0)', backgroundColor: 'rgb(255, 0, 0)' }]);
    show_gist(document.getElementById("p_ofb_hist"), labels, [{ label: 'P', data: get_static(p_bits), borderColor: 'rgb(25, 118, 210)', backgroundColor: 'rgb(25, 118, 210)' }, { label: 'OFB', data: get_static(ofb_bits), borderColor: 'rgb(255, 0, 0)', backgroundColor: 'rgb(255, 0, 0)' }]);
    show_gist(document.getElementById("p_cfb_hist"), labels, [{ label: 'P', data: get_static(p_bits), borderColor: 'rgb(25, 118, 210)', backgroundColor: 'rgb(25, 118, 210)' }, { label: 'CFB', data: get_static(cfb_bits), borderColor: 'rgb(255, 0, 0)', backgroundColor: 'rgb(255, 0, 0)' }]);
}

p_data.addEventListener("change", update_result);
k_data.addEventListener("change", update_result);

update_result();