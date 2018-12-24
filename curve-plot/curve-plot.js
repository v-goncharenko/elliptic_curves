'use strict';

const infPoint = {x: null, y: null};

function bezout(a, b) {
  // a > 0 && b > 0
  let prev = {a: null, x: 0, b: null, y: 1,                  r: b};
  let curr = {a: a,    x: 1, b: b,    y: -Math.trunc(a / b), r: a % b};
  while(curr.r !== 0) {
    const div = Math.trunc(curr.b / curr.r);
    const next = {
      a: curr.b,
      x: prev.x - div * curr.x,
      b: curr.r,
      y: prev.y - div * curr.y,
      r: curr.b - curr.r * div,
    };
    prev = curr;
    curr = next;
  }
  return [prev.x, prev.y];
}

function ecAdd(p, a, b, P, Q) {
  if(P.x === null) {
    return Q;
  } else if(Q.x === null) {
    return P;
  } else if(P.x === Q.x && P.y === Q.y) {
    if(P.y == 0) {
      return infPoint;
    }
    const denom = bezout(2 * P.y, p)[0] % p;
    let s = ((3 * P.x * P.x + a) * denom) % p;
    s = s >= 0 ? s : s + p;
    const Rx = (s * s - 2 * P.x) % p;
    const Ry = (- P.y - s * (Rx - P.x)) % p;
    return {
      x: Rx >= 0 ? Rx : Rx + p,
      y: Ry >= 0 ? Ry : Ry + p,
    };
  } else if(P.x === Q.x) {
    return infPoint;
  } else {
    const denom = bezout(P.x - Q.x + p, p)[0] % p;
    let s = ((P.y - Q.y) * denom) % p;
    s = s >= 0 ? s : s + p;
    const Rx = (s * s - P.x - Q.x) % p;
    const Ry = (- P.y - s * (Rx - P.x)) % p;
    return {
      x: Rx >= 0 ? Rx : Rx + p,
      y: Ry >= 0 ? Ry : Ry + p,
    };
  }
};

function ecMult(p, a, b, G, n) {
  let R = infPoint;
  for (let i = 0; i < n; i++) {
    R = ecAdd(p, a, b, R, G);
  }
  return R;
}

function checkMult(p, a, b, G, times) {
  for (let i = 0; i < times; i++) {
    console.log(i, ecMult(p, a, b, G, i));
  }
}

function ecSubgroup(p, a, b, G) {
  const S = [];
  let R = infPoint;
  while(true) {
    R = ecAdd(p, a, b, R, G);
    S.push(R);
    if(R === infPoint) {
      return S;
    }
  }
}

function range(start, stop, step) {
  let grid = [];
  for(let i = start; i < stop; i += step) {
    grid.push(i);
  }
  return grid;
}

function make_curve_points(p, a, b) {
  let X = []; 
  let Y = []; 
  let Y_roots = {};
  
  for (var i = 0; i < p; i++) {
    let square = Math.pow(i, 2) % p;
    if (square in Y_roots) {
      Y_roots[square].push(i)
    } else {
      Y_roots[square] = [i]
    }
  }

  for (var i = 0; i < p; i++) {
    let square = (Math.pow(i, 3) + a * i + b) % p
    if (square in Y_roots) {
      for (var j = 0; j < Y_roots[square].length; j++) {
        X.push(i)
        Y.push(Y_roots[square][j])
      }
    }
  }

  return {
    x: X,
    y: Y,
    mode: 'markers', 
    name: 'Elliptic curve', 
    marker: {
      color: 'rgb(255, 217, 102)', 
      size: 12,
    }, 
    type: 'scatter'
  };
}
