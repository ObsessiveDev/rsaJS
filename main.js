function getGcd(pInput, qInput) {
  let p = BigInt(pInput.value);
  let q = BigInt(qInput.value);

  while (q > 0) {
    r = p % q;
    p = q;
    q = r;
  }
  
  document.getElementById("gcdResult").innerHTML = p;
}
