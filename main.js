const numberLength = 3;
const millerNumberLength = 3;

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
  if((number & 1n) == 0n) {
    number++;
  }
  return number;
}

function gcd(a, b) {
  return (!b) ? a : gcd(b, a % b);
}

function egcd(a, b) {
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
  return new Array(x[0], y[0]);
}

function modulo(base, power, mod) {
  let x = 1n, y = base, pow = power;
  while(pow > 0n) {
    if((pow & 1n) == 1n) {
      x = mulMod(x, y, mod);
    }
    y = mulMod(y, y, mod);
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
  let i, d, a, temp, mod;
  d = p - 1n;
  while((d & 1n) == 0n) {
    d >>= 1n;
  }

  for(i = 0; i < 20; i++) {
    do {
      a = getRandomNumber(millerNumberLength) % (p - 1n) + 1n;
    } while((gcd(a, p) != 1));
    temp = d;
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

do {
  do {
    var p = getRandomOddNumber(numberLength);
  } while(!millerRabin(p));
  
  do {
    var q = getRandomOddNumber(numberLength);
  } while(!millerRabin(q));
  
  if(p < q) {
    let temp = p;
    p = q;
    q = temp;
  }
} while(gcd(p, q) != 1n);

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
  var e = (getRandomOddNumber(getRandomLength() + 2) % phi);
} while((gcd(phi, e) != 1n));
document.getElementsByClassName("e")[0].innerHTML = e;
document.getElementsByClassName("e")[1].innerHTML = e;

var d = egcd(phi, e)[1];
if(d < 0n) {
  d += phi;
}

function encrypt() {
  var c = modulo(BigInt(document.getElementById("message").value), e, n);
  document.getElementById("c").innerHTML = c;
  var mVer1 = modulo(c, d, n);
  document.getElementById("mVer1").innerHTML = mVer1;
  var mVer2 = decrypt(c);
  document.getElementById("mVer2").innerHTML = mVer2;
}

function decrypt(c) {
  let mp = modulo(c, d % (p - 1n), p);
  let mq = modulo(c, d % (q - 1n), q);
  let array = egcd(p, q);
  let res = (mp * array[1] * q + mq * array[0] * p) % n;
  if(res < 0) {
    res += n;
  }
  return res;
}

document.getElementsByClassName("d")[0].innerHTML = d;
document.getElementsByClassName("d")[1].innerHTML = d;

document.getElementById("message").addEventListener("keyup", function(event) {
  event.preventDefault();
  if (event.keyCode === 13) {
      document.getElementById("messageBtn").click();
  }
});
