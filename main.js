function getRandomLength() {
  let array = new Uint8Array(1);
  crypto.getRandomValues(array);
  return array % 5;
}

function getRandomNumber(length) {
  let firstPositionValidChars = '123456789';
  let firstPositionValidCharsLength = 9;
  let restPositionValidChars = '0123456789';
  let restPositionValidCharsLength = 10;
  let firstPositionArray = new Uint8Array(1);
  let restPositionArray = new Uint8Array(length - 1);
  window.crypto.getRandomValues(firstPositionArray);
  window.crypto.getRandomValues(restPositionArray);
  firstPositionArray = firstPositionArray.map(x => firstPositionValidChars.charCodeAt(x % firstPositionValidCharsLength));
  restPositionArray = restPositionArray.map(x => restPositionValidChars.charCodeAt(x % restPositionValidCharsLength));
  let number = String.fromCharCode.apply(null, firstPositionArray);
  number += String.fromCharCode.apply(null, restPositionArray);
  number = BigInt(number);
  return number;
}

function getRandomOddNumber(length) {
  let firstPositionValidChars = '123456789';
  let firstPositionValidCharsLength = 9;
  let restPositionValidChars = '0123456789';
  let restPositionValidCharsLength = 10;
  let firstPositionArray = new Uint8Array(1);
  let restPositionArray = new Uint8Array(length - 1);
  window.crypto.getRandomValues(firstPositionArray);
  window.crypto.getRandomValues(restPositionArray);
  firstPositionArray = firstPositionArray.map(x => firstPositionValidChars.charCodeAt(x % firstPositionValidCharsLength));
  restPositionArray = restPositionArray.map(x => restPositionValidChars.charCodeAt(x % restPositionValidCharsLength));
  let number = String.fromCharCode.apply(null, firstPositionArray);
  number += String.fromCharCode.apply(null, restPositionArray);
  number = BigInt(number);
  if((number &1n) == 0n) {
    number++;
  }
  return number;
}

function euclidean(a, b) {
  return (!b) ? a : euclidean(b, a % b);
}

function extendedEuclidean(a, b) {
  let r = new Array(a, b), x = new Array(1n, 0n), y = new Array(0n, 1n), q;
  while(r[1] != 0n) {
    q = r[0] / r[1];
    r[2] = r[1];
    x[2] = x[1];
    y[2] = y[1];
    r[1] = r[0] - (q * r[1]);
    x[1] = x[0] - (q * x[1]);
    y[1] = y[0] - (q * y[1]);
    r[0] = r[2];
    x[0] = x[2];
    y[0] = y[2];
  }
  return y[0];
}

function modulo(base, power, mod) {
  let x = 1n, y = base, pow = power;
  while(pow > 0n) {
    if((pow & 1n) == 1n) {
      x = (x * y) % mod;
    }
    y = (y * y) % mod;
    pow >>= 1n;
  }
  return x;
}

function mulMod(base, multiplier, mod) {
  let x = 0n, y = base % mod, multi = multiplier;
  while(multi > 0n) {
    if((multi & 1n) == 1n) {
      x = (x + y) % mod;
    }
    y = (y * 2n) % mod;
    multi >>= 1n;
  }
  return x;
}


function millerRabin(p) {
  let i, s, a, temp, mod;
  s = p - 1n;
  while((s & 1n) == 0n) {
    s >>= 1n;
  }

  for(i = 0; i < 20; i++) {
    do {
      a = getRandomNumber(2) % (p - 1n) + 1n;
    } while((euclidean(a, p) != 1));
    temp = s;
    mod = modulo(a, temp, p);
    while(temp != p - 1n && mod != 1n && mod != p - 1n) {
      mod = mulMod(mod, mod, p);
      temp <<= 1n;
    }
    if(mod != p - 1n && (temp & 1n) == 0n) {
      return false;
    }
  }
  return true;
}

function encrypt() {
  var c = modulo(BigInt(document.getElementById("message").value), e, n);
  document.getElementById("c").innerHTML = c;
  var m = modulo(c, d, n);
  document.getElementById("m").innerHTML = m;
}

do {
  var p = getRandomOddNumber(3);
} while(!millerRabin(p));

do {
  var q = getRandomOddNumber(3);
} while(!millerRabin(q));

if(p < q) {
  let temp = p;
  p = q;
  q = temp;
}

document.getElementById("p").innerHTML = p;
document.getElementById("q").innerHTML = q;

var n = p * q;
document.getElementsByClassName("n")[0].innerHTML = n;
document.getElementsByClassName("n")[1].innerHTML = n;
document.getElementsByClassName("n")[2].innerHTML = n;
document.getElementsByClassName("n")[3].innerHTML = n;

var phi = (p - 1n) * (q - 1n);
document.getElementsByClassName("phi")[0].innerHTML = phi;
document.getElementsByClassName("phi")[1].innerHTML = phi;

do {
  var e = getRandomOddNumber(getRandomLength() + 2);
} while((euclidean(phi, e) != 1n));

document.getElementsByClassName("e")[0].innerHTML = e;
document.getElementsByClassName("e")[1].innerHTML = e;

var d = extendedEuclidean(phi, e);
if(d < 0n) {
  d += phi;
}
document.getElementsByClassName("d")[0].innerHTML = d;
document.getElementsByClassName("d")[1].innerHTML = d;
