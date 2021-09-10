const fs = require("fs").promises;;
const crypto = require('crypto')
var flag = false
var counter = 0;
const path = process.cwd();
fs.readdir(path + "/source").then((path) => {
    path.forEach((filepath) => {

        fs.readFile("source/"+filepath, "utf-8").then((content) => {
            // console.log(isJSON(content))
            if (isJSON(content)) {
                var data = JSON.parse(content)
                var notes = data.timeline.notes
                var noteLines = data.timeline.noteLines

                // console.log(noteLines)
                noteLines.forEach(element => {
                    var head_index = notes.findIndex((innner_element) => {
                        return innner_element.guid === element.head
                    })
                    // console.log("head: " + head_index)
                    // if(notes[head_index].type== "hold"||"above-slide"){

                    // }else{
                    //     console.log("failed")
                    // }
                    var tail_index = notes.findIndex((innner_element) => {
                        return innner_element.guid === element.tail
                    })
                    // console.log("tail: " + tail_index)
                    var head_note = notes[head_index]
                    var tail_note = notes[tail_index]

                    //slideノーツに8分を加える&スライド判定
                    var slide_judge_note_timing_array = new Array()
                    var duration = tail_note.editorProps.time - head_note.editorProps.time
                    flag = false
                    var head_timing = new Fraction(head_note.measureIndex * head_note.measurePosition.denominator + head_note.measurePosition.numerator, head_note.measurePosition.denominator)
                    // console.log(head_timing)
                    var tail_timing = new Fraction(tail_note.measureIndex * tail_note.measurePosition.denominator + tail_note.measurePosition.numerator, tail_note.measurePosition.denominator)
                    // console.log(tail_timing)
                    var slide_judge_note_timing = head_timing

                    var slide_horizontal_head = new Fraction(head_note.horizontalPosition.numerator, head_note.horizontalPosition.denominator)
                    var slide_horizontal_tail = new Fraction(tail_note.horizontalPosition.numerator, tail_note.horizontalPosition.denominator)
                    var slide_distance = slide_horizontal_tail
                    slide_distance.subtract(slide_horizontal_head)

                    var slide_size_head = head_note.horizontalSize
                    var slide_size_tail = tail_note.horizontalSize
                    var slide_size_change = tail_note.horizontalSize - head_note.horizontalSize

                    // console.log(slide_distance)
                    // console.log(slide_size_change)
                    while (flag === false) {

                        slide_judge_note_timing.add(new Fraction(1, 8))
                        if (slide_judge_note_timing.num / slide_judge_note_timing.den >= tail_timing.num / tail_timing.den) {
                            flag = true
                            var j = 1;
                            slide_judge_note_timing_array.forEach((hjnt) => {

                                hjnt.editorProps.time = head_note.editorProps.time + duration / (slide_judge_note_timing_array.length + 1) * j
                                hjnt.horizontalSize = Math.floor(head_note.horizontalSize + (slide_size_change / (slide_judge_note_timing_array.length + 1) * j))
                                var horizontal_calc = slide_horizontal_head

                                var horizontal_move = slide_distance
                                horizontal_move.divide(counter + 1, 1)
                                horizontal_calc.add(horizontal_move.multiply(j, 1))
                                hjnt.horizontalPosition.numerator = horizontal_calc.num
                                hjnt.horizontalPosition.denominator = horizontal_calc.den
                                if (Math.floor(head_note.horizontalSize + (slide_size_change / (slide_judge_note_timing_array.length + 1) * j)) < 0) {
                                    console.log("Attention! :" + Math.floor(head_note.horizontalSize + (slide_size_change / (slide_judge_note_timing_array.length + 1) * j)) + " : " + head_note.horizontalSize + " " + tail_note.horizontalSize)
                                }
                                j++
                            })
                        } else {
                            const S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
                            const N = 32
                            var guid = Array.from(crypto.randomFillSync(new Uint8Array(N))).map((n) => S[n % S.length]).join('')
                            var slide_judge_note = {
                                "guid": guid,
                                "editorProps": {
                                    "time": null
                                },
                                "measureIndex": Math.floor(slide_judge_note_timing.num / slide_judge_note_timing.den),
                                "measurePosition": {
                                    "numerator": slide_judge_note_timing.num % slide_judge_note_timing.den,
                                    "denominator": slide_judge_note_timing.den
                                },
                                "horizontalSize": null,
                                "horizontalPosition": {
                                    "numerator": null,
                                    "denominator": null
                                },
                                "type": head_note.type + "-judge-note",
                                "speed": head_note.speed,
                                "lane": head_note.lane,
                                "layer": head_note.layer,
                                "customProps": {}
                            }
                            slide_judge_note_timing_array.push(slide_judge_note)
                            notes.push(slide_judge_note)

                        }
                        counter++
                    }

                    //  console.log(slide_judge_note_timing_array)

                });
                notes.sort((a, b) => {
                    if (a.editorProps.time < b.editorProps.time) return -1;
                    if (a.editorProps.time > b.editorProps.time) return 1;
                    return 0;
                })
                data.timeline.notes = notes
                fs.writeFile("result/"+"ena_"+filepath, "").then(() => {
                    fs.writeFile("result/"+"ena_"+filepath, JSON.stringify(data,null , "\t")).then(() => {
                        console.log("done")
                    }).catch((err) => {
                        console.log(err)
                    })
                })

            }else{
                console.log("ERR: source/"+filepath+" is not a JSON file.")
            }

        });
    })

});

function isJSON(arg) {
    arg = (typeof arg === "function") ? arg() : arg;
    if (typeof arg !== "string") {
        return false;
    } try {
        arg = (!JSON) ? eval("(" + arg + ")") : JSON.parse(arg);
        return true;
    } catch (e) {
        return false;
    }
};

var Fraction = function (num, den) {
    var isFraction = num instanceof arguments.callee;
    this.num = Number(isFraction ? num.num : num || 0);
    this.den = Number(isFraction ? num.den : den || 1);
    this.reduce();
};

Fraction.prototype.valueOf = function () { return this.num / this.den; };
Fraction.prototype.toString = function () { return this.num + ' / ' + this.den; };

/** 約分 */
Fraction.prototype.reduce = function () {
    var num = Math.abs(this.num), den = Math.abs(this.den);
    if (!isFinite(num) || !isFinite(den) || den === 0) throw 'Error';    //XXX
    if (num) {
        var sign = this.num / num * this.den / den;
        while ((num % 1) || (den % 1)) { num *= 10; den *= 10; }  //整数化
        var r, m = Math.max(num, den), n = Math.min(num, den);    //互除法
        while (r = m % n) { m = n; n = r; }
        this.num = sign * num / n;
        this.den = den / n;
    } else {
        this.num = 0;
        this.den = 1;
    }
};

/** 加算 */
Fraction.prototype['+'] = Fraction.prototype.add = function (n) {
    n = new Fraction(n);

    this.num = this.num * n.den + n.num * this.den;
    this.den *= n.den;

    this.reduce();
};

/** 減算 */
Fraction.prototype['-'] = Fraction.prototype.subtract = function (n) {
    n = new Fraction(n);

    this.num = this.num * n.den - n.num * this.den;
    this.den *= n.den;

    this.reduce();
};

/** 乗算 */
Fraction.prototype['*'] = Fraction.prototype.multiply = function (n) {
    n = new Fraction(n);

    this.num *= n.num;
    this.den *= n.den;

    this.reduce();
};

/** 除算 */
Fraction.prototype['/'] = Fraction.prototype.divide = function (n) {
    n = new Fraction(n);

    this.num *= n.den;
    this.den *= n.num;

    this.reduce();
};