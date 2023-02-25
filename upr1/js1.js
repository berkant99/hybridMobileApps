// ex1
// function sumNum(arr) {
//     let sum = 0;
//     arr.forEach(element => {
//         sum += parseInt(element)
//     });
//     return sum;
// }

// let arr = ["4","3","2"];

// console.log(sumNum(arr));

//ex2
// function calcVat(arr) {
//     let sum = 0, total = 0, vat;
//     arr.forEach(element => {
//         sum += parseInt(element)
//     });
//     vat = sum * 0.2;
//     total = sum * 1.2;
//     console.log(sum + " " + parseFloat(vat).toFixed(2) + " " + parseFloat(total).toFixed(2))
// }

// let arr = ["4.5", "15", "22.35"];

// calcVat(arr);

//ex3
// function strCount(arr) {
//     let str = arr[0],
//         letter = arr[1],
//         count = 0;

//     for (let i = 0; i < str.length; i++) {
//         if (str.charAt(i) == letter) {
//             count++;
//         }
//     }
//     console.log(count)
// }

// strCount(["Hello", "l"]);

//ex4
// function findArea(arr) {
//     let area1 = arr[2] * arr[3];
//     let area2 = (arr[1] - arr[3]) * arr[0];
//     let total = area1 + area2;
//     return total;
// }

// let arr = ["2", "4", "5", "3"];
// console.log(findArea(arr));

//ex5
// function isLeapYear(year) {
//     if (year % 4 == 0 && year % 100 != 0 && year % 400 == 0) {
//         console.log("Yes");
//     } else {
//         console.log("No");
//     }
// }

// isLeapYear(2023)

//ex6
// function printNum(num) {
//     let str = "";
//     for (let i = 1; i <= num; i++) {
//         str += i;
//     }
//     console.log(str)
// }

// printNum(10);

//ex7
// function findDistance(arr) {
//     let x1 = arr[0],
//         y1 = arr[1],
//         x2 = arr[2],
//         y2 = arr[3];
//     let distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
//     console.log(parseFloat(distance).toFixed(2));
// }

// let arr = ["1", "2", "4", "6"];
// findDistance(arr);

//ex8
// function boxes(n, k) {
//     let result = n / k;
//     console.log(Math.ceil(result));
// }

// boxes(20, 5);
// boxes(15, 7);
// boxes(5, 10);

//ex9
// function area(a, b, c) {
//     if (a + b <= c || a + c <= b || b + c <= a) {
//         console.log("Триъгълникът не съществува");
//     } else {
//         let p = a + b + c;
//         let s = Math.sqrt(p * (p - a) * (p - b) * (p - c));
//         console.log("Лицето на триъгълника е: " + parseFloat(s).toFixed(2));
//     }
// }

// area(4, 5, 6);

//ex10
// function volumeAndSurface(arr) {
//     let r = Number(arr[0]);
//     let h = Number(arr[1]);
//     let l = Math.sqrt((h * h) + (r * r));
//     let volume = 1/3*(Math.PI * Math.pow(r, 2) * h);
//     let surface = (Math.PI * r) * (r + l);
//     console.log("V = " + volume + "\nS = " + surface);
// }

// volumeAndSurface(["3","5"])

//ex11
// function oddOrEven(num) {
//     if (num % 2 == 0){
//         console.log("Even");
//     }else{
//         console.log("Odd");
//     }
// }

// oddOrEven(5);

//ex12
// function isPrime(num) {
//     if (num === 1) {
//         return false;
//     }
//     else if (num === 2) {
//         return true;
//     } else {
//         for (let i = 2; i < num; i++) {
//             if (num % i == 0) {
//                 return false;
//             }
//         }
//         return true;
//     }
// }

// console.log(isPrime(6));

//ex13
// function calcDistance(arr) {
//     let v1 = Number(arr[0]);
//     let v2 = Number(arr[1]);
//     let t = Number(arr[2]) / 3600;
//     let s1 = v1 * t;
//     let s2 = v2 * t;
//     let distance = 0;
//     if (s1 > s2) {
//         distance = s1 - s2;
//     } else {
//         distance = s2 - s1;
//     }
//     console.log(distance*1000)
// }

// calcDistance(["50","60","3600"]);

//ex14
// function arrToObj(arr) {
//     let obj = {};
//     for (let i = 0; i < arr.length; i+=2){
//         obj[arr[i]] = arr[i+1] || "";
//     }
//     console.log(obj);
// }

// arrToObj(['name', 'Pesho', 'age', '23', 'gender', 'male']);

//ex15
// function maxNum(arr) {
//     console.log(Math.max(...arr));
// }

// maxNum(["5","-3","10","1"]);

//ex16
// function calc(arr) {
//     let num1 = arr[0];
//     let num2 = arr[1];
//     let op = arr[2];
//     console.log(eval(num1 + op + num2))
// }

// calc(['7', '3', '-']);

//ex17
// function toUpper(str) {
//     let words = str.split(' ');
//     words.forEach(word => {
//         console.log(word.toUpperCase() + ", ");
//     });
// }

// toUpper("How are you?");