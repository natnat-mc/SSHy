var wsproxyURL = 'wsproxy.codinget.me'
var wsproxyEncoding = 'base64'
var title = 'SSHy.codinget.me'
var defaultHost = 'desktop.codinget.me'
var defaultLogin = 'codinget'
var wsproxyPorts = { ws: 80, wss: 443 }
var wsproxyProto = 'ws'

var ws,
	transport,
	settings,
	term = null
var fitAddon = null

// Test IE 11
if (window.msCrypto) {
	// Redirect window.crypto.getRandomValues() -> window.msCrypto.getRandomValues()
	window.crypto = {}
	window.crypto.getRandomValues = function (a) {
		return window.msCrypto.getRandomValues(a)
	}

	// PolyFill Uint8Array.slice() for IE 11 for sjcl AES
	if (!Uint8Array.prototype.slice) {
		Object.defineProperty(Uint8Array.prototype, 'slice', {
			value: Array.prototype.slice,
		})
	}
}

var resizeInterval
SSHyClient = {
    // Global Defines
    MSG_DISCONNECT: 1,
    MSG_IGNORE: 2,
    MSG_UNIMPLEMENTED: 3,
    MSG_DEBUG: 4,
    MSG_SERVICE_REQUEST: 5,
    MSG_SERVICE_ACCEPT: 6,

    MSG_KEX_INIT: 20,
    MSG_NEW_KEYS: 21,
    MSG_KEXDH_INIT: 30,
    MSG_KEXDH_GEX_GROUP: 31,
    MSG_KEXDH_GEX_INIT: 32,
    MSG_KEXDH_GEX_REPLY: 33,
    MSG_KEXDH_GEX_REQUEST: 34,

    MSG_USERAUTH_REQUEST: 50,
    MSG_USERAUTH_FAILURE: 51,
    MSG_USERAUTH_SUCCESS: 52,
    MSG_USERAUTH_BANNER: 53,

    MSG_GLOBAL_REQUEST: 80,
    MSG_REQUEST_SUCCESS: 81,
    MSG_REQUEST_FAILURE: 82,

    MSG_CHANNEL_OPEN: 90,
    MSG_CHANNEL_OPEN_SUCCESS: 91,
    MSG_CHANNEL_OPEN_FAILURE: 92,
    MSG_CHANNEL_WINDOW_ADJUST: 93,
    MSG_CHANNEL_DATA: 94,
    MSG_CHANNEL_EXTENDED_DATA: 95,
    MSG_CHANNEL_EOF: 96,
    MSG_CHANNEL_CLOSE: 97,
    MSG_CHANNEL_REQUEST: 98,
    MSG_CHANNEL_SUCCESS: 99,
    MSG_CHANNEL_FAILURE: 100,

    WINDOW_SIZE: 40674, // Coppied from Putty
    MAX_PACKET_SIZE: 16384,

    AES_CBC: 2,
    AES_CTR: 6,

	/* Fish Binding */
	fishFsHintLeave: "\x1b\x5b\x33\x32",
	/* Bash Binding */
	bashFsHintLeave: "\x1b\x5d\x30\x3b"
};
var BigInteger = function() {
        function e(a, b, c) {
            null != a && ("number" == typeof a ? this.fromNumber(a, b, c) : null == b && "string" != typeof a ? this.fromString(a, 256) : this.fromString(a, b))
        }

        function l() {
            return new e(null)
        }

        function F(a, b, c, d, k, e) {
            for (; 0 <= --e;) {
                var f = b * this[a++] + c[d] + k;
                k = Math.floor(f / 67108864);
                c[d++] = f & 67108863
            }
            return k
        }

        function G(a, b, c, d, k, e) {
            var f = b & 32767;
            for (b >>= 15; 0 <= --e;) {
                var g = this[a] & 32767,
                    l = this[a++] >> 15,
                    m = b * g + l * f,
                    g = f * g + ((m & 32767) << 15) + c[d] + (k & 1073741823);
                k = (g >>> 30) + (m >>> 15) + b * l + (k >>> 30);
                c[d++] =
                    g & 1073741823
            }
            return k
        }

        function H(a, b, c, d, k, e) {
            var f = b & 16383;
            for (b >>= 14; 0 <= --e;) {
                var g = this[a] & 16383,
                    l = this[a++] >> 14,
                    m = b * g + l * f,
                    g = f * g + ((m & 16383) << 14) + c[d] + k;
                k = (g >> 28) + (m >> 14) + b * l;
                c[d++] = g & 268435455
            }
            return k
        }

        function B(a, b) {
            var c = y[a.charCodeAt(b)];
            return null == c ? -1 : c
        }

        function t(a) {
            var b = l();
            b.fromInt(a);
            return b
        }

        function z(a) {
            var b = 1,
                c;
            0 != (c = a >>> 16) && (a = c, b += 16);
            0 != (c = a >> 8) && (a = c, b += 8);
            0 != (c = a >> 4) && (a = c, b += 4);
            0 != (c = a >> 2) && (a = c, b += 2);
            0 != a >> 1 && (b += 1);
            return b
        }

        function u(a) {
            this.m = a
        }

        function w(a) {
            this.m =
                a;
            this.mp = a.invDigit();
            this.mpl = this.mp & 32767;
            this.mph = this.mp >> 15;
            this.um = (1 << a.DB - 15) - 1;
            this.mt2 = 2 * a.t
        }

        function I(a, b) {
            return a & b
        }

        function A(a, b) {
            return a | b
        }

        function C(a, b) {
            return a ^ b
        }

        function D(a, b) {
            return a & ~b
        }

        function v() {}

        function E(a) {
            return a
        }

        function x(a) {
            this.r2 = l();
            this.q3 = l();
            e.ONE.dlShiftTo(2 * a.t, this.r2);
            this.mu = this.r2.divide(a);
            this.m = a
        }
        var m;
        "Microsoft Internet Explorer" == navigator.appName ? (e.prototype.am = G, m = 30) : "Netscape" != navigator.appName ? (e.prototype.am = F, m = 26) : (e.prototype.am =
            H, m = 28);
        e.prototype.DB = m;
        e.prototype.DM = (1 << m) - 1;
        e.prototype.DV = 1 << m;
        e.prototype.FV = Math.pow(2, 52);
        e.prototype.F1 = 52 - m;
        e.prototype.F2 = 2 * m - 52;
        var y = [],
            n;
        m = 48;
        for (n = 0; 9 >= n; ++n) y[m++] = n;
        m = 97;
        for (n = 10; 36 > n; ++n) y[m++] = n;
        m = 65;
        for (n = 10; 36 > n; ++n) y[m++] = n;
        u.prototype.convert = function(a) {
            return 0 > a.s || 0 <= a.compareTo(this.m) ? a.mod(this.m) : a
        };
        u.prototype.revert = function(a) {
            return a
        };
        u.prototype.reduce = function(a) {
            a.divRemTo(this.m, null, a)
        };
        u.prototype.mulTo = function(a, b, c) {
            a.multiplyTo(b, c);
            this.reduce(c)
        };
        u.prototype.sqrTo =
            function(a, b) {
                a.squareTo(b);
                this.reduce(b)
            };
        w.prototype.convert = function(a) {
            var b = l();
            a.abs().dlShiftTo(this.m.t, b);
            b.divRemTo(this.m, null, b);
            0 > a.s && 0 < b.compareTo(e.ZERO) && this.m.subTo(b, b);
            return b
        };
        w.prototype.revert = function(a) {
            var b = l();
            a.copyTo(b);
            this.reduce(b);
            return b
        };
        w.prototype.reduce = function(a) {
            for (; a.t <= this.mt2;) a[a.t++] = 0;
            for (var b = 0; b < this.m.t; ++b) {
                var c = a[b] & 32767,
                    d = c * this.mpl + ((c * this.mph + (a[b] >> 15) * this.mpl & this.um) << 15) & a.DM,
                    c = b + this.m.t;
                for (a[c] += this.m.am(0, d, a, b, 0, this.m.t); a[c] >=
                    a.DV;) a[c] -= a.DV, a[++c]++
            }
            a.clamp();
            a.drShiftTo(this.m.t, a);
            0 <= a.compareTo(this.m) && a.subTo(this.m, a)
        };
        w.prototype.mulTo = function(a, b, c) {
            a.multiplyTo(b, c);
            this.reduce(c)
        };
        w.prototype.sqrTo = function(a, b) {
            a.squareTo(b);
            this.reduce(b)
        };
        e.prototype.copyTo = function(a) {
            for (var b = this.t - 1; 0 <= b; --b) a[b] = this[b];
            a.t = this.t;
            a.s = this.s
        };
        e.prototype.fromInt = function(a) {
            this.t = 1;
            this.s = 0 > a ? -1 : 0;
            0 < a ? this[0] = a : -1 > a ? this[0] = a + DV : this.t = 0
        };
        e.prototype.fromString = function(a, b) {
            var c;
            if (16 == b) c = 4;
            else if (8 == b) c = 3;
            else if (256 ==
                b) c = 8;
            else if (2 == b) c = 1;
            else if (32 == b) c = 5;
            else if (4 == b) c = 2;
            else {
                this.fromRadix(a, b);
                return
            }
            this.s = this.t = 0;
            for (var d = a.length, k = !1, f = 0; 0 <= --d;) {
                var h = 8 == c ? a[d] & 255 : B(a, d);
                0 > h ? "-" == a.charAt(d) && (k = !0) : (k = !1, 0 == f ? this[this.t++] = h : f + c > this.DB ? (this[this.t - 1] |= (h & (1 << this.DB - f) - 1) << f, this[this.t++] = h >> this.DB - f) : this[this.t - 1] |= h << f, f += c, f >= this.DB && (f -= this.DB))
            }
            8 == c && 0 != (a[0] & 128) && (this.s = -1, 0 < f && (this[this.t - 1] |= (1 << this.DB - f) - 1 << f));
            this.clamp();
            k && e.ZERO.subTo(this, this)
        };
        e.prototype.clamp = function() {
            for (var a =
                    this.s & this.DM; 0 < this.t && this[this.t - 1] == a;) --this.t
        };
        e.prototype.dlShiftTo = function(a, b) {
            var c;
            for (c = this.t - 1; 0 <= c; --c) b[c + a] = this[c];
            for (c = a - 1; 0 <= c; --c) b[c] = 0;
            b.t = this.t + a;
            b.s = this.s
        };
        e.prototype.drShiftTo = function(a, b) {
            for (var c = a; c < this.t; ++c) b[c - a] = this[c];
            b.t = Math.max(this.t - a, 0);
            b.s = this.s
        };
        e.prototype.lShiftTo = function(a, b) {
            var c = a % this.DB,
                d = this.DB - c,
                e = (1 << d) - 1,
                f = Math.floor(a / this.DB),
                h = this.s << c & this.DM,
                g;
            for (g = this.t - 1; 0 <= g; --g) b[g + f + 1] = this[g] >> d | h, h = (this[g] & e) << c;
            for (g = f - 1; 0 <= g; --g) b[g] =
                0;
            b[f] = h;
            b.t = this.t + f + 1;
            b.s = this.s;
            b.clamp()
        };
        e.prototype.rShiftTo = function(a, b) {
            b.s = this.s;
            var c = Math.floor(a / this.DB);
            if (c >= this.t) b.t = 0;
            else {
                var d = a % this.DB,
                    e = this.DB - d,
                    f = (1 << d) - 1;
                b[0] = this[c] >> d;
                for (var h = c + 1; h < this.t; ++h) b[h - c - 1] |= (this[h] & f) << e, b[h - c] = this[h] >> d;
                0 < d && (b[this.t - c - 1] |= (this.s & f) << e);
                b.t = this.t - c;
                b.clamp()
            }
        };
        e.prototype.subTo = function(a, b) {
            for (var c = 0, d = 0, e = Math.min(a.t, this.t); c < e;) d += this[c] - a[c], b[c++] = d & this.DM, d >>= this.DB;
            if (a.t < this.t) {
                for (d -= a.s; c < this.t;) d += this[c], b[c++] =
                    d & this.DM, d >>= this.DB;
                d += this.s
            } else {
                for (d += this.s; c < a.t;) d -= a[c], b[c++] = d & this.DM, d >>= this.DB;
                d -= a.s
            }
            b.s = 0 > d ? -1 : 0; - 1 > d ? b[c++] = this.DV + d : 0 < d && (b[c++] = d);
            b.t = c;
            b.clamp()
        };
        e.prototype.multiplyTo = function(a, b) {
            var c = this.abs(),
                d = a.abs(),
                k = c.t;
            for (b.t = k + d.t; 0 <= --k;) b[k] = 0;
            for (k = 0; k < d.t; ++k) b[k + c.t] = c.am(0, d[k], b, k, 0, c.t);
            b.s = 0;
            b.clamp();
            this.s != a.s && e.ZERO.subTo(b, b)
        };
        e.prototype.squareTo = function(a) {
            for (var b = this.abs(), c = a.t = 2 * b.t; 0 <= --c;) a[c] = 0;
            for (c = 0; c < b.t - 1; ++c) {
                var d = b.am(c, b[c], a, 2 * c, 0, 1);
                (a[c +
                    b.t] += b.am(c + 1, 2 * b[c], a, 2 * c + 1, d, b.t - c - 1)) >= b.DV && (a[c + b.t] -= b.DV, a[c + b.t + 1] = 1)
            }
            0 < a.t && (a[a.t - 1] += b.am(c, b[c], a, 2 * c, 0, 1));
            a.s = 0;
            a.clamp()
        };
        e.prototype.divRemTo = function(a, b, c) {
            var d = a.abs();
            if (!(0 >= d.t)) {
                var k = this.abs();
                if (k.t < d.t) null != b && b.fromInt(0), null != c && this.copyTo(c);
                else {
                    null == c && (c = l());
                    var f = l(),
                        h = this.s;
                    a = a.s;
                    var g = this.DB - z(d[d.t - 1]);
                    0 < g ? (d.lShiftTo(g, f), k.lShiftTo(g, c)) : (d.copyTo(f), k.copyTo(c));
                    d = f.t;
                    k = f[d - 1];
                    if (0 != k) {
                        var m = k * (1 << this.F1) + (1 < d ? f[d - 2] >> this.F2 : 0),
                            p = this.FV / m,
                            m = (1 <<
                                this.F1) / m,
                            n = 1 << this.F2,
                            r = c.t,
                            t = r - d,
                            q = null == b ? l() : b;
                        f.dlShiftTo(t, q);
                        0 <= c.compareTo(q) && (c[c.t++] = 1, c.subTo(q, c));
                        e.ONE.dlShiftTo(d, q);
                        for (q.subTo(f, f); f.t < d;) f[f.t++] = 0;
                        for (; 0 <= --t;) {
                            var u = c[--r] == k ? this.DM : Math.floor(c[r] * p + (c[r - 1] + n) * m);
                            if ((c[r] += f.am(0, u, c, t, 0, d)) < u)
                                for (f.dlShiftTo(t, q), c.subTo(q, c); c[r] < --u;) c.subTo(q, c)
                        }
                        null != b && (c.drShiftTo(d, b), h != a && e.ZERO.subTo(b, b));
                        c.t = d;
                        c.clamp();
                        0 < g && c.rShiftTo(g, c);
                        0 > h && e.ZERO.subTo(c, c)
                    }
                }
            }
        };
        e.prototype.invDigit = function() {
            if (1 > this.t) return 0;
            var a =
                this[0];
            if (0 == (a & 1)) return 0;
            var b = a & 3,
                b = b * (2 - (a & 15) * b) & 15,
                b = b * (2 - (a & 255) * b) & 255,
                b = b * (2 - ((a & 65535) * b & 65535)) & 65535,
                b = b * (2 - a * b % this.DV) % this.DV;
            return 0 < b ? this.DV - b : -b
        };
        e.prototype.isEven = function() {
            return 0 == (0 < this.t ? this[0] & 1 : this.s)
        };
        e.prototype.exp = function(a, b) {
            if (4294967295 < a || 1 > a) return e.ONE;
            var c = l(),
                d = l(),
                k = b.convert(this),
                f = z(a) - 1;
            for (k.copyTo(c); 0 <= --f;)
                if (b.sqrTo(c, d), 0 < (a & 1 << f)) b.mulTo(d, k, c);
                else var h = c,
                    c = d,
                    d = h;
            return b.revert(c)
        };
        e.prototype.toString = function(a) {
            if (0 > this.s) return "-" +
                this.negate().toString(a);
            if (16 == a) a = 4;
            else if (8 == a) a = 3;
            else if (2 == a) a = 1;
            else if (32 == a) a = 5;
            else if (4 == a) a = 2;
            else return this.toRadix(a);
            var b = (1 << a) - 1,
                c, d = !1,
                e = "",
                f = this.t,
                h = this.DB - f * this.DB % a;
            if (0 < f--)
                for (h < this.DB && 0 < (c = this[f] >> h) && (d = !0, e = "0123456789abcdefghijklmnopqrstuvwxyz".charAt(c)); 0 <= f;) h < a ? (c = (this[f] & (1 << h) - 1) << a - h, c |= this[--f] >> (h += this.DB - a)) : (c = this[f] >> (h -= a) & b, 0 >= h && (h += this.DB, --f)), 0 < c && (d = !0), d && (e += "0123456789abcdefghijklmnopqrstuvwxyz".charAt(c));
            return d ? e : "0"
        };
        e.prototype.negate =
            function() {
                var a = l();
                e.ZERO.subTo(this, a);
                return a
            };
        e.prototype.abs = function() {
            return 0 > this.s ? this.negate() : this
        };
        e.prototype.compareTo = function(a) {
            var b = this.s - a.s;
            if (0 != b) return b;
            var c = this.t,
                b = c - a.t;
            if (0 != b) return b;
            for (; 0 <= --c;)
                if (0 != (b = this[c] - a[c])) return b;
            return 0
        };
        e.prototype.bitLength = function() {
            return 0 >= this.t ? 0 : this.DB * (this.t - 1) + z(this[this.t - 1] ^ this.s & this.DM)
        };
        e.prototype.mod = function(a) {
            var b = l();
            this.abs().divRemTo(a, null, b);
            0 > this.s && 0 < b.compareTo(e.ZERO) && a.subTo(b, b);
            return b
        };
        e.prototype.modPowInt = function(a, b) {
            var c;
            c = 256 > a || b.isEven() ? new u(b) : new w(b);
            return this.exp(a, c)
        };
        e.ZERO = t(0);
        e.ONE = t(1);
        v.prototype.convert = E;
        v.prototype.revert = E;
        v.prototype.mulTo = function(a, b, c) {
            a.multiplyTo(b, c)
        };
        v.prototype.sqrTo = function(a, b) {
            a.squareTo(b)
        };
        x.prototype.convert = function(a) {
            if (0 > a.s || a.t > 2 * this.m.t) return a.mod(this.m);
            if (0 > a.compareTo(this.m)) return a;
            var b = l();
            a.copyTo(b);
            this.reduce(b);
            return b
        };
        x.prototype.revert = function(a) {
            return a
        };
        x.prototype.reduce = function(a) {
            a.drShiftTo(this.m.t -
                1, this.r2);
            a.t > this.m.t + 1 && (a.t = this.m.t + 1, a.clamp());
            this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
            for (this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2); 0 > a.compareTo(this.r2);) a.dAddOffset(1, this.m.t + 1);
            for (a.subTo(this.r2, a); 0 <= a.compareTo(this.m);) a.subTo(this.m, a)
        };
        x.prototype.mulTo = function(a, b, c) {
            a.multiplyTo(b, c);
            this.reduce(c)
        };
        x.prototype.sqrTo = function(a, b) {
            a.squareTo(b);
            this.reduce(b)
        };
        var p = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109,
                113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509
            ],
            J = 67108864 / p[p.length - 1];
        e.prototype.chunkSize = function(a) {
            return Math.floor(Math.LN2 * this.DB / Math.log(a))
        };
        e.prototype.toRadix = function(a) {
            null == a && (a = 10);
            if (0 == this.signum() || 2 > a || 36 < a) return "0";
            var b = this.chunkSize(a),
                b = Math.pow(a,
                    b),
                c = t(b),
                d = l(),
                e = l(),
                f = "";
            for (this.divRemTo(c, d, e); 0 < d.signum();) f = (b + e.intValue()).toString(a).substr(1) + f, d.divRemTo(c, d, e);
            return e.intValue().toString(a) + f
        };
        e.prototype.fromRadix = function(a, b) {
            this.fromInt(0);
            null == b && (b = 10);
            for (var c = this.chunkSize(b), d = Math.pow(b, c), k = !1, f = 0, h = 0, g = 0; g < a.length; ++g) {
                var l = B(a, g);
                0 > l ? "-" == a.charAt(g) && 0 == this.signum() && (k = !0) : (h = b * h + l, ++f >= c && (this.dMultiply(d), this.dAddOffset(h, 0), h = f = 0))
            }
            0 < f && (this.dMultiply(Math.pow(b, f)), this.dAddOffset(h, 0));
            k && e.ZERO.subTo(this,
                this)
        };
        e.prototype.fromNumber = function(a, b, c) {
            if ("number" == typeof b)
                if (2 > a) this.fromInt(1);
                else
                    for (this.fromNumber(a, c), this.testBit(a - 1) || this.bitwiseTo(e.ONE.shiftLeft(a - 1), A, this), this.isEven() && this.dAddOffset(1, 0); !this.isProbablePrime(b);) this.dAddOffset(2, 0), this.bitLength() > a && this.subTo(e.ONE.shiftLeft(a - 1), this);
            else {
                c = [];
                var d = a & 7;
                c.length = (a >> 3) + 1;
                b.nextBytes(c);
                c[0] = 0 < d ? c[0] & (1 << d) - 1 : 0;
                this.fromString(c, 256)
            }
        };
        e.prototype.bitwiseTo = function(a, b, c) {
            var d, e, f = Math.min(a.t, this.t);
            for (d =
                0; d < f; ++d) c[d] = b(this[d], a[d]);
            if (a.t < this.t) {
                e = a.s & this.DM;
                for (d = f; d < this.t; ++d) c[d] = b(this[d], e);
                c.t = this.t
            } else {
                e = this.s & this.DM;
                for (d = f; d < a.t; ++d) c[d] = b(e, a[d]);
                c.t = a.t
            }
            c.s = b(this.s, a.s);
            c.clamp()
        };
        e.prototype.changeBit = function(a, b) {
            var c = e.ONE.shiftLeft(a);
            this.bitwiseTo(c, b, c);
            return c
        };
        e.prototype.addTo = function(a, b) {
            for (var c = 0, d = 0, e = Math.min(a.t, this.t); c < e;) d += this[c] + a[c], b[c++] = d & this.DM, d >>= this.DB;
            if (a.t < this.t) {
                for (d += a.s; c < this.t;) d += this[c], b[c++] = d & this.DM, d >>= this.DB;
                d += this.s
            } else {
                for (d +=
                    this.s; c < a.t;) d += a[c], b[c++] = d & this.DM, d >>= this.DB;
                d += a.s
            }
            b.s = 0 > d ? -1 : 0;
            0 < d ? b[c++] = d : -1 > d && (b[c++] = this.DV + d);
            b.t = c;
            b.clamp()
        };
        e.prototype.dMultiply = function(a) {
            this[this.t] = this.am(0, a - 1, this, 0, 0, this.t);
            ++this.t;
            this.clamp()
        };
        e.prototype.dAddOffset = function(a, b) {
            if (0 != a) {
                for (; this.t <= b;) this[this.t++] = 0;
                for (this[b] += a; this[b] >= this.DV;) this[b] -= this.DV, ++b >= this.t && (this[this.t++] = 0), ++this[b]
            }
        };
        e.prototype.multiplyLowerTo = function(a, b, c) {
            var d = Math.min(this.t + a.t, b);
            c.s = 0;
            for (c.t = d; 0 < d;) c[--d] =
                0;
            var e;
            for (e = c.t - this.t; d < e; ++d) c[d + this.t] = this.am(0, a[d], c, d, 0, this.t);
            for (e = Math.min(a.t, b); d < e; ++d) this.am(0, a[d], c, d, 0, b - d);
            c.clamp()
        };
        e.prototype.multiplyUpperTo = function(a, b, c) {
            --b;
            var d = c.t = this.t + a.t - b;
            for (c.s = 0; 0 <= --d;) c[d] = 0;
            for (d = Math.max(b - this.t, 0); d < a.t; ++d) c[this.t + d - b] = this.am(b - d, a[d], c, 0, 0, this.t + d - b);
            c.clamp();
            c.drShiftTo(1, c)
        };
        e.prototype.modInt = function(a) {
            if (0 >= a) return 0;
            var b = this.DV % a,
                c = 0 > this.s ? a - 1 : 0;
            if (0 < this.t)
                if (0 == b) c = this[0] % a;
                else
                    for (var d = this.t - 1; 0 <= d; --d) c = (b *
                        c + this[d]) % a;
            return c
        };
        e.prototype.millerRabin = function(a) {
            var b = this.subtract(e.ONE),
                c = b.getLowestSetBit();
            if (0 >= c) return !1;
            var d = b.shiftRight(c);
            a = a + 1 >> 1;
            a > p.length && (a = p.length);
            for (var k = l(), f = 0; f < a; ++f) {
                k.fromInt(p[f]);
                var h = k.modPow(d, this);
                if (0 != h.compareTo(e.ONE) && 0 != h.compareTo(b)) {
                    for (var g = 1; g++ < c && 0 != h.compareTo(b);)
                        if (h = h.modPowInt(2, this), 0 == h.compareTo(e.ONE)) return !1;
                    if (0 != h.compareTo(b)) return !1
                }
            }
            return !0
        };
        e.prototype.clone = function() {
            var a = l();
            this.copyTo(a);
            return a
        };
        e.prototype.intValue =
            function() {
                if (0 > this.s) {
                    if (1 == this.t) return this[0] - this.DV;
                    if (0 == this.t) return -1
                } else {
                    if (1 == this.t) return this[0];
                    if (0 == this.t) return 0
                }
                return (this[1] & (1 << 32 - this.DB) - 1) << this.DB | this[0]
            };
        e.prototype.byteValue = function() {
            return 0 == this.t ? this.s : this[0] << 24 >> 24
        };
        e.prototype.shortValue = function() {
            return 0 == this.t ? this.s : this[0] << 16 >> 16
        };
        e.prototype.signum = function() {
            return 0 > this.s ? -1 : 0 >= this.t || 1 == this.t && 0 >= this[0] ? 0 : 1
        };
        e.prototype.toByteArray = function() {
            var a = this.t,
                b = [];
            b[0] = this.s;
            var c = this.DB -
                a * this.DB % 8,
                d, e = 0;
            if (0 < a--)
                for (c < this.DB && (d = this[a] >> c) != (this.s & this.DM) >> c && (b[e++] = d | this.s << this.DB - c); 0 <= a;)
                    if (8 > c ? (d = (this[a] & (1 << c) - 1) << 8 - c, d |= this[--a] >> (c += this.DB - 8)) : (d = this[a] >> (c -= 8) & 255, 0 >= c && (c += this.DB, --a)), 0 != (d & 128) && (d |= -256), 0 == e && (this.s & 128) != (d & 128) && ++e, 0 < e || d != this.s) b[e++] = d;
            return b
        };
        e.prototype.equals = function(a) {
            return 0 == this.compareTo(a)
        };
        e.prototype.min = function(a) {
            return 0 > this.compareTo(a) ? this : a
        };
        e.prototype.max = function(a) {
            return 0 < this.compareTo(a) ? this : a
        };
        e.prototype.and =
            function(a) {
                var b = l();
                this.bitwiseTo(a, I, b);
                return b
            };
        e.prototype.or = function(a) {
            var b = l();
            this.bitwiseTo(a, A, b);
            return b
        };
        e.prototype.xor = function(a) {
            var b = l();
            this.bitwiseTo(a, C, b);
            return b
        };
        e.prototype.andNot = function(a) {
            var b = l();
            this.bitwiseTo(a, D, b);
            return b
        };
        e.prototype.not = function() {
            for (var a = l(), b = 0; b < this.t; ++b) a[b] = this.DM & ~this[b];
            a.t = this.t;
            a.s = ~this.s;
            return a
        };
        e.prototype.shiftLeft = function(a) {
            var b = l();
            0 > a ? this.rShiftTo(-a, b) : this.lShiftTo(a, b);
            return b
        };
        e.prototype.shiftRight = function(a) {
            var b =
                l();
            0 > a ? this.lShiftTo(-a, b) : this.rShiftTo(a, b);
            return b
        };
        e.prototype.getLowestSetBit = function() {
            for (var a = 0; a < this.t; ++a)
                if (0 != this[a]) {
                    var b = a * this.DB;
                    a = this[a];
                    if (0 == a) a = -1;
                    else {
                        var c = 0;
                        0 == (a & 65535) && (a >>= 16, c += 16);
                        0 == (a & 255) && (a >>= 8, c += 8);
                        0 == (a & 15) && (a >>= 4, c += 4);
                        0 == (a & 3) && (a >>= 2, c += 2);
                        0 == (a & 1) && ++c;
                        a = c
                    }
                    return b + a
                }
            return 0 > this.s ? this.t * this.DB : -1
        };
        e.prototype.bitCount = function() {
            for (var a = 0, b = this.s & this.DM, c = 0; c < this.t; ++c) {
                for (var d = this[c] ^ b, e = 0; 0 != d;) d &= d - 1, ++e;
                a += e
            }
            return a
        };
        e.prototype.testBit =
            function(a) {
                var b = Math.floor(a / this.DB);
                return b >= this.t ? 0 != this.s : 0 != (this[b] & 1 << a % this.DB)
            };
        e.prototype.setBit = function(a) {
            return this.changeBit(a, A)
        };
        e.prototype.clearBit = function(a) {
            return this.changeBit(a, D)
        };
        e.prototype.flipBit = function(a) {
            return this.changeBit(a, C)
        };
        e.prototype.add = function(a) {
            var b = l();
            this.addTo(a, b);
            return b
        };
        e.prototype.subtract = function(a) {
            var b = l();
            this.subTo(a, b);
            return b
        };
        e.prototype.multiply = function(a) {
            var b = l();
            this.multiplyTo(a, b);
            return b
        };
        e.prototype.divide = function(a) {
            var b =
                l();
            this.divRemTo(a, b, null);
            return b
        };
        e.prototype.remainder = function(a) {
            var b = l();
            this.divRemTo(a, null, b);
            return b
        };
        e.prototype.divideAndRemainder = function(a) {
            var b = l(),
                c = l();
            this.divRemTo(a, b, c);
            return [b, c]
        };
        e.prototype.modPow = function(a, b) {
            var c = a.bitLength(),
                d, e = t(1),
                f;
            if (0 >= c) return e;
            d = 18 > c ? 1 : 48 > c ? 3 : 144 > c ? 4 : 768 > c ? 5 : 6;
            f = 8 > c ? new u(b) : b.isEven() ? new x(b) : new w(b);
            var h = [],
                g = 3,
                m = d - 1,
                p = (1 << d) - 1;
            h[1] = f.convert(this);
            if (1 < d)
                for (c = l(), f.sqrTo(h[1], c); g <= p;) h[g] = l(), f.mulTo(c, h[g - 2], h[g]), g += 2;
            for (var n =
                    a.t - 1, r, v = !0, q = l(), c = z(a[n]) - 1; 0 <= n;) {
                c >= m ? r = a[n] >> c - m & p : (r = (a[n] & (1 << c + 1) - 1) << m - c, 0 < n && (r |= a[n - 1] >> this.DB + c - m));
                for (g = d; 0 == (r & 1);) r >>= 1, --g;
                0 > (c -= g) && (c += this.DB, --n);
                if (v) h[r].copyTo(e), v = !1;
                else {
                    for (; 1 < g;) f.sqrTo(e, q), f.sqrTo(q, e), g -= 2;
                    0 < g ? f.sqrTo(e, q) : (g = e, e = q, q = g);
                    f.mulTo(q, h[r], e)
                }
                for (; 0 <= n && 0 == (a[n] & 1 << c);) f.sqrTo(e, q), g = e, e = q, q = g, 0 > --c && (c = this.DB - 1, --n)
            }
            return f.revert(e)
        };
        e.prototype.modInverse = function(a) {
            var b = a.isEven();
            if (this.isEven() && b || 0 == a.signum()) return e.ZERO;
            for (var c = a.clone(),
                    d = this.clone(), k = t(1), f = t(0), h = t(0), g = t(1); 0 != c.signum();) {
                for (; c.isEven();) c.rShiftTo(1, c), b ? (k.isEven() && f.isEven() || (k.addTo(this, k), f.subTo(a, f)), k.rShiftTo(1, k)) : f.isEven() || f.subTo(a, f), f.rShiftTo(1, f);
                for (; d.isEven();) d.rShiftTo(1, d), b ? (h.isEven() && g.isEven() || (h.addTo(this, h), g.subTo(a, g)), h.rShiftTo(1, h)) : g.isEven() || g.subTo(a, g), g.rShiftTo(1, g);
                0 <= c.compareTo(d) ? (c.subTo(d, c), b && k.subTo(h, k), f.subTo(g, f)) : (d.subTo(c, d), b && h.subTo(k, h), g.subTo(f, g))
            }
            if (0 != d.compareTo(e.ONE)) return e.ZERO;
            if (0 <= g.compareTo(a)) return g.subtract(a);
            if (0 > g.signum()) g.addTo(a, g);
            else return g;
            return 0 > g.signum() ? g.add(a) : g
        };
        e.prototype.pow = function(a) {
            return this.exp(a, new v)
        };
        e.prototype.gcd = function(a) {
            var b = 0 > this.s ? this.negate() : this.clone();
            a = 0 > a.s ? a.negate() : a.clone();
            if (0 > b.compareTo(a)) {
                var c = b,
                    b = a;
                a = c
            }
            var c = b.getLowestSetBit(),
                d = a.getLowestSetBit();
            if (0 > d) return b;
            c < d && (d = c);
            0 < d && (b.rShiftTo(d, b), a.rShiftTo(d, a));
            for (; 0 < b.signum();) 0 < (c = b.getLowestSetBit()) && b.rShiftTo(c, b), 0 < (c = a.getLowestSetBit()) &&
                a.rShiftTo(c, a), 0 <= b.compareTo(a) ? (b.subTo(a, b), b.rShiftTo(1, b)) : (a.subTo(b, a), a.rShiftTo(1, a));
            0 < d && a.lShiftTo(d, a);
            return a
        };
        e.prototype.isProbablePrime = function(a) {
            var b, c = this.abs();
            if (1 == c.t && c[0] <= p[p.length - 1]) {
                for (b = 0; b < p.length; ++b)
                    if (c[0] == p[b]) return !0;
                return !1
            }
            if (c.isEven()) return !1;
            for (b = 1; b < p.length;) {
                for (var d = p[b], e = b + 1; e < p.length && d < J;) d *= p[e++];
                for (d = c.modInt(d); b < e;)
                    if (0 == d % p[b++]) return !1
            }
            return c.millerRabin(a)
        };
        return {
            BigInteger: e
        }
    }(),
    BigInteger = BigInteger.BigInteger;
SSHyClient.hash = {};

SSHyClient.hash.SHA1 = function(a) {
    this.data = a || "";
    this.digest_size = 20
};
SSHyClient.hash.SHA1.prototype = {
    digest: function() {
        var a = toByteArray(this.data),
            h = bytesToWords(a),
            f = 8 * a.length,
            a = [],
            g = 1732584193,
            c = -271733879,
            d = -1732584194,
            e = 271733878,
            k = -1009589776;
        h[f >> 5] |= 128 << 24 - f % 32;
        h[(f + 64 >>> 9 << 4) + 15] = f;
        for (f = 0; f < h.length; f += 16) {
            for (var m = g, n = c, p = d, q = e, r = k, b = 0; 80 > b; b++) {
                if (16 > b) a[b] = h[f + b];
                else {
                    var l = a[b - 3] ^ a[b - 8] ^ a[b - 14] ^ a[b - 16];
                    a[b] = l << 1 | l >>> 31
                }
                l = (g << 5 | g >>> 27) + k + (a[b] >>> 0) + (20 > b ? (c & d | ~c & e) + 1518500249 : 40 > b ? (c ^ d ^ e) + 1859775393 : 60 > b ? (c & d | c & e | d & e) - 1894007588 : (c ^ d ^ e) - 899497514);
                k = e;
                e = d;
                d = c << 30 | c >>> 2;
                c = g;
                g = l
            }
            g += m;
            c += n;
            d += p;
            e += q;
            k += r
        }
        return fromByteArray(wordsToBytes([g, c, d, e, k]))
    }
};

SSHyClient.hash.SHA256 = function(a) {
	this.data = a || ""
	this.digest_size = 32
}
SSHyClient.hash.SHA256.prototype = {
    digest: function() {
      var hashData = toByteArray(this.data);

      // Constants
      var K = [ 0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5,
          0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
          0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
          0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
          0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC,
          0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
          0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7,
          0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967,
          0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
          0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
          0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3,
          0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
          0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5,
          0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
          0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
          0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2 ];

      var m = bytesToWords(hashData),
          l = hashData.length * 8,
          H = [ 0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A,
                0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19 ],
          w = [],
          a, b, c, d, e, f, g, h, i, j,
          t1, t2;

      // Padding
      m[l >> 5] |= 0x80 << (24 - l % 32);
      m[((l + 64 >> 9) << 4) + 15] = l;

      for (var i = 0; i < m.length; i += 16) {
        a = H[0];
        b = H[1];
        c = H[2];
        d = H[3];
        e = H[4];
        f = H[5];
        g = H[6];
        h = H[7];

        for (var j = 0; j < 64; j++) {
          if (j < 16) {
            w[j] = m[j + i];
          } else {
            var gamma0x = w[j - 15],
                gamma1x = w[j - 2],
                gamma0  = ((gamma0x << 25) | (gamma0x >>>  7)) ^
                          ((gamma0x << 14) | (gamma0x >>> 18)) ^
                           (gamma0x >>> 3),
                gamma1  = ((gamma1x <<  15) | (gamma1x >>> 17)) ^
                          ((gamma1x <<  13) | (gamma1x >>> 19)) ^
                           (gamma1x >>> 10);

            w[j] = gamma0 + (w[j - 7] >>> 0) +
                   gamma1 + (w[j - 16] >>> 0);
          }

          var ch  = e & f ^ ~e & g,
              maj = a & b ^ a & c ^ b & c,
              sigma0 = ((a << 30) | (a >>>  2)) ^
                       ((a << 19) | (a >>> 13)) ^
                       ((a << 10) | (a >>> 22)),
              sigma1 = ((e << 26) | (e >>>  6)) ^
                       ((e << 21) | (e >>> 11)) ^
                       ((e <<  7) | (e >>> 25));

          t1 = (h >>> 0) + sigma1 + ch + (K[j]) + (w[j] >>> 0);
          t2 = sigma0 + maj;

          h = g;
          g = f;
          f = e;
          e = (d + t1) >>> 0;
          d = c;
          c = b;
          b = a;
          a = (t1 + t2) >>> 0;
        }

        H[0] += a;
        H[1] += b;
        H[2] += c;
        H[3] += d;
        H[4] += e;
        H[5] += f;
        H[6] += g;
        H[7] += h;
      }

      return fromByteArray(wordsToBytes(H));
    }
  }

SSHyClient.hash.HMAC = function(a, g, SHAVersion) {
	var b = digestmod = SHAVersion == 'SHA-1' ? SSHyClient.hash.SHA1 : SSHyClient.hash.SHA256,
		d = new b,
		e = new b;
	64 < a.length && (a = (new b(a)).digest());
	a += Array(64 - a.length + 1).join("\x00");
	for (var b = toByteArray(a).slice(0), f = toByteArray(a).slice(0), c = 0; 64 > c; ++c) b[c] ^= 92, f[c] ^= 54;
	d.data += fromByteArray(b)
	e.data += fromByteArray(f);
	e.data += g;
	d.data += e.digest();
	return d.digest()
};

SSHyClient.hash.MD5 = function(data){
	var hashData = toByteArray(data);

	var m = bytesToWords(hashData),
		l = hashData.length * 8,
		a =  1732584193,
		b = -271733879,
		c = -1732584194,
		d =  271733878;

	// Swap endian
	for (var i = 0; i < m.length; i++) {
		m[i] = ((m[i] <<  8) | (m[i] >>> 24)) & 0x00FF00FF |
			   ((m[i] << 24) | (m[i] >>>  8)) & 0xFF00FF00;
	}

	// Padding
	m[l >>> 5] |= 0x80 << (l % 32);
	m[(((l + 64) >>> 9) << 4) + 14] = l;

	// Method shortcuts
	var FF = function (a, b, c, d, x, s, t) {
	  var n = a + (b & c | ~b & d) + (x >>> 0) + t;
	  return ((n << s) | (n >>> (32 - s))) + b;
	};
	var GG = function (a, b, c, d, x, s, t) {
	  var n = a + (b & d | c & ~d) + (x >>> 0) + t;
	  return ((n << s) | (n >>> (32 - s))) + b;
	};
	var HH = function (a, b, c, d, x, s, t) {
	  var n = a + (b ^ c ^ d) + (x >>> 0) + t;
	  return ((n << s) | (n >>> (32 - s))) + b;
	};
	var II = function (a, b, c, d, x, s, t) {
	  var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
	  return ((n << s) | (n >>> (32 - s))) + b;
	};

	for (var i = 0; i < m.length; i += 16) {
	  var aa = a,
		  bb = b,
		  cc = c,
		  dd = d;

	  a = FF(a, b, c, d, m[i+ 0],  7, -680876936);
	  d = FF(d, a, b, c, m[i+ 1], 12, -389564586);
	  c = FF(c, d, a, b, m[i+ 2], 17,  606105819);
	  b = FF(b, c, d, a, m[i+ 3], 22, -1044525330);
	  a = FF(a, b, c, d, m[i+ 4],  7, -176418897);
	  d = FF(d, a, b, c, m[i+ 5], 12,  1200080426);
	  c = FF(c, d, a, b, m[i+ 6], 17, -1473231341);
	  b = FF(b, c, d, a, m[i+ 7], 22, -45705983);
	  a = FF(a, b, c, d, m[i+ 8],  7,  1770035416);
	  d = FF(d, a, b, c, m[i+ 9], 12, -1958414417);
	  c = FF(c, d, a, b, m[i+10], 17, -42063);
	  b = FF(b, c, d, a, m[i+11], 22, -1990404162);
	  a = FF(a, b, c, d, m[i+12],  7,  1804603682);
	  d = FF(d, a, b, c, m[i+13], 12, -40341101);
	  c = FF(c, d, a, b, m[i+14], 17, -1502002290);
	  b = FF(b, c, d, a, m[i+15], 22,  1236535329);

	  a = GG(a, b, c, d, m[i+ 1],  5, -165796510);
	  d = GG(d, a, b, c, m[i+ 6],  9, -1069501632);
	  c = GG(c, d, a, b, m[i+11], 14,  643717713);
	  b = GG(b, c, d, a, m[i+ 0], 20, -373897302);
	  a = GG(a, b, c, d, m[i+ 5],  5, -701558691);
	  d = GG(d, a, b, c, m[i+10],  9,  38016083);
	  c = GG(c, d, a, b, m[i+15], 14, -660478335);
	  b = GG(b, c, d, a, m[i+ 4], 20, -405537848);
	  a = GG(a, b, c, d, m[i+ 9],  5,  568446438);
	  d = GG(d, a, b, c, m[i+14],  9, -1019803690);
	  c = GG(c, d, a, b, m[i+ 3], 14, -187363961);
	  b = GG(b, c, d, a, m[i+ 8], 20,  1163531501);
	  a = GG(a, b, c, d, m[i+13],  5, -1444681467);
	  d = GG(d, a, b, c, m[i+ 2],  9, -51403784);
	  c = GG(c, d, a, b, m[i+ 7], 14,  1735328473);
	  b = GG(b, c, d, a, m[i+12], 20, -1926607734);

	  a = HH(a, b, c, d, m[i+ 5],  4, -378558);
	  d = HH(d, a, b, c, m[i+ 8], 11, -2022574463);
	  c = HH(c, d, a, b, m[i+11], 16,  1839030562);
	  b = HH(b, c, d, a, m[i+14], 23, -35309556);
	  a = HH(a, b, c, d, m[i+ 1],  4, -1530992060);
	  d = HH(d, a, b, c, m[i+ 4], 11,  1272893353);
	  c = HH(c, d, a, b, m[i+ 7], 16, -155497632);
	  b = HH(b, c, d, a, m[i+10], 23, -1094730640);
	  a = HH(a, b, c, d, m[i+13],  4,  681279174);
	  d = HH(d, a, b, c, m[i+ 0], 11, -358537222);
	  c = HH(c, d, a, b, m[i+ 3], 16, -722521979);
	  b = HH(b, c, d, a, m[i+ 6], 23,  76029189);
	  a = HH(a, b, c, d, m[i+ 9],  4, -640364487);
	  d = HH(d, a, b, c, m[i+12], 11, -421815835);
	  c = HH(c, d, a, b, m[i+15], 16,  530742520);
	  b = HH(b, c, d, a, m[i+ 2], 23, -995338651);

	  a = II(a, b, c, d, m[i+ 0],  6, -198630844);
	  d = II(d, a, b, c, m[i+ 7], 10,  1126891415);
	  c = II(c, d, a, b, m[i+14], 15, -1416354905);
	  b = II(b, c, d, a, m[i+ 5], 21, -57434055);
	  a = II(a, b, c, d, m[i+12],  6,  1700485571);
	  d = II(d, a, b, c, m[i+ 3], 10, -1894986606);
	  c = II(c, d, a, b, m[i+10], 15, -1051523);
	  b = II(b, c, d, a, m[i+ 1], 21, -2054922799);
	  a = II(a, b, c, d, m[i+ 8],  6,  1873313359);
	  d = II(d, a, b, c, m[i+15], 10, -30611744);
	  c = II(c, d, a, b, m[i+ 6], 15, -1560198380);
	  b = II(b, c, d, a, m[i+13], 21,  1309151649);
	  a = II(a, b, c, d, m[i+ 4],  6, -145523070);
	  d = II(d, a, b, c, m[i+11], 10, -1120210379);
	  c = II(c, d, a, b, m[i+ 2], 15,  718787259);
	  b = II(b, c, d, a, m[i+ 9], 21, -343485551);

	  a = (a + aa) >>> 0;
	  b = (b + bb) >>> 0;
	  c = (c + cc) >>> 0;
	  d = (d + dd) >>> 0;
	}

	var rotl = function (n, b) {
	  return (n << b) | (n >>> (32 - b));
	};

	var endian = function (n) {
	  // If number given, swap endian
	  if (n.constructor == Number) {
		return rotl(n,  8) & 0x00FF00FF |
			   rotl(n, 24) & 0xFF00FF00;
	  }

	  // Else, assume array and swap all items
	  for (var i = 0; i < n.length; i++) {
		n[i] = endian(n[i]);
	  }
	  return n;
	};

	return fromByteArray(wordsToBytes(endian([a, b, c, d])));
};
sjcl = {
    cipher: {}
};
sjcl.cipher.aes = function(e, d) {
    this._tables[0][0][0] || this._precompute();
    this.mode = d;
    var c, b, a, f, g, h = this._tables[0][4],
        n = this._tables[1];
    b = e.length;
    var l = 1;
    if (4 !== b && 6 !== b && 8 !== b) throw "invalid aes key size";
    this._key = [f = e.slice(0), g = []];
    for (c = b; c < 4 * b + 28; c++) {
        a = f[c - 1];
        if (0 === c % b || 8 === b && 4 === c % b) a = h[a >>> 24] << 24 ^ h[a >> 16 & 255] << 16 ^ h[a >> 8 & 255] << 8 ^ h[a & 255], 0 === c % b && (a = a << 8 ^ a >>> 24 ^ l << 24, l = l << 1 ^ 283 * (l >> 7));
        f[c] = f[c - b] ^ a
    }
    for (b = 0; c; b++, c--) a = f[b & 3 ? c : c - 4], g[b] = 4 >= c || 4 > b ? a : n[0][h[a >>> 24]] ^ n[1][h[a >> 16 & 255]] ^ n[2][h[a >>
        8 & 255]] ^ n[3][h[a & 255]]
};
sjcl.cipher.aes.MODE_CBC = 2;
sjcl.cipher.aes.MODE_CTR = 6;
sjcl.cipher.aes.prototype = {
    encrypt: function(e, d, c) {
        d = this.mode == sjcl.cipher.aes.MODE_CBC ? d : [];
        for (var b = [], a = 0; a < e.length / 16; a++) {
            var f = e.slice(16 * a, 16 * (a + 1));
            if (this.mode == sjcl.cipher.aes.MODE_CBC) {
                for (var g = 0; 16 > g; g++) f[g] ^= d[g];
                d = sjcl.codec.bytes.fromBits(this._crypt(sjcl.codec.bytes.toBits(f), 0))
            } else
                for (d = sjcl.codec.bytes.fromBits(this._crypt(sjcl.codec.bytes.toBits(toByteArray(c.increment())), 0)), g = 0; 16 > g; g++) d[g] ^= f[g];
            b = b.concat(d)
        }
        return b
    },
    decrypt: function(e, d) {
        for (var c = [], b = 0; b < e.length /
            16; b++) {
            var a = e.slice(16 * b, 16 * (b + 1));
            ct = sjcl.codec.bytes.fromBits(this._crypt(sjcl.codec.bytes.toBits(a), 1));
            if (this.mode == sjcl.cipher.aes.MODE_CBC) {
                for (var f = 0; 16 > f; f++) ct[f] ^= d[f];
                d = a
            }
            c = c.concat(ct)
        }
        return c
    },
    _tables: [
        [
            [],
            [],
            [],
            [],
            []
        ],
        [
            [],
            [],
            [],
            [],
            []
        ]
    ],
    _precompute: function() {
        var e = this._tables[0],
            d = this._tables[1],
            c = e[4],
            b = d[4],
            a, f, g, h = [],
            n = [],
            l, p, k, m;
        for (a = 0; 256 > a; a++) n[(h[a] = a << 1 ^ 283 * (a >> 7)) ^ a] = a;
        for (f = g = 0; !c[f]; f ^= l || 1, g = n[g] || 1)
            for (k = g ^ g << 1 ^ g << 2 ^ g << 3 ^ g << 4, k = k >> 8 ^ k & 255 ^ 99, c[f] = k, b[k] = f, p = h[a =
                    h[l = h[f]]], m = 16843009 * p ^ 65537 * a ^ 257 * l ^ 16843008 * f, p = 257 * h[k] ^ 16843008 * k, a = 0; 4 > a; a++) e[a][f] = p = p << 24 ^ p >>> 8, d[a][k] = m = m << 24 ^ m >>> 8;
        for (a = 0; 5 > a; a++) e[a] = e[a].slice(0), d[a] = d[a].slice(0)
    },
    _crypt: function(e, d) {
        if (4 !== e.length) throw "invalid aes block size";
        var c = this._key[d],
            b = e[0] ^ c[0],
            a = e[d ? 3 : 1] ^ c[1],
            f = e[2] ^ c[2],
            g = e[d ? 1 : 3] ^ c[3],
            h, n, l, p = c.length / 4 - 2,
            k, m = 4,
            w = [0, 0, 0, 0];
        h = this._tables[d];
        var q = h[0],
            r = h[1],
            t = h[2],
            u = h[3],
            v = h[4];
        for (k = 0; k < p; k++) h = q[b >>> 24] ^ r[a >> 16 & 255] ^ t[f >> 8 & 255] ^ u[g & 255] ^ c[m], n = q[a >>> 24] ^ r[f >>
            16 & 255] ^ t[g >> 8 & 255] ^ u[b & 255] ^ c[m + 1], l = q[f >>> 24] ^ r[g >> 16 & 255] ^ t[b >> 8 & 255] ^ u[a & 255] ^ c[m + 2], g = q[g >>> 24] ^ r[b >> 16 & 255] ^ t[a >> 8 & 255] ^ u[f & 255] ^ c[m + 3], m += 4, b = h, a = n, f = l;
        for (k = 0; 4 > k; k++) w[d ? 3 & -k : k] = v[b >>> 24] << 24 ^ v[a >> 16 & 255] << 16 ^ v[f >> 8 & 255] << 8 ^ v[g & 255] ^ c[m++], h = b, b = a, a = f, f = g, g = h;
        return w
    }
};
sjcl.codec = {};
sjcl.codec.bytes = {
    fromBits: function(e) {
        var d = [],
            c = sjcl.bitArray.bitLength(e),
            b, a;
        for (b = 0; b < c / 8; b++) 0 === (b & 3) && (a = e[b / 4]), d.push(a >>> 24), a <<= 8;
        return d
    },
    toBits: function(e) {
        var d = [],
            c, b = 0;
        for (c = 0; c < e.length; c++) b = b << 8 | e[c], 3 === (c & 3) && (d.push(b), b = 0);
        c & 3 && d.push(sjcl.bitArray.partial(8 * (c & 3), b));
        return d
    }
};
sjcl.bitArray = {
    bitLength: function(e) {
        var d = e.length;
        return 0 === d ? 0 : 32 * (d - 1) + sjcl.bitArray.getPartial(e[d - 1])
    },
    partial: function(e, d, c) {
        return 32 === e ? d : (c ? d | 0 : d << 32 - e) + 1099511627776 * e
    },
    getPartial: function(e) {
        return Math.round(e / 1099511627776) || 32
    }
};
/*
	Slightly modified version of [randomart](https://github.com/purpliminal/randomart)
	to run in web browsers based on SSH RSA keys
*/

var symbols = {
    "-2": "E",
    "-1": "S",
    "0": " ",
    "1": ".",
    "2": "o",
    "3": "+",
    "4": "=",
    "5": "*",
    "6": "B",
    "7": "O",
    "8": "X",
    "9": "@",
    "10": "%",
    "11": "&",
    "12": "#",
    "13": "/",
    "14": "^"
};

var bounds = {
    width: 17,
    height: 9
};

function createBoard(bounds) {
    var result = [];

    for (var i = 0; i < bounds.width; i++) {
        result[i] = [];
        for (var j = 0; j < bounds.height; j++) {
            result[i][j] = 0;
        }
    }
    return result;
}

function generateBoard(data) {
    var board = createBoard(bounds);

    var x = Math.floor(bounds.width / 2);
    var y = Math.floor(bounds.height / 2);

    board[x][y] = -1;

    data.forEach(
        function(b) {
            for (var s = 0; s < 8; s += 2) {
                var d = (b >> s) & 3;

                switch (d) {
                    case 0: // up
                    case 1:
                        if (y > 0) y--;
                        break;
                    case 2: // down
                    case 3:
                        if (y < (bounds.height - 1)) y++;
                        break;
                }
                switch (d) {
                    case 0: // left
                    case 2:
                        if (x > 0) x--;
                        break;
                    case 1: // right
                    case 3:
                        if (x < (bounds.width - 1)) x++;
                        break;
                }

                if (board[x][y] >= 0) board[x][y]++;
            }
        }
    );

    board[x][y] = -2;
    return board;
}

function boardToString(board) {
    result = [];

    for (var i = 0; i < bounds.height; i++) {
        result[i] = [];
        for (var j = 0; j < bounds.width; j++) {
            result[i][j] = symbols[board[j][i]] || symbols[0];
        }
        // Add | to start and end of result[i]
        result[i] = '|' + result[i].join('') + '|';
    }
    result.splice(0, 0, '\n+---[ RSA2048 ]---+');
    result.push('+-----------------+');
    return result.join('\n');
}

function randomart(data) {
	var buffer = [];
	for(var i = 0, length = data.length; i < length; i++){
		buffer.push('0x' + data[i]);
	}
	// Write the board to HTML
	document.getElementById('hostKeyImg').innerHTML = boardToString(generateBoard(buffer));
    return;
}
var struct = {
    pack: function(e, a) {
        var b = "";
        switch (e) {
            case "Q":
                var d = new BigInteger("ff", 16),
                    b = b + String.fromCharCode(a.shiftRight(56).and(d)),
                    b = b + String.fromCharCode(a.shiftRight(48).and(d)),
                    b = b + String.fromCharCode(a.shiftRight(40).and(d)),
                    b = b + String.fromCharCode(a.shiftRight(32).and(d)),
                    b = b + String.fromCharCode(a.shiftRight(24).and(d)),
                    b = b + String.fromCharCode(a.shiftRight(16).and(d)),
                    b = b + String.fromCharCode(a.shiftRight(8).and(d)),
                    b = b + String.fromCharCode(a.and(d));
                break;
            case "I":
                b += String.fromCharCode(a >>>
                    24 & 255), b += String.fromCharCode(a >>> 16 & 255), b += String.fromCharCode(a >>> 8 & 255);
            case "B":
                b += String.fromCharCode(a & 255)
        }
        return b
    },
    unpack: function(e, a) {
        var b = [],
            d = 0,
            c = 0;
        switch (e) {
            case "Q":
                c = new BigInteger("0", 10);
                c = c.add((new BigInteger(a.charCodeAt(0).toString(), 10)).shiftLeft(56));
                c = c.add((new BigInteger(a.charCodeAt(1).toString(), 10)).shiftLeft(48));
                c = c.add((new BigInteger(a.charCodeAt(2).toString(), 10)).shiftLeft(40));
                c = c.add((new BigInteger(a.charCodeAt(3).toString(), 10)).shiftLeft(32));
                c = c.add((new BigInteger(a.charCodeAt(4).toString(),
                    10)).shiftLeft(24));
                c = c.add((new BigInteger(a.charCodeAt(5).toString(), 10)).shiftLeft(16));
                c = c.add((new BigInteger(a.charCodeAt(6).toString(), 10)).shiftLeft(8));
                c = c.add((new BigInteger(a.charCodeAt(7).toString(), 10)).shiftLeft(0));
                b.push(c);
                break;
            case "I":
                c += a.charCodeAt(0) << 24 >>> 0, c += a.charCodeAt(1) << 16 >>> 0, c += a.charCodeAt(2) << 8 >>> 0, d += 3;
            case "B":
                c += a.charCodeAt(0 + d) << 0 >>> 0, b.push(c)
        }
        return b
    }
};
function inflate_long(a) {
    var c = new BigInteger("0", 10);
    a.length % 4 && (a = Array(4 - a.length % 4 + 1).join("\x00") + a);
    for (var b = 0; b < a.length; b += 4)
        c = c.shiftLeft(32), c = c.add(new BigInteger(struct.unpack("I", a.substring(b, b + 4))[0].toString(), 10));
    return c
}

function deflate_long(a, c) {
    a = "number" == typeof a ? new BigInteger(a.toString(), 10) : a.clone();
    c = void 0 == c ? !0 : c;
    for (var b = "", d = new BigInteger("-1", 10), f = new BigInteger("ffffffff", 16); !a.equals(BigInteger.ZERO) && !a.equals(d);) b = struct.pack("I", a.and(f)) + b, a = a.shiftRight(32);
    for (var f = !1, e = 0; e < b.length; ++e) {
        if (a.equals(BigInteger.ZERO) && "\x00" != b.charAt(e)) {
            f = !0;
            break
        }
        if (a.equals(d) && "\u00ff" != b.charAt(e)) {
            f = !0;
            break
        }
    }
    f || (e = 0, b = a.equals(BigInteger.ZERO) ? "\x00" : "\u00ff");
    b = b.substring(e);
    c && (a.equals(BigInteger.ZERO) &&
        128 <= b.charCodeAt(0) && (b = "\x00" + b), a.equals(d) && 128 > b.charCodeAt(0) && (b = "\u00ff" + b));
    return b
}
// Converts strings to byte arrays
function toByteArray(a) {
	var bufView = new Uint8Array(a.length);
	for (var i=0; i < a.length; i++) {
		bufView[i] = a.charCodeAt(i);
	}
	return bufView;
}
// Converts byte arrays to strings
function fromByteArray(a) {
  return String.fromCharCode.apply(null, new Uint8Array(a));
}
// Converts bytes to words
function bytesToWords(a) {
    for (var c = [], b = 0, d = 0; b < a.length; b++, d += 8) c[d >>> 5] |= (a[b] & 255) << 24 - d % 32;
    return c
}
// Converts words to bytes
function wordsToBytes(a) {
    for (var c = [], b = 0; b < 32 * a.length; b += 8) c.push(a[b >>> 5] >>> 24 - b % 32 & 255);
    return c
}
// Used to set specific values for the AES counter
function setCharAt(a, c, b) {
    return a.substring(0, c) + b + a.substring(c + 1)
};
// Converts UTF-8 strings to raw encoding that xtemrm.js can handle
function fromUtf8(str) {
	   var res = '';
	   var bytes = toByteArray(str);
	   for (var i = 0; i < str.length; i++) {
		   var c = str.charCodeAt(i);
		   if (c >= 0x00C0 && c <= 0x00DF) {
			   var c2 = bytes[++i];
			   c = ((c & 0x1F) << 6) | (c2 & 0x3F);
		   } else if (c >= 0x00E0 && c <= 0x00EF) {
			   var c2 = bytes[++i];
			   var c3 = bytes[++i];
			   c = ((c & 0x0F) << 12) | ((c2 & 0x3F) << 6) | (c3 & 0x3F);
		   } else if (c >= 0x0080) {
			   c = '.'; // Invalid encoding, unprintable character
		   }
		   res += String.fromCharCode(c);
	   }
	   return res;
   }
// returns a b byte random number
function read_rng(b) {
	return String.fromCharCode.apply(null, window.crypto.getRandomValues(new Uint8Array(b)))
}
// Used for filtering algorithms and selecting the algorithms to be used during kex_init
function filter(client, server) {
	client = client.split(',')
	for (var x = 0; x < client.length; ++x) {
		if (server.indexOf(client[x]) != -1) {
			return client[x];
		}
	}
}
// Used to split large chunks of text pasted into the client into managable portions
function splitSlice(str, len = 5000) {
  var ret = [ ];
  for (var offset = 0, strLen = str.length; offset < strLen; offset += len) {
    ret.push(str.slice(offset, len + offset));
  }
  return ret;
}
// Modifies a hex color by percent (+/-) light/darkness
function modColorPercent(color, percent) {
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}
// 	Converts an ascii string to hex encoded string
function ascii2hex(a) {
	for (var c = "", b = 0; b < a.length; b++) c = 1 == a.charCodeAt(b).toString(16).length ? c + ("0" + a.charCodeAt(b).toString(16)) : c + ("" + a.charCodeAt(b).toString(16));
	return c;
}

// Moves the cursor back one and deletes a character from xtermjs term
function termBackspace(term) {
    term.write('\b');
    term.eraseRight(term.buffers._terminal.buffer.x - 1, term.buffers._terminal.buffer.y);
}SSHyClient.kex = {
    K: null, 		// Our secret key K generated by our preferred_kex algorithm
    H: null, 		// A hash used for encryption key generation by the preferred_keys algorithm
	sessionId: null // Session identifier; should be the same as H until a rekey event
};

function verifyKey(host_key, sig){
	var rsa = new SSHyClient.RSAKey(new SSHyClient.Message(host_key));
	if(!rsa.verify(SSHyClient.kex.H, new SSHyClient.Message(sig))){
		transport.disconnect();
	    throw 'RSA signature verification failed, disconnecting.';
	}
}

SSHyClient.kex.DiffieHellman = function(transport, group, SHAVersion){
	this.transport = transport;
	this.SHAVersion = SHAVersion;
	this.group = group;

	// Using group to determine what type of DH; 0= GEX; 1=g1; 14=g14
	if(this.group === undefined){
		this.p = this.q = this.g = this.x = this.e = this.f = null;

	    this.minBits = 1024;
	    this.maxBits = 8192;
	    this.preferredBits = 2048;
		return;
	} else if(this.group === 1){
		this.P = new BigInteger("FFFFFFFFFFFFFFFFC90FDAA22168C234C4C6628B80DC1CD129024E088A67CC74020BBEA63B139B22514A08798E3404DDEF9519B3CD3A431B302B0A6DF25F14374FE1356D6D51C245E485B576625E7EC6F44C42E9A637ED6B0BFF5CB6F406B7EDEE386BFB5A899FA5AE9F24117C4B1FE649286651ECE65381FFFFFFFFFFFFFFFF", 16);
	} else if(this.group === 14){
	 	this.P = new BigInteger("FFFFFFFFFFFFFFFFC90FDAA22168C234C4C6628B80DC1CD129024E088A67CC74020BBEA63B139B22514A08798E3404DDEF9519B3CD3A431B302B0A6DF25F14374FE1356D6D51C245E485B576625E7EC6F44C42E9A637ED6B0BFF5CB6F406B7EDEE386BFB5A899FA5AE9F24117C4B1FE649286651ECE45B3DC2007CB8A163BF0598DA48361C55D39A69163FA8FD24CF5F83655D23DCA3AD961C62F356208552BB9ED529077096966D670C354E4ABC9804F1746C08CA18217C32905E462E36CE3BE39E772C180E86039B2783A2EC07A28FB5C55DF06F4C52C9DE2BCBF6955817183995497CEA956AE515D2261898FA051015728E5A8AACAA68FFFFFFFFFFFFFFFF", 16);
	}

	// These only apply to DH group 1 and 14
	this.x = this.e = this.f = new BigInteger('0', 10);
	this.G = new BigInteger("2", 10);
};

SSHyClient.kex.DiffieHellman.prototype = {
    start: function() {
		var m = new SSHyClient.Message();

		if(this.group === undefined){
	        m.add_bytes(String.fromCharCode(SSHyClient.MSG_KEXDH_GEX_REQUEST));
	        m.add_int(this.minBits);
	        m.add_int(this.preferredBits);
	        m.add_int(this.maxBits);
		} else {
	        // generates our 128 bit random number
	        this.x = inflate_long(read_rng(128));

	        // Now we calculate e = (g=2) ^ x mod p
	        this.e = this.G.modPow(this.x, this.P);

	        // Now we create the message and send it
	        m.add_bytes(String.fromCharCode(SSHyClient.MSG_KEXDH_INIT));
	        m.add_mpint(this.e);
		}

		this.transport.send_packet(m);
    },

    parse_reply: function(ptype, r) {
		if(this.group === undefined && ptype == SSHyClient.MSG_KEXDH_GEX_GROUP){
			this.parse_gex_group(r);
			return;
		}
		this.handleDHReply(r);
    },

	handleDHReply: function(r){
		// convert r into message format for deconstruction
		r = new SSHyClient.Message(r);

		// get the host key, f and signature from the message
		var host_key = r.get_string();
		if(transport.settings.rsaCheckEnabled){
			// Now lets make sure that the host_key is recognised, firstly we'll pre-fetch all the data we require (ip/port/rsaKey)
			var key = wsproxyURL.split('/')[3];
			// Cache the hexified host key
			var hexHostKey = ascii2hex(host_key);
			// Generate the short MD5'd key for randomart and confirm
			var shortKey = ascii2hex(SSHyClient.hash.MD5(host_key)).match(/.{2}/g);

			// Create the randomArt image
			randomart(shortKey);

			// Since we've got everthing we need lets see if the key exists already
			var localObj = localStorage.getItem(key);

			if(localObj){
				// Check all the details match.. they should but Sanity
				if(localObj != hexHostKey){
					if(confirm('WARNING - POTENTIAL SECURITY BREACH!\r\n\nThe server\s host key does not match the one SSHy has cached in local storage. This means that either the server administrator has changed the host key, or you have actually connected to another computer pretending to be the server.\r\nThe new rsa2 key fingerprint is:\r\nssh-rsa 2048 ' + shortKey.join(':') + '\r\nIf you were expecting this change and trust the new key, hit `Ok` to add the key to SSHy\'s cache and carry on connecting.\r\nIf you do not trust this new key, hit `Cancel` to abandon the connection')){
						// User has agree'd to the new host key so lets save it for them
						localStorage.setItem(key, hexHostKey);
					} else {
						// Close the connection
						ws.close();
						throw 'Error: Locally stored rsa key does not match remote key';
					}
				}
			} else {
				// Prompt the user just like they are in puTTy
				if(confirm('The server\'s host key is not cached in local storage. You have no guarentee that the server is the computer you think it is.\n\rThe server\'s rsa2 key finterprint is:\r\nssh-rsa 2048 ' + shortKey.join(':') + '\r\nIf you trust the host, hit `Ok` to add the key to SSHy\'s cache and carry on connecting.\r\nIf you do not trust this host, hit `Cancel` to abandon the connection')){
					// User has confirmed it is correct so save the RSA key
					localStorage.setItem(key, hexHostKey);
				} else {
					// need to disconnect and kill the connection
					ws.close();
					throw 'User has declined the rsa-key and closed the connection';
				}
			}
		}

		this.f = r.get_mpint();

		var sig = r.get_string();
		// calculate our shared secret key (K) using f
		var K = this.f.modPow(this.x, this.p);

		/*
		   Now we need to generate H = hash(V_C || V_S || I_C || I_S || K_S || e || f || K)
		   where	V_ = identification string,	K_ = public host key,	I_ = SSH_MSG_KEXINIT message
		*/
		var m = new SSHyClient.Message();
		m.add_string(this.transport.local_version);
		m.add_string(this.transport.remote_version);
		m.add_string(this.transport.local_kex_message);
		m.add_string(this.transport.remote_kex_message);
		m.add_string(host_key);
		// Only add these if we're using DH GEX
		if(this.group === undefined){
			m.add_int(this.minBits);
			m.add_int(this.preferredBits);
			m.add_int(this.maxBits);
			m.add_mpint(this.p);
			m.add_mpint(this.g);
		}
		m.add_mpint(this.e);
		m.add_mpint(this.f);
		m.add_mpint(K);

		SSHyClient.kex.K = K;
		SSHyClient.kex.sessionId = SSHyClient.kex.H = this.SHAVersion == 'SHA-1' ? new SSHyClient.hash.SHA1(m.toString()).digest() : new SSHyClient.hash.SHA256(m.toString()).digest();
		if(transport.settings.rsaCheckEnabled){
			verifyKey(host_key, sig);
		}
		this.transport.send_new_keys();
	},

	// generates our secret x
    generate_x: function() {
        var q = this.p.subtract(BigInteger.ONE);
        q = q.divide(new BigInteger("2", 10));

        var qnorm = deflate_long(q, 0);
        var qhbyte = qnorm[0].charCodeAt(0);
        var bytes = qnorm.length;
        var qmask = 0xff;
        while (!(qhbyte & 0x80)) {
            qhbyte <<= 1;
            qmask >>= 1;
        }
        var x;
        while (true) {
            var x_bytes = read_rng(bytes);
            x_bytes = String.fromCharCode(x_bytes[0].charCodeAt(0) & qmask) + x_bytes.substring(1);
            x = inflate_long(x_bytes, 1);
            if (x.compareTo(BigInteger.ONE) > 0 && q.compareTo(x) > 0) {
                break;
            }
        }
        this.x = x;
    },
    // gets the prime and group from parse_reply and generates our secret number e
    parse_gex_group: function(m) {
        m = new SSHyClient.Message(m);
        this.p = m.get_mpint();
        this.g = m.get_mpint();

        this.generate_x();

        this.e = this.g.modPow(this.x, this.p);

        m = new SSHyClient.Message();
        m.add_bytes(String.fromCharCode(SSHyClient.MSG_KEXDH_GEX_INIT));
        m.add_mpint(this.e);
        this.transport.send_packet(m);
    }
};
SSHyClient.Transport = function(ws, settings) {
    this.local_version = 'SSH-2.0-SSHyClient';
    this.remote_version = '';

    // Kex variables
    this.local_kex_message = null; // Our local kex init message containing algorithm negotiation
    this.remote_kex_message = null; // The remote servers ^

    // Our supported Algorithms
    this.preferred_algorithms = ['diffie-hellman-group-exchange-sha256,diffie-hellman-group-exchange-sha1,diffie-hellman-group14-sha256,diffie-hellman-group14-sha1,diffie-hellman-group1-sha256,diffie-hellman-group1-sha1',
        'ssh-rsa',
        'aes128-ctr',
        'hmac-sha2-256,hmac-sha1',
        'none',
		''
    ];

    // Objects storing references to our different algorithm modules
    this.preferred_kex = null;
    this.preferred_mac = null;
	this.preferred_hash = null;

	// Other SSHyClient module classes
    this.parceler = new SSHyClient.parceler(ws, this);
    this.auth = new SSHyClient.auth(this.parceler);
	this.settings = settings === undefined ? new SSHyClient.settings() : settings;

    this.lastKey = '';

	this.closing = false;
};

SSHyClient.Transport.prototype = {
	/* 	Lookup table for all of our supported KEX algorithms
		- Called by kex_info[<string> id]
		- returns <object> KEX algorithm */
    kex_info: {
        'diffie-hellman-group1-sha1': function(self) {
            return new SSHyClient.kex.DiffieHellman(self, 1, 'SHA-1');
        },
        'diffie-hellman-group14-sha1': function(self) {
            return new SSHyClient.kex.DiffieHellman(self, 14, 'SHA-1');
        },
        'diffie-hellman-group-exchange-sha1': function(self) {
            return new SSHyClient.kex.DiffieHellman(self, undefined, 'SHA-1');
        },
        'diffie-hellman-group1-sha256': function(self) {
            return new SSHyClient.kex.DiffieHellman(self, 1, 'SHA-256');
        },
        'diffie-hellman-group14-sha256': function(self) {
            return new SSHyClient.kex.DiffieHellman(self, 14, 'SHA-256');
        },
        'diffie-hellman-group-exchange-sha256': function(self) {
            return new SSHyClient.kex.DiffieHellman(self, undefined, 'SHA-256');
        }
    },
	/* 	Lookup table for all of our supported MAC algorithms
		Called by kex_info[<string> id]	*/
    mac_info: {
        'hmac-sha1': function(self) {
            self.parceler.hmacSHAVersion = 'SHA-1';
            self.preferred_hash = 20;
            return;
        },
        'hmac-sha2-256': function(self) {
            self.parceler.hmacSHAVersion = 'SHA-256';
            self.preferred_hash = 32;
            return;
        }
    },
    /*
    	A table storing various function calls corresponding to the Message ID numbers defined [https://www.ietf.org/rfc/rfc4250.txt]
    	called like :
    		`handler_table[id](<object> SSHyClient.transport, <string> message)`
    */
    handler_table: {
		/* Sends our local SSH version to the SSH server */
		0: function(self, m){
			// Directly interface with the websocket
			self.parceler.socket.sendB64(self.local_version + '\r\n');
			// Slice off the '/r/n' from the end of our remote version
			self.remote_version = m.slice(0, m.length - 2);
			self.send_kex_init();
			return;
		},
        /* SSH_MSG_DISCONNECT - sent by the SSH server when the connection is gracefully closed */
        1: function(self, m) {
            self.disconnect();
            return;
        },
        /* SSH_MSG_IGNORE - sent by the SSH server when keys are not to be echoed */
        2: function(self, m) {
            return;
        },
        /* SSH_MSG_UNIMPLEMENTED - sent by the server to indicate a function is not implemented on the remote */
        3: function(self, m) {
            return;
        },
        /* SSH_MSG_SERVICE_ACCEPT: sent by the SSH server after the client request's a service (post-kex) */
        6: function(self, m) {
            var service = new SSHyClient.Message(m.slice(1)).get_string();
            // Check th type of message sent by the server and start the appropriate service
            if (service == "ssh-userauth") {
                self.auth.ssh_connection();
            }
            return;
        },
        /* SSH_MSG_KEXINIT: sent by the server after algorithm negotiation - contains server's keys and hash */
        20: function(self, m) {
            // Remote_kex_message must have no padding or length meta data so we have to strip that out
            self.parse_kex_reply(m);
            self.remote_kex_message = m; // we need this later for calculating H
            self.preferred_kex.start();
            return;
        },
		/*  SSH_MSG_NEWKEYS: sent by the server to inform us that it will use encryption from now on */
		21: function(self){
	        self.activate_encryption();
			return;
		},
        /* SSH_MSG_KEX_DH_GEX_GROUP: used for DH GroupEx when negotiating which group to use */
        31: function(self, m) {
            /* Since we're just extracting data from r in parse_reply, we don't need to do the processing to remove the padding
			 and can just remove the first 1 byte (message code) */
            self.preferred_kex.parse_reply(31, m.slice(1));
            return;
        },
        /* SSH_MSG_KEX_DH_GEX_REPLY: used for DH GroupEx, sent by the server - contains server's keys and hash */
        33: function(self, m) {
            self.preferred_kex.parse_reply(33, m.slice(1));
            return;
        },
        /* SSH_MSG_USERAUTH_FAILURE: sent by the server when there is a complete or partial failure with user authentication */
        51: function(self, m) {
            self.auth.awaitingAuthentication = false;
            self.auth.authFailure();
            return;
        },
        /* SSH_MSG_USERAUTH_SUCCESS: sent by the server when an authentication attempt succeeds */
        52: function(self, m) {
            self.auth.authenticated = true;
            self.auth.awaitingAuthentication = false;
            self.auth.auth_success(true);
            return;
        },
        /* SSH_MSG_GLOBAL_REQUEST: sent by the server to request information, server sends its hostkey after user-auth
           but RSA keys (TODO) aren't implemented so for now we can ignore this message */
        80: function(self, m) {
            return;
        },
        /* SSH_MSG_CHANNEL_OPEN_CONFIRMATION: sent by the server to inform the client that a new channel has been opened */
        91: function(self, m) {
            self.auth.channelOpened = true;
            resize()
            self.auth.mod_pty('pty-req', term.cols, term.rows, 'xterm');
            return;
        },
        /* SSH_MSG_CHANNEL_WINDOW_ADJUST: sent by the server to inform the client of the maximum window size (bytes) */
        93: function(self, m) {
            return;
        },
        /* SSH_MSG_CHANNEL_DATA: text sent by the server which is displayed by writing to the terminal */
        94: function(self, m) {
            // Slice the heading 9 bytes and send the remaining xterm sequence to the terminal
            var str = m.slice(9);

			// Local Echo module
			if(self.settings.localEcho){
				// Inspect the packet for identifying shell type
				self.settings.testShell(str);
				// Inspect the packet for fullscreen applications
				self.settings.parseLocalEcho(str);
				if (self.lastKey) {
					/* 	If packet data == lastkey pressed do nothing, otherwise delete last key in term
						and write the returned packet data 	*/
	                if (str == self.lastKey.substring(0,1)) {
	                    self.lastKey = self.lastKey.slice(1);
	                    return;
	                }
	                self.lastKey = self.lastKey.slice(1);
	                term.write('\b');
	            }
			}
			// Convert str and write it to console
            term.write(fromUtf8(str));
            return;
        },
        /* SSH_MSG_CHANNEL_EOF: sent by the server indicating no more data will be sent to the channel*/
        96: function(self, m) {
            return;
        },
        /* SSH_MSG_CHANNEL_CLOSE: sent by the server to indicate the channel is now closed; the SSH connection remains open*/
        97: function(self, m) {
            self.disconnect();
            return;
        },
        /* SSH_MSG_CHANNEL_REQUEST: sent by the server to request a new channel, as the client we can just ignore this*/
        98: function(self, m) {
            return;
        }
    },

    /*
		Once the SSH server has transmitted its full window size it gets locked up and cannot send more data
		until the window has been readjusted.

		Using WINDOW_SIZE from puTTy
	*/
    winAdjust: function() {
        var m = new SSHyClient.Message();
        m.add_bytes(String.fromCharCode(SSHyClient.MSG_CHANNEL_WINDOW_ADJUST));
        m.add_int(0);
        m.add_int(SSHyClient.WINDOW_SIZE);

        this.send_packet(m.toString());
        this.parceler.windowSize = SSHyClient.WINDOW_SIZE;
    },
    // Disconnect the web client from the server with a given error code (11 - SSH_DISCONNECT_BY_APPLICATION )
    disconnect: function(reason) {
		this.closing = true;
        reason = reason === undefined ? 11 : reason;
        var m = new SSHyClient.Message();
        m.add_bytes(String.fromCharCode(SSHyClient.MSG_DISCONNECT));
        m.add_int(reason);
        this.send_packet(m.toString());
        ws.close();
        term.write("\r\nConnection to " + this.auth.hostname + " closed. Code - " + reason);
    },
	// Sends a null packet to the SSH server to keep the connection alive
	keepAlive: function(){
		// Make sure the websocket is still open
		if(ws.readyState === 3){
			return;
		}
		var m = new SSHyClient.Message();
		m.add_bytes(String.fromCharCode(SSHyClient.MSG_IGNORE));
		m.add_string('');

		transport.send_packet(m.toString());
	},
	/* 	Cuts the padding 00's off the end of a message by reading the padding length
		- param <string> m
		returns <string>	*/
    cut_padding: function(m) {
        return m.substring(1, m.length - m[0].charCodeAt(0));
    },
	// Sends the raw packet to the parceler to be encapsulated and sent via websocket
    send_packet: function(m) {
        this.parceler.send(m);
    },
	// Initiates the key exchange process by sending our supported algorithms & ciphers
    send_kex_init: function() {
        var m = new SSHyClient.Message();
        m.add_bytes(String.fromCharCode(SSHyClient.MSG_KEX_INIT));
        // add 16 random bytes
        m.add_bytes(read_rng(16));
        m.add_string(this.preferred_algorithms[0]); // Preferred Kex
        m.add_string(this.preferred_algorithms[1]); // Preferred Server keys
		// Adds cipher, mac, compression and languages twice
		for(var i = 2; i < 6; i++){
			m.add_string(this.preferred_algorithms[i]);
			m.add_string(this.preferred_algorithms[i]);
		}

        m.add_boolean(false); // Kex guessing
        m.add_int(0);

		m = m.toString();
        //save a copy for calculating H later
        this.local_kex_message = m;

        this.send_packet(m);
    },
	// Parses the server's kex init and selects best fit algorithms & ciphers
    parse_kex_reply: function(m) {
        m = new SSHyClient.Message(m);
		// Cuts the 16 byte random cookie and message flags from the beginning
		m.get_bytes(17);

		// Gets the supported algorithms, ignoring repeated keys/cipher algorithms
        var kex = filter(this.preferred_algorithms[0], m.get_string().split(','));
        var keys = filter(this.preferred_algorithms[1], m.get_string().split(','));
        m.get_string();
        var cipher = filter(this.preferred_algorithms[2], m.get_string().split(','));
        m.get_string();
        var mac = filter(this.preferred_algorithms[3], m.get_string().split(','));

		// Sanity checking to make sure nessesary algorithms have been negotiated
        if (!kex || !keys || !cipher || !mac) {
            var missing = '';
            if (!kex) {
                missing += "KEX Algorithm,";
            }
            if (!keys) {
                missing += "Host Keys,";
            }
            if (!cipher) {
                missing += "Encryption Cipher,";
            }
            if (!mac) {
                missing += "MAC Algorithm";
            }

            //term.write("Incompatable SSH server (no compatable - " + missing + " )");
            throw "Chosen Algs = kex=" + kex + ", keys=" + keys + ", cipher=" + cipher + ", mac=" + mac;
        }
        // Set those preferred Algs
        this.preferred_kex = this.kex_info[kex](this);
        this.preferred_mac = this.mac_info[mac](this);
    },

    /* 	Takes a character and size then generates a key to be used by ssh
    	A = Initial IV 		client -> server
    	C = Encryption Key 	client -> server
    	E = Integrity Key 	client -> server
    */
    generate_key: function(char, size) {
        var m = new SSHyClient.Message();
        m.add_mpint(SSHyClient.kex.K);
        m.add_bytes(SSHyClient.kex.H);
        m.add_bytes(char);
        m.add_bytes(SSHyClient.kex.sessionId);

        return this.preferred_kex.SHAVersion == 'SHA-1' ? new SSHyClient.hash.SHA1(m.toString()).digest().substring(0, size) : new SSHyClient.hash.SHA256(m.toString()).digest().substring(0, size);
    },
	// Sets up the keys and ciphers that the parceler will use
    activate_encryption: function() {
        this.parceler.block_size = 16;
		this.parceler.macSize = this.preferred_hash;

        // Generate the keys we need for encryption and HMAC
        this.parceler.outbound_enc_iv = this.generate_key('A', this.parceler.block_size, this.preferred_kex.SHAVersion);
        this.parceler.outbound_enc_key = this.generate_key('C', this.parceler.block_size, this.preferred_kex.SHAVersion);
        this.parceler.outbound_mac_key = this.generate_key('E', this.parceler.macSize, this.preferred_kex.SHAVersion);

        this.parceler.outbound_cipher = new SSHyClient.crypto.AES(this.parceler.outbound_enc_key,
            SSHyClient.AES_CTR,
            this.parceler.outbound_enc_iv,
            new SSHyClient.crypto.counter(this.parceler.block_size * 8, inflate_long(this.parceler.outbound_enc_iv)));

        this.parceler.inbound_enc_iv = this.generate_key('B', this.parceler.block_size, this.preferred_kex.SHAVersion);
        this.parceler.inbound_enc_key = this.generate_key('D', this.parceler.block_size, this.preferred_kex.SHAVersion);
        this.parceler.inbound_mac_key = this.generate_key('F', this.parceler.macSize, this.preferred_kex.SHAVersion);

        this.parceler.inbound_cipher = new SSHyClient.crypto.AES(this.parceler.inbound_enc_key,
            SSHyClient.AES_CTR,
            this.parceler.inbound_enc_iv,
            new SSHyClient.crypto.counter(this.parceler.block_size * 8, inflate_long(this.parceler.inbound_enc_iv)));

        // signal to the parceler that we want to encrypt and decypt
        this.parceler.encrypting = true;

        this.auth.request_auth();
    },
	// Takes an arbitrary packet and processes it to be looked up by the handler_table
    handle_dec: function(m) {
        // Cut the padding off
        m = this.cut_padding(m);
        // Should now be in format [ptype][message]
        try {
            this.handler_table[m.substring(0, 1).charCodeAt(0)](this, m);
        } catch (err) {
            console.log(err);
            console.log("Error! code - " + m.substring(0, 1).charCodeAt(0) + " does not exist!");
        }
    },
    str_to_bytes: function(s) {
        return unescape(encodeURIComponent(s))
    },
	// Takes a char or string and sends it to the SSH server
    expect_key: function(command) {
		// Make sure a non-null command is being sent
		if(!command){
			return;
		}
		// encapsulates a character or command and sends it to the SSH server
		var m = new SSHyClient.Message();
		m.add_bytes(String.fromCharCode(SSHyClient.MSG_CHANNEL_DATA));
		m.add_int(0);
		m.add_string(this.str_to_bytes(command.toString()));

		this.parceler.send(m);
    },
	// Sends the new keys message signaling we're using the generated keys from now on
    send_new_keys: function(SHAVersion) {
        var m = new SSHyClient.Message();
        m.add_bytes(String.fromCharCode(SSHyClient.MSG_NEW_KEYS));

        this.send_packet(m);
    }
};
/**
 * Copyright (c) 2017 The xterm.js authors. All rights reserved.
 * @license MIT
 */

var MINIMUM_COLS = 2;
var MINIMUM_ROWS = 1;
var FitAddon = /** @class */ (function () {
    'use strict';
    function FitAddon() {
    }
    FitAddon.prototype.activate = function (terminal) {
        this._terminal = terminal;
    };
    FitAddon.prototype.dispose = function () { };
    FitAddon.prototype.fit = function () {
        var dims = this.proposeDimensions();
        if (!dims || !this._terminal) {
            return;
        }
        // TODO: Remove reliance on private API
        var core = this._terminal._core;
        // Force a full render
        if (this._terminal.rows !== dims.rows || this._terminal.cols !== dims.cols) {
            core._renderService.clear();
            this._terminal.resize(dims.cols, dims.rows);
        }
    };
    FitAddon.prototype.proposeDimensions = function () {
        if (!this._terminal) {
            return undefined;
        }
        if (!this._terminal.element || !this._terminal.element.parentElement) {
            return undefined;
        }
        // TODO: Remove reliance on private API
        var core = this._terminal._core;
        if (core._renderService.dimensions.actualCellWidth === 0 || core._renderService.dimensions.actualCellHeight === 0) {
            return undefined;
        }
        var parentElementStyle = window.getComputedStyle(this._terminal.element.parentElement);
        var parentElementHeight = parseInt(parentElementStyle.getPropertyValue('height'));
        var parentElementWidth = Math.max(0, parseInt(parentElementStyle.getPropertyValue('width')));
        var elementStyle = window.getComputedStyle(this._terminal.element);
        var elementPadding = {
            top: parseInt(elementStyle.getPropertyValue('padding-top')),
            bottom: parseInt(elementStyle.getPropertyValue('padding-bottom')),
            right: parseInt(elementStyle.getPropertyValue('padding-right')),
            left: parseInt(elementStyle.getPropertyValue('padding-left'))
        };
        var elementPaddingVer = elementPadding.top + elementPadding.bottom;
        var elementPaddingHor = elementPadding.right + elementPadding.left;
        var availableHeight = parentElementHeight - elementPaddingVer;
        var availableWidth = parentElementWidth - elementPaddingHor - core.viewport.scrollBarWidth;
        var geometry = {
            cols: Math.max(MINIMUM_COLS, Math.floor(availableWidth / core._renderService.dimensions.actualCellWidth)),
            rows: Math.max(MINIMUM_ROWS, Math.floor(availableHeight / core._renderService.dimensions.actualCellHeight))
        };
        return geometry;
    };
    return FitAddon;
}());

SSHyClient.auth = function(parceler) {
    this.parceler = parceler; // We shouldn't need anything from the transport handler
    this.authenticated = null;
    this.awaitingAuthentication = false;
	this.hostname = wsproxyURL ? wsproxyURL.split('/')[2].split(':')[0] : '';
	this.termUsername = '';
	this.termPassword = undefined;
	this.failedAttempts = 0;
    this.channelOpened = false;
};

SSHyClient.auth.prototype = {
    // Requests we want to authenticate ourselves with the SSH server
    request_auth: function() {
        var m = new SSHyClient.Message();
        m.add_bytes(String.fromCharCode(SSHyClient.MSG_SERVICE_REQUEST));
        m.add_string('ssh-userauth');
        this.parceler.send(m);
    },
    // Sends the username and password provided by index.html
    ssh_connection: function() {
		if(!this.termUsername || !this.termPassword){
			// If no termUser or termPass has been set then we are likely using the wrapper
			if(!term){
				startxtermjs();
			}
			return;
		}

       var m = new SSHyClient.Message();
       m.add_bytes(String.fromCharCode(SSHyClient.MSG_USERAUTH_REQUEST));
       m.add_string(this.termUsername);
       m.add_string("ssh-connection");
       m.add_string("password");
       m.add_boolean(false);
       m.add_string(this.termPassword);

       this.awaitingAuthentication = true;

       this.parceler.send(m);
	},
    // Called on successful or partially successful SSH connection authentications
    auth_success: function(success) {
        if (success) {
            // Change the window title
            document.title = this.termUsername + '@' + this.hostname;
			// Purge the username and password
			this.termUsername = '';
			this.termPassword = undefined;
			// Make sure xtermjs has been initialised
			if(!term){
				startxtermjs();
			}
			// Starts up the keep alive interval to 240s
			transport.settings.setKeepAlive(240);
			document.getElementById('keepAlive').value = 240;
            // We've been authenticated, lets open a channel
            this.open_channel('session');
        }
        // TODO: implement follow on tries for authentication (keyboard/public key)
    },
    // Opens a channel - generally called right after authenticating with the SSH server
    open_channel: function(type, onsuccess) {
        onsuccess = onsuccess === undefined ? null : onsuccess;
        var m = new SSHyClient.Message();
        m.add_bytes(String.fromCharCode(SSHyClient.MSG_CHANNEL_OPEN));
        m.add_string(type);
        m.add_int(1);
        m.add_int(SSHyClient.WINDOW_SIZE);
        m.add_int(SSHyClient.MAX_PACKET_SIZE);

        this.parceler.send(m);
    },
    // Requests a pseudo-terminal, defaulting to xterm if no other terminal emulator is provided when type == "pty-req"
    // Sends the remote server our terminal rows/cols settings, called by window.resize() when type == "window-change"
    mod_pty: function(type, width, height, term) {
        if (!this.channelOpened) {
            return;
        }

        var m = new SSHyClient.Message();
        m.add_bytes(String.fromCharCode(SSHyClient.MSG_CHANNEL_REQUEST));
        m.add_int(0);
        m.add_string(type);
        m.add_boolean(false); // we don't want any enviroment vars to be returned
        if (term) {
            m.add_string(term);
        }
        m.add_int(width);
        m.add_int(height);
        // pixel data, which is overwritten by the above height and width
        m.add_int(0);
        m.add_int(0);
        
        if (term) {
            // Don't sent any special terminal modes
            m.add_string('');
        }

        this.parceler.send(m);
       
        if (term) {
            // invokes the shell session right after sending the packet
            this.invoke_shell();
        }
    },
    // Invokes the interactive terminal using the pseudo-terminal channel
    invoke_shell: function() {
        // Craft the shell invocation packet
        var m = new SSHyClient.Message();
        m.add_bytes(String.fromCharCode(SSHyClient.MSG_CHANNEL_REQUEST));
        m.add_int(0);
        m.add_string('shell');
        m.add_boolean(false);

        this.parceler.send(m);
        // Start xterm.js
        if (this.termPassword === undefined) {
            term.write('\n\r');
            return;
        }
        startxtermjs();
    },
	// Called on unsuccessful SSH connection authentication
	authFailure: function() {
		if(term){
		    term.write("Access Denied\r\n");
			// if we've failed authentication more than 5 times than disconect and warn the user
		    if (++this.failedAttempts >= 5) {
		        term.write("Too many failed authentication attempts");
		        transport.disconnect();
		        return;
		    }
		    term.write(this.termUsername + '@' + this.hostname + '\'s password:');
		    this.termPassword = '';
		} else {
			display_error('Invalid Username or Password');
		}
	}
};
SSHyClient.crypto = {};

// AES wrapper for Libs/aes.min.js (SJCL)
SSHyClient.crypto.AES = function(key, mode, iv, counter) {
    // Setup our cipher and give it the key and mode
    this.cipher = new sjcl.cipher.aes(sjcl.codec.bytes.toBits(toByteArray(key)), mode);
    this.mode = mode;
    // some support for CBC mode - however not fully implemented
    if (this.mode == SSHyClient.AES_CBC) {
        this.iv = toByteArray(iv);
    }
    this.counter = counter;
};

SSHyClient.crypto.AES.prototype = {
    encrypt: function(plaintext) {
        // encrypt the plaintext!
        var ciphertext = this.cipher.encrypt(toByteArray(plaintext), this.iv, this.counter);
        if (this.mode == SSHyClient.AES_CBC) {
            // take the last 16 bytes for our IV
            this.iv = ciphertext.slice(-16);
        }
        // convert the ciphertext from an array of bytes back into text
        return fromByteArray(ciphertext);
    },

    decrypt: function(ciphertext) {
        var plaintext;
        ciphertext = toByteArray(ciphertext);
        // do different stuff for CTR & CBC mode
        if (this.mode == SSHyClient.AES_CBC) {
            plaintext = this.cipher.decrypt(ciphertext, this.iv);
            this.iv = ciphertext.slice(-16);
        } else {
            plaintext = this.cipher.encrypt(ciphertext, this.iv, this.counter);
        }
        return fromByteArray(plaintext);
    }
};
// Defines our custom counter
SSHyClient.crypto.counter = function(num, init) {
    init = init === undefined ? 1 : init;

    this.blocksize = num / 8;
    this.overflow = 0;

    // setup the initial counter value depending on if we recieved a number or not.
    if (init === 0) {
        this.value = new array(this.blocksize + 1).join('\xFF');
    } else {
        var val = deflate_long(init.subtract(BigInteger.ONE), false);
        this.value = new Array(this.blocksize - val.length + 1).join('\x00') + val;
    }
};

SSHyClient.crypto.counter.prototype = {
    // increment the current counter
    increment: function() {
        var i = this.blocksize;
        while (i--) {
            var count = String.fromCharCode((this.value.charCodeAt(i) + 1) % 256);
            this.value = setCharAt(this.value, i, count);
            if (count != '\x00') {
                return this.value;
            }
        }

        // Deals with counter resetting / overflowing
		var x = deflate_long(this.overflow, false);
		this.value = new Array(this.blocksize - x.length + 1).join('\x00') + x;
        return this.value;

    }
};
/*
  Implementation of SSHv2 Message

  Each packet is a stream of bytes that encode a combinatiuon of strings, integers, booleans
  and multipoint integers.

  This class builds or breaks down a bytes stream with the implemented functions

*/

SSHyClient.Message = function(content) {
    this.position = 0;

    this.packet = content === undefined ? String() : String(content);
};

SSHyClient.Message.prototype = {
    toString: function() {
        return this.packet;
    },

    get_bytes: function(n) {
        var b = this.packet.substring(this.position, this.position + n);
        this.position += n;
        if (b.length < n && n < 1048576) { // n < 1Mb
            return b + new Array(n - b.length + 1).join('\x00');
        }
        return b;
    },

    get_int: function() {
        return struct.unpack('I', this.get_bytes(4))[0];
    },

    get_string: function() {
        return this.get_bytes(this.get_int());
    },

    get_mpint: function() {
        return inflate_long(this.get_string());
    },

    add_bytes: function(d) {
        this.packet += d;
        return this;
    },

    add_boolean: function(b) {
        this.add_bytes(b === true ? '\x01' : '\x00');
        return this;
    },

    add_int: function(i) {
        this.packet += struct.pack('I', i);
        return this;
    },

    add_mpint: function(d) {
        this.add_string(deflate_long(d));
        return this;
    },

    add_string: function(d) {
        this.add_int(d.length);
        this.packet += d;
        return this;
    }
};
SSHyClient.parceler = function(web_socket, transport) {
    this.socket = web_socket;
    this.transport = transport;
    this.encrypting = false;

    // Encryption & Mac variables
    this.outbound_enc_iv = this.outbound_enc_key = this.outbound_mac_key = this.outbound_cipher= null;

    this.inbound_iv = this.inbound_enc_key = this.inbound_mac_key = this.inbound_cipher = null;

    this.hmacSHAVersion = null;
	this.macSize = 0;

    this.outbound_sequence_num = this.inbound_sequence_num = 0;
    this.block_size = 8;

    this.prevHeader = this.inbound_buffer = '';

	this.windowSize = SSHyClient.WINDOW_SIZE;

	/* Stores the recieved and transmitted data in bytes;
	   possible integer overflow however would need to exchange 8.1PetaBytes of data*/
	this.recieveData = this.transmitData = 0;
};

SSHyClient.parceler.prototype = {
	// Send / Encrypt messages to the websocket proxy
    send: function(data) {
		// Encapsulate the data with padding and length
		packet = this.pack_message(data.toString());

		if (this.encrypting) {
			// Encrypt the encapsulated packet
			var encrypted_packet = this.outbound_cipher.encrypt(packet);

            // Add the mac hash & pack the sequence number
            packet = encrypted_packet + SSHyClient.hash.HMAC(this.outbound_mac_key, struct.pack('I', this.outbound_sequence_num) + packet, this.hmacSHAVersion);
        }

		// Now send it as a base64 string
		this.socket.sendB64(packet);

        this.outbound_sequence_num++;
    },

    // Calculates and adds the packet length, padding length and padding to the message
    pack_message: function(data) {
        var padding = 3 + this.block_size - ((data.length + 8) % this.block_size);

        // Adds the message length, padding length and data together
        var packet = struct.pack('I', data.length + padding + 1) + struct.pack('B', padding) + data;

        // RFC says we should use random bytes but we should only need if we are encrypting. Otherwise it is a waste of time
        packet += this.encrypting ? read_rng(padding) : new Array(padding + 1).join('\x00');

        return packet;
    },
	// Handles inbound traffic over the socket
	handle: function(r) {
		// Add the packet length to the parceler's rx
		this.recieveData += r.length;
		this.transport.settings.setNetTraffic(transport.parceler.recieveData, true);
		/* Checking for encryption first since it will be the most common check
			- Parceler should send decrypted message ( -packet length -padding length -padding ) to transport.handle_dec()
			  from there it should be send to the relevant handler (auth/control)		*/
		if (this.encrypting) {
			this.inbound_buffer += r;
			this.decrypt();
			return;
		}

		/* If we don't have a remote_version then send our version and set the remote_version */
		if (!this.transport.remote_version) {
			this.transport.handler_table[0](this.transport, r);
			return;
		}

		this.inbound_buffer += r;
		this.decrypt(r);
	},
	// Decrypt messages from the SSH server
    decrypt: function() {
        // Since we cannot guarentee that we will be decyrpting zero, one or multiple packets we have to rely on this.read_ibuffer()
        var buffer = ' ';
        var header;
        while (buffer !== null) {
            // If there isn'ta previous header then we need to get one
            if (!this.prevHeader) {
				// Read [this.block_size] from the inbound buffer
                header = this.read_ibuffer();
                if (!header) { // just for safety
                    return;
                }
				// Only need to decrypt it if we've enabled encryption
				if(this.encrypting){
                	header = this.inbound_cipher.decrypt(header);
				}
            } else {
                header = this.prevHeader;
                this.prevHeader = '';
            }
			// Unpack the packet size from the decrypted header
            var packet_size = struct.unpack('I', header.substring(0, 4))[0];
            // We can store the start of our message for later now
            var leftover = header.substring(4);

			// Attempt to read [packet_size] from inbound buffer; returns null on failure
            buffer = this.read_ibuffer(packet_size + this.macSize - leftover.length);
            if (!buffer) {
				// Couldn't read [packet_size] so store the prevHeader
                this.prevHeader = header;
                return;
            }
			// Get the packet body and mac length from the buffer
            var packet = buffer.substring(0, packet_size - leftover.length);

			// Decrypt the packet
			if(this.encrypting){
				packet = this.inbound_cipher.decrypt(packet);
			}

			// Prepend our leftover header
            packet = leftover + packet;

            /*
             	Now lets verify the MAC - just to make sure!
            	- To do this we will get the MAC from the message and generate our own MAC, then compare the two.
            */
			if(this.macSize){
	            var mac = buffer.substring(packet_size - leftover.length);
	            var mac_payload = struct.pack('I', this.inbound_sequence_num) + struct.pack('I', packet_size) + packet;
	            var our_mac = SSHyClient.hash.HMAC(this.inbound_mac_key, mac_payload, this.hmacSHAVersion);
	            if (our_mac != mac) {
					// Oops something went wrong, lets close the connection
	                this.transport.disconnect();
	                throw "Inbound MAC verification failed - Mismatched MAC";
	            }
			}

            // Increment the sequence number
            this.inbound_sequence_num++;

            // calculate how much window size we have left
            this.windowSize -= packet_size;

			// If we've run out of window size then readjust it
            if (this.windowSize <= 0) {
                this.transport.winAdjust();
            }
			// Send the decoded packet to the transport handler
            this.transport.handle_dec(packet);
        }
    },
	// Read [bytes] from the inbound buffer
    read_ibuffer: function(bytes) { // if we don't feed it any arguments we are only wanting one block anyway
        bytes = bytes === undefined ? this.block_size : bytes;
        if (this.inbound_buffer.length < bytes) {
            return null;
        }

        var out = this.inbound_buffer.substring(0, bytes);
		// Remove the bytes we're taking from the buffer
        this.inbound_buffer = this.inbound_buffer.substring(bytes);
        return out;
    }
};
SSHyClient.RSAKey = function(msg){
	msg.get_string();
	this.e = msg.get_mpint();
	this.n = msg.get_mpint();
};

SSHyClient.RSAKey.prototype = {
	/*	Turn a 20-byte SHA1 hash into a blob of data as large as the key's N,
		using PKCS1's \"emsa-pkcs1-v1_5\" encoding.	*/
	pkcs1imify : function(data) {
		var SHA1_DIGESTINFO = '\x30\x21\x30\x09\x06\x05\x2b\x0e\x03\x02\x1a\x05\x00\x04\x14';
		var filler = new Array(deflate_long(this.n, 0).length - SHA1_DIGESTINFO.length - data.length - 3 + 1).join('\xff');
		return '\x00\x01' + filler + '\x00' + SHA1_DIGESTINFO + data;
	},
	/* 	Compares data (hash H) with the SSH server's signature
		returns true if match, false otherwise.*/
	verify : function(data, SSHsig) {
		if (SSHsig.get_string() != 'ssh-rsa') {
			return false;
		}
		var sigData = inflate_long(SSHsig.get_string(), true);
		var hashObj = inflate_long(this.pkcs1imify(new SSHyClient.hash.SHA1(data).digest()), true);

	 	return sigData.modPow(this.e, this.n).equals(hashObj);
	},
};

!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var r=t();for(var i in r)("object"==typeof exports?exports:e)[i]=r[i]}}(self,(function(){return(()=>{"use strict";var e={4567:function(e,t,r){var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0}),t.AccessibilityManager=void 0;var o=r(9042),s=r(6114),a=r(6193),c=r(3656),l=r(844),h=r(5596),u=r(9631),f=function(e){function t(t,r){var i=e.call(this)||this;i._terminal=t,i._renderService=r,i._liveRegionLineCount=0,i._charsToConsume=[],i._charsToAnnounce="",i._accessibilityTreeRoot=document.createElement("div"),i._accessibilityTreeRoot.classList.add("xterm-accessibility"),i._rowContainer=document.createElement("div"),i._rowContainer.setAttribute("role","list"),i._rowContainer.classList.add("xterm-accessibility-tree"),i._rowElements=[];for(var n=0;n<i._terminal.rows;n++)i._rowElements[n]=i._createAccessibilityTreeNode(),i._rowContainer.appendChild(i._rowElements[n]);if(i._topBoundaryFocusListener=function(e){return i._onBoundaryFocus(e,0)},i._bottomBoundaryFocusListener=function(e){return i._onBoundaryFocus(e,1)},i._rowElements[0].addEventListener("focus",i._topBoundaryFocusListener),i._rowElements[i._rowElements.length-1].addEventListener("focus",i._bottomBoundaryFocusListener),i._refreshRowsDimensions(),i._accessibilityTreeRoot.appendChild(i._rowContainer),i._renderRowsDebouncer=new a.RenderDebouncer(i._renderRows.bind(i)),i._refreshRows(),i._liveRegion=document.createElement("div"),i._liveRegion.classList.add("live-region"),i._liveRegion.setAttribute("aria-live","assertive"),i._accessibilityTreeRoot.appendChild(i._liveRegion),!i._terminal.element)throw new Error("Cannot enable accessibility before Terminal.open");return i._terminal.element.insertAdjacentElement("afterbegin",i._accessibilityTreeRoot),i.register(i._renderRowsDebouncer),i.register(i._terminal.onResize((function(e){return i._onResize(e.rows)}))),i.register(i._terminal.onRender((function(e){return i._refreshRows(e.start,e.end)}))),i.register(i._terminal.onScroll((function(){return i._refreshRows()}))),i.register(i._terminal.onA11yChar((function(e){return i._onChar(e)}))),i.register(i._terminal.onLineFeed((function(){return i._onChar("\n")}))),i.register(i._terminal.onA11yTab((function(e){return i._onTab(e)}))),i.register(i._terminal.onKey((function(e){return i._onKey(e.key)}))),i.register(i._terminal.onBlur((function(){return i._clearLiveRegion()}))),i.register(i._renderService.onDimensionsChange((function(){return i._refreshRowsDimensions()}))),i._screenDprMonitor=new h.ScreenDprMonitor,i.register(i._screenDprMonitor),i._screenDprMonitor.setListener((function(){return i._refreshRowsDimensions()})),i.register(c.addDisposableDomListener(window,"resize",(function(){return i._refreshRowsDimensions()}))),i}return n(t,e),t.prototype.dispose=function(){e.prototype.dispose.call(this),u.removeElementFromParent(this._accessibilityTreeRoot),this._rowElements.length=0},t.prototype._onBoundaryFocus=function(e,t){var r=e.target,i=this._rowElements[0===t?1:this._rowElements.length-2];if(r.getAttribute("aria-posinset")!==(0===t?"1":""+this._terminal.buffer.lines.length)&&e.relatedTarget===i){var n,o;if(0===t?(n=r,o=this._rowElements.pop(),this._rowContainer.removeChild(o)):(n=this._rowElements.shift(),o=r,this._rowContainer.removeChild(n)),n.removeEventListener("focus",this._topBoundaryFocusListener),o.removeEventListener("focus",this._bottomBoundaryFocusListener),0===t){var s=this._createAccessibilityTreeNode();this._rowElements.unshift(s),this._rowContainer.insertAdjacentElement("afterbegin",s)}else s=this._createAccessibilityTreeNode(),this._rowElements.push(s),this._rowContainer.appendChild(s);this._rowElements[0].addEventListener("focus",this._topBoundaryFocusListener),this._rowElements[this._rowElements.length-1].addEventListener("focus",this._bottomBoundaryFocusListener),this._terminal.scrollLines(0===t?-1:1),this._rowElements[0===t?1:this._rowElements.length-2].focus(),e.preventDefault(),e.stopImmediatePropagation()}},t.prototype._onResize=function(e){this._rowElements[this._rowElements.length-1].removeEventListener("focus",this._bottomBoundaryFocusListener);for(var t=this._rowContainer.children.length;t<this._terminal.rows;t++)this._rowElements[t]=this._createAccessibilityTreeNode(),this._rowContainer.appendChild(this._rowElements[t]);for(;this._rowElements.length>e;)this._rowContainer.removeChild(this._rowElements.pop());this._rowElements[this._rowElements.length-1].addEventListener("focus",this._bottomBoundaryFocusListener),this._refreshRowsDimensions()},t.prototype._createAccessibilityTreeNode=function(){var e=document.createElement("div");return e.setAttribute("role","listitem"),e.tabIndex=-1,this._refreshRowDimensions(e),e},t.prototype._onTab=function(e){for(var t=0;t<e;t++)this._onChar(" ")},t.prototype._onChar=function(e){var t=this;this._liveRegionLineCount<21&&(this._charsToConsume.length>0?this._charsToConsume.shift()!==e&&(this._charsToAnnounce+=e):this._charsToAnnounce+=e,"\n"===e&&(this._liveRegionLineCount++,21===this._liveRegionLineCount&&(this._liveRegion.textContent+=o.tooMuchOutput)),s.isMac&&this._liveRegion.textContent&&this._liveRegion.textContent.length>0&&!this._liveRegion.parentNode&&setTimeout((function(){t._accessibilityTreeRoot.appendChild(t._liveRegion)}),0))},t.prototype._clearLiveRegion=function(){this._liveRegion.textContent="",this._liveRegionLineCount=0,s.isMac&&u.removeElementFromParent(this._liveRegion)},t.prototype._onKey=function(e){this._clearLiveRegion(),this._charsToConsume.push(e)},t.prototype._refreshRows=function(e,t){this._renderRowsDebouncer.refresh(e,t,this._terminal.rows)},t.prototype._renderRows=function(e,t){for(var r=this._terminal.buffer,i=r.lines.length.toString(),n=e;n<=t;n++){var o=r.translateBufferLineToString(r.ydisp+n,!0),s=(r.ydisp+n+1).toString(),a=this._rowElements[n];a&&(0===o.length?a.innerText=" ":a.textContent=o,a.setAttribute("aria-posinset",s),a.setAttribute("aria-setsize",i))}this._announceCharacters()},t.prototype._refreshRowsDimensions=function(){if(this._renderService.dimensions.actualCellHeight){this._rowElements.length!==this._terminal.rows&&this._onResize(this._terminal.rows);for(var e=0;e<this._terminal.rows;e++)this._refreshRowDimensions(this._rowElements[e])}},t.prototype._refreshRowDimensions=function(e){e.style.height=this._renderService.dimensions.actualCellHeight+"px"},t.prototype._announceCharacters=function(){0!==this._charsToAnnounce.length&&(this._liveRegion.textContent+=this._charsToAnnounce,this._charsToAnnounce="")},t}(l.Disposable);t.AccessibilityManager=f},3614:(e,t)=>{function r(e){return e.replace(/\r?\n/g,"\r")}function i(e,t){return t?"[200~"+e+"[201~":e}function n(e,t,n){e=i(e=r(e),n.decPrivateModes.bracketedPasteMode),n.triggerDataEvent(e,!0),t.value=""}function o(e,t,r){var i=r.getBoundingClientRect(),n=e.clientX-i.left-10,o=e.clientY-i.top-10;t.style.width="20px",t.style.height="20px",t.style.left=n+"px",t.style.top=o+"px",t.style.zIndex="1000",t.focus()}Object.defineProperty(t,"__esModule",{value:!0}),t.rightClickHandler=t.moveTextAreaUnderMouseCursor=t.paste=t.handlePasteEvent=t.copyHandler=t.bracketTextForPaste=t.prepareTextForTerminal=void 0,t.prepareTextForTerminal=r,t.bracketTextForPaste=i,t.copyHandler=function(e,t){e.clipboardData&&e.clipboardData.setData("text/plain",t.selectionText),e.preventDefault()},t.handlePasteEvent=function(e,t,r){e.stopPropagation(),e.clipboardData&&n(e.clipboardData.getData("text/plain"),t,r)},t.paste=n,t.moveTextAreaUnderMouseCursor=o,t.rightClickHandler=function(e,t,r,i,n){o(e,t,r),n&&i.rightClickSelect(e),t.value=i.selectionText,t.select()}},4774:(e,t)=>{var r,i,n,o;function s(e){var t=e.toString(16);return t.length<2?"0"+t:t}function a(e,t){return e<t?(t+.05)/(e+.05):(e+.05)/(t+.05)}Object.defineProperty(t,"__esModule",{value:!0}),t.contrastRatio=t.toPaddedHex=t.rgba=t.rgb=t.css=t.color=t.channels=void 0,function(e){e.toCss=function(e,t,r,i){return void 0!==i?"#"+s(e)+s(t)+s(r)+s(i):"#"+s(e)+s(t)+s(r)},e.toRgba=function(e,t,r,i){return void 0===i&&(i=255),(e<<24|t<<16|r<<8|i)>>>0}}(r=t.channels||(t.channels={})),(i=t.color||(t.color={})).blend=function(e,t){var i=(255&t.rgba)/255;if(1===i)return{css:t.css,rgba:t.rgba};var n=t.rgba>>24&255,o=t.rgba>>16&255,s=t.rgba>>8&255,a=e.rgba>>24&255,c=e.rgba>>16&255,l=e.rgba>>8&255,h=a+Math.round((n-a)*i),u=c+Math.round((o-c)*i),f=l+Math.round((s-l)*i);return{css:r.toCss(h,u,f),rgba:r.toRgba(h,u,f)}},i.isOpaque=function(e){return 255==(255&e.rgba)},i.ensureContrastRatio=function(e,t,r){var i=o.ensureContrastRatio(e.rgba,t.rgba,r);if(i)return o.toColor(i>>24&255,i>>16&255,i>>8&255)},i.opaque=function(e){var t=(255|e.rgba)>>>0,i=o.toChannels(t),n=i[0],s=i[1],a=i[2];return{css:r.toCss(n,s,a),rgba:t}},i.opacity=function(e,t){var i=Math.round(255*t),n=o.toChannels(e.rgba),s=n[0],a=n[1],c=n[2];return{css:r.toCss(s,a,c,i),rgba:r.toRgba(s,a,c,i)}},(t.css||(t.css={})).toColor=function(e){switch(e.length){case 7:return{css:e,rgba:(parseInt(e.slice(1),16)<<8|255)>>>0};case 9:return{css:e,rgba:parseInt(e.slice(1),16)>>>0}}throw new Error("css.toColor: Unsupported css format")},function(e){function t(e,t,r){var i=e/255,n=t/255,o=r/255;return.2126*(i<=.03928?i/12.92:Math.pow((i+.055)/1.055,2.4))+.7152*(n<=.03928?n/12.92:Math.pow((n+.055)/1.055,2.4))+.0722*(o<=.03928?o/12.92:Math.pow((o+.055)/1.055,2.4))}e.relativeLuminance=function(e){return t(e>>16&255,e>>8&255,255&e)},e.relativeLuminance2=t}(n=t.rgb||(t.rgb={})),function(e){function t(e,t,r){for(var i=e>>24&255,o=e>>16&255,s=e>>8&255,c=t>>24&255,l=t>>16&255,h=t>>8&255,u=a(n.relativeLuminance2(c,h,l),n.relativeLuminance2(i,o,s));u<r&&(c>0||l>0||h>0);)c-=Math.max(0,Math.ceil(.1*c)),l-=Math.max(0,Math.ceil(.1*l)),h-=Math.max(0,Math.ceil(.1*h)),u=a(n.relativeLuminance2(c,h,l),n.relativeLuminance2(i,o,s));return(c<<24|l<<16|h<<8|255)>>>0}function i(e,t,r){for(var i=e>>24&255,o=e>>16&255,s=e>>8&255,c=t>>24&255,l=t>>16&255,h=t>>8&255,u=a(n.relativeLuminance2(c,h,l),n.relativeLuminance2(i,o,s));u<r&&(c<255||l<255||h<255);)c=Math.min(255,c+Math.ceil(.1*(255-c))),l=Math.min(255,l+Math.ceil(.1*(255-l))),h=Math.min(255,h+Math.ceil(.1*(255-h))),u=a(n.relativeLuminance2(c,h,l),n.relativeLuminance2(i,o,s));return(c<<24|l<<16|h<<8|255)>>>0}e.ensureContrastRatio=function(e,r,o){var s=n.relativeLuminance(e>>8),c=n.relativeLuminance(r>>8);if(a(s,c)<o)return c<s?t(e,r,o):i(e,r,o)},e.reduceLuminance=t,e.increaseLuminance=i,e.toChannels=function(e){return[e>>24&255,e>>16&255,e>>8&255,255&e]},e.toColor=function(e,t,i){return{css:r.toCss(e,t,i),rgba:r.toRgba(e,t,i)}}}(o=t.rgba||(t.rgba={})),t.toPaddedHex=s,t.contrastRatio=a},7239:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.ColorContrastCache=void 0;var r=function(){function e(){this._color={},this._rgba={}}return e.prototype.clear=function(){this._color={},this._rgba={}},e.prototype.setCss=function(e,t,r){this._rgba[e]||(this._rgba[e]={}),this._rgba[e][t]=r},e.prototype.getCss=function(e,t){return this._rgba[e]?this._rgba[e][t]:void 0},e.prototype.setColor=function(e,t,r){this._color[e]||(this._color[e]={}),this._color[e][t]=r},e.prototype.getColor=function(e,t){return this._color[e]?this._color[e][t]:void 0},e}();t.ColorContrastCache=r},5680:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.ColorManager=t.DEFAULT_ANSI_COLORS=void 0;var i=r(4774),n=r(7239),o=i.css.toColor("#ffffff"),s=i.css.toColor("#000000"),a=i.css.toColor("#ffffff"),c=i.css.toColor("#000000"),l={css:"rgba(255, 255, 255, 0.3)",rgba:4294967117};t.DEFAULT_ANSI_COLORS=Object.freeze(function(){for(var e=[i.css.toColor("#2e3436"),i.css.toColor("#cc0000"),i.css.toColor("#4e9a06"),i.css.toColor("#c4a000"),i.css.toColor("#3465a4"),i.css.toColor("#75507b"),i.css.toColor("#06989a"),i.css.toColor("#d3d7cf"),i.css.toColor("#555753"),i.css.toColor("#ef2929"),i.css.toColor("#8ae234"),i.css.toColor("#fce94f"),i.css.toColor("#729fcf"),i.css.toColor("#ad7fa8"),i.css.toColor("#34e2e2"),i.css.toColor("#eeeeec")],t=[0,95,135,175,215,255],r=0;r<216;r++){var n=t[r/36%6|0],o=t[r/6%6|0],s=t[r%6];e.push({css:i.channels.toCss(n,o,s),rgba:i.channels.toRgba(n,o,s)})}for(r=0;r<24;r++){var a=8+10*r;e.push({css:i.channels.toCss(a,a,a),rgba:i.channels.toRgba(a,a,a)})}return e}());var h=function(){function e(e,r){this.allowTransparency=r;var h=e.createElement("canvas");h.width=1,h.height=1;var u=h.getContext("2d");if(!u)throw new Error("Could not get rendering context");this._ctx=u,this._ctx.globalCompositeOperation="copy",this._litmusColor=this._ctx.createLinearGradient(0,0,1,1),this._contrastCache=new n.ColorContrastCache,this.colors={foreground:o,background:s,cursor:a,cursorAccent:c,selectionTransparent:l,selectionOpaque:i.color.blend(s,l),ansi:t.DEFAULT_ANSI_COLORS.slice(),contrastCache:this._contrastCache}}return e.prototype.onOptionsChange=function(e){"minimumContrastRatio"===e&&this._contrastCache.clear()},e.prototype.setTheme=function(e){void 0===e&&(e={}),this.colors.foreground=this._parseColor(e.foreground,o),this.colors.background=this._parseColor(e.background,s),this.colors.cursor=this._parseColor(e.cursor,a,!0),this.colors.cursorAccent=this._parseColor(e.cursorAccent,c,!0),this.colors.selectionTransparent=this._parseColor(e.selection,l,!0),this.colors.selectionOpaque=i.color.blend(this.colors.background,this.colors.selectionTransparent),i.color.isOpaque(this.colors.selectionTransparent)&&(this.colors.selectionTransparent=i.color.opacity(this.colors.selectionTransparent,.3)),this.colors.ansi[0]=this._parseColor(e.black,t.DEFAULT_ANSI_COLORS[0]),this.colors.ansi[1]=this._parseColor(e.red,t.DEFAULT_ANSI_COLORS[1]),this.colors.ansi[2]=this._parseColor(e.green,t.DEFAULT_ANSI_COLORS[2]),this.colors.ansi[3]=this._parseColor(e.yellow,t.DEFAULT_ANSI_COLORS[3]),this.colors.ansi[4]=this._parseColor(e.blue,t.DEFAULT_ANSI_COLORS[4]),this.colors.ansi[5]=this._parseColor(e.magenta,t.DEFAULT_ANSI_COLORS[5]),this.colors.ansi[6]=this._parseColor(e.cyan,t.DEFAULT_ANSI_COLORS[6]),this.colors.ansi[7]=this._parseColor(e.white,t.DEFAULT_ANSI_COLORS[7]),this.colors.ansi[8]=this._parseColor(e.brightBlack,t.DEFAULT_ANSI_COLORS[8]),this.colors.ansi[9]=this._parseColor(e.brightRed,t.DEFAULT_ANSI_COLORS[9]),this.colors.ansi[10]=this._parseColor(e.brightGreen,t.DEFAULT_ANSI_COLORS[10]),this.colors.ansi[11]=this._parseColor(e.brightYellow,t.DEFAULT_ANSI_COLORS[11]),this.colors.ansi[12]=this._parseColor(e.brightBlue,t.DEFAULT_ANSI_COLORS[12]),this.colors.ansi[13]=this._parseColor(e.brightMagenta,t.DEFAULT_ANSI_COLORS[13]),this.colors.ansi[14]=this._parseColor(e.brightCyan,t.DEFAULT_ANSI_COLORS[14]),this.colors.ansi[15]=this._parseColor(e.brightWhite,t.DEFAULT_ANSI_COLORS[15]),this._contrastCache.clear()},e.prototype._parseColor=function(e,t,r){if(void 0===r&&(r=this.allowTransparency),void 0===e)return t;if(this._ctx.fillStyle=this._litmusColor,this._ctx.fillStyle=e,"string"!=typeof this._ctx.fillStyle)return console.warn("Color: "+e+" is invalid using fallback "+t.css),t;this._ctx.fillRect(0,0,1,1);var n=this._ctx.getImageData(0,0,1,1).data;if(255!==n[3]){if(!r)return console.warn("Color: "+e+" is using transparency, but allowTransparency is false. Using fallback "+t.css+"."),t;var o=this._ctx.fillStyle.substring(5,this._ctx.fillStyle.length-1).split(",").map((function(e){return Number(e)})),s=o[0],a=o[1],c=o[2],l=o[3],h=Math.round(255*l);return{rgba:i.channels.toRgba(s,a,c,h),css:e}}return{css:this._ctx.fillStyle,rgba:i.channels.toRgba(n[0],n[1],n[2],n[3])}},e}();t.ColorManager=h},9631:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.removeElementFromParent=void 0,t.removeElementFromParent=function(){for(var e,t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];for(var i=0,n=t;i<n.length;i++){var o=n[i];null===(e=null==o?void 0:o.parentElement)||void 0===e||e.removeChild(o)}}},3656:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.addDisposableDomListener=void 0,t.addDisposableDomListener=function(e,t,r,i){e.addEventListener(t,r,i);var n=!1;return{dispose:function(){n||(n=!0,e.removeEventListener(t,r,i))}}}},3551:function(e,t,r){var i=this&&this.__decorate||function(e,t,r,i){var n,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(s=(o<3?n(s):o>3?n(t,r,s):n(t,r))||s);return o>3&&s&&Object.defineProperty(t,r,s),s},n=this&&this.__param||function(e,t){return function(r,i){t(r,i,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.MouseZone=t.Linkifier=void 0;var o=r(8460),s=r(2585),a=function(){function e(e,t,r){this._bufferService=e,this._logService=t,this._unicodeService=r,this._linkMatchers=[],this._nextLinkMatcherId=0,this._onShowLinkUnderline=new o.EventEmitter,this._onHideLinkUnderline=new o.EventEmitter,this._onLinkTooltip=new o.EventEmitter,this._rowsToLinkify={start:void 0,end:void 0}}return Object.defineProperty(e.prototype,"onShowLinkUnderline",{get:function(){return this._onShowLinkUnderline.event},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"onHideLinkUnderline",{get:function(){return this._onHideLinkUnderline.event},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"onLinkTooltip",{get:function(){return this._onLinkTooltip.event},enumerable:!1,configurable:!0}),e.prototype.attachToDom=function(e,t){this._element=e,this._mouseZoneManager=t},e.prototype.linkifyRows=function(t,r){var i=this;this._mouseZoneManager&&(void 0===this._rowsToLinkify.start||void 0===this._rowsToLinkify.end?(this._rowsToLinkify.start=t,this._rowsToLinkify.end=r):(this._rowsToLinkify.start=Math.min(this._rowsToLinkify.start,t),this._rowsToLinkify.end=Math.max(this._rowsToLinkify.end,r)),this._mouseZoneManager.clearAll(t,r),this._rowsTimeoutId&&clearTimeout(this._rowsTimeoutId),this._rowsTimeoutId=setTimeout((function(){return i._linkifyRows()}),e._timeBeforeLatency))},e.prototype._linkifyRows=function(){this._rowsTimeoutId=void 0;var e=this._bufferService.buffer;if(void 0!==this._rowsToLinkify.start&&void 0!==this._rowsToLinkify.end){var t=e.ydisp+this._rowsToLinkify.start;if(!(t>=e.lines.length)){for(var r=e.ydisp+Math.min(this._rowsToLinkify.end,this._bufferService.rows)+1,i=Math.ceil(2e3/this._bufferService.cols),n=this._bufferService.buffer.iterator(!1,t,r,i,i);n.hasNext();)for(var o=n.next(),s=0;s<this._linkMatchers.length;s++)this._doLinkifyRow(o.range.first,o.content,this._linkMatchers[s]);this._rowsToLinkify.start=void 0,this._rowsToLinkify.end=void 0}}else this._logService.debug("_rowToLinkify was unset before _linkifyRows was called")},e.prototype.registerLinkMatcher=function(e,t,r){if(void 0===r&&(r={}),!t)throw new Error("handler must be defined");var i={id:this._nextLinkMatcherId++,regex:e,handler:t,matchIndex:r.matchIndex,validationCallback:r.validationCallback,hoverTooltipCallback:r.tooltipCallback,hoverLeaveCallback:r.leaveCallback,willLinkActivate:r.willLinkActivate,priority:r.priority||0};return this._addLinkMatcherToList(i),i.id},e.prototype._addLinkMatcherToList=function(e){if(0!==this._linkMatchers.length){for(var t=this._linkMatchers.length-1;t>=0;t--)if(e.priority<=this._linkMatchers[t].priority)return void this._linkMatchers.splice(t+1,0,e);this._linkMatchers.splice(0,0,e)}else this._linkMatchers.push(e)},e.prototype.deregisterLinkMatcher=function(e){for(var t=0;t<this._linkMatchers.length;t++)if(this._linkMatchers[t].id===e)return this._linkMatchers.splice(t,1),!0;return!1},e.prototype._doLinkifyRow=function(e,t,r){for(var i,n=this,o=new RegExp(r.regex.source,(r.regex.flags||"")+"g"),s=-1,a=function(){var a=i["number"!=typeof r.matchIndex?0:r.matchIndex];if(!a)return c._logService.debug("match found without corresponding matchIndex",i,r),"break";if(s=t.indexOf(a,s+1),o.lastIndex=s+a.length,s<0)return"break";var l=c._bufferService.buffer.stringIndexToBufferIndex(e,s);if(l[0]<0)return"break";var h=c._bufferService.buffer.lines.get(l[0]);if(!h)return"break";var u=h.getFg(l[1]),f=u?u>>9&511:void 0;r.validationCallback?r.validationCallback(a,(function(e){n._rowsTimeoutId||e&&n._addLink(l[1],l[0]-n._bufferService.buffer.ydisp,a,r,f)})):c._addLink(l[1],l[0]-c._bufferService.buffer.ydisp,a,r,f)},c=this;null!==(i=o.exec(t))&&"break"!==a(););},e.prototype._addLink=function(e,t,r,i,n){var o=this;if(this._mouseZoneManager&&this._element){var s=this._unicodeService.getStringCellWidth(r),a=e%this._bufferService.cols,l=t+Math.floor(e/this._bufferService.cols),h=(a+s)%this._bufferService.cols,u=l+Math.floor((a+s)/this._bufferService.cols);0===h&&(h=this._bufferService.cols,u--),this._mouseZoneManager.add(new c(a+1,l+1,h+1,u+1,(function(e){if(i.handler)return i.handler(e,r);var t=window.open();t?(t.opener=null,t.location.href=r):console.warn("Opening link blocked as opener could not be cleared")}),(function(){o._onShowLinkUnderline.fire(o._createLinkHoverEvent(a,l,h,u,n)),o._element.classList.add("xterm-cursor-pointer")}),(function(e){o._onLinkTooltip.fire(o._createLinkHoverEvent(a,l,h,u,n)),i.hoverTooltipCallback&&i.hoverTooltipCallback(e,r,{start:{x:a,y:l},end:{x:h,y:u}})}),(function(){o._onHideLinkUnderline.fire(o._createLinkHoverEvent(a,l,h,u,n)),o._element.classList.remove("xterm-cursor-pointer"),i.hoverLeaveCallback&&i.hoverLeaveCallback()}),(function(e){return!i.willLinkActivate||i.willLinkActivate(e,r)})))}},e.prototype._createLinkHoverEvent=function(e,t,r,i,n){return{x1:e,y1:t,x2:r,y2:i,cols:this._bufferService.cols,fg:n}},e._timeBeforeLatency=200,e=i([n(0,s.IBufferService),n(1,s.ILogService),n(2,s.IUnicodeService)],e)}();t.Linkifier=a;var c=function(e,t,r,i,n,o,s,a,c){this.x1=e,this.y1=t,this.x2=r,this.y2=i,this.clickCallback=n,this.hoverCallback=o,this.tooltipCallback=s,this.leaveCallback=a,this.willLinkActivate=c};t.MouseZone=c},6465:function(e,t,r){var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}),o=this&&this.__decorate||function(e,t,r,i){var n,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(s=(o<3?n(s):o>3?n(t,r,s):n(t,r))||s);return o>3&&s&&Object.defineProperty(t,r,s),s},s=this&&this.__param||function(e,t){return function(r,i){t(r,i,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.Linkifier2=void 0;var a=r(2585),c=r(8460),l=r(844),h=r(3656),u=function(e){function t(t){var r=e.call(this)||this;return r._bufferService=t,r._linkProviders=[],r._linkCacheDisposables=[],r._isMouseOut=!0,r._activeLine=-1,r._onShowLinkUnderline=r.register(new c.EventEmitter),r._onHideLinkUnderline=r.register(new c.EventEmitter),r.register(l.getDisposeArrayDisposable(r._linkCacheDisposables)),r}return n(t,e),Object.defineProperty(t.prototype,"onShowLinkUnderline",{get:function(){return this._onShowLinkUnderline.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onHideLinkUnderline",{get:function(){return this._onHideLinkUnderline.event},enumerable:!1,configurable:!0}),t.prototype.registerLinkProvider=function(e){var t=this;return this._linkProviders.push(e),{dispose:function(){var r=t._linkProviders.indexOf(e);-1!==r&&t._linkProviders.splice(r,1)}}},t.prototype.attachToDom=function(e,t,r){var i=this;this._element=e,this._mouseService=t,this._renderService=r,this.register(h.addDisposableDomListener(this._element,"mouseleave",(function(){i._isMouseOut=!0,i._clearCurrentLink()}))),this.register(h.addDisposableDomListener(this._element,"mousemove",this._onMouseMove.bind(this))),this.register(h.addDisposableDomListener(this._element,"click",this._onClick.bind(this)))},t.prototype._onMouseMove=function(e){if(this._lastMouseEvent=e,this._element&&this._mouseService){var t=this._positionFromMouseEvent(e,this._element,this._mouseService);if(t){this._isMouseOut=!1;for(var r=e.composedPath(),i=0;i<r.length;i++){var n=r[i];if(n.classList.contains("xterm"))break;if(n.classList.contains("xterm-hover"))return}this._lastBufferCell&&t.x===this._lastBufferCell.x&&t.y===this._lastBufferCell.y||(this._onHover(t),this._lastBufferCell=t)}}},t.prototype._onHover=function(e){if(this._activeLine!==e.y)return this._clearCurrentLink(),void this._askForLink(e,!1);this._currentLink&&this._linkAtPosition(this._currentLink.link,e)||(this._clearCurrentLink(),this._askForLink(e,!0))},t.prototype._askForLink=function(e,t){var r,i=this;this._activeProviderReplies&&t||(null===(r=this._activeProviderReplies)||void 0===r||r.forEach((function(e){null==e||e.forEach((function(e){e.link.dispose&&e.link.dispose()}))})),this._activeProviderReplies=new Map,this._activeLine=e.y);var n=!1;this._linkProviders.forEach((function(r,o){var s;t?(null===(s=i._activeProviderReplies)||void 0===s?void 0:s.get(o))&&(n=i._checkLinkProviderResult(o,e,n)):r.provideLinks(e.y,(function(t){var r,s;if(!i._isMouseOut){var a=null==t?void 0:t.map((function(e){return{link:e}}));null===(r=i._activeProviderReplies)||void 0===r||r.set(o,a),n=i._checkLinkProviderResult(o,e,n),(null===(s=i._activeProviderReplies)||void 0===s?void 0:s.size)===i._linkProviders.length&&i._removeIntersectingLinks(e.y,i._activeProviderReplies)}}))}))},t.prototype._removeIntersectingLinks=function(e,t){for(var r=new Set,i=0;i<t.size;i++){var n=t.get(i);if(n)for(var o=0;o<n.length;o++)for(var s=n[o],a=s.link.range.start.y<e?0:s.link.range.start.x,c=s.link.range.end.y>e?this._bufferService.cols:s.link.range.end.x,l=a;l<=c;l++){if(r.has(l)){n.splice(o--,1);break}r.add(l)}}},t.prototype._checkLinkProviderResult=function(e,t,r){var i,n=this;if(!this._activeProviderReplies)return r;for(var o=this._activeProviderReplies.get(e),s=!1,a=0;a<e;a++)this._activeProviderReplies.has(a)&&!this._activeProviderReplies.get(a)||(s=!0);if(!s&&o){var c=o.find((function(e){return n._linkAtPosition(e.link,t)}));c&&(r=!0,this._handleNewLink(c))}if(this._activeProviderReplies.size===this._linkProviders.length&&!r)for(a=0;a<this._activeProviderReplies.size;a++){var l=null===(i=this._activeProviderReplies.get(a))||void 0===i?void 0:i.find((function(e){return n._linkAtPosition(e.link,t)}));if(l){r=!0,this._handleNewLink(l);break}}return r},t.prototype._onClick=function(e){if(this._element&&this._mouseService&&this._currentLink){var t=this._positionFromMouseEvent(e,this._element,this._mouseService);t&&this._linkAtPosition(this._currentLink.link,t)&&this._currentLink.link.activate(e,this._currentLink.link.text)}},t.prototype._clearCurrentLink=function(e,t){this._element&&this._currentLink&&this._lastMouseEvent&&(!e||!t||this._currentLink.link.range.start.y>=e&&this._currentLink.link.range.end.y<=t)&&(this._linkLeave(this._element,this._currentLink.link,this._lastMouseEvent),this._currentLink=void 0,l.disposeArray(this._linkCacheDisposables))},t.prototype._handleNewLink=function(e){var t=this;if(this._element&&this._lastMouseEvent&&this._mouseService){var r=this._positionFromMouseEvent(this._lastMouseEvent,this._element,this._mouseService);r&&this._linkAtPosition(e.link,r)&&(this._currentLink=e,this._currentLink.state={decorations:{underline:void 0===e.link.decorations||e.link.decorations.underline,pointerCursor:void 0===e.link.decorations||e.link.decorations.pointerCursor},isHovered:!0},this._linkHover(this._element,e.link,this._lastMouseEvent),e.link.decorations={},Object.defineProperties(e.link.decorations,{pointerCursor:{get:function(){var e,r;return null===(r=null===(e=t._currentLink)||void 0===e?void 0:e.state)||void 0===r?void 0:r.decorations.pointerCursor},set:function(e){var r,i;(null===(r=t._currentLink)||void 0===r?void 0:r.state)&&t._currentLink.state.decorations.pointerCursor!==e&&(t._currentLink.state.decorations.pointerCursor=e,t._currentLink.state.isHovered&&(null===(i=t._element)||void 0===i||i.classList.toggle("xterm-cursor-pointer",e)))}},underline:{get:function(){var e,r;return null===(r=null===(e=t._currentLink)||void 0===e?void 0:e.state)||void 0===r?void 0:r.decorations.underline},set:function(r){var i,n,o;(null===(i=t._currentLink)||void 0===i?void 0:i.state)&&(null===(o=null===(n=t._currentLink)||void 0===n?void 0:n.state)||void 0===o?void 0:o.decorations.underline)!==r&&(t._currentLink.state.decorations.underline=r,t._currentLink.state.isHovered&&t._fireUnderlineEvent(e.link,r))}}}),this._renderService&&this._linkCacheDisposables.push(this._renderService.onRenderedBufferChange((function(e){var r=0===e.start?0:e.start+1+t._bufferService.buffer.ydisp;t._clearCurrentLink(r,e.end+1+t._bufferService.buffer.ydisp)}))))}},t.prototype._linkHover=function(e,t,r){var i;(null===(i=this._currentLink)||void 0===i?void 0:i.state)&&(this._currentLink.state.isHovered=!0,this._currentLink.state.decorations.underline&&this._fireUnderlineEvent(t,!0),this._currentLink.state.decorations.pointerCursor&&e.classList.add("xterm-cursor-pointer")),t.hover&&t.hover(r,t.text)},t.prototype._fireUnderlineEvent=function(e,t){var r=e.range,i=this._bufferService.buffer.ydisp,n=this._createLinkUnderlineEvent(r.start.x-1,r.start.y-i-1,r.end.x,r.end.y-i-1,void 0);(t?this._onShowLinkUnderline:this._onHideLinkUnderline).fire(n)},t.prototype._linkLeave=function(e,t,r){var i;(null===(i=this._currentLink)||void 0===i?void 0:i.state)&&(this._currentLink.state.isHovered=!1,this._currentLink.state.decorations.underline&&this._fireUnderlineEvent(t,!1),this._currentLink.state.decorations.pointerCursor&&e.classList.remove("xterm-cursor-pointer")),t.leave&&t.leave(r,t.text)},t.prototype._linkAtPosition=function(e,t){var r=e.range.start.y===e.range.end.y,i=e.range.start.y<t.y,n=e.range.end.y>t.y;return(r&&e.range.start.x<=t.x&&e.range.end.x>=t.x||i&&e.range.end.x>=t.x||n&&e.range.start.x<=t.x||i&&n)&&e.range.start.y<=t.y&&e.range.end.y>=t.y},t.prototype._positionFromMouseEvent=function(e,t,r){var i=r.getCoords(e,t,this._bufferService.cols,this._bufferService.rows);if(i)return{x:i[0],y:i[1]+this._bufferService.buffer.ydisp}},t.prototype._createLinkUnderlineEvent=function(e,t,r,i,n){return{x1:e,y1:t,x2:r,y2:i,cols:this._bufferService.cols,fg:n}},o([s(0,a.IBufferService)],t)}(l.Disposable);t.Linkifier2=u},9042:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.tooMuchOutput=t.promptLabel=void 0,t.promptLabel="Terminal input",t.tooMuchOutput="Too much output to announce, navigate to rows manually to read"},6954:function(e,t,r){var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}),o=this&&this.__decorate||function(e,t,r,i){var n,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(s=(o<3?n(s):o>3?n(t,r,s):n(t,r))||s);return o>3&&s&&Object.defineProperty(t,r,s),s},s=this&&this.__param||function(e,t){return function(r,i){t(r,i,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.MouseZoneManager=void 0;var a=r(844),c=r(3656),l=r(4725),h=r(2585),u=function(e){function t(t,r,i,n,o,s){var a=e.call(this)||this;return a._element=t,a._screenElement=r,a._bufferService=i,a._mouseService=n,a._selectionService=o,a._optionsService=s,a._zones=[],a._areZonesActive=!1,a._lastHoverCoords=[void 0,void 0],a._initialSelectionLength=0,a.register(c.addDisposableDomListener(a._element,"mousedown",(function(e){return a._onMouseDown(e)}))),a._mouseMoveListener=function(e){return a._onMouseMove(e)},a._mouseLeaveListener=function(e){return a._onMouseLeave(e)},a._clickListener=function(e){return a._onClick(e)},a}return n(t,e),t.prototype.dispose=function(){e.prototype.dispose.call(this),this._deactivate()},t.prototype.add=function(e){this._zones.push(e),1===this._zones.length&&this._activate()},t.prototype.clearAll=function(e,t){if(0!==this._zones.length){e&&t||(e=0,t=this._bufferService.rows-1);for(var r=0;r<this._zones.length;r++){var i=this._zones[r];(i.y1>e&&i.y1<=t+1||i.y2>e&&i.y2<=t+1||i.y1<e&&i.y2>t+1)&&(this._currentZone&&this._currentZone===i&&(this._currentZone.leaveCallback(),this._currentZone=void 0),this._zones.splice(r--,1))}0===this._zones.length&&this._deactivate()}},t.prototype._activate=function(){this._areZonesActive||(this._areZonesActive=!0,this._element.addEventListener("mousemove",this._mouseMoveListener),this._element.addEventListener("mouseleave",this._mouseLeaveListener),this._element.addEventListener("click",this._clickListener))},t.prototype._deactivate=function(){this._areZonesActive&&(this._areZonesActive=!1,this._element.removeEventListener("mousemove",this._mouseMoveListener),this._element.removeEventListener("mouseleave",this._mouseLeaveListener),this._element.removeEventListener("click",this._clickListener))},t.prototype._onMouseMove=function(e){this._lastHoverCoords[0]===e.pageX&&this._lastHoverCoords[1]===e.pageY||(this._onHover(e),this._lastHoverCoords=[e.pageX,e.pageY])},t.prototype._onHover=function(e){var t=this,r=this._findZoneEventAt(e);r!==this._currentZone&&(this._currentZone&&(this._currentZone.leaveCallback(),this._currentZone=void 0,this._tooltipTimeout&&clearTimeout(this._tooltipTimeout)),r&&(this._currentZone=r,r.hoverCallback&&r.hoverCallback(e),this._tooltipTimeout=window.setTimeout((function(){return t._onTooltip(e)}),this._optionsService.options.linkTooltipHoverDuration)))},t.prototype._onTooltip=function(e){this._tooltipTimeout=void 0;var t=this._findZoneEventAt(e);t&&t.tooltipCallback&&t.tooltipCallback(e)},t.prototype._onMouseDown=function(e){if(this._initialSelectionLength=this._getSelectionLength(),this._areZonesActive){var t=this._findZoneEventAt(e);(null==t?void 0:t.willLinkActivate(e))&&(e.preventDefault(),e.stopImmediatePropagation())}},t.prototype._onMouseLeave=function(e){this._currentZone&&(this._currentZone.leaveCallback(),this._currentZone=void 0,this._tooltipTimeout&&clearTimeout(this._tooltipTimeout))},t.prototype._onClick=function(e){var t=this._findZoneEventAt(e),r=this._getSelectionLength();t&&r===this._initialSelectionLength&&(t.clickCallback(e),e.preventDefault(),e.stopImmediatePropagation())},t.prototype._getSelectionLength=function(){var e=this._selectionService.selectionText;return e?e.length:0},t.prototype._findZoneEventAt=function(e){var t=this._mouseService.getCoords(e,this._screenElement,this._bufferService.cols,this._bufferService.rows);if(t)for(var r=t[0],i=t[1],n=0;n<this._zones.length;n++){var o=this._zones[n];if(o.y1===o.y2){if(i===o.y1&&r>=o.x1&&r<o.x2)return o}else if(i===o.y1&&r>=o.x1||i===o.y2&&r<o.x2||i>o.y1&&i<o.y2)return o}},o([s(2,h.IBufferService),s(3,l.IMouseService),s(4,l.ISelectionService),s(5,h.IOptionsService)],t)}(a.Disposable);t.MouseZoneManager=u},6193:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.RenderDebouncer=void 0;var r=function(){function e(e){this._renderCallback=e}return e.prototype.dispose=function(){this._animationFrame&&(window.cancelAnimationFrame(this._animationFrame),this._animationFrame=void 0)},e.prototype.refresh=function(e,t,r){var i=this;this._rowCount=r,e=void 0!==e?e:0,t=void 0!==t?t:this._rowCount-1,this._rowStart=void 0!==this._rowStart?Math.min(this._rowStart,e):e,this._rowEnd=void 0!==this._rowEnd?Math.max(this._rowEnd,t):t,this._animationFrame||(this._animationFrame=window.requestAnimationFrame((function(){return i._innerRefresh()})))},e.prototype._innerRefresh=function(){if(void 0!==this._rowStart&&void 0!==this._rowEnd&&void 0!==this._rowCount){var e=Math.max(this._rowStart,0),t=Math.min(this._rowEnd,this._rowCount-1);this._rowStart=void 0,this._rowEnd=void 0,this._animationFrame=void 0,this._renderCallback(e,t)}},e}();t.RenderDebouncer=r},5596:function(e,t,r){var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0}),t.ScreenDprMonitor=void 0;var o=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t._currentDevicePixelRatio=window.devicePixelRatio,t}return n(t,e),t.prototype.setListener=function(e){var t=this;this._listener&&this.clearListener(),this._listener=e,this._outerListener=function(){t._listener&&(t._listener(window.devicePixelRatio,t._currentDevicePixelRatio),t._updateDpr())},this._updateDpr()},t.prototype.dispose=function(){e.prototype.dispose.call(this),this.clearListener()},t.prototype._updateDpr=function(){var e;this._outerListener&&(null===(e=this._resolutionMediaMatchList)||void 0===e||e.removeListener(this._outerListener),this._currentDevicePixelRatio=window.devicePixelRatio,this._resolutionMediaMatchList=window.matchMedia("screen and (resolution: "+window.devicePixelRatio+"dppx)"),this._resolutionMediaMatchList.addListener(this._outerListener))},t.prototype.clearListener=function(){this._resolutionMediaMatchList&&this._listener&&this._outerListener&&(this._resolutionMediaMatchList.removeListener(this._outerListener),this._resolutionMediaMatchList=void 0,this._listener=void 0,this._outerListener=void 0)},t}(r(844).Disposable);t.ScreenDprMonitor=o},3236:function(e,t,r){var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0}),t.Terminal=void 0;var o=r(2950),s=r(1680),a=r(3614),c=r(2584),l=r(5435),h=r(3525),u=r(3551),f=r(9312),_=r(6114),d=r(3656),p=r(9042),v=r(357),g=r(6954),y=r(4567),b=r(1296),S=r(7399),m=r(8460),C=r(8437),w=r(5680),E=r(3230),L=r(4725),A=r(428),R=r(8934),k=r(6465),x=r(5114),D=r(8969),T=r(4774),O="undefined"!=typeof window?window.document:null,M=function(e){function t(t){void 0===t&&(t={});var r=e.call(this,t)||this;return r.browser=_,r._keyDownHandled=!1,r._onCursorMove=new m.EventEmitter,r._onKey=new m.EventEmitter,r._onRender=new m.EventEmitter,r._onSelectionChange=new m.EventEmitter,r._onTitleChange=new m.EventEmitter,r._onFocus=new m.EventEmitter,r._onBlur=new m.EventEmitter,r._onA11yCharEmitter=new m.EventEmitter,r._onA11yTabEmitter=new m.EventEmitter,r._setup(),r.linkifier=r._instantiationService.createInstance(u.Linkifier),r.linkifier2=r.register(r._instantiationService.createInstance(k.Linkifier2)),r.register(r._inputHandler.onRequestBell((function(){return r.bell()}))),r.register(r._inputHandler.onRequestRefreshRows((function(e,t){return r.refresh(e,t)}))),r.register(r._inputHandler.onRequestReset((function(){return r.reset()}))),r.register(r._inputHandler.onRequestScroll((function(e,t){return r.scroll(e,t||void 0)}))),r.register(r._inputHandler.onRequestWindowsOptionsReport((function(e){return r._reportWindowsOptions(e)}))),r.register(r._inputHandler.onAnsiColorChange((function(e){return r._changeAnsiColor(e)}))),r.register(m.forwardEvent(r._inputHandler.onCursorMove,r._onCursorMove)),r.register(m.forwardEvent(r._inputHandler.onTitleChange,r._onTitleChange)),r.register(m.forwardEvent(r._inputHandler.onA11yChar,r._onA11yCharEmitter)),r.register(m.forwardEvent(r._inputHandler.onA11yTab,r._onA11yTabEmitter)),r.register(r._bufferService.onResize((function(e){return r._afterResize(e.cols,e.rows)}))),r}return n(t,e),Object.defineProperty(t.prototype,"options",{get:function(){return this.optionsService.options},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onCursorMove",{get:function(){return this._onCursorMove.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onKey",{get:function(){return this._onKey.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onRender",{get:function(){return this._onRender.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onSelectionChange",{get:function(){return this._onSelectionChange.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onTitleChange",{get:function(){return this._onTitleChange.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onFocus",{get:function(){return this._onFocus.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onBlur",{get:function(){return this._onBlur.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onA11yChar",{get:function(){return this._onA11yCharEmitter.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onA11yTab",{get:function(){return this._onA11yTabEmitter.event},enumerable:!1,configurable:!0}),t.prototype._changeAnsiColor=function(e){var t,r,i=this;this._colorManager&&(e.colors.forEach((function(e){var t=T.rgba.toColor(e.red,e.green,e.blue);i._colorManager.colors.ansi[e.colorIndex]=t})),null===(t=this._renderService)||void 0===t||t.setColors(this._colorManager.colors),null===(r=this.viewport)||void 0===r||r.onThemeChange(this._colorManager.colors))},t.prototype.dispose=function(){var t,r,i;this._isDisposed||(e.prototype.dispose.call(this),null===(t=this._renderService)||void 0===t||t.dispose(),this._customKeyEventHandler=void 0,this.write=function(){},null===(i=null===(r=this.element)||void 0===r?void 0:r.parentNode)||void 0===i||i.removeChild(this.element))},t.prototype._setup=function(){e.prototype._setup.call(this),this._customKeyEventHandler=void 0},Object.defineProperty(t.prototype,"buffer",{get:function(){return this.buffers.active},enumerable:!1,configurable:!0}),t.prototype.focus=function(){this.textarea&&this.textarea.focus({preventScroll:!0})},t.prototype._updateOptions=function(t){var r,i,n,o;switch(e.prototype._updateOptions.call(this,t),t){case"fontFamily":case"fontSize":null===(r=this._renderService)||void 0===r||r.clear(),null===(i=this._charSizeService)||void 0===i||i.measure();break;case"cursorBlink":case"cursorStyle":this.refresh(this.buffer.y,this.buffer.y);break;case"drawBoldTextInBrightColors":case"letterSpacing":case"lineHeight":case"fontWeight":case"fontWeightBold":case"minimumContrastRatio":this._renderService&&(this._renderService.clear(),this._renderService.onResize(this.cols,this.rows),this.refresh(0,this.rows-1));break;case"rendererType":this._renderService&&(this._renderService.setRenderer(this._createRenderer()),this._renderService.onResize(this.cols,this.rows));break;case"scrollback":null===(n=this.viewport)||void 0===n||n.syncScrollArea();break;case"screenReaderMode":this.optionsService.options.screenReaderMode?!this._accessibilityManager&&this._renderService&&(this._accessibilityManager=new y.AccessibilityManager(this,this._renderService)):(null===(o=this._accessibilityManager)||void 0===o||o.dispose(),this._accessibilityManager=void 0);break;case"tabStopWidth":this.buffers.setupTabStops();break;case"theme":this._setTheme(this.optionsService.options.theme)}},t.prototype._onTextAreaFocus=function(e){this._coreService.decPrivateModes.sendFocus&&this._coreService.triggerDataEvent(c.C0.ESC+"[I"),this.updateCursorStyle(e),this.element.classList.add("focus"),this._showCursor(),this._onFocus.fire()},t.prototype.blur=function(){var e;return null===(e=this.textarea)||void 0===e?void 0:e.blur()},t.prototype._onTextAreaBlur=function(){this.textarea.value="",this.refresh(this.buffer.y,this.buffer.y),this._coreService.decPrivateModes.sendFocus&&this._coreService.triggerDataEvent(c.C0.ESC+"[O"),this.element.classList.remove("focus"),this._onBlur.fire()},t.prototype._syncTextArea=function(){if(this.textarea&&this.buffer.isCursorInViewport&&!this._compositionHelper.isComposing){var e=Math.ceil(this._charSizeService.height*this.optionsService.options.lineHeight),t=this._bufferService.buffer.y*e,r=this._bufferService.buffer.x*this._charSizeService.width;this.textarea.style.left=r+"px",this.textarea.style.top=t+"px",this.textarea.style.width=this._charSizeService.width+"px",this.textarea.style.height=e+"px",this.textarea.style.lineHeight=e+"px",this.textarea.style.zIndex="-5"}},t.prototype._initGlobal=function(){var e=this;this._bindKeys(),this.register(d.addDisposableDomListener(this.element,"copy",(function(t){e.hasSelection()&&a.copyHandler(t,e._selectionService)})));var t=function(t){return a.handlePasteEvent(t,e.textarea,e._coreService)};this.register(d.addDisposableDomListener(this.textarea,"paste",t)),this.register(d.addDisposableDomListener(this.element,"paste",t)),_.isFirefox?this.register(d.addDisposableDomListener(this.element,"mousedown",(function(t){2===t.button&&a.rightClickHandler(t,e.textarea,e.screenElement,e._selectionService,e.options.rightClickSelectsWord)}))):this.register(d.addDisposableDomListener(this.element,"contextmenu",(function(t){a.rightClickHandler(t,e.textarea,e.screenElement,e._selectionService,e.options.rightClickSelectsWord)}))),_.isLinux&&this.register(d.addDisposableDomListener(this.element,"auxclick",(function(t){1===t.button&&a.moveTextAreaUnderMouseCursor(t,e.textarea,e.screenElement)})))},t.prototype._bindKeys=function(){var e=this;this.register(d.addDisposableDomListener(this.textarea,"keyup",(function(t){return e._keyUp(t)}),!0)),this.register(d.addDisposableDomListener(this.textarea,"keydown",(function(t){return e._keyDown(t)}),!0)),this.register(d.addDisposableDomListener(this.textarea,"keypress",(function(t){return e._keyPress(t)}),!0)),this.register(d.addDisposableDomListener(this.textarea,"compositionstart",(function(){return e._compositionHelper.compositionstart()}))),this.register(d.addDisposableDomListener(this.textarea,"compositionupdate",(function(t){return e._compositionHelper.compositionupdate(t)}))),this.register(d.addDisposableDomListener(this.textarea,"compositionend",(function(){return e._compositionHelper.compositionend()}))),this.register(this.onRender((function(){return e._compositionHelper.updateCompositionElements()}))),this.register(this.onRender((function(t){return e._queueLinkification(t.start,t.end)})))},t.prototype.open=function(e){var t=this;if(!e)throw new Error("Terminal requires a parent element.");e.isConnected||this._logService.debug("Terminal.open was called on an element that was not attached to the DOM"),this._document=e.ownerDocument,this.element=this._document.createElement("div"),this.element.dir="ltr",this.element.classList.add("terminal"),this.element.classList.add("xterm"),this.element.setAttribute("tabindex","0"),this.element.setAttribute("role","document"),e.appendChild(this.element);var r=O.createDocumentFragment();this._viewportElement=O.createElement("div"),this._viewportElement.classList.add("xterm-viewport"),r.appendChild(this._viewportElement),this._viewportScrollArea=O.createElement("div"),this._viewportScrollArea.classList.add("xterm-scroll-area"),this._viewportElement.appendChild(this._viewportScrollArea),this.screenElement=O.createElement("div"),this.screenElement.classList.add("xterm-screen"),this._helperContainer=O.createElement("div"),this._helperContainer.classList.add("xterm-helpers"),this.screenElement.appendChild(this._helperContainer),r.appendChild(this.screenElement),this.textarea=O.createElement("textarea"),this.textarea.classList.add("xterm-helper-textarea"),this.textarea.setAttribute("aria-label",p.promptLabel),this.textarea.setAttribute("aria-multiline","false"),this.textarea.setAttribute("autocorrect","off"),this.textarea.setAttribute("autocapitalize","off"),this.textarea.setAttribute("spellcheck","false"),this.textarea.tabIndex=0,this.register(d.addDisposableDomListener(this.textarea,"focus",(function(e){return t._onTextAreaFocus(e)}))),this.register(d.addDisposableDomListener(this.textarea,"blur",(function(){return t._onTextAreaBlur()}))),this._helperContainer.appendChild(this.textarea);var i=this._instantiationService.createInstance(x.CoreBrowserService,this.textarea);this._instantiationService.setService(L.ICoreBrowserService,i),this._charSizeService=this._instantiationService.createInstance(A.CharSizeService,this._document,this._helperContainer),this._instantiationService.setService(L.ICharSizeService,this._charSizeService),this._compositionView=O.createElement("div"),this._compositionView.classList.add("composition-view"),this._compositionHelper=this._instantiationService.createInstance(o.CompositionHelper,this.textarea,this._compositionView),this._helperContainer.appendChild(this._compositionView),this.element.appendChild(r),this._theme=this.options.theme||this._theme,this._colorManager=new w.ColorManager(O,this.options.allowTransparency),this.register(this.optionsService.onOptionChange((function(e){return t._colorManager.onOptionsChange(e)}))),this._colorManager.setTheme(this._theme);var n=this._createRenderer();this._renderService=this.register(this._instantiationService.createInstance(E.RenderService,n,this.rows,this.screenElement)),this._instantiationService.setService(L.IRenderService,this._renderService),this.register(this._renderService.onRenderedBufferChange((function(e){return t._onRender.fire(e)}))),this.onResize((function(e){return t._renderService.resize(e.cols,e.rows)})),this._soundService=this._instantiationService.createInstance(v.SoundService),this._instantiationService.setService(L.ISoundService,this._soundService),this._mouseService=this._instantiationService.createInstance(R.MouseService),this._instantiationService.setService(L.IMouseService,this._mouseService),this.viewport=this._instantiationService.createInstance(s.Viewport,(function(e,r){return t.scrollLines(e,r)}),this._viewportElement,this._viewportScrollArea),this.viewport.onThemeChange(this._colorManager.colors),this.register(this._inputHandler.onRequestSyncScrollBar((function(){return t.viewport.syncScrollArea()}))),this.register(this.viewport),this.register(this.onCursorMove((function(){t._renderService.onCursorMove(),t._syncTextArea()}))),this.register(this.onResize((function(){return t._renderService.onResize(t.cols,t.rows)}))),this.register(this.onBlur((function(){return t._renderService.onBlur()}))),this.register(this.onFocus((function(){return t._renderService.onFocus()}))),this.register(this._renderService.onDimensionsChange((function(){return t.viewport.syncScrollArea()}))),this._selectionService=this.register(this._instantiationService.createInstance(f.SelectionService,this.element,this.screenElement)),this._instantiationService.setService(L.ISelectionService,this._selectionService),this.register(this._selectionService.onRequestScrollLines((function(e){return t.scrollLines(e.amount,e.suppressScrollEvent)}))),this.register(this._selectionService.onSelectionChange((function(){return t._onSelectionChange.fire()}))),this.register(this._selectionService.onRequestRedraw((function(e){return t._renderService.onSelectionChanged(e.start,e.end,e.columnSelectMode)}))),this.register(this._selectionService.onLinuxMouseSelection((function(e){t.textarea.value=e,t.textarea.focus(),t.textarea.select()}))),this.register(this.onScroll((function(){t.viewport.syncScrollArea(),t._selectionService.refresh()}))),this.register(d.addDisposableDomListener(this._viewportElement,"scroll",(function(){return t._selectionService.refresh()}))),this._mouseZoneManager=this._instantiationService.createInstance(g.MouseZoneManager,this.element,this.screenElement),this.register(this._mouseZoneManager),this.register(this.onScroll((function(){return t._mouseZoneManager.clearAll()}))),this.linkifier.attachToDom(this.element,this._mouseZoneManager),this.linkifier2.attachToDom(this.element,this._mouseService,this._renderService),this.register(d.addDisposableDomListener(this.element,"mousedown",(function(e){return t._selectionService.onMouseDown(e)}))),this._coreMouseService.areMouseEventsActive?(this._selectionService.disable(),this.element.classList.add("enable-mouse-events")):this._selectionService.enable(),this.options.screenReaderMode&&(this._accessibilityManager=new y.AccessibilityManager(this,this._renderService)),this._charSizeService.measure(),this.refresh(0,this.rows-1),this._initGlobal(),this.bindMouse()},t.prototype._createRenderer=function(){switch(this.options.rendererType){case"canvas":return this._instantiationService.createInstance(h.Renderer,this._colorManager.colors,this.screenElement,this.linkifier,this.linkifier2);case"dom":return this._instantiationService.createInstance(b.DomRenderer,this._colorManager.colors,this.element,this.screenElement,this._viewportElement,this.linkifier,this.linkifier2);default:throw new Error('Unrecognized rendererType "'+this.options.rendererType+'"')}},t.prototype._setTheme=function(e){var t,r,i;this._theme=e,null===(t=this._colorManager)||void 0===t||t.setTheme(e),null===(r=this._renderService)||void 0===r||r.setColors(this._colorManager.colors),null===(i=this.viewport)||void 0===i||i.onThemeChange(this._colorManager.colors)},t.prototype.bindMouse=function(){var e=this,t=this,r=this.element;function i(e){var r,i,n=t._mouseService.getRawByteCoords(e,t.screenElement,t.cols,t.rows);if(!n)return!1;switch(e.overrideType||e.type){case"mousemove":i=32,void 0===e.buttons?(r=3,void 0!==e.button&&(r=e.button<3?e.button:3)):r=1&e.buttons?0:4&e.buttons?1:2&e.buttons?2:3;break;case"mouseup":i=0,r=e.button<3?e.button:3;break;case"mousedown":i=1,r=e.button<3?e.button:3;break;case"wheel":0!==e.deltaY&&(i=e.deltaY<0?0:1),r=4;break;default:return!1}return!(void 0===i||void 0===r||r>4)&&t._coreMouseService.triggerMouseEvent({col:n.x-33,row:n.y-33,button:r,action:i,ctrl:e.ctrlKey,alt:e.altKey,shift:e.shiftKey})}var n={mouseup:null,wheel:null,mousedrag:null,mousemove:null},o=function(t){return i(t),t.buttons||(e._document.removeEventListener("mouseup",n.mouseup),n.mousedrag&&e._document.removeEventListener("mousemove",n.mousedrag)),e.cancel(t)},s=function(t){return i(t),t.preventDefault(),e.cancel(t)},a=function(e){e.buttons&&i(e)},l=function(e){e.buttons||i(e)};this.register(this._coreMouseService.onProtocolChange((function(t){t?("debug"===e.optionsService.options.logLevel&&e._logService.debug("Binding to mouse events:",e._coreMouseService.explainEvents(t)),e.element.classList.add("enable-mouse-events"),e._selectionService.disable()):(e._logService.debug("Unbinding from mouse events."),e.element.classList.remove("enable-mouse-events"),e._selectionService.enable()),8&t?n.mousemove||(r.addEventListener("mousemove",l),n.mousemove=l):(r.removeEventListener("mousemove",n.mousemove),n.mousemove=null),16&t?n.wheel||(r.addEventListener("wheel",s,{passive:!1}),n.wheel=s):(r.removeEventListener("wheel",n.wheel),n.wheel=null),2&t?n.mouseup||(n.mouseup=o):(e._document.removeEventListener("mouseup",n.mouseup),n.mouseup=null),4&t?n.mousedrag||(n.mousedrag=a):(e._document.removeEventListener("mousemove",n.mousedrag),n.mousedrag=null)}))),this._coreMouseService.activeProtocol=this._coreMouseService.activeProtocol,this.register(d.addDisposableDomListener(r,"mousedown",(function(t){if(t.preventDefault(),e.focus(),e._coreMouseService.areMouseEventsActive&&!e._selectionService.shouldForceSelection(t))return i(t),n.mouseup&&e._document.addEventListener("mouseup",n.mouseup),n.mousedrag&&e._document.addEventListener("mousemove",n.mousedrag),e.cancel(t)}))),this.register(d.addDisposableDomListener(r,"wheel",(function(t){if(n.wheel);else if(!e.buffer.hasScrollback){var r=e.viewport.getLinesScrolled(t);if(0===r)return;for(var i=c.C0.ESC+(e._coreService.decPrivateModes.applicationCursorKeys?"O":"[")+(t.deltaY<0?"A":"B"),o="",s=0;s<Math.abs(r);s++)o+=i;e._coreService.triggerDataEvent(o,!0)}}),{passive:!0})),this.register(d.addDisposableDomListener(r,"wheel",(function(t){if(!n.wheel)return e.viewport.onWheel(t)?void 0:e.cancel(t)}),{passive:!1})),this.register(d.addDisposableDomListener(r,"touchstart",(function(t){if(!e._coreMouseService.areMouseEventsActive)return e.viewport.onTouchStart(t),e.cancel(t)}),{passive:!0})),this.register(d.addDisposableDomListener(r,"touchmove",(function(t){if(!e._coreMouseService.areMouseEventsActive)return e.viewport.onTouchMove(t)?void 0:e.cancel(t)}),{passive:!1}))},t.prototype.refresh=function(e,t){var r;null===(r=this._renderService)||void 0===r||r.refreshRows(e,t)},t.prototype._queueLinkification=function(e,t){var r;null===(r=this.linkifier)||void 0===r||r.linkifyRows(e,t)},t.prototype.updateCursorStyle=function(e){this._selectionService&&this._selectionService.shouldColumnSelect(e)?this.element.classList.add("column-select"):this.element.classList.remove("column-select")},t.prototype._showCursor=function(){this._coreService.isCursorInitialized||(this._coreService.isCursorInitialized=!0,this.refresh(this.buffer.y,this.buffer.y))},t.prototype.scrollLines=function(t,r){e.prototype.scrollLines.call(this,t,r),this.refresh(0,this.rows-1)},t.prototype.paste=function(e){a.paste(e,this.textarea,this._coreService)},t.prototype.attachCustomKeyEventHandler=function(e){this._customKeyEventHandler=e},t.prototype.registerLinkMatcher=function(e,t,r){var i=this.linkifier.registerLinkMatcher(e,t,r);return this.refresh(0,this.rows-1),i},t.prototype.deregisterLinkMatcher=function(e){this.linkifier.deregisterLinkMatcher(e)&&this.refresh(0,this.rows-1)},t.prototype.registerLinkProvider=function(e){return this.linkifier2.registerLinkProvider(e)},t.prototype.registerCharacterJoiner=function(e){var t=this._renderService.registerCharacterJoiner(e);return this.refresh(0,this.rows-1),t},t.prototype.deregisterCharacterJoiner=function(e){this._renderService.deregisterCharacterJoiner(e)&&this.refresh(0,this.rows-1)},Object.defineProperty(t.prototype,"markers",{get:function(){return this.buffer.markers},enumerable:!1,configurable:!0}),t.prototype.addMarker=function(e){if(this.buffer===this.buffers.normal)return this.buffer.addMarker(this.buffer.ybase+this.buffer.y+e)},t.prototype.hasSelection=function(){return!!this._selectionService&&this._selectionService.hasSelection},t.prototype.select=function(e,t,r){this._selectionService.setSelection(e,t,r)},t.prototype.getSelection=function(){return this._selectionService?this._selectionService.selectionText:""},t.prototype.getSelectionPosition=function(){if(this._selectionService&&this._selectionService.hasSelection)return{startColumn:this._selectionService.selectionStart[0],startRow:this._selectionService.selectionStart[1],endColumn:this._selectionService.selectionEnd[0],endRow:this._selectionService.selectionEnd[1]}},t.prototype.clearSelection=function(){var e;null===(e=this._selectionService)||void 0===e||e.clearSelection()},t.prototype.selectAll=function(){var e;null===(e=this._selectionService)||void 0===e||e.selectAll()},t.prototype.selectLines=function(e,t){var r;null===(r=this._selectionService)||void 0===r||r.selectLines(e,t)},t.prototype._keyDown=function(e){if(this._keyDownHandled=!1,this._customKeyEventHandler&&!1===this._customKeyEventHandler(e))return!1;if(!this._compositionHelper.keydown(e))return this.buffer.ybase!==this.buffer.ydisp&&this.scrollToBottom(),!1;var t=S.evaluateKeyboardEvent(e,this._coreService.decPrivateModes.applicationCursorKeys,this.browser.isMac,this.options.macOptionIsMeta);if(this.updateCursorStyle(e),3===t.type||2===t.type){var r=this.rows-1;return this.scrollLines(2===t.type?-r:r),this.cancel(e,!0)}return 1===t.type&&this.selectAll(),!!this._isThirdLevelShift(this.browser,e)||(t.cancel&&this.cancel(e,!0),!t.key||(t.key!==c.C0.ETX&&t.key!==c.C0.CR||(this.textarea.value=""),this._onKey.fire({key:t.key,domEvent:e}),this._showCursor(),this._coreService.triggerDataEvent(t.key,!0),this.optionsService.options.screenReaderMode?void(this._keyDownHandled=!0):this.cancel(e,!0)))},t.prototype._isThirdLevelShift=function(e,t){var r=e.isMac&&!this.options.macOptionIsMeta&&t.altKey&&!t.ctrlKey&&!t.metaKey||e.isWindows&&t.altKey&&t.ctrlKey&&!t.metaKey;return"keypress"===t.type?r:r&&(!t.keyCode||t.keyCode>47)},t.prototype._keyUp=function(e){this._customKeyEventHandler&&!1===this._customKeyEventHandler(e)||(function(e){return 16===e.keyCode||17===e.keyCode||18===e.keyCode}(e)||this.focus(),this.updateCursorStyle(e))},t.prototype._keyPress=function(e){var t;if(this._keyDownHandled)return!1;if(this._customKeyEventHandler&&!1===this._customKeyEventHandler(e))return!1;if(this.cancel(e),e.charCode)t=e.charCode;else if(null===e.which||void 0===e.which)t=e.keyCode;else{if(0===e.which||0===e.charCode)return!1;t=e.which}return!(!t||(e.altKey||e.ctrlKey||e.metaKey)&&!this._isThirdLevelShift(this.browser,e)||(t=String.fromCharCode(t),this._onKey.fire({key:t,domEvent:e}),this._showCursor(),this._coreService.triggerDataEvent(t,!0),0))},t.prototype.bell=function(){this._soundBell()&&this._soundService.playBellSound()},t.prototype.resize=function(t,r){t!==this.cols||r!==this.rows?e.prototype.resize.call(this,t,r):this._charSizeService&&!this._charSizeService.hasValidSize&&this._charSizeService.measure()},t.prototype._afterResize=function(e,t){var r,i;null===(r=this._charSizeService)||void 0===r||r.measure(),null===(i=this.viewport)||void 0===i||i.syncScrollArea(!0)},t.prototype.clear=function(){if(0!==this.buffer.ybase||0!==this.buffer.y){this.buffer.lines.set(0,this.buffer.lines.get(this.buffer.ybase+this.buffer.y)),this.buffer.lines.length=1,this.buffer.ydisp=0,this.buffer.ybase=0,this.buffer.y=0;for(var e=1;e<this.rows;e++)this.buffer.lines.push(this.buffer.getBlankLine(C.DEFAULT_ATTR_DATA));this.refresh(0,this.rows-1),this._onScroll.fire(this.buffer.ydisp)}},t.prototype.reset=function(){var t,r;this.options.rows=this.rows,this.options.cols=this.cols;var i=this._customKeyEventHandler;this._setup(),e.prototype.reset.call(this),null===(t=this._selectionService)||void 0===t||t.reset(),this._customKeyEventHandler=i,this.refresh(0,this.rows-1),null===(r=this.viewport)||void 0===r||r.syncScrollArea()},t.prototype._reportWindowsOptions=function(e){if(this._renderService)switch(e){case l.WindowsOptionsReportType.GET_WIN_SIZE_PIXELS:var t=this._renderService.dimensions.scaledCanvasWidth.toFixed(0),r=this._renderService.dimensions.scaledCanvasHeight.toFixed(0);this._coreService.triggerDataEvent(c.C0.ESC+"[4;"+r+";"+t+"t");break;case l.WindowsOptionsReportType.GET_CELL_SIZE_PIXELS:var i=this._renderService.dimensions.scaledCellWidth.toFixed(0),n=this._renderService.dimensions.scaledCellHeight.toFixed(0);this._coreService.triggerDataEvent(c.C0.ESC+"[6;"+n+";"+i+"t")}},t.prototype.cancel=function(e,t){if(this.options.cancelEvents||t)return e.preventDefault(),e.stopPropagation(),!1},t.prototype._visualBell=function(){return!1},t.prototype._soundBell=function(){return"sound"===this.options.bellStyle},t}(D.CoreTerminal);t.Terminal=M},1680:function(e,t,r){var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}),o=this&&this.__decorate||function(e,t,r,i){var n,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(s=(o<3?n(s):o>3?n(t,r,s):n(t,r))||s);return o>3&&s&&Object.defineProperty(t,r,s),s},s=this&&this.__param||function(e,t){return function(r,i){t(r,i,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.Viewport=void 0;var a=r(844),c=r(3656),l=r(4725),h=r(2585),u=function(e){function t(t,r,i,n,o,s,a){var l=e.call(this)||this;return l._scrollLines=t,l._viewportElement=r,l._scrollArea=i,l._bufferService=n,l._optionsService=o,l._charSizeService=s,l._renderService=a,l.scrollBarWidth=0,l._currentRowHeight=0,l._lastRecordedBufferLength=0,l._lastRecordedViewportHeight=0,l._lastRecordedBufferHeight=0,l._lastTouchY=0,l._lastScrollTop=0,l._wheelPartialScroll=0,l._refreshAnimationFrame=null,l._ignoreNextScrollEvent=!1,l.scrollBarWidth=l._viewportElement.offsetWidth-l._scrollArea.offsetWidth||15,l.register(c.addDisposableDomListener(l._viewportElement,"scroll",l._onScroll.bind(l))),setTimeout((function(){return l.syncScrollArea()}),0),l}return n(t,e),t.prototype.onThemeChange=function(e){this._viewportElement.style.backgroundColor=e.background.css},t.prototype._refresh=function(e){var t=this;if(e)return this._innerRefresh(),void(null!==this._refreshAnimationFrame&&cancelAnimationFrame(this._refreshAnimationFrame));null===this._refreshAnimationFrame&&(this._refreshAnimationFrame=requestAnimationFrame((function(){return t._innerRefresh()})))},t.prototype._innerRefresh=function(){if(this._charSizeService.height>0){this._currentRowHeight=this._renderService.dimensions.scaledCellHeight/window.devicePixelRatio,this._lastRecordedViewportHeight=this._viewportElement.offsetHeight;var e=Math.round(this._currentRowHeight*this._lastRecordedBufferLength)+(this._lastRecordedViewportHeight-this._renderService.dimensions.canvasHeight);this._lastRecordedBufferHeight!==e&&(this._lastRecordedBufferHeight=e,this._scrollArea.style.height=this._lastRecordedBufferHeight+"px")}var t=this._bufferService.buffer.ydisp*this._currentRowHeight;this._viewportElement.scrollTop!==t&&(this._ignoreNextScrollEvent=!0,this._viewportElement.scrollTop=t),this._refreshAnimationFrame=null},t.prototype.syncScrollArea=function(e){if(void 0===e&&(e=!1),this._lastRecordedBufferLength!==this._bufferService.buffer.lines.length)return this._lastRecordedBufferLength=this._bufferService.buffer.lines.length,void this._refresh(e);if(this._lastRecordedViewportHeight===this._renderService.dimensions.canvasHeight){var t=this._bufferService.buffer.ydisp*this._currentRowHeight;this._lastScrollTop===t&&this._lastScrollTop===this._viewportElement.scrollTop&&this._renderService.dimensions.scaledCellHeight/window.devicePixelRatio===this._currentRowHeight||this._refresh(e)}else this._refresh(e)},t.prototype._onScroll=function(e){if(this._lastScrollTop=this._viewportElement.scrollTop,this._viewportElement.offsetParent)if(this._ignoreNextScrollEvent)this._ignoreNextScrollEvent=!1;else{var t=Math.round(this._lastScrollTop/this._currentRowHeight)-this._bufferService.buffer.ydisp;this._scrollLines(t,!0)}},t.prototype._bubbleScroll=function(e,t){var r=this._viewportElement.scrollTop+this._lastRecordedViewportHeight;return!(t<0&&0!==this._viewportElement.scrollTop||t>0&&r<this._lastRecordedBufferHeight)||(e.cancelable&&e.preventDefault(),!1)},t.prototype.onWheel=function(e){var t=this._getPixelsScrolled(e);return 0!==t&&(this._viewportElement.scrollTop+=t,this._bubbleScroll(e,t))},t.prototype._getPixelsScrolled=function(e){if(0===e.deltaY)return 0;var t=this._applyScrollModifier(e.deltaY,e);return e.deltaMode===WheelEvent.DOM_DELTA_LINE?t*=this._currentRowHeight:e.deltaMode===WheelEvent.DOM_DELTA_PAGE&&(t*=this._currentRowHeight*this._bufferService.rows),t},t.prototype.getLinesScrolled=function(e){if(0===e.deltaY)return 0;var t=this._applyScrollModifier(e.deltaY,e);return e.deltaMode===WheelEvent.DOM_DELTA_PIXEL?(t/=this._currentRowHeight+0,this._wheelPartialScroll+=t,t=Math.floor(Math.abs(this._wheelPartialScroll))*(this._wheelPartialScroll>0?1:-1),this._wheelPartialScroll%=1):e.deltaMode===WheelEvent.DOM_DELTA_PAGE&&(t*=this._bufferService.rows),t},t.prototype._applyScrollModifier=function(e,t){var r=this._optionsService.options.fastScrollModifier;return"alt"===r&&t.altKey||"ctrl"===r&&t.ctrlKey||"shift"===r&&t.shiftKey?e*this._optionsService.options.fastScrollSensitivity*this._optionsService.options.scrollSensitivity:e*this._optionsService.options.scrollSensitivity},t.prototype.onTouchStart=function(e){this._lastTouchY=e.touches[0].pageY},t.prototype.onTouchMove=function(e){var t=this._lastTouchY-e.touches[0].pageY;return this._lastTouchY=e.touches[0].pageY,0!==t&&(this._viewportElement.scrollTop+=t,this._bubbleScroll(e,t))},o([s(3,h.IBufferService),s(4,h.IOptionsService),s(5,l.ICharSizeService),s(6,l.IRenderService)],t)}(a.Disposable);t.Viewport=u},2950:function(e,t,r){var i=this&&this.__decorate||function(e,t,r,i){var n,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(s=(o<3?n(s):o>3?n(t,r,s):n(t,r))||s);return o>3&&s&&Object.defineProperty(t,r,s),s},n=this&&this.__param||function(e,t){return function(r,i){t(r,i,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.CompositionHelper=void 0;var o=r(4725),s=r(2585),a=function(){function e(e,t,r,i,n,o){this._textarea=e,this._compositionView=t,this._bufferService=r,this._optionsService=i,this._charSizeService=n,this._coreService=o,this._isComposing=!1,this._isSendingComposition=!1,this._compositionPosition={start:0,end:0},this._dataAlreadySent=""}return Object.defineProperty(e.prototype,"isComposing",{get:function(){return this._isComposing},enumerable:!1,configurable:!0}),e.prototype.compositionstart=function(){this._isComposing=!0,this._compositionPosition.start=this._textarea.value.length,this._compositionView.textContent="",this._dataAlreadySent="",this._compositionView.classList.add("active")},e.prototype.compositionupdate=function(e){var t=this;this._compositionView.textContent=e.data,this.updateCompositionElements(),setTimeout((function(){t._compositionPosition.end=t._textarea.value.length}),0)},e.prototype.compositionend=function(){this._finalizeComposition(!0)},e.prototype.keydown=function(e){if(this._isComposing||this._isSendingComposition){if(229===e.keyCode)return!1;if(16===e.keyCode||17===e.keyCode||18===e.keyCode)return!1;this._finalizeComposition(!1)}return 229!==e.keyCode||(this._handleAnyTextareaChanges(),!1)},e.prototype._finalizeComposition=function(e){var t=this;if(this._compositionView.classList.remove("active"),this._isComposing=!1,e){var r={start:this._compositionPosition.start,end:this._compositionPosition.end};this._isSendingComposition=!0,setTimeout((function(){if(t._isSendingComposition){t._isSendingComposition=!1;var e;r.start+=t._dataAlreadySent.length,(e=t._isComposing?t._textarea.value.substring(r.start,r.end):t._textarea.value.substring(r.start)).length>0&&t._coreService.triggerDataEvent(e,!0)}}),0)}else{this._isSendingComposition=!1;var i=this._textarea.value.substring(this._compositionPosition.start,this._compositionPosition.end);this._coreService.triggerDataEvent(i,!0)}},e.prototype._handleAnyTextareaChanges=function(){var e=this,t=this._textarea.value;setTimeout((function(){if(!e._isComposing){var r=e._textarea.value.replace(t,"");r.length>0&&(e._dataAlreadySent=r,e._coreService.triggerDataEvent(r,!0))}}),0)},e.prototype.updateCompositionElements=function(e){var t=this;if(this._isComposing){if(this._bufferService.buffer.isCursorInViewport){var r=Math.ceil(this._charSizeService.height*this._optionsService.options.lineHeight),i=this._bufferService.buffer.y*r,n=this._bufferService.buffer.x*this._charSizeService.width;this._compositionView.style.left=n+"px",this._compositionView.style.top=i+"px",this._compositionView.style.height=r+"px",this._compositionView.style.lineHeight=r+"px",this._compositionView.style.fontFamily=this._optionsService.options.fontFamily,this._compositionView.style.fontSize=this._optionsService.options.fontSize+"px";var o=this._compositionView.getBoundingClientRect();this._textarea.style.left=n+"px",this._textarea.style.top=i+"px",this._textarea.style.width=o.width+"px",this._textarea.style.height=o.height+"px",this._textarea.style.lineHeight=o.height+"px"}e||setTimeout((function(){return t.updateCompositionElements(!0)}),0)}},i([n(2,s.IBufferService),n(3,s.IOptionsService),n(4,o.ICharSizeService),n(5,s.ICoreService)],e)}();t.CompositionHelper=a},9806:(e,t)=>{function r(e,t){var r=t.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top]}Object.defineProperty(t,"__esModule",{value:!0}),t.getRawByteCoords=t.getCoords=t.getCoordsRelativeToElement=void 0,t.getCoordsRelativeToElement=r,t.getCoords=function(e,t,i,n,o,s,a,c){if(o){var l=r(e,t);if(l)return l[0]=Math.ceil((l[0]+(c?s/2:0))/s),l[1]=Math.ceil(l[1]/a),l[0]=Math.min(Math.max(l[0],1),i+(c?1:0)),l[1]=Math.min(Math.max(l[1],1),n),l}},t.getRawByteCoords=function(e){if(e)return{x:e[0]+32,y:e[1]+32}}},9504:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.moveToCellSequence=void 0;var i=r(2584);function n(e,t,r,i){var n=e-o(r,e),a=t-o(r,t);return l(Math.abs(n-a)-function(e,t,r){for(var i=0,n=e-o(r,e),a=t-o(r,t),c=0;c<Math.abs(n-a);c++){var l="A"===s(e,t)?-1:1,h=r.buffer.lines.get(n+l*c);h&&h.isWrapped&&i++}return i}(e,t,r),c(s(e,t),i))}function o(e,t){for(var r=0,i=e.buffer.lines.get(t),n=i&&i.isWrapped;n&&t>=0&&t<e.rows;)r++,n=(i=e.buffer.lines.get(--t))&&i.isWrapped;return r}function s(e,t){return e>t?"A":"B"}function a(e,t,r,i,n,o){for(var s=e,a=t,c="";s!==r||a!==i;)s+=n?1:-1,n&&s>o.cols-1?(c+=o.buffer.translateBufferLineToString(a,!1,e,s),s=0,e=0,a++):!n&&s<0&&(c+=o.buffer.translateBufferLineToString(a,!1,0,e+1),e=s=o.cols-1,a--);return c+o.buffer.translateBufferLineToString(a,!1,e,s)}function c(e,t){var r=t?"O":"[";return i.C0.ESC+r+e}function l(e,t){e=Math.floor(e);for(var r="",i=0;i<e;i++)r+=t;return r}t.moveToCellSequence=function(e,t,r,i){var s,h=r.buffer.x,u=r.buffer.y;if(!r.buffer.hasScrollback)return function(e,t,r,i,s,h){return 0===n(t,i,s,h).length?"":l(a(e,t,e,t-o(s,t),!1,s).length,c("D",h))}(h,u,0,t,r,i)+n(u,t,r,i)+function(e,t,r,i,s,h){var u;u=n(t,i,s,h).length>0?i-o(s,i):t;var f=i,_=function(e,t,r,i,s,a){var c;return c=n(r,i,s,a).length>0?i-o(s,i):t,e<r&&c<=i||e>=r&&c<i?"C":"D"}(e,t,r,i,s,h);return l(a(e,u,r,f,"C"===_,s).length,c(_,h))}(h,u,e,t,r,i);if(u===t)return s=h>e?"D":"C",l(Math.abs(h-e),c(s,i));s=u>t?"D":"C";var f=Math.abs(u-t);return l(function(e,t){return t.cols-e}(u>t?e:h,r)+(f-1)*r.cols+1+((u>t?h:e)-1),c(s,i))}},244:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.AddonManager=void 0;var r=function(){function e(){this._addons=[]}return e.prototype.dispose=function(){for(var e=this._addons.length-1;e>=0;e--)this._addons[e].instance.dispose()},e.prototype.loadAddon=function(e,t){var r=this,i={instance:t,dispose:t.dispose,isDisposed:!1};this._addons.push(i),t.dispose=function(){return r._wrappedAddonDispose(i)},t.activate(e)},e.prototype._wrappedAddonDispose=function(e){if(!e.isDisposed){for(var t=-1,r=0;r<this._addons.length;r++)if(this._addons[r]===e){t=r;break}if(-1===t)throw new Error("Could not dispose an addon that has not been loaded");e.isDisposed=!0,e.dispose.apply(e.instance),this._addons.splice(t,1)}},e}();t.AddonManager=r},4389:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Terminal=void 0;var i=r(511),n=r(3236),o=r(9042),s=r(8460),a=r(244),c=function(){function e(e){this._core=new n.Terminal(e),this._addonManager=new a.AddonManager}return e.prototype._checkProposedApi=function(){if(!this._core.optionsService.options.allowProposedApi)throw new Error("You must set the allowProposedApi option to true to use proposed API")},Object.defineProperty(e.prototype,"onCursorMove",{get:function(){return this._core.onCursorMove},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"onLineFeed",{get:function(){return this._core.onLineFeed},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"onSelectionChange",{get:function(){return this._core.onSelectionChange},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"onData",{get:function(){return this._core.onData},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"onBinary",{get:function(){return this._core.onBinary},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"onTitleChange",{get:function(){return this._core.onTitleChange},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"onScroll",{get:function(){return this._core.onScroll},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"onKey",{get:function(){return this._core.onKey},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"onRender",{get:function(){return this._core.onRender},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"onResize",{get:function(){return this._core.onResize},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"element",{get:function(){return this._core.element},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"parser",{get:function(){return this._checkProposedApi(),this._parser||(this._parser=new f(this._core)),this._parser},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"unicode",{get:function(){return this._checkProposedApi(),new _(this._core)},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"textarea",{get:function(){return this._core.textarea},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"rows",{get:function(){return this._core.rows},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"cols",{get:function(){return this._core.cols},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"buffer",{get:function(){return this._checkProposedApi(),this._buffer||(this._buffer=new h(this._core)),this._buffer},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"markers",{get:function(){return this._checkProposedApi(),this._core.markers},enumerable:!1,configurable:!0}),e.prototype.blur=function(){this._core.blur()},e.prototype.focus=function(){this._core.focus()},e.prototype.resize=function(e,t){this._verifyIntegers(e,t),this._core.resize(e,t)},e.prototype.open=function(e){this._core.open(e)},e.prototype.attachCustomKeyEventHandler=function(e){this._core.attachCustomKeyEventHandler(e)},e.prototype.registerLinkMatcher=function(e,t,r){return this._checkProposedApi(),this._core.registerLinkMatcher(e,t,r)},e.prototype.deregisterLinkMatcher=function(e){this._checkProposedApi(),this._core.deregisterLinkMatcher(e)},e.prototype.registerLinkProvider=function(e){return this._checkProposedApi(),this._core.registerLinkProvider(e)},e.prototype.registerCharacterJoiner=function(e){return this._checkProposedApi(),this._core.registerCharacterJoiner(e)},e.prototype.deregisterCharacterJoiner=function(e){this._checkProposedApi(),this._core.deregisterCharacterJoiner(e)},e.prototype.registerMarker=function(e){return this._checkProposedApi(),this._verifyIntegers(e),this._core.addMarker(e)},e.prototype.addMarker=function(e){return this.registerMarker(e)},e.prototype.hasSelection=function(){return this._core.hasSelection()},e.prototype.select=function(e,t,r){this._verifyIntegers(e,t,r),this._core.select(e,t,r)},e.prototype.getSelection=function(){return this._core.getSelection()},e.prototype.getSelectionPosition=function(){return this._core.getSelectionPosition()},e.prototype.clearSelection=function(){this._core.clearSelection()},e.prototype.selectAll=function(){this._core.selectAll()},e.prototype.selectLines=function(e,t){this._verifyIntegers(e,t),this._core.selectLines(e,t)},e.prototype.dispose=function(){this._addonManager.dispose(),this._core.dispose()},e.prototype.scrollLines=function(e){this._verifyIntegers(e),this._core.scrollLines(e)},e.prototype.scrollPages=function(e){this._verifyIntegers(e),this._core.scrollPages(e)},e.prototype.scrollToTop=function(){this._core.scrollToTop()},e.prototype.scrollToBottom=function(){this._core.scrollToBottom()},e.prototype.scrollToLine=function(e){this._verifyIntegers(e),this._core.scrollToLine(e)},e.prototype.clear=function(){this._core.clear()},e.prototype.write=function(e,t){this._core.write(e,t)},e.prototype.writeUtf8=function(e,t){this._core.write(e,t)},e.prototype.writeln=function(e,t){this._core.write(e),this._core.write("\r\n",t)},e.prototype.paste=function(e){this._core.paste(e)},e.prototype.getOption=function(e){return this._core.optionsService.getOption(e)},e.prototype.setOption=function(e,t){this._core.optionsService.setOption(e,t)},e.prototype.refresh=function(e,t){this._verifyIntegers(e,t),this._core.refresh(e,t)},e.prototype.reset=function(){this._core.reset()},e.prototype.loadAddon=function(e){return this._addonManager.loadAddon(this,e)},Object.defineProperty(e,"strings",{get:function(){return o},enumerable:!1,configurable:!0}),e.prototype._verifyIntegers=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];for(var r=0,i=e;r<i.length;r++){var n=i[r];if(n===1/0||isNaN(n)||n%1!=0)throw new Error("This API only accepts integers")}},e}();t.Terminal=c;var l=function(){function e(e,t){this._buffer=e,this.type=t}return e.prototype.init=function(e){return this._buffer=e,this},Object.defineProperty(e.prototype,"cursorY",{get:function(){return this._buffer.y},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"cursorX",{get:function(){return this._buffer.x},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"viewportY",{get:function(){return this._buffer.ydisp},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"baseY",{get:function(){return this._buffer.ybase},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"length",{get:function(){return this._buffer.lines.length},enumerable:!1,configurable:!0}),e.prototype.getLine=function(e){var t=this._buffer.lines.get(e);if(t)return new u(t)},e.prototype.getNullCell=function(){return new i.CellData},e}(),h=function(){function e(e){var t=this;this._core=e,this._onBufferChange=new s.EventEmitter,this._normal=new l(this._core.buffers.normal,"normal"),this._alternate=new l(this._core.buffers.alt,"alternate"),this._core.buffers.onBufferActivate((function(){return t._onBufferChange.fire(t.active)}))}return Object.defineProperty(e.prototype,"onBufferChange",{get:function(){return this._onBufferChange.event},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"active",{get:function(){if(this._core.buffers.active===this._core.buffers.normal)return this.normal;if(this._core.buffers.active===this._core.buffers.alt)return this.alternate;throw new Error("Active buffer is neither normal nor alternate")},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"normal",{get:function(){return this._normal.init(this._core.buffers.normal)},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"alternate",{get:function(){return this._alternate.init(this._core.buffers.alt)},enumerable:!1,configurable:!0}),e}(),u=function(){function e(e){this._line=e}return Object.defineProperty(e.prototype,"isWrapped",{get:function(){return this._line.isWrapped},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"length",{get:function(){return this._line.length},enumerable:!1,configurable:!0}),e.prototype.getCell=function(e,t){if(!(e<0||e>=this._line.length))return t?(this._line.loadCell(e,t),t):this._line.loadCell(e,new i.CellData)},e.prototype.translateToString=function(e,t,r){return this._line.translateToString(e,t,r)},e}(),f=function(){function e(e){this._core=e}return e.prototype.registerCsiHandler=function(e,t){return this._core.addCsiHandler(e,(function(e){return t(e.toArray())}))},e.prototype.addCsiHandler=function(e,t){return this.registerCsiHandler(e,t)},e.prototype.registerDcsHandler=function(e,t){return this._core.addDcsHandler(e,(function(e,r){return t(e,r.toArray())}))},e.prototype.addDcsHandler=function(e,t){return this.registerDcsHandler(e,t)},e.prototype.registerEscHandler=function(e,t){return this._core.addEscHandler(e,t)},e.prototype.addEscHandler=function(e,t){return this.registerEscHandler(e,t)},e.prototype.registerOscHandler=function(e,t){return this._core.addOscHandler(e,t)},e.prototype.addOscHandler=function(e,t){return this.registerOscHandler(e,t)},e}(),_=function(){function e(e){this._core=e}return e.prototype.register=function(e){this._core.unicodeService.register(e)},Object.defineProperty(e.prototype,"versions",{get:function(){return this._core.unicodeService.versions},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"activeVersion",{get:function(){return this._core.unicodeService.activeVersion},set:function(e){this._core.unicodeService.activeVersion=e},enumerable:!1,configurable:!0}),e}()},1546:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.BaseRenderLayer=void 0;var i=r(643),n=r(8803),o=r(1420),s=r(3734),a=r(1752),c=r(4774),l=r(9631),h=function(){function e(e,t,r,i,n,o,s,a){this._container=e,this._alpha=i,this._colors=n,this._rendererId=o,this._bufferService=s,this._optionsService=a,this._scaledCharWidth=0,this._scaledCharHeight=0,this._scaledCellWidth=0,this._scaledCellHeight=0,this._scaledCharLeft=0,this._scaledCharTop=0,this._currentGlyphIdentifier={chars:"",code:0,bg:0,fg:0,bold:!1,dim:!1,italic:!1},this._canvas=document.createElement("canvas"),this._canvas.classList.add("xterm-"+t+"-layer"),this._canvas.style.zIndex=r.toString(),this._initCanvas(),this._container.appendChild(this._canvas)}return e.prototype.dispose=function(){var e;l.removeElementFromParent(this._canvas),null===(e=this._charAtlas)||void 0===e||e.dispose()},e.prototype._initCanvas=function(){this._ctx=a.throwIfFalsy(this._canvas.getContext("2d",{alpha:this._alpha})),this._alpha||this._clearAll()},e.prototype.onOptionsChanged=function(){},e.prototype.onBlur=function(){},e.prototype.onFocus=function(){},e.prototype.onCursorMove=function(){},e.prototype.onGridChanged=function(e,t){},e.prototype.onSelectionChanged=function(e,t,r){void 0===r&&(r=!1)},e.prototype.setColors=function(e){this._refreshCharAtlas(e)},e.prototype._setTransparency=function(e){if(e!==this._alpha){var t=this._canvas;this._alpha=e,this._canvas=this._canvas.cloneNode(),this._initCanvas(),this._container.replaceChild(this._canvas,t),this._refreshCharAtlas(this._colors),this.onGridChanged(0,this._bufferService.rows-1)}},e.prototype._refreshCharAtlas=function(e){this._scaledCharWidth<=0&&this._scaledCharHeight<=0||(this._charAtlas=o.acquireCharAtlas(this._optionsService.options,this._rendererId,e,this._scaledCharWidth,this._scaledCharHeight),this._charAtlas.warmUp())},e.prototype.resize=function(e){this._scaledCellWidth=e.scaledCellWidth,this._scaledCellHeight=e.scaledCellHeight,this._scaledCharWidth=e.scaledCharWidth,this._scaledCharHeight=e.scaledCharHeight,this._scaledCharLeft=e.scaledCharLeft,this._scaledCharTop=e.scaledCharTop,this._canvas.width=e.scaledCanvasWidth,this._canvas.height=e.scaledCanvasHeight,this._canvas.style.width=e.canvasWidth+"px",this._canvas.style.height=e.canvasHeight+"px",this._alpha||this._clearAll(),this._refreshCharAtlas(this._colors)},e.prototype._fillCells=function(e,t,r,i){this._ctx.fillRect(e*this._scaledCellWidth,t*this._scaledCellHeight,r*this._scaledCellWidth,i*this._scaledCellHeight)},e.prototype._fillBottomLineAtCells=function(e,t,r){void 0===r&&(r=1),this._ctx.fillRect(e*this._scaledCellWidth,(t+1)*this._scaledCellHeight-window.devicePixelRatio-1,r*this._scaledCellWidth,window.devicePixelRatio)},e.prototype._fillLeftLineAtCell=function(e,t,r){this._ctx.fillRect(e*this._scaledCellWidth,t*this._scaledCellHeight,window.devicePixelRatio*r,this._scaledCellHeight)},e.prototype._strokeRectAtCell=function(e,t,r,i){this._ctx.lineWidth=window.devicePixelRatio,this._ctx.strokeRect(e*this._scaledCellWidth+window.devicePixelRatio/2,t*this._scaledCellHeight+window.devicePixelRatio/2,r*this._scaledCellWidth-window.devicePixelRatio,i*this._scaledCellHeight-window.devicePixelRatio)},e.prototype._clearAll=function(){this._alpha?this._ctx.clearRect(0,0,this._canvas.width,this._canvas.height):(this._ctx.fillStyle=this._colors.background.css,this._ctx.fillRect(0,0,this._canvas.width,this._canvas.height))},e.prototype._clearCells=function(e,t,r,i){this._alpha?this._ctx.clearRect(e*this._scaledCellWidth,t*this._scaledCellHeight,r*this._scaledCellWidth,i*this._scaledCellHeight):(this._ctx.fillStyle=this._colors.background.css,this._ctx.fillRect(e*this._scaledCellWidth,t*this._scaledCellHeight,r*this._scaledCellWidth,i*this._scaledCellHeight))},e.prototype._fillCharTrueColor=function(e,t,r){this._ctx.font=this._getFont(!1,!1),this._ctx.textBaseline="middle",this._clipRow(r),this._ctx.fillText(e.getChars(),t*this._scaledCellWidth+this._scaledCharLeft,r*this._scaledCellHeight+this._scaledCharTop+this._scaledCharHeight/2)},e.prototype._drawChars=function(e,t,r){var o,s,a=this._getContrastColor(e);a||e.isFgRGB()||e.isBgRGB()?this._drawUncachedChars(e,t,r,a):(e.isInverse()?(o=e.isBgDefault()?n.INVERTED_DEFAULT_COLOR:e.getBgColor(),s=e.isFgDefault()?n.INVERTED_DEFAULT_COLOR:e.getFgColor()):(s=e.isBgDefault()?i.DEFAULT_COLOR:e.getBgColor(),o=e.isFgDefault()?i.DEFAULT_COLOR:e.getFgColor()),o+=this._optionsService.options.drawBoldTextInBrightColors&&e.isBold()&&o<8?8:0,this._currentGlyphIdentifier.chars=e.getChars()||i.WHITESPACE_CELL_CHAR,this._currentGlyphIdentifier.code=e.getCode()||i.WHITESPACE_CELL_CODE,this._currentGlyphIdentifier.bg=s,this._currentGlyphIdentifier.fg=o,this._currentGlyphIdentifier.bold=!!e.isBold(),this._currentGlyphIdentifier.dim=!!e.isDim(),this._currentGlyphIdentifier.italic=!!e.isItalic(),this._charAtlas&&this._charAtlas.draw(this._ctx,this._currentGlyphIdentifier,t*this._scaledCellWidth+this._scaledCharLeft,r*this._scaledCellHeight+this._scaledCharTop)||this._drawUncachedChars(e,t,r))},e.prototype._drawUncachedChars=function(e,t,r,i){if(this._ctx.save(),this._ctx.font=this._getFont(!!e.isBold(),!!e.isItalic()),this._ctx.textBaseline="middle",e.isInverse())if(i)this._ctx.fillStyle=i.css;else if(e.isBgDefault())this._ctx.fillStyle=c.color.opaque(this._colors.background).css;else if(e.isBgRGB())this._ctx.fillStyle="rgb("+s.AttributeData.toColorRGB(e.getBgColor()).join(",")+")";else{var o=e.getBgColor();this._optionsService.options.drawBoldTextInBrightColors&&e.isBold()&&o<8&&(o+=8),this._ctx.fillStyle=this._colors.ansi[o].css}else if(i)this._ctx.fillStyle=i.css;else if(e.isFgDefault())this._ctx.fillStyle=this._colors.foreground.css;else if(e.isFgRGB())this._ctx.fillStyle="rgb("+s.AttributeData.toColorRGB(e.getFgColor()).join(",")+")";else{var a=e.getFgColor();this._optionsService.options.drawBoldTextInBrightColors&&e.isBold()&&a<8&&(a+=8),this._ctx.fillStyle=this._colors.ansi[a].css}this._clipRow(r),e.isDim()&&(this._ctx.globalAlpha=n.DIM_OPACITY),this._ctx.fillText(e.getChars(),t*this._scaledCellWidth+this._scaledCharLeft,r*this._scaledCellHeight+this._scaledCharTop+this._scaledCharHeight/2),this._ctx.restore()},e.prototype._clipRow=function(e){this._ctx.beginPath(),this._ctx.rect(0,e*this._scaledCellHeight,this._bufferService.cols*this._scaledCellWidth,this._scaledCellHeight),this._ctx.clip()},e.prototype._getFont=function(e,t){return(t?"italic":"")+" "+(e?this._optionsService.options.fontWeightBold:this._optionsService.options.fontWeight)+" "+this._optionsService.options.fontSize*window.devicePixelRatio+"px "+this._optionsService.options.fontFamily},e.prototype._getContrastColor=function(e){if(1!==this._optionsService.options.minimumContrastRatio){var t=this._colors.contrastCache.getColor(e.bg,e.fg);if(void 0!==t)return t||void 0;var r=e.getFgColor(),i=e.getFgColorMode(),n=e.getBgColor(),o=e.getBgColorMode(),s=!!e.isInverse(),a=!!e.isInverse();if(s){var l=r;r=n,n=l;var h=i;i=o,o=h}var u=this._resolveBackgroundRgba(o,n,s),f=this._resolveForegroundRgba(i,r,s,a),_=c.rgba.ensureContrastRatio(u,f,this._optionsService.options.minimumContrastRatio);if(_){var d={css:c.channels.toCss(_>>24&255,_>>16&255,_>>8&255),rgba:_};return this._colors.contrastCache.setColor(e.bg,e.fg,d),d}this._colors.contrastCache.setColor(e.bg,e.fg,null)}},e.prototype._resolveBackgroundRgba=function(e,t,r){switch(e){case 16777216:case 33554432:return this._colors.ansi[t].rgba;case 50331648:return t<<8;case 0:default:return r?this._colors.foreground.rgba:this._colors.background.rgba}},e.prototype._resolveForegroundRgba=function(e,t,r,i){switch(e){case 16777216:case 33554432:return this._optionsService.options.drawBoldTextInBrightColors&&i&&t<8&&(t+=8),this._colors.ansi[t].rgba;case 50331648:return t<<8;case 0:default:return r?this._colors.background.rgba:this._colors.foreground.rgba}},e}();t.BaseRenderLayer=h},5879:function(e,t,r){var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0}),t.CharacterJoinerRegistry=t.JoinedCellData=void 0;var o=r(3734),s=r(643),a=r(511),c=function(e){function t(t,r,i){var n=e.call(this)||this;return n.content=0,n.combinedData="",n.fg=t.fg,n.bg=t.bg,n.combinedData=r,n._width=i,n}return n(t,e),t.prototype.isCombined=function(){return 2097152},t.prototype.getWidth=function(){return this._width},t.prototype.getChars=function(){return this.combinedData},t.prototype.getCode=function(){return 2097151},t.prototype.setFromCharData=function(e){throw new Error("not implemented")},t.prototype.getAsCharData=function(){return[this.fg,this.getChars(),this.getWidth(),this.getCode()]},t}(o.AttributeData);t.JoinedCellData=c;var l=function(){function e(e){this._bufferService=e,this._characterJoiners=[],this._nextCharacterJoinerId=0,this._workCell=new a.CellData}return e.prototype.registerCharacterJoiner=function(e){var t={id:this._nextCharacterJoinerId++,handler:e};return this._characterJoiners.push(t),t.id},e.prototype.deregisterCharacterJoiner=function(e){for(var t=0;t<this._characterJoiners.length;t++)if(this._characterJoiners[t].id===e)return this._characterJoiners.splice(t,1),!0;return!1},e.prototype.getJoinedCharacters=function(e){if(0===this._characterJoiners.length)return[];var t=this._bufferService.buffer.lines.get(e);if(!t||0===t.length)return[];for(var r=[],i=t.translateToString(!0),n=0,o=0,a=0,c=t.getFg(0),l=t.getBg(0),h=0;h<t.getTrimmedLength();h++)if(t.loadCell(h,this._workCell),0!==this._workCell.getWidth()){if(this._workCell.fg!==c||this._workCell.bg!==l){if(h-n>1)for(var u=this._getJoinedRanges(i,a,o,t,n),f=0;f<u.length;f++)r.push(u[f]);n=h,a=o,c=this._workCell.fg,l=this._workCell.bg}o+=this._workCell.getChars().length||s.WHITESPACE_CELL_CHAR.length}if(this._bufferService.cols-n>1)for(u=this._getJoinedRanges(i,a,o,t,n),f=0;f<u.length;f++)r.push(u[f]);return r},e.prototype._getJoinedRanges=function(t,r,i,n,o){for(var s=t.substring(r,i),a=this._characterJoiners[0].handler(s),c=1;c<this._characterJoiners.length;c++)for(var l=this._characterJoiners[c].handler(s),h=0;h<l.length;h++)e._mergeRanges(a,l[h]);return this._stringRangesToCellRanges(a,n,o),a},e.prototype._stringRangesToCellRanges=function(e,t,r){var i=0,n=!1,o=0,a=e[i];if(a){for(var c=r;c<this._bufferService.cols;c++){var l=t.getWidth(c),h=t.getString(c).length||s.WHITESPACE_CELL_CHAR.length;if(0!==l){if(!n&&a[0]<=o&&(a[0]=c,n=!0),a[1]<=o){if(a[1]=c,!(a=e[++i]))break;a[0]<=o?(a[0]=c,n=!0):n=!1}o+=h}}a&&(a[1]=this._bufferService.cols)}},e._mergeRanges=function(e,t){for(var r=!1,i=0;i<e.length;i++){var n=e[i];if(r){if(t[1]<=n[0])return e[i-1][1]=t[1],e;if(t[1]<=n[1])return e[i-1][1]=Math.max(t[1],n[1]),e.splice(i,1),e;e.splice(i,1),i--}else{if(t[1]<=n[0])return e.splice(i,0,t),e;if(t[1]<=n[1])return n[0]=Math.min(t[0],n[0]),e;t[0]<n[1]&&(n[0]=Math.min(t[0],n[0]),r=!0)}}return r?e[e.length-1][1]=t[1]:e.push(t),e},e}();t.CharacterJoinerRegistry=l},2512:function(e,t,r){var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0}),t.CursorRenderLayer=void 0;var o=r(1546),s=r(511),a=600,c=function(e){function t(t,r,i,n,o,a,c,l,h){var u=e.call(this,t,"cursor",r,!0,i,n,a,c)||this;return u._onRequestRedraw=o,u._coreService=l,u._coreBrowserService=h,u._cell=new s.CellData,u._state={x:0,y:0,isFocused:!1,style:"",width:0},u._cursorRenderers={bar:u._renderBarCursor.bind(u),block:u._renderBlockCursor.bind(u),underline:u._renderUnderlineCursor.bind(u)},u}return n(t,e),t.prototype.resize=function(t){e.prototype.resize.call(this,t),this._state={x:0,y:0,isFocused:!1,style:"",width:0}},t.prototype.reset=function(){this._clearCursor(),this._cursorBlinkStateManager&&(this._cursorBlinkStateManager.dispose(),this._cursorBlinkStateManager=void 0,this.onOptionsChanged())},t.prototype.onBlur=function(){this._cursorBlinkStateManager&&this._cursorBlinkStateManager.pause(),this._onRequestRedraw.fire({start:this._bufferService.buffer.y,end:this._bufferService.buffer.y})},t.prototype.onFocus=function(){this._cursorBlinkStateManager?this._cursorBlinkStateManager.resume():this._onRequestRedraw.fire({start:this._bufferService.buffer.y,end:this._bufferService.buffer.y})},t.prototype.onOptionsChanged=function(){var e,t=this;this._optionsService.options.cursorBlink?this._cursorBlinkStateManager||(this._cursorBlinkStateManager=new l(this._coreBrowserService.isFocused,(function(){t._render(!0)}))):(null===(e=this._cursorBlinkStateManager)||void 0===e||e.dispose(),this._cursorBlinkStateManager=void 0),this._onRequestRedraw.fire({start:this._bufferService.buffer.y,end:this._bufferService.buffer.y})},t.prototype.onCursorMove=function(){this._cursorBlinkStateManager&&this._cursorBlinkStateManager.restartBlinkAnimation()},t.prototype.onGridChanged=function(e,t){!this._cursorBlinkStateManager||this._cursorBlinkStateManager.isPaused?this._render(!1):this._cursorBlinkStateManager.restartBlinkAnimation()},t.prototype._render=function(e){if(this._coreService.isCursorInitialized&&!this._coreService.isCursorHidden){var t=this._bufferService.buffer.ybase+this._bufferService.buffer.y,r=t-this._bufferService.buffer.ydisp;if(r<0||r>=this._bufferService.rows)this._clearCursor();else{var i=Math.min(this._bufferService.buffer.x,this._bufferService.cols-1);if(this._bufferService.buffer.lines.get(t).loadCell(i,this._cell),void 0!==this._cell.content){if(!this._coreBrowserService.isFocused){this._clearCursor(),this._ctx.save(),this._ctx.fillStyle=this._colors.cursor.css;var n=this._optionsService.options.cursorStyle;return n&&"block"!==n?this._cursorRenderers[n](i,r,this._cell):this._renderBlurCursor(i,r,this._cell),this._ctx.restore(),this._state.x=i,this._state.y=r,this._state.isFocused=!1,this._state.style=n,void(this._state.width=this._cell.getWidth())}if(!this._cursorBlinkStateManager||this._cursorBlinkStateManager.isCursorVisible){if(this._state){if(this._state.x===i&&this._state.y===r&&this._state.isFocused===this._coreBrowserService.isFocused&&this._state.style===this._optionsService.options.cursorStyle&&this._state.width===this._cell.getWidth())return;this._clearCursor()}this._ctx.save(),this._cursorRenderers[this._optionsService.options.cursorStyle||"block"](i,r,this._cell),this._ctx.restore(),this._state.x=i,this._state.y=r,this._state.isFocused=!1,this._state.style=this._optionsService.options.cursorStyle,this._state.width=this._cell.getWidth()}else this._clearCursor()}}}else this._clearCursor()},t.prototype._clearCursor=function(){this._state&&(this._clearCells(this._state.x,this._state.y,this._state.width,1),this._state={x:0,y:0,isFocused:!1,style:"",width:0})},t.prototype._renderBarCursor=function(e,t,r){this._ctx.save(),this._ctx.fillStyle=this._colors.cursor.css,this._fillLeftLineAtCell(e,t,this._optionsService.options.cursorWidth),this._ctx.restore()},t.prototype._renderBlockCursor=function(e,t,r){this._ctx.save(),this._ctx.fillStyle=this._colors.cursor.css,this._fillCells(e,t,r.getWidth(),1),this._ctx.fillStyle=this._colors.cursorAccent.css,this._fillCharTrueColor(r,e,t),this._ctx.restore()},t.prototype._renderUnderlineCursor=function(e,t,r){this._ctx.save(),this._ctx.fillStyle=this._colors.cursor.css,this._fillBottomLineAtCells(e,t),this._ctx.restore()},t.prototype._renderBlurCursor=function(e,t,r){this._ctx.save(),this._ctx.strokeStyle=this._colors.cursor.css,this._strokeRectAtCell(e,t,r.getWidth(),1),this._ctx.restore()},t}(o.BaseRenderLayer);t.CursorRenderLayer=c;var l=function(){function e(e,t){this._renderCallback=t,this.isCursorVisible=!0,e&&this._restartInterval()}return Object.defineProperty(e.prototype,"isPaused",{get:function(){return!(this._blinkStartTimeout||this._blinkInterval)},enumerable:!1,configurable:!0}),e.prototype.dispose=function(){this._blinkInterval&&(window.clearInterval(this._blinkInterval),this._blinkInterval=void 0),this._blinkStartTimeout&&(window.clearTimeout(this._blinkStartTimeout),this._blinkStartTimeout=void 0),this._animationFrame&&(window.cancelAnimationFrame(this._animationFrame),this._animationFrame=void 0)},e.prototype.restartBlinkAnimation=function(){var e=this;this.isPaused||(this._animationTimeRestarted=Date.now(),this.isCursorVisible=!0,this._animationFrame||(this._animationFrame=window.requestAnimationFrame((function(){e._renderCallback(),e._animationFrame=void 0}))))},e.prototype._restartInterval=function(e){var t=this;void 0===e&&(e=a),this._blinkInterval&&window.clearInterval(this._blinkInterval),this._blinkStartTimeout=window.setTimeout((function(){if(t._animationTimeRestarted){var e=a-(Date.now()-t._animationTimeRestarted);if(t._animationTimeRestarted=void 0,e>0)return void t._restartInterval(e)}t.isCursorVisible=!1,t._animationFrame=window.requestAnimationFrame((function(){t._renderCallback(),t._animationFrame=void 0})),t._blinkInterval=window.setInterval((function(){if(t._animationTimeRestarted){var e=a-(Date.now()-t._animationTimeRestarted);return t._animationTimeRestarted=void 0,void t._restartInterval(e)}t.isCursorVisible=!t.isCursorVisible,t._animationFrame=window.requestAnimationFrame((function(){t._renderCallback(),t._animationFrame=void 0}))}),a)}),e)},e.prototype.pause=function(){this.isCursorVisible=!0,this._blinkInterval&&(window.clearInterval(this._blinkInterval),this._blinkInterval=void 0),this._blinkStartTimeout&&(window.clearTimeout(this._blinkStartTimeout),this._blinkStartTimeout=void 0),this._animationFrame&&(window.cancelAnimationFrame(this._animationFrame),this._animationFrame=void 0)},e.prototype.resume=function(){this.pause(),this._animationTimeRestarted=void 0,this._restartInterval(),this.restartBlinkAnimation()},e}()},3700:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.GridCache=void 0;var r=function(){function e(){this.cache=[]}return e.prototype.resize=function(e,t){for(var r=0;r<e;r++){this.cache.length<=r&&this.cache.push([]);for(var i=this.cache[r].length;i<t;i++)this.cache[r].push(void 0);this.cache[r].length=t}this.cache.length=e},e.prototype.clear=function(){for(var e=0;e<this.cache.length;e++)for(var t=0;t<this.cache[e].length;t++)this.cache[e][t]=void 0},e}();t.GridCache=r},5098:function(e,t,r){var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0}),t.LinkRenderLayer=void 0;var o=r(1546),s=r(8803),a=r(2040),c=function(e){function t(t,r,i,n,o,s,a,c){var l=e.call(this,t,"link",r,!0,i,n,a,c)||this;return o.onShowLinkUnderline((function(e){return l._onShowLinkUnderline(e)})),o.onHideLinkUnderline((function(e){return l._onHideLinkUnderline(e)})),s.onShowLinkUnderline((function(e){return l._onShowLinkUnderline(e)})),s.onHideLinkUnderline((function(e){return l._onHideLinkUnderline(e)})),l}return n(t,e),t.prototype.resize=function(t){e.prototype.resize.call(this,t),this._state=void 0},t.prototype.reset=function(){this._clearCurrentLink()},t.prototype._clearCurrentLink=function(){if(this._state){this._clearCells(this._state.x1,this._state.y1,this._state.cols-this._state.x1,1);var e=this._state.y2-this._state.y1-1;e>0&&this._clearCells(0,this._state.y1+1,this._state.cols,e),this._clearCells(0,this._state.y2,this._state.x2,1),this._state=void 0}},t.prototype._onShowLinkUnderline=function(e){if(e.fg===s.INVERTED_DEFAULT_COLOR?this._ctx.fillStyle=this._colors.background.css:e.fg&&a.is256Color(e.fg)?this._ctx.fillStyle=this._colors.ansi[e.fg].css:this._ctx.fillStyle=this._colors.foreground.css,e.y1===e.y2)this._fillBottomLineAtCells(e.x1,e.y1,e.x2-e.x1);else{this._fillBottomLineAtCells(e.x1,e.y1,e.cols-e.x1);for(var t=e.y1+1;t<e.y2;t++)this._fillBottomLineAtCells(0,t,e.cols);this._fillBottomLineAtCells(0,e.y2,e.x2)}this._state=e},t.prototype._onHideLinkUnderline=function(e){this._clearCurrentLink()},t}(o.BaseRenderLayer);t.LinkRenderLayer=c},3525:function(e,t,r){var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}),o=this&&this.__decorate||function(e,t,r,i){var n,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(s=(o<3?n(s):o>3?n(t,r,s):n(t,r))||s);return o>3&&s&&Object.defineProperty(t,r,s),s},s=this&&this.__param||function(e,t){return function(r,i){t(r,i,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.Renderer=void 0;var a=r(9596),c=r(4149),l=r(2512),h=r(5098),u=r(5879),f=r(844),_=r(4725),d=r(2585),p=r(1420),v=r(8460),g=1,y=function(e){function t(t,r,i,n,o,s,f,_,d){var p=e.call(this)||this;p._colors=t,p._screenElement=r,p._bufferService=o,p._charSizeService=s,p._optionsService=f,p._id=g++,p._onRequestRedraw=new v.EventEmitter;var y=p._optionsService.options.allowTransparency;return p._characterJoinerRegistry=new u.CharacterJoinerRegistry(p._bufferService),p._renderLayers=[new a.TextRenderLayer(p._screenElement,0,p._colors,p._characterJoinerRegistry,y,p._id,p._bufferService,f),new c.SelectionRenderLayer(p._screenElement,1,p._colors,p._id,p._bufferService,f),new h.LinkRenderLayer(p._screenElement,2,p._colors,p._id,i,n,p._bufferService,f),new l.CursorRenderLayer(p._screenElement,3,p._colors,p._id,p._onRequestRedraw,p._bufferService,f,_,d)],p.dimensions={scaledCharWidth:0,scaledCharHeight:0,scaledCellWidth:0,scaledCellHeight:0,scaledCharLeft:0,scaledCharTop:0,scaledCanvasWidth:0,scaledCanvasHeight:0,canvasWidth:0,canvasHeight:0,actualCellWidth:0,actualCellHeight:0},p._devicePixelRatio=window.devicePixelRatio,p._updateDimensions(),p.onOptionsChanged(),p}return n(t,e),Object.defineProperty(t.prototype,"onRequestRedraw",{get:function(){return this._onRequestRedraw.event},enumerable:!1,configurable:!0}),t.prototype.dispose=function(){for(var t=0,r=this._renderLayers;t<r.length;t++)r[t].dispose();e.prototype.dispose.call(this),p.removeTerminalFromCache(this._id)},t.prototype.onDevicePixelRatioChange=function(){this._devicePixelRatio!==window.devicePixelRatio&&(this._devicePixelRatio=window.devicePixelRatio,this.onResize(this._bufferService.cols,this._bufferService.rows))},t.prototype.setColors=function(e){this._colors=e;for(var t=0,r=this._renderLayers;t<r.length;t++){var i=r[t];i.setColors(this._colors),i.reset()}},t.prototype.onResize=function(e,t){this._updateDimensions();for(var r=0,i=this._renderLayers;r<i.length;r++)i[r].resize(this.dimensions);this._screenElement.style.width=this.dimensions.canvasWidth+"px",this._screenElement.style.height=this.dimensions.canvasHeight+"px"},t.prototype.onCharSizeChanged=function(){this.onResize(this._bufferService.cols,this._bufferService.rows)},t.prototype.onBlur=function(){this._runOperation((function(e){return e.onBlur()}))},t.prototype.onFocus=function(){this._runOperation((function(e){return e.onFocus()}))},t.prototype.onSelectionChanged=function(e,t,r){void 0===r&&(r=!1),this._runOperation((function(i){return i.onSelectionChanged(e,t,r)}))},t.prototype.onCursorMove=function(){this._runOperation((function(e){return e.onCursorMove()}))},t.prototype.onOptionsChanged=function(){this._runOperation((function(e){return e.onOptionsChanged()}))},t.prototype.clear=function(){this._runOperation((function(e){return e.reset()}))},t.prototype._runOperation=function(e){for(var t=0,r=this._renderLayers;t<r.length;t++)e(r[t])},t.prototype.renderRows=function(e,t){for(var r=0,i=this._renderLayers;r<i.length;r++)i[r].onGridChanged(e,t)},t.prototype._updateDimensions=function(){this._charSizeService.hasValidSize&&(this.dimensions.scaledCharWidth=Math.floor(this._charSizeService.width*window.devicePixelRatio),this.dimensions.scaledCharHeight=Math.ceil(this._charSizeService.height*window.devicePixelRatio),this.dimensions.scaledCellHeight=Math.floor(this.dimensions.scaledCharHeight*this._optionsService.options.lineHeight),this.dimensions.scaledCharTop=1===this._optionsService.options.lineHeight?0:Math.round((this.dimensions.scaledCellHeight-this.dimensions.scaledCharHeight)/2),this.dimensions.scaledCellWidth=this.dimensions.scaledCharWidth+Math.round(this._optionsService.options.letterSpacing),this.dimensions.scaledCharLeft=Math.floor(this._optionsService.options.letterSpacing/2),this.dimensions.scaledCanvasHeight=this._bufferService.rows*this.dimensions.scaledCellHeight,this.dimensions.scaledCanvasWidth=this._bufferService.cols*this.dimensions.scaledCellWidth,this.dimensions.canvasHeight=Math.round(this.dimensions.scaledCanvasHeight/window.devicePixelRatio),this.dimensions.canvasWidth=Math.round(this.dimensions.scaledCanvasWidth/window.devicePixelRatio),this.dimensions.actualCellHeight=this.dimensions.canvasHeight/this._bufferService.rows,this.dimensions.actualCellWidth=this.dimensions.canvasWidth/this._bufferService.cols)},t.prototype.registerCharacterJoiner=function(e){return this._characterJoinerRegistry.registerCharacterJoiner(e)},t.prototype.deregisterCharacterJoiner=function(e){return this._characterJoinerRegistry.deregisterCharacterJoiner(e)},o([s(4,d.IBufferService),s(5,_.ICharSizeService),s(6,d.IOptionsService),s(7,d.ICoreService),s(8,_.ICoreBrowserService)],t)}(f.Disposable);t.Renderer=y},1752:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.throwIfFalsy=void 0,t.throwIfFalsy=function(e){if(!e)throw new Error("value must not be falsy");return e}},4149:function(e,t,r){var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0}),t.SelectionRenderLayer=void 0;var o=function(e){function t(t,r,i,n,o,s){var a=e.call(this,t,"selection",r,!0,i,n,o,s)||this;return a._clearState(),a}return n(t,e),t.prototype._clearState=function(){this._state={start:void 0,end:void 0,columnSelectMode:void 0,ydisp:void 0}},t.prototype.resize=function(t){e.prototype.resize.call(this,t),this._clearState()},t.prototype.reset=function(){this._state.start&&this._state.end&&(this._clearState(),this._clearAll())},t.prototype.onSelectionChanged=function(e,t,r){if(this._didStateChange(e,t,r,this._bufferService.buffer.ydisp))if(this._clearAll(),e&&t){var i=e[1]-this._bufferService.buffer.ydisp,n=t[1]-this._bufferService.buffer.ydisp,o=Math.max(i,0),s=Math.min(n,this._bufferService.rows-1);if(o>=this._bufferService.rows||s<0)this._state.ydisp=this._bufferService.buffer.ydisp;else{if(this._ctx.fillStyle=this._colors.selectionTransparent.css,r){var a=e[0],c=t[0]-a,l=s-o+1;this._fillCells(a,o,c,l)}else{a=i===o?e[0]:0;var h=o===n?t[0]:this._bufferService.cols;this._fillCells(a,o,h-a,1);var u=Math.max(s-o-1,0);if(this._fillCells(0,o+1,this._bufferService.cols,u),o!==s){var f=n===s?t[0]:this._bufferService.cols;this._fillCells(0,s,f,1)}}this._state.start=[e[0],e[1]],this._state.end=[t[0],t[1]],this._state.columnSelectMode=r,this._state.ydisp=this._bufferService.buffer.ydisp}}else this._clearState()},t.prototype._didStateChange=function(e,t,r,i){return!this._areCoordinatesEqual(e,this._state.start)||!this._areCoordinatesEqual(t,this._state.end)||r!==this._state.columnSelectMode||i!==this._state.ydisp},t.prototype._areCoordinatesEqual=function(e,t){return!(!e||!t)&&e[0]===t[0]&&e[1]===t[1]},t}(r(1546).BaseRenderLayer);t.SelectionRenderLayer=o},9596:function(e,t,r){var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0}),t.TextRenderLayer=void 0;var o=r(3700),s=r(1546),a=r(3734),c=r(643),l=r(5879),h=r(511),u=function(e){function t(t,r,i,n,s,a,c,l){var u=e.call(this,t,"text",r,s,i,a,c,l)||this;return u._characterWidth=0,u._characterFont="",u._characterOverlapCache={},u._workCell=new h.CellData,u._state=new o.GridCache,u._characterJoinerRegistry=n,u}return n(t,e),t.prototype.resize=function(t){e.prototype.resize.call(this,t);var r=this._getFont(!1,!1);this._characterWidth===t.scaledCharWidth&&this._characterFont===r||(this._characterWidth=t.scaledCharWidth,this._characterFont=r,this._characterOverlapCache={}),this._state.clear(),this._state.resize(this._bufferService.cols,this._bufferService.rows)},t.prototype.reset=function(){this._state.clear(),this._clearAll()},t.prototype._forEachCell=function(e,t,r,i){for(var n=e;n<=t;n++)for(var o=n+this._bufferService.buffer.ydisp,s=this._bufferService.buffer.lines.get(o),a=r?r.getJoinedCharacters(o):[],h=0;h<this._bufferService.cols;h++){s.loadCell(h,this._workCell);var u=this._workCell,f=!1,_=h;if(0!==u.getWidth()){if(a.length>0&&h===a[0][0]){f=!0;var d=a.shift();u=new l.JoinedCellData(this._workCell,s.translateToString(!0,d[0],d[1]),d[1]-d[0]),_=d[1]-1}!f&&this._isOverlapping(u)&&_<s.length-1&&s.getCodePoint(_+1)===c.NULL_CELL_CODE&&(u.content&=-12582913,u.content|=2<<22),i(u,h,n),h=_}}},t.prototype._drawBackground=function(e,t){var r=this,i=this._ctx,n=this._bufferService.cols,o=0,s=0,c=null;i.save(),this._forEachCell(e,t,null,(function(e,t,l){var h=null;e.isInverse()?h=e.isFgDefault()?r._colors.foreground.css:e.isFgRGB()?"rgb("+a.AttributeData.toColorRGB(e.getFgColor()).join(",")+")":r._colors.ansi[e.getFgColor()].css:e.isBgRGB()?h="rgb("+a.AttributeData.toColorRGB(e.getBgColor()).join(",")+")":e.isBgPalette()&&(h=r._colors.ansi[e.getBgColor()].css),null===c&&(o=t,s=l),l!==s?(i.fillStyle=c||"",r._fillCells(o,s,n-o,1),o=t,s=l):c!==h&&(i.fillStyle=c||"",r._fillCells(o,s,t-o,1),o=t,s=l),c=h})),null!==c&&(i.fillStyle=c,this._fillCells(o,s,n-o,1)),i.restore()},t.prototype._drawForeground=function(e,t){var r=this;this._forEachCell(e,t,this._characterJoinerRegistry,(function(e,t,i){if(!e.isInvisible()&&(r._drawChars(e,t,i),e.isUnderline())){if(r._ctx.save(),e.isInverse())if(e.isBgDefault())r._ctx.fillStyle=r._colors.background.css;else if(e.isBgRGB())r._ctx.fillStyle="rgb("+a.AttributeData.toColorRGB(e.getBgColor()).join(",")+")";else{var n=e.getBgColor();r._optionsService.options.drawBoldTextInBrightColors&&e.isBold()&&n<8&&(n+=8),r._ctx.fillStyle=r._colors.ansi[n].css}else if(e.isFgDefault())r._ctx.fillStyle=r._colors.foreground.css;else if(e.isFgRGB())r._ctx.fillStyle="rgb("+a.AttributeData.toColorRGB(e.getFgColor()).join(",")+")";else{var o=e.getFgColor();r._optionsService.options.drawBoldTextInBrightColors&&e.isBold()&&o<8&&(o+=8),r._ctx.fillStyle=r._colors.ansi[o].css}r._fillBottomLineAtCells(t,i,e.getWidth()),r._ctx.restore()}}))},t.prototype.onGridChanged=function(e,t){0!==this._state.cache.length&&(this._charAtlas&&this._charAtlas.beginFrame(),this._clearCells(0,e,this._bufferService.cols,t-e+1),this._drawBackground(e,t),this._drawForeground(e,t))},t.prototype.onOptionsChanged=function(){this._setTransparency(this._optionsService.options.allowTransparency)},t.prototype._isOverlapping=function(e){if(1!==e.getWidth())return!1;if(e.getCode()<256)return!1;var t=e.getChars();if(this._characterOverlapCache.hasOwnProperty(t))return this._characterOverlapCache[t];this._ctx.save(),this._ctx.font=this._characterFont;var r=Math.floor(this._ctx.measureText(t).width)>this._characterWidth;return this._ctx.restore(),this._characterOverlapCache[t]=r,r},t}(s.BaseRenderLayer);t.TextRenderLayer=u},9616:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.BaseCharAtlas=void 0;var r=function(){function e(){this._didWarmUp=!1}return e.prototype.dispose=function(){},e.prototype.warmUp=function(){this._didWarmUp||(this._doWarmUp(),this._didWarmUp=!0)},e.prototype._doWarmUp=function(){},e.prototype.beginFrame=function(){},e}();t.BaseCharAtlas=r},1420:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.removeTerminalFromCache=t.acquireCharAtlas=void 0;var i=r(2040),n=r(1906),o=[];t.acquireCharAtlas=function(e,t,r,s,a){for(var c=i.generateConfig(s,a,e,r),l=0;l<o.length;l++){var h=(u=o[l]).ownedBy.indexOf(t);if(h>=0){if(i.configEquals(u.config,c))return u.atlas;1===u.ownedBy.length?(u.atlas.dispose(),o.splice(l,1)):u.ownedBy.splice(h,1);break}}for(l=0;l<o.length;l++){var u=o[l];if(i.configEquals(u.config,c))return u.ownedBy.push(t),u.atlas}var f={atlas:new n.DynamicCharAtlas(document,c),config:c,ownedBy:[t]};return o.push(f),f.atlas},t.removeTerminalFromCache=function(e){for(var t=0;t<o.length;t++){var r=o[t].ownedBy.indexOf(e);if(-1!==r){1===o[t].ownedBy.length?(o[t].atlas.dispose(),o.splice(t,1)):o[t].ownedBy.splice(r,1);break}}}},2040:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.is256Color=t.configEquals=t.generateConfig=void 0;var i=r(643);t.generateConfig=function(e,t,r,i){var n={foreground:i.foreground,background:i.background,cursor:void 0,cursorAccent:void 0,selection:void 0,ansi:i.ansi};return{devicePixelRatio:window.devicePixelRatio,scaledCharWidth:e,scaledCharHeight:t,fontFamily:r.fontFamily,fontSize:r.fontSize,fontWeight:r.fontWeight,fontWeightBold:r.fontWeightBold,allowTransparency:r.allowTransparency,colors:n}},t.configEquals=function(e,t){for(var r=0;r<e.colors.ansi.length;r++)if(e.colors.ansi[r].rgba!==t.colors.ansi[r].rgba)return!1;return e.devicePixelRatio===t.devicePixelRatio&&e.fontFamily===t.fontFamily&&e.fontSize===t.fontSize&&e.fontWeight===t.fontWeight&&e.fontWeightBold===t.fontWeightBold&&e.allowTransparency===t.allowTransparency&&e.scaledCharWidth===t.scaledCharWidth&&e.scaledCharHeight===t.scaledCharHeight&&e.colors.foreground===t.colors.foreground&&e.colors.background===t.colors.background},t.is256Color=function(e){return e<i.DEFAULT_COLOR}},8803:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.CHAR_ATLAS_CELL_SPACING=t.DIM_OPACITY=t.INVERTED_DEFAULT_COLOR=void 0,t.INVERTED_DEFAULT_COLOR=257,t.DIM_OPACITY=.5,t.CHAR_ATLAS_CELL_SPACING=1},1906:function(e,t,r){var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0}),t.NoneCharAtlas=t.DynamicCharAtlas=t.getGlyphCacheKey=void 0;var o=r(8803),s=r(9616),a=r(5680),c=r(7001),l=r(6114),h=r(1752),u=r(4774),f={css:"rgba(0, 0, 0, 0)",rgba:0};function _(e){return e.code<<21|e.bg<<12|e.fg<<3|(e.bold?0:4)+(e.dim?0:2)+(e.italic?0:1)}t.getGlyphCacheKey=_;var d=function(e){function t(t,r){var i=e.call(this)||this;i._config=r,i._drawToCacheCount=0,i._glyphsWaitingOnBitmap=[],i._bitmapCommitTimeout=null,i._bitmap=null,i._cacheCanvas=t.createElement("canvas"),i._cacheCanvas.width=1024,i._cacheCanvas.height=1024,i._cacheCtx=h.throwIfFalsy(i._cacheCanvas.getContext("2d",{alpha:!0}));var n=t.createElement("canvas");n.width=i._config.scaledCharWidth,n.height=i._config.scaledCharHeight,i._tmpCtx=h.throwIfFalsy(n.getContext("2d",{alpha:i._config.allowTransparency})),i._width=Math.floor(1024/i._config.scaledCharWidth),i._height=Math.floor(1024/i._config.scaledCharHeight);var o=i._width*i._height;return i._cacheMap=new c.LRUMap(o),i._cacheMap.prealloc(o),i}return n(t,e),t.prototype.dispose=function(){null!==this._bitmapCommitTimeout&&(window.clearTimeout(this._bitmapCommitTimeout),this._bitmapCommitTimeout=null)},t.prototype.beginFrame=function(){this._drawToCacheCount=0},t.prototype.draw=function(e,t,r,i){if(32===t.code)return!0;if(!this._canCache(t))return!1;var n=_(t),o=this._cacheMap.get(n);if(null!=o)return this._drawFromCache(e,o,r,i),!0;if(this._drawToCacheCount<100){var s;s=this._cacheMap.size<this._cacheMap.capacity?this._cacheMap.size:this._cacheMap.peek().index;var a=this._drawToCache(t,s);return this._cacheMap.set(n,a),this._drawFromCache(e,a,r,i),!0}return!1},t.prototype._canCache=function(e){return e.code<256},t.prototype._toCoordinateX=function(e){return e%this._width*this._config.scaledCharWidth},t.prototype._toCoordinateY=function(e){return Math.floor(e/this._width)*this._config.scaledCharHeight},t.prototype._drawFromCache=function(e,t,r,i){if(!t.isEmpty){var n=this._toCoordinateX(t.index),o=this._toCoordinateY(t.index);e.drawImage(t.inBitmap?this._bitmap:this._cacheCanvas,n,o,this._config.scaledCharWidth,this._config.scaledCharHeight,r,i,this._config.scaledCharWidth,this._config.scaledCharHeight)}},t.prototype._getColorFromAnsiIndex=function(e){return e<this._config.colors.ansi.length?this._config.colors.ansi[e]:a.DEFAULT_ANSI_COLORS[e]},t.prototype._getBackgroundColor=function(e){return this._config.allowTransparency?f:e.bg===o.INVERTED_DEFAULT_COLOR?this._config.colors.foreground:e.bg<256?this._getColorFromAnsiIndex(e.bg):this._config.colors.background},t.prototype._getForegroundColor=function(e){return e.fg===o.INVERTED_DEFAULT_COLOR?u.color.opaque(this._config.colors.background):e.fg<256?this._getColorFromAnsiIndex(e.fg):this._config.colors.foreground},t.prototype._drawToCache=function(e,t){this._drawToCacheCount++,this._tmpCtx.save();var r=this._getBackgroundColor(e);this._tmpCtx.globalCompositeOperation="copy",this._tmpCtx.fillStyle=r.css,this._tmpCtx.fillRect(0,0,this._config.scaledCharWidth,this._config.scaledCharHeight),this._tmpCtx.globalCompositeOperation="source-over";var i=e.bold?this._config.fontWeightBold:this._config.fontWeight,n=e.italic?"italic":"";this._tmpCtx.font=n+" "+i+" "+this._config.fontSize*this._config.devicePixelRatio+"px "+this._config.fontFamily,this._tmpCtx.textBaseline="middle",this._tmpCtx.fillStyle=this._getForegroundColor(e).css,e.dim&&(this._tmpCtx.globalAlpha=o.DIM_OPACITY),this._tmpCtx.fillText(e.chars,0,this._config.scaledCharHeight/2),this._tmpCtx.restore();var s=this._tmpCtx.getImageData(0,0,this._config.scaledCharWidth,this._config.scaledCharHeight),a=!1;this._config.allowTransparency||(a=function(e,t){for(var r=!0,i=t.rgba>>>24,n=t.rgba>>>16&255,o=t.rgba>>>8&255,s=0;s<e.data.length;s+=4)e.data[s]===i&&e.data[s+1]===n&&e.data[s+2]===o?e.data[s+3]=0:r=!1;return r}(s,r));var c=this._toCoordinateX(t),l=this._toCoordinateY(t);this._cacheCtx.putImageData(s,c,l);var h={index:t,isEmpty:a,inBitmap:!1};return this._addGlyphToBitmap(h),h},t.prototype._addGlyphToBitmap=function(e){var t=this;!("createImageBitmap"in window)||l.isFirefox||l.isSafari||(this._glyphsWaitingOnBitmap.push(e),null===this._bitmapCommitTimeout&&(this._bitmapCommitTimeout=window.setTimeout((function(){return t._generateBitmap()}),100)))},t.prototype._generateBitmap=function(){var e=this,t=this._glyphsWaitingOnBitmap;this._glyphsWaitingOnBitmap=[],window.createImageBitmap(this._cacheCanvas).then((function(r){e._bitmap=r;for(var i=0;i<t.length;i++)t[i].inBitmap=!0})),this._bitmapCommitTimeout=null},t}(s.BaseCharAtlas);t.DynamicCharAtlas=d;var p=function(e){function t(t,r){return e.call(this)||this}return n(t,e),t.prototype.draw=function(e,t,r,i){return!1},t}(s.BaseCharAtlas);t.NoneCharAtlas=p},7001:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.LRUMap=void 0;var r=function(){function e(e){this.capacity=e,this._map={},this._head=null,this._tail=null,this._nodePool=[],this.size=0}return e.prototype._unlinkNode=function(e){var t=e.prev,r=e.next;e===this._head&&(this._head=r),e===this._tail&&(this._tail=t),null!==t&&(t.next=r),null!==r&&(r.prev=t)},e.prototype._appendNode=function(e){var t=this._tail;null!==t&&(t.next=e),e.prev=t,e.next=null,this._tail=e,null===this._head&&(this._head=e)},e.prototype.prealloc=function(e){for(var t=this._nodePool,r=0;r<e;r++)t.push({prev:null,next:null,key:null,value:null})},e.prototype.get=function(e){var t=this._map[e];return void 0!==t?(this._unlinkNode(t),this._appendNode(t),t.value):null},e.prototype.peekValue=function(e){var t=this._map[e];return void 0!==t?t.value:null},e.prototype.peek=function(){var e=this._head;return null===e?null:e.value},e.prototype.set=function(e,t){var r=this._map[e];if(void 0!==r)r=this._map[e],this._unlinkNode(r),r.value=t;else if(this.size>=this.capacity)r=this._head,this._unlinkNode(r),delete this._map[r.key],r.key=e,r.value=t,this._map[e]=r;else{var i=this._nodePool;i.length>0?((r=i.pop()).key=e,r.value=t):r={prev:null,next:null,key:e,value:t},this._map[e]=r,this.size++}this._appendNode(r)},e}();t.LRUMap=r},1296:function(e,t,r){var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}),o=this&&this.__decorate||function(e,t,r,i){var n,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(s=(o<3?n(s):o>3?n(t,r,s):n(t,r))||s);return o>3&&s&&Object.defineProperty(t,r,s),s},s=this&&this.__param||function(e,t){return function(r,i){t(r,i,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.DomRenderer=void 0;var a=r(3787),c=r(8803),l=r(844),h=r(4725),u=r(2585),f=r(8460),_=r(4774),d=r(9631),p="xterm-dom-renderer-owner-",v="xterm-fg-",g="xterm-bg-",y="xterm-focus",b=1,S=function(e){function t(t,r,i,n,o,s,c,l,h){var u=e.call(this)||this;return u._colors=t,u._element=r,u._screenElement=i,u._viewportElement=n,u._linkifier=o,u._linkifier2=s,u._charSizeService=c,u._optionsService=l,u._bufferService=h,u._terminalClass=b++,u._rowElements=[],u._rowContainer=document.createElement("div"),u._rowContainer.classList.add("xterm-rows"),u._rowContainer.style.lineHeight="normal",u._rowContainer.setAttribute("aria-hidden","true"),u._refreshRowElements(u._bufferService.cols,u._bufferService.rows),u._selectionContainer=document.createElement("div"),u._selectionContainer.classList.add("xterm-selection"),u._selectionContainer.setAttribute("aria-hidden","true"),u.dimensions={scaledCharWidth:0,scaledCharHeight:0,scaledCellWidth:0,scaledCellHeight:0,scaledCharLeft:0,scaledCharTop:0,scaledCanvasWidth:0,scaledCanvasHeight:0,canvasWidth:0,canvasHeight:0,actualCellWidth:0,actualCellHeight:0},u._updateDimensions(),u._injectCss(),u._rowFactory=new a.DomRendererRowFactory(document,u._optionsService,u._colors),u._element.classList.add(p+u._terminalClass),u._screenElement.appendChild(u._rowContainer),u._screenElement.appendChild(u._selectionContainer),u._linkifier.onShowLinkUnderline((function(e){return u._onLinkHover(e)})),u._linkifier.onHideLinkUnderline((function(e){return u._onLinkLeave(e)})),u._linkifier2.onShowLinkUnderline((function(e){return u._onLinkHover(e)})),u._linkifier2.onHideLinkUnderline((function(e){return u._onLinkLeave(e)})),u}return n(t,e),Object.defineProperty(t.prototype,"onRequestRedraw",{get:function(){return(new f.EventEmitter).event},enumerable:!1,configurable:!0}),t.prototype.dispose=function(){this._element.classList.remove(p+this._terminalClass),d.removeElementFromParent(this._rowContainer,this._selectionContainer,this._themeStyleElement,this._dimensionsStyleElement),e.prototype.dispose.call(this)},t.prototype._updateDimensions=function(){this.dimensions.scaledCharWidth=this._charSizeService.width*window.devicePixelRatio,this.dimensions.scaledCharHeight=Math.ceil(this._charSizeService.height*window.devicePixelRatio),this.dimensions.scaledCellWidth=this.dimensions.scaledCharWidth+Math.round(this._optionsService.options.letterSpacing),this.dimensions.scaledCellHeight=Math.floor(this.dimensions.scaledCharHeight*this._optionsService.options.lineHeight),this.dimensions.scaledCharLeft=0,this.dimensions.scaledCharTop=0,this.dimensions.scaledCanvasWidth=this.dimensions.scaledCellWidth*this._bufferService.cols,this.dimensions.scaledCanvasHeight=this.dimensions.scaledCellHeight*this._bufferService.rows,this.dimensions.canvasWidth=Math.round(this.dimensions.scaledCanvasWidth/window.devicePixelRatio),this.dimensions.canvasHeight=Math.round(this.dimensions.scaledCanvasHeight/window.devicePixelRatio),this.dimensions.actualCellWidth=this.dimensions.canvasWidth/this._bufferService.cols,this.dimensions.actualCellHeight=this.dimensions.canvasHeight/this._bufferService.rows;for(var e=0,t=this._rowElements;e<t.length;e++){var r=t[e];r.style.width=this.dimensions.canvasWidth+"px",r.style.height=this.dimensions.actualCellHeight+"px",r.style.lineHeight=this.dimensions.actualCellHeight+"px",r.style.overflow="hidden"}this._dimensionsStyleElement||(this._dimensionsStyleElement=document.createElement("style"),this._screenElement.appendChild(this._dimensionsStyleElement));var i=this._terminalSelector+" .xterm-rows span { display: inline-block; height: 100%; vertical-align: top; width: "+this.dimensions.actualCellWidth+"px}";this._dimensionsStyleElement.textContent=i,this._selectionContainer.style.height=this._viewportElement.style.height,this._screenElement.style.width=this.dimensions.canvasWidth+"px",this._screenElement.style.height=this.dimensions.canvasHeight+"px"},t.prototype.setColors=function(e){this._colors=e,this._injectCss()},t.prototype._injectCss=function(){var e=this;this._themeStyleElement||(this._themeStyleElement=document.createElement("style"),this._screenElement.appendChild(this._themeStyleElement));var t=this._terminalSelector+" .xterm-rows { color: "+this._colors.foreground.css+"; font-family: "+this._optionsService.options.fontFamily+"; font-size: "+this._optionsService.options.fontSize+"px;}";t+=this._terminalSelector+" span:not(."+a.BOLD_CLASS+") { font-weight: "+this._optionsService.options.fontWeight+";}"+this._terminalSelector+" span."+a.BOLD_CLASS+" { font-weight: "+this._optionsService.options.fontWeightBold+";}"+this._terminalSelector+" span."+a.ITALIC_CLASS+" { font-style: italic;}",t+="@keyframes blink_box_shadow_"+this._terminalClass+" { 50% {  box-shadow: none; }}",t+="@keyframes blink_block_"+this._terminalClass+" { 0% {  background-color: "+this._colors.cursor.css+";  color: "+this._colors.cursorAccent.css+"; } 50% {  background-color: "+this._colors.cursorAccent.css+";  color: "+this._colors.cursor.css+"; }}",t+=this._terminalSelector+" .xterm-rows:not(.xterm-focus) ."+a.CURSOR_CLASS+"."+a.CURSOR_STYLE_BLOCK_CLASS+" { outline: 1px solid "+this._colors.cursor.css+"; outline-offset: -1px;}"+this._terminalSelector+" .xterm-rows.xterm-focus ."+a.CURSOR_CLASS+"."+a.CURSOR_BLINK_CLASS+":not(."+a.CURSOR_STYLE_BLOCK_CLASS+") { animation: blink_box_shadow_"+this._terminalClass+" 1s step-end infinite;}"+this._terminalSelector+" .xterm-rows.xterm-focus ."+a.CURSOR_CLASS+"."+a.CURSOR_BLINK_CLASS+"."+a.CURSOR_STYLE_BLOCK_CLASS+" { animation: blink_block_"+this._terminalClass+" 1s step-end infinite;}"+this._terminalSelector+" .xterm-rows.xterm-focus ."+a.CURSOR_CLASS+"."+a.CURSOR_STYLE_BLOCK_CLASS+" { background-color: "+this._colors.cursor.css+"; color: "+this._colors.cursorAccent.css+";}"+this._terminalSelector+" .xterm-rows ."+a.CURSOR_CLASS+"."+a.CURSOR_STYLE_BAR_CLASS+" { box-shadow: "+this._optionsService.options.cursorWidth+"px 0 0 "+this._colors.cursor.css+" inset;}"+this._terminalSelector+" .xterm-rows ."+a.CURSOR_CLASS+"."+a.CURSOR_STYLE_UNDERLINE_CLASS+" { box-shadow: 0 -1px 0 "+this._colors.cursor.css+" inset;}",t+=this._terminalSelector+" .xterm-selection { position: absolute; top: 0; left: 0; z-index: 1; pointer-events: none;}"+this._terminalSelector+" .xterm-selection div { position: absolute; background-color: "+this._colors.selectionTransparent.css+";}",this._colors.ansi.forEach((function(r,i){t+=e._terminalSelector+" ."+v+i+" { color: "+r.css+"; }"+e._terminalSelector+" ."+g+i+" { background-color: "+r.css+"; }"})),t+=this._terminalSelector+" ."+v+c.INVERTED_DEFAULT_COLOR+" { color: "+_.color.opaque(this._colors.background).css+"; }"+this._terminalSelector+" ."+g+c.INVERTED_DEFAULT_COLOR+" { background-color: "+this._colors.foreground.css+"; }",this._themeStyleElement.textContent=t},t.prototype.onDevicePixelRatioChange=function(){this._updateDimensions()},t.prototype._refreshRowElements=function(e,t){for(var r=this._rowElements.length;r<=t;r++){var i=document.createElement("div");this._rowContainer.appendChild(i),this._rowElements.push(i)}for(;this._rowElements.length>t;)this._rowContainer.removeChild(this._rowElements.pop())},t.prototype.onResize=function(e,t){this._refreshRowElements(e,t),this._updateDimensions()},t.prototype.onCharSizeChanged=function(){this._updateDimensions()},t.prototype.onBlur=function(){this._rowContainer.classList.remove(y)},t.prototype.onFocus=function(){this._rowContainer.classList.add(y)},t.prototype.onSelectionChanged=function(e,t,r){for(;this._selectionContainer.children.length;)this._selectionContainer.removeChild(this._selectionContainer.children[0]);if(e&&t){var i=e[1]-this._bufferService.buffer.ydisp,n=t[1]-this._bufferService.buffer.ydisp,o=Math.max(i,0),s=Math.min(n,this._bufferService.rows-1);if(!(o>=this._bufferService.rows||s<0)){var a=document.createDocumentFragment();if(r)a.appendChild(this._createSelectionElement(o,e[0],t[0],s-o+1));else{var c=i===o?e[0]:0,l=o===n?t[0]:this._bufferService.cols;a.appendChild(this._createSelectionElement(o,c,l));var h=s-o-1;if(a.appendChild(this._createSelectionElement(o+1,0,this._bufferService.cols,h)),o!==s){var u=n===s?t[0]:this._bufferService.cols;a.appendChild(this._createSelectionElement(s,0,u))}}this._selectionContainer.appendChild(a)}}},t.prototype._createSelectionElement=function(e,t,r,i){void 0===i&&(i=1);var n=document.createElement("div");return n.style.height=i*this.dimensions.actualCellHeight+"px",n.style.top=e*this.dimensions.actualCellHeight+"px",n.style.left=t*this.dimensions.actualCellWidth+"px",n.style.width=this.dimensions.actualCellWidth*(r-t)+"px",n},t.prototype.onCursorMove=function(){},t.prototype.onOptionsChanged=function(){this._updateDimensions(),this._injectCss()},t.prototype.clear=function(){for(var e=0,t=this._rowElements;e<t.length;e++)t[e].innerText=""},t.prototype.renderRows=function(e,t){for(var r=this._bufferService.buffer.ybase+this._bufferService.buffer.y,i=Math.min(this._bufferService.buffer.x,this._bufferService.cols-1),n=this._optionsService.options.cursorBlink,o=e;o<=t;o++){var s=this._rowElements[o];s.innerText="";var a=o+this._bufferService.buffer.ydisp,c=this._bufferService.buffer.lines.get(a),l=this._optionsService.options.cursorStyle;s.appendChild(this._rowFactory.createRow(c,a===r,l,i,n,this.dimensions.actualCellWidth,this._bufferService.cols))}},Object.defineProperty(t.prototype,"_terminalSelector",{get:function(){return"."+p+this._terminalClass},enumerable:!1,configurable:!0}),t.prototype.registerCharacterJoiner=function(e){return-1},t.prototype.deregisterCharacterJoiner=function(e){return!1},t.prototype._onLinkHover=function(e){this._setCellUnderline(e.x1,e.x2,e.y1,e.y2,e.cols,!0)},t.prototype._onLinkLeave=function(e){this._setCellUnderline(e.x1,e.x2,e.y1,e.y2,e.cols,!1)},t.prototype._setCellUnderline=function(e,t,r,i,n,o){for(;e!==t||r!==i;){var s=this._rowElements[r];if(!s)return;var a=s.children[e];a&&(a.style.textDecoration=o?"underline":"none"),++e>=n&&(e=0,r++)}},o([s(6,h.ICharSizeService),s(7,u.IOptionsService),s(8,u.IBufferService)],t)}(l.Disposable);t.DomRenderer=S},3787:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.DomRendererRowFactory=t.CURSOR_STYLE_UNDERLINE_CLASS=t.CURSOR_STYLE_BAR_CLASS=t.CURSOR_STYLE_BLOCK_CLASS=t.CURSOR_BLINK_CLASS=t.CURSOR_CLASS=t.UNDERLINE_CLASS=t.ITALIC_CLASS=t.DIM_CLASS=t.BOLD_CLASS=void 0;var i=r(8803),n=r(643),o=r(511),s=r(4774);t.BOLD_CLASS="xterm-bold",t.DIM_CLASS="xterm-dim",t.ITALIC_CLASS="xterm-italic",t.UNDERLINE_CLASS="xterm-underline",t.CURSOR_CLASS="xterm-cursor",t.CURSOR_BLINK_CLASS="xterm-cursor-blink",t.CURSOR_STYLE_BLOCK_CLASS="xterm-cursor-block",t.CURSOR_STYLE_BAR_CLASS="xterm-cursor-bar",t.CURSOR_STYLE_UNDERLINE_CLASS="xterm-cursor-underline";var a=function(){function e(e,t,r){this._document=e,this._optionsService=t,this._colors=r,this._workCell=new o.CellData}return e.prototype.setColors=function(e){this._colors=e},e.prototype.createRow=function(e,r,o,a,l,h,u){for(var f=this._document.createDocumentFragment(),_=0,d=Math.min(e.length,u)-1;d>=0;d--)if(e.loadCell(d,this._workCell).getCode()!==n.NULL_CELL_CODE||r&&d===a){_=d+1;break}for(d=0;d<_;d++){e.loadCell(d,this._workCell);var p=this._workCell.getWidth();if(0!==p){var v=this._document.createElement("span");if(p>1&&(v.style.width=h*p+"px"),r&&d===a)switch(v.classList.add(t.CURSOR_CLASS),l&&v.classList.add(t.CURSOR_BLINK_CLASS),o){case"bar":v.classList.add(t.CURSOR_STYLE_BAR_CLASS);break;case"underline":v.classList.add(t.CURSOR_STYLE_UNDERLINE_CLASS);break;default:v.classList.add(t.CURSOR_STYLE_BLOCK_CLASS)}this._workCell.isBold()&&v.classList.add(t.BOLD_CLASS),this._workCell.isItalic()&&v.classList.add(t.ITALIC_CLASS),this._workCell.isDim()&&v.classList.add(t.DIM_CLASS),this._workCell.isUnderline()&&v.classList.add(t.UNDERLINE_CLASS),this._workCell.isInvisible()?v.textContent=n.WHITESPACE_CELL_CHAR:v.textContent=this._workCell.getChars()||n.WHITESPACE_CELL_CHAR;var g=this._workCell.getFgColor(),y=this._workCell.getFgColorMode(),b=this._workCell.getBgColor(),S=this._workCell.getBgColorMode(),m=!!this._workCell.isInverse();if(m){var C=g;g=b,b=C;var w=y;y=S,S=w}switch(y){case 16777216:case 33554432:this._workCell.isBold()&&g<8&&this._optionsService.options.drawBoldTextInBrightColors&&(g+=8),this._applyMinimumContrast(v,this._colors.background,this._colors.ansi[g])||v.classList.add("xterm-fg-"+g);break;case 50331648:var E=s.rgba.toColor(g>>16&255,g>>8&255,255&g);this._applyMinimumContrast(v,this._colors.background,E)||this._addStyle(v,"color:#"+c(g.toString(16),"0",6));break;case 0:default:this._applyMinimumContrast(v,this._colors.background,this._colors.foreground)||m&&v.classList.add("xterm-fg-"+i.INVERTED_DEFAULT_COLOR)}switch(S){case 16777216:case 33554432:v.classList.add("xterm-bg-"+b);break;case 50331648:this._addStyle(v,"background-color:#"+c(b.toString(16),"0",6));break;case 0:default:m&&v.classList.add("xterm-bg-"+i.INVERTED_DEFAULT_COLOR)}f.appendChild(v)}}return f},e.prototype._applyMinimumContrast=function(e,t,r){if(1===this._optionsService.options.minimumContrastRatio)return!1;var i=this._colors.contrastCache.getColor(this._workCell.bg,this._workCell.fg);return void 0===i&&(i=s.color.ensureContrastRatio(t,r,this._optionsService.options.minimumContrastRatio),this._colors.contrastCache.setColor(this._workCell.bg,this._workCell.fg,null!=i?i:null)),!!i&&(this._addStyle(e,"color:"+i.css),!0)},e.prototype._addStyle=function(e,t){e.setAttribute("style",""+(e.getAttribute("style")||"")+t+";")},e}();function c(e,t,r){for(;e.length<r;)e=t+e;return e}t.DomRendererRowFactory=a},456:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.SelectionModel=void 0;var r=function(){function e(e){this._bufferService=e,this.isSelectAllActive=!1,this.selectionStartLength=0}return e.prototype.clearSelection=function(){this.selectionStart=void 0,this.selectionEnd=void 0,this.isSelectAllActive=!1,this.selectionStartLength=0},Object.defineProperty(e.prototype,"finalSelectionStart",{get:function(){return this.isSelectAllActive?[0,0]:this.selectionEnd&&this.selectionStart&&this.areSelectionValuesReversed()?this.selectionEnd:this.selectionStart},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"finalSelectionEnd",{get:function(){if(this.isSelectAllActive)return[this._bufferService.cols,this._bufferService.buffer.ybase+this._bufferService.rows-1];if(this.selectionStart){if(!this.selectionEnd||this.areSelectionValuesReversed()){var e=this.selectionStart[0]+this.selectionStartLength;return e>this._bufferService.cols?[e%this._bufferService.cols,this.selectionStart[1]+Math.floor(e/this._bufferService.cols)]:[e,this.selectionStart[1]]}return this.selectionStartLength&&this.selectionEnd[1]===this.selectionStart[1]?[Math.max(this.selectionStart[0]+this.selectionStartLength,this.selectionEnd[0]),this.selectionEnd[1]]:this.selectionEnd}},enumerable:!1,configurable:!0}),e.prototype.areSelectionValuesReversed=function(){var e=this.selectionStart,t=this.selectionEnd;return!(!e||!t)&&(e[1]>t[1]||e[1]===t[1]&&e[0]>t[0])},e.prototype.onTrim=function(e){return this.selectionStart&&(this.selectionStart[1]-=e),this.selectionEnd&&(this.selectionEnd[1]-=e),this.selectionEnd&&this.selectionEnd[1]<0?(this.clearSelection(),!0):(this.selectionStart&&this.selectionStart[1]<0&&(this.selectionStart[1]=0),!1)},e}();t.SelectionModel=r},428:function(e,t,r){var i=this&&this.__decorate||function(e,t,r,i){var n,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(s=(o<3?n(s):o>3?n(t,r,s):n(t,r))||s);return o>3&&s&&Object.defineProperty(t,r,s),s},n=this&&this.__param||function(e,t){return function(r,i){t(r,i,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.CharSizeService=void 0;var o=r(2585),s=r(8460),a=function(){function e(e,t,r){this._optionsService=r,this.width=0,this.height=0,this._onCharSizeChange=new s.EventEmitter,this._measureStrategy=new c(e,t,this._optionsService)}return Object.defineProperty(e.prototype,"hasValidSize",{get:function(){return this.width>0&&this.height>0},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"onCharSizeChange",{get:function(){return this._onCharSizeChange.event},enumerable:!1,configurable:!0}),e.prototype.measure=function(){var e=this._measureStrategy.measure();e.width===this.width&&e.height===this.height||(this.width=e.width,this.height=e.height,this._onCharSizeChange.fire())},i([n(2,o.IOptionsService)],e)}();t.CharSizeService=a;var c=function(){function e(e,t,r){this._document=e,this._parentElement=t,this._optionsService=r,this._result={width:0,height:0},this._measureElement=this._document.createElement("span"),this._measureElement.classList.add("xterm-char-measure-element"),this._measureElement.textContent="W",this._measureElement.setAttribute("aria-hidden","true"),this._parentElement.appendChild(this._measureElement)}return e.prototype.measure=function(){this._measureElement.style.fontFamily=this._optionsService.options.fontFamily,this._measureElement.style.fontSize=this._optionsService.options.fontSize+"px";var e=this._measureElement.getBoundingClientRect();return 0!==e.width&&0!==e.height&&(this._result.width=e.width,this._result.height=Math.ceil(e.height)),this._result},e}()},5114:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.CoreBrowserService=void 0;var r=function(){function e(e){this._textarea=e}return Object.defineProperty(e.prototype,"isFocused",{get:function(){return(this._textarea.getRootNode?this._textarea.getRootNode():document).activeElement===this._textarea&&document.hasFocus()},enumerable:!1,configurable:!0}),e}();t.CoreBrowserService=r},8934:function(e,t,r){var i=this&&this.__decorate||function(e,t,r,i){var n,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(s=(o<3?n(s):o>3?n(t,r,s):n(t,r))||s);return o>3&&s&&Object.defineProperty(t,r,s),s},n=this&&this.__param||function(e,t){return function(r,i){t(r,i,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.MouseService=void 0;var o=r(4725),s=r(9806),a=function(){function e(e,t){this._renderService=e,this._charSizeService=t}return e.prototype.getCoords=function(e,t,r,i,n){return s.getCoords(e,t,r,i,this._charSizeService.hasValidSize,this._renderService.dimensions.actualCellWidth,this._renderService.dimensions.actualCellHeight,n)},e.prototype.getRawByteCoords=function(e,t,r,i){var n=this.getCoords(e,t,r,i);return s.getRawByteCoords(n)},i([n(0,o.IRenderService),n(1,o.ICharSizeService)],e)}();t.MouseService=a},3230:function(e,t,r){var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}),o=this&&this.__decorate||function(e,t,r,i){var n,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(s=(o<3?n(s):o>3?n(t,r,s):n(t,r))||s);return o>3&&s&&Object.defineProperty(t,r,s),s},s=this&&this.__param||function(e,t){return function(r,i){t(r,i,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.RenderService=void 0;var a=r(6193),c=r(8460),l=r(844),h=r(5596),u=r(3656),f=r(2585),_=r(4725),d=function(e){function t(t,r,i,n,o,s){var l=e.call(this)||this;if(l._renderer=t,l._rowCount=r,l._charSizeService=o,l._isPaused=!1,l._needsFullRefresh=!1,l._isNextRenderRedrawOnly=!0,l._needsSelectionRefresh=!1,l._canvasWidth=0,l._canvasHeight=0,l._selectionState={start:void 0,end:void 0,columnSelectMode:!1},l._onDimensionsChange=new c.EventEmitter,l._onRender=new c.EventEmitter,l._onRefreshRequest=new c.EventEmitter,l.register({dispose:function(){return l._renderer.dispose()}}),l._renderDebouncer=new a.RenderDebouncer((function(e,t){return l._renderRows(e,t)})),l.register(l._renderDebouncer),l._screenDprMonitor=new h.ScreenDprMonitor,l._screenDprMonitor.setListener((function(){return l.onDevicePixelRatioChange()})),l.register(l._screenDprMonitor),l.register(s.onResize((function(e){return l._fullRefresh()}))),l.register(n.onOptionChange((function(){return l._renderer.onOptionsChanged()}))),l.register(l._charSizeService.onCharSizeChange((function(){return l.onCharSizeChanged()}))),l._renderer.onRequestRedraw((function(e){return l.refreshRows(e.start,e.end,!0)})),l.register(u.addDisposableDomListener(window,"resize",(function(){return l.onDevicePixelRatioChange()}))),"IntersectionObserver"in window){var f=new IntersectionObserver((function(e){return l._onIntersectionChange(e[e.length-1])}),{threshold:0});f.observe(i),l.register({dispose:function(){return f.disconnect()}})}return l}return n(t,e),Object.defineProperty(t.prototype,"onDimensionsChange",{get:function(){return this._onDimensionsChange.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onRenderedBufferChange",{get:function(){return this._onRender.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onRefreshRequest",{get:function(){return this._onRefreshRequest.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"dimensions",{get:function(){return this._renderer.dimensions},enumerable:!1,configurable:!0}),t.prototype._onIntersectionChange=function(e){this._isPaused=void 0===e.isIntersecting?0===e.intersectionRatio:!e.isIntersecting,this._isPaused||this._charSizeService.hasValidSize||this._charSizeService.measure(),!this._isPaused&&this._needsFullRefresh&&(this.refreshRows(0,this._rowCount-1),this._needsFullRefresh=!1)},t.prototype.refreshRows=function(e,t,r){void 0===r&&(r=!1),this._isPaused?this._needsFullRefresh=!0:(r||(this._isNextRenderRedrawOnly=!1),this._renderDebouncer.refresh(e,t,this._rowCount))},t.prototype._renderRows=function(e,t){this._renderer.renderRows(e,t),this._needsSelectionRefresh&&(this._renderer.onSelectionChanged(this._selectionState.start,this._selectionState.end,this._selectionState.columnSelectMode),this._needsSelectionRefresh=!1),this._isNextRenderRedrawOnly||this._onRender.fire({start:e,end:t}),this._isNextRenderRedrawOnly=!0},t.prototype.resize=function(e,t){this._rowCount=t,this._fireOnCanvasResize()},t.prototype.changeOptions=function(){this._renderer.onOptionsChanged(),this.refreshRows(0,this._rowCount-1),this._fireOnCanvasResize()},t.prototype._fireOnCanvasResize=function(){this._renderer.dimensions.canvasWidth===this._canvasWidth&&this._renderer.dimensions.canvasHeight===this._canvasHeight||this._onDimensionsChange.fire(this._renderer.dimensions)},t.prototype.dispose=function(){e.prototype.dispose.call(this)},t.prototype.setRenderer=function(e){var t=this;this._renderer.dispose(),this._renderer=e,this._renderer.onRequestRedraw((function(e){return t.refreshRows(e.start,e.end,!0)})),this._needsSelectionRefresh=!0,this._fullRefresh()},t.prototype._fullRefresh=function(){this._isPaused?this._needsFullRefresh=!0:this.refreshRows(0,this._rowCount-1)},t.prototype.setColors=function(e){this._renderer.setColors(e),this._fullRefresh()},t.prototype.onDevicePixelRatioChange=function(){this._charSizeService.measure(),this._renderer.onDevicePixelRatioChange(),this.refreshRows(0,this._rowCount-1)},t.prototype.onResize=function(e,t){this._renderer.onResize(e,t),this._fullRefresh()},t.prototype.onCharSizeChanged=function(){this._renderer.onCharSizeChanged()},t.prototype.onBlur=function(){this._renderer.onBlur()},t.prototype.onFocus=function(){this._renderer.onFocus()},t.prototype.onSelectionChanged=function(e,t,r){this._selectionState.start=e,this._selectionState.end=t,this._selectionState.columnSelectMode=r,this._renderer.onSelectionChanged(e,t,r)},t.prototype.onCursorMove=function(){this._renderer.onCursorMove()},t.prototype.clear=function(){this._renderer.clear()},t.prototype.registerCharacterJoiner=function(e){return this._renderer.registerCharacterJoiner(e)},t.prototype.deregisterCharacterJoiner=function(e){return this._renderer.deregisterCharacterJoiner(e)},o([s(3,f.IOptionsService),s(4,_.ICharSizeService),s(5,f.IBufferService)],t)}(l.Disposable);t.RenderService=d},9312:function(e,t,r){var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}),o=this&&this.__decorate||function(e,t,r,i){var n,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(s=(o<3?n(s):o>3?n(t,r,s):n(t,r))||s);return o>3&&s&&Object.defineProperty(t,r,s),s},s=this&&this.__param||function(e,t){return function(r,i){t(r,i,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.SelectionService=void 0;var a=r(6114),c=r(456),l=r(511),h=r(8460),u=r(4725),f=r(2585),_=r(9806),d=r(9504),p=r(844),v=String.fromCharCode(160),g=new RegExp(v,"g"),y=function(e){function t(t,r,i,n,o,s,a){var u=e.call(this)||this;return u._element=t,u._screenElement=r,u._bufferService=i,u._coreService=n,u._mouseService=o,u._optionsService=s,u._renderService=a,u._dragScrollAmount=0,u._enabled=!0,u._workCell=new l.CellData,u._mouseDownTimeStamp=0,u._oldHasSelection=!1,u._oldSelectionStart=void 0,u._oldSelectionEnd=void 0,u._onLinuxMouseSelection=u.register(new h.EventEmitter),u._onRedrawRequest=u.register(new h.EventEmitter),u._onSelectionChange=u.register(new h.EventEmitter),u._onRequestScrollLines=u.register(new h.EventEmitter),u._mouseMoveListener=function(e){return u._onMouseMove(e)},u._mouseUpListener=function(e){return u._onMouseUp(e)},u._coreService.onUserInput((function(){u.hasSelection&&u.clearSelection()})),u._trimListener=u._bufferService.buffer.lines.onTrim((function(e){return u._onTrim(e)})),u.register(u._bufferService.buffers.onBufferActivate((function(e){return u._onBufferActivate(e)}))),u.enable(),u._model=new c.SelectionModel(u._bufferService),u._activeSelectionMode=0,u}return n(t,e),Object.defineProperty(t.prototype,"onLinuxMouseSelection",{get:function(){return this._onLinuxMouseSelection.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onRequestRedraw",{get:function(){return this._onRedrawRequest.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onSelectionChange",{get:function(){return this._onSelectionChange.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onRequestScrollLines",{get:function(){return this._onRequestScrollLines.event},enumerable:!1,configurable:!0}),t.prototype.dispose=function(){this._removeMouseDownListeners()},t.prototype.reset=function(){this.clearSelection()},t.prototype.disable=function(){this.clearSelection(),this._enabled=!1},t.prototype.enable=function(){this._enabled=!0},Object.defineProperty(t.prototype,"selectionStart",{get:function(){return this._model.finalSelectionStart},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"selectionEnd",{get:function(){return this._model.finalSelectionEnd},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"hasSelection",{get:function(){var e=this._model.finalSelectionStart,t=this._model.finalSelectionEnd;return!(!e||!t||e[0]===t[0]&&e[1]===t[1])},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"selectionText",{get:function(){var e=this._model.finalSelectionStart,t=this._model.finalSelectionEnd;if(!e||!t)return"";var r=this._bufferService.buffer,i=[];if(3===this._activeSelectionMode){if(e[0]===t[0])return"";for(var n=e[1];n<=t[1];n++){var o=r.translateBufferLineToString(n,!0,e[0],t[0]);i.push(o)}}else{var s=e[1]===t[1]?t[0]:void 0;for(i.push(r.translateBufferLineToString(e[1],!0,e[0],s)),n=e[1]+1;n<=t[1]-1;n++){var c=r.lines.get(n);o=r.translateBufferLineToString(n,!0),c&&c.isWrapped?i[i.length-1]+=o:i.push(o)}e[1]!==t[1]&&(c=r.lines.get(t[1]),o=r.translateBufferLineToString(t[1],!0,0,t[0]),c&&c.isWrapped?i[i.length-1]+=o:i.push(o))}return i.map((function(e){return e.replace(g," ")})).join(a.isWindows?"\r\n":"\n")},enumerable:!1,configurable:!0}),t.prototype.clearSelection=function(){this._model.clearSelection(),this._removeMouseDownListeners(),this.refresh(),this._onSelectionChange.fire()},t.prototype.refresh=function(e){var t=this;this._refreshAnimationFrame||(this._refreshAnimationFrame=window.requestAnimationFrame((function(){return t._refresh()}))),a.isLinux&&e&&this.selectionText.length&&this._onLinuxMouseSelection.fire(this.selectionText)},t.prototype._refresh=function(){this._refreshAnimationFrame=void 0,this._onRedrawRequest.fire({start:this._model.finalSelectionStart,end:this._model.finalSelectionEnd,columnSelectMode:3===this._activeSelectionMode})},t.prototype._isClickInSelection=function(e){var t=this._getMouseBufferCoords(e),r=this._model.finalSelectionStart,i=this._model.finalSelectionEnd;return!!(r&&i&&t)&&this._areCoordsInSelection(t,r,i)},t.prototype._areCoordsInSelection=function(e,t,r){return e[1]>t[1]&&e[1]<r[1]||t[1]===r[1]&&e[1]===t[1]&&e[0]>=t[0]&&e[0]<r[0]||t[1]<r[1]&&e[1]===r[1]&&e[0]<r[0]||t[1]<r[1]&&e[1]===t[1]&&e[0]>=t[0]},t.prototype._selectWordAtCursor=function(e){var t=this._getMouseBufferCoords(e);t&&(this._selectWordAt(t,!1),this._model.selectionEnd=void 0,this.refresh(!0))},t.prototype.selectAll=function(){this._model.isSelectAllActive=!0,this.refresh(),this._onSelectionChange.fire()},t.prototype.selectLines=function(e,t){this._model.clearSelection(),e=Math.max(e,0),t=Math.min(t,this._bufferService.buffer.lines.length-1),this._model.selectionStart=[0,e],this._model.selectionEnd=[this._bufferService.cols,t],this.refresh(),this._onSelectionChange.fire()},t.prototype._onTrim=function(e){this._model.onTrim(e)&&this.refresh()},t.prototype._getMouseBufferCoords=function(e){var t=this._mouseService.getCoords(e,this._screenElement,this._bufferService.cols,this._bufferService.rows,!0);if(t)return t[0]--,t[1]--,t[1]+=this._bufferService.buffer.ydisp,t},t.prototype._getMouseEventScrollAmount=function(e){var t=_.getCoordsRelativeToElement(e,this._screenElement)[1],r=this._renderService.dimensions.canvasHeight;return t>=0&&t<=r?0:(t>r&&(t-=r),t=Math.min(Math.max(t,-50),50),(t/=50)/Math.abs(t)+Math.round(14*t))},t.prototype.shouldForceSelection=function(e){return a.isMac?e.altKey&&this._optionsService.options.macOptionClickForcesSelection:e.shiftKey},t.prototype.onMouseDown=function(e){if(this._mouseDownTimeStamp=e.timeStamp,(2!==e.button||!this.hasSelection)&&0===e.button){if(!this._enabled){if(!this.shouldForceSelection(e))return;e.stopPropagation()}e.preventDefault(),this._dragScrollAmount=0,this._enabled&&e.shiftKey?this._onIncrementalClick(e):1===e.detail?this._onSingleClick(e):2===e.detail?this._onDoubleClick(e):3===e.detail&&this._onTripleClick(e),this._addMouseDownListeners(),this.refresh(!0)}},t.prototype._addMouseDownListeners=function(){var e=this;this._screenElement.ownerDocument&&(this._screenElement.ownerDocument.addEventListener("mousemove",this._mouseMoveListener),this._screenElement.ownerDocument.addEventListener("mouseup",this._mouseUpListener)),this._dragScrollIntervalTimer=window.setInterval((function(){return e._dragScroll()}),50)},t.prototype._removeMouseDownListeners=function(){this._screenElement.ownerDocument&&(this._screenElement.ownerDocument.removeEventListener("mousemove",this._mouseMoveListener),this._screenElement.ownerDocument.removeEventListener("mouseup",this._mouseUpListener)),clearInterval(this._dragScrollIntervalTimer),this._dragScrollIntervalTimer=void 0},t.prototype._onIncrementalClick=function(e){this._model.selectionStart&&(this._model.selectionEnd=this._getMouseBufferCoords(e))},t.prototype._onSingleClick=function(e){if(this._model.selectionStartLength=0,this._model.isSelectAllActive=!1,this._activeSelectionMode=this.shouldColumnSelect(e)?3:0,this._model.selectionStart=this._getMouseBufferCoords(e),this._model.selectionStart){this._model.selectionEnd=void 0;var t=this._bufferService.buffer.lines.get(this._model.selectionStart[1]);t&&t.length!==this._model.selectionStart[0]&&0===t.hasWidth(this._model.selectionStart[0])&&this._model.selectionStart[0]++}},t.prototype._onDoubleClick=function(e){var t=this._getMouseBufferCoords(e);t&&(this._activeSelectionMode=1,this._selectWordAt(t,!0))},t.prototype._onTripleClick=function(e){var t=this._getMouseBufferCoords(e);t&&(this._activeSelectionMode=2,this._selectLineAt(t[1]))},t.prototype.shouldColumnSelect=function(e){return e.altKey&&!(a.isMac&&this._optionsService.options.macOptionClickForcesSelection)},t.prototype._onMouseMove=function(e){if(e.stopImmediatePropagation(),this._model.selectionStart){var t=this._model.selectionEnd?[this._model.selectionEnd[0],this._model.selectionEnd[1]]:null;if(this._model.selectionEnd=this._getMouseBufferCoords(e),this._model.selectionEnd){2===this._activeSelectionMode?this._model.selectionEnd[1]<this._model.selectionStart[1]?this._model.selectionEnd[0]=0:this._model.selectionEnd[0]=this._bufferService.cols:1===this._activeSelectionMode&&this._selectToWordAt(this._model.selectionEnd),this._dragScrollAmount=this._getMouseEventScrollAmount(e),3!==this._activeSelectionMode&&(this._dragScrollAmount>0?this._model.selectionEnd[0]=this._bufferService.cols:this._dragScrollAmount<0&&(this._model.selectionEnd[0]=0));var r=this._bufferService.buffer;if(this._model.selectionEnd[1]<r.lines.length){var i=r.lines.get(this._model.selectionEnd[1]);i&&0===i.hasWidth(this._model.selectionEnd[0])&&this._model.selectionEnd[0]++}t&&t[0]===this._model.selectionEnd[0]&&t[1]===this._model.selectionEnd[1]||this.refresh(!0)}else this.refresh(!0)}},t.prototype._dragScroll=function(){if(this._model.selectionEnd&&this._model.selectionStart&&this._dragScrollAmount){this._onRequestScrollLines.fire({amount:this._dragScrollAmount,suppressScrollEvent:!1});var e=this._bufferService.buffer;this._dragScrollAmount>0?(3!==this._activeSelectionMode&&(this._model.selectionEnd[0]=this._bufferService.cols),this._model.selectionEnd[1]=Math.min(e.ydisp+this._bufferService.rows,e.lines.length-1)):(3!==this._activeSelectionMode&&(this._model.selectionEnd[0]=0),this._model.selectionEnd[1]=e.ydisp),this.refresh()}},t.prototype._onMouseUp=function(e){var t=e.timeStamp-this._mouseDownTimeStamp;if(this._removeMouseDownListeners(),this.selectionText.length<=1&&t<500&&e.altKey&&this._optionsService.getOption("altClickMovesCursor")){if(this._bufferService.buffer.ybase===this._bufferService.buffer.ydisp){var r=this._mouseService.getCoords(e,this._element,this._bufferService.cols,this._bufferService.rows,!1);if(r&&void 0!==r[0]&&void 0!==r[1]){var i=d.moveToCellSequence(r[0]-1,r[1]-1,this._bufferService,this._coreService.decPrivateModes.applicationCursorKeys);this._coreService.triggerDataEvent(i,!0)}}}else this._fireEventIfSelectionChanged()},t.prototype._fireEventIfSelectionChanged=function(){var e=this._model.finalSelectionStart,t=this._model.finalSelectionEnd,r=!(!e||!t||e[0]===t[0]&&e[1]===t[1]);r?e&&t&&(this._oldSelectionStart&&this._oldSelectionEnd&&e[0]===this._oldSelectionStart[0]&&e[1]===this._oldSelectionStart[1]&&t[0]===this._oldSelectionEnd[0]&&t[1]===this._oldSelectionEnd[1]||this._fireOnSelectionChange(e,t,r)):this._oldHasSelection&&this._fireOnSelectionChange(e,t,r)},t.prototype._fireOnSelectionChange=function(e,t,r){this._oldSelectionStart=e,this._oldSelectionEnd=t,this._oldHasSelection=r,this._onSelectionChange.fire()},t.prototype._onBufferActivate=function(e){var t=this;this.clearSelection(),this._trimListener.dispose(),this._trimListener=e.activeBuffer.lines.onTrim((function(e){return t._onTrim(e)}))},t.prototype._convertViewportColToCharacterIndex=function(e,t){for(var r=t[0],i=0;t[0]>=i;i++){var n=e.loadCell(i,this._workCell).getChars().length;0===this._workCell.getWidth()?r--:n>1&&t[0]!==i&&(r+=n-1)}return r},t.prototype.setSelection=function(e,t,r){this._model.clearSelection(),this._removeMouseDownListeners(),this._model.selectionStart=[e,t],this._model.selectionStartLength=r,this.refresh()},t.prototype.rightClickSelect=function(e){this._isClickInSelection(e)||(this._selectWordAtCursor(e),this._fireEventIfSelectionChanged())},t.prototype._getWordAt=function(e,t,r,i){if(void 0===r&&(r=!0),void 0===i&&(i=!0),!(e[0]>=this._bufferService.cols)){var n=this._bufferService.buffer,o=n.lines.get(e[1]);if(o){var s=n.translateBufferLineToString(e[1],!1),a=this._convertViewportColToCharacterIndex(o,e),c=a,l=e[0]-a,h=0,u=0,f=0,_=0;if(" "===s.charAt(a)){for(;a>0&&" "===s.charAt(a-1);)a--;for(;c<s.length&&" "===s.charAt(c+1);)c++}else{var d=e[0],p=e[0];0===o.getWidth(d)&&(h++,d--),2===o.getWidth(p)&&(u++,p++);var v=o.getString(p).length;for(v>1&&(_+=v-1,c+=v-1);d>0&&a>0&&!this._isCharWordSeparator(o.loadCell(d-1,this._workCell));){o.loadCell(d-1,this._workCell);var g=this._workCell.getChars().length;0===this._workCell.getWidth()?(h++,d--):g>1&&(f+=g-1,a-=g-1),a--,d--}for(;p<o.length&&c+1<s.length&&!this._isCharWordSeparator(o.loadCell(p+1,this._workCell));){o.loadCell(p+1,this._workCell);var y=this._workCell.getChars().length;2===this._workCell.getWidth()?(u++,p++):y>1&&(_+=y-1,c+=y-1),c++,p++}}c++;var b=a+l-h+f,S=Math.min(this._bufferService.cols,c-a+h+u-f-_);if(t||""!==s.slice(a,c).trim()){if(r&&0===b&&32!==o.getCodePoint(0)){var m=n.lines.get(e[1]-1);if(m&&o.isWrapped&&32!==m.getCodePoint(this._bufferService.cols-1)){var C=this._getWordAt([this._bufferService.cols-1,e[1]-1],!1,!0,!1);if(C){var w=this._bufferService.cols-C.start;b-=w,S+=w}}}if(i&&b+S===this._bufferService.cols&&32!==o.getCodePoint(this._bufferService.cols-1)){var E=n.lines.get(e[1]+1);if(E&&E.isWrapped&&32!==E.getCodePoint(0)){var L=this._getWordAt([0,e[1]+1],!1,!1,!0);L&&(S+=L.length)}}return{start:b,length:S}}}}},t.prototype._selectWordAt=function(e,t){var r=this._getWordAt(e,t);if(r){for(;r.start<0;)r.start+=this._bufferService.cols,e[1]--;this._model.selectionStart=[r.start,e[1]],this._model.selectionStartLength=r.length}},t.prototype._selectToWordAt=function(e){var t=this._getWordAt(e,!0);if(t){for(var r=e[1];t.start<0;)t.start+=this._bufferService.cols,r--;if(!this._model.areSelectionValuesReversed())for(;t.start+t.length>this._bufferService.cols;)t.length-=this._bufferService.cols,r++;this._model.selectionEnd=[this._model.areSelectionValuesReversed()?t.start:t.start+t.length,r]}},t.prototype._isCharWordSeparator=function(e){return 0!==e.getWidth()&&this._optionsService.options.wordSeparator.indexOf(e.getChars())>=0},t.prototype._selectLineAt=function(e){var t=this._bufferService.buffer.getWrappedRangeForLine(e);this._model.selectionStart=[0,t.first],this._model.selectionEnd=[this._bufferService.cols,t.last],this._model.selectionStartLength=0},o([s(2,f.IBufferService),s(3,f.ICoreService),s(4,u.IMouseService),s(5,f.IOptionsService),s(6,u.IRenderService)],t)}(p.Disposable);t.SelectionService=y},4725:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.ISoundService=t.ISelectionService=t.IRenderService=t.IMouseService=t.ICoreBrowserService=t.ICharSizeService=void 0;var i=r(8343);t.ICharSizeService=i.createDecorator("CharSizeService"),t.ICoreBrowserService=i.createDecorator("CoreBrowserService"),t.IMouseService=i.createDecorator("MouseService"),t.IRenderService=i.createDecorator("RenderService"),t.ISelectionService=i.createDecorator("SelectionService"),t.ISoundService=i.createDecorator("SoundService")},357:function(e,t,r){var i=this&&this.__decorate||function(e,t,r,i){var n,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(s=(o<3?n(s):o>3?n(t,r,s):n(t,r))||s);return o>3&&s&&Object.defineProperty(t,r,s),s},n=this&&this.__param||function(e,t){return function(r,i){t(r,i,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.SoundService=void 0;var o=r(2585),s=function(){function e(e){this._optionsService=e}return Object.defineProperty(e,"audioContext",{get:function(){if(!e._audioContext){var t=window.AudioContext||window.webkitAudioContext;if(!t)return console.warn("Web Audio API is not supported by this browser. Consider upgrading to the latest version"),null;e._audioContext=new t}return e._audioContext},enumerable:!1,configurable:!0}),e.prototype.playBellSound=function(){var t=e.audioContext;if(t){var r=t.createBufferSource();t.decodeAudioData(this._base64ToArrayBuffer(this._removeMimeType(this._optionsService.options.bellSound)),(function(e){r.buffer=e,r.connect(t.destination),r.start(0)}))}},e.prototype._base64ToArrayBuffer=function(e){for(var t=window.atob(e),r=t.length,i=new Uint8Array(r),n=0;n<r;n++)i[n]=t.charCodeAt(n);return i.buffer},e.prototype._removeMimeType=function(e){return e.split(",")[1]},e=i([n(0,o.IOptionsService)],e)}();t.SoundService=s},6349:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.CircularList=void 0;var i=r(8460),n=function(){function e(e){this._maxLength=e,this.onDeleteEmitter=new i.EventEmitter,this.onInsertEmitter=new i.EventEmitter,this.onTrimEmitter=new i.EventEmitter,this._array=new Array(this._maxLength),this._startIndex=0,this._length=0}return Object.defineProperty(e.prototype,"onDelete",{get:function(){return this.onDeleteEmitter.event},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"onInsert",{get:function(){return this.onInsertEmitter.event},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"onTrim",{get:function(){return this.onTrimEmitter.event},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"maxLength",{get:function(){return this._maxLength},set:function(e){if(this._maxLength!==e){for(var t=new Array(e),r=0;r<Math.min(e,this.length);r++)t[r]=this._array[this._getCyclicIndex(r)];this._array=t,this._maxLength=e,this._startIndex=0}},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"length",{get:function(){return this._length},set:function(e){if(e>this._length)for(var t=this._length;t<e;t++)this._array[t]=void 0;this._length=e},enumerable:!1,configurable:!0}),e.prototype.get=function(e){return this._array[this._getCyclicIndex(e)]},e.prototype.set=function(e,t){this._array[this._getCyclicIndex(e)]=t},e.prototype.push=function(e){this._array[this._getCyclicIndex(this._length)]=e,this._length===this._maxLength?(this._startIndex=++this._startIndex%this._maxLength,this.onTrimEmitter.fire(1)):this._length++},e.prototype.recycle=function(){if(this._length!==this._maxLength)throw new Error("Can only recycle when the buffer is full");return this._startIndex=++this._startIndex%this._maxLength,this.onTrimEmitter.fire(1),this._array[this._getCyclicIndex(this._length-1)]},Object.defineProperty(e.prototype,"isFull",{get:function(){return this._length===this._maxLength},enumerable:!1,configurable:!0}),e.prototype.pop=function(){return this._array[this._getCyclicIndex(this._length---1)]},e.prototype.splice=function(e,t){for(var r=[],i=2;i<arguments.length;i++)r[i-2]=arguments[i];if(t){for(var n=e;n<this._length-t;n++)this._array[this._getCyclicIndex(n)]=this._array[this._getCyclicIndex(n+t)];this._length-=t,this.onDeleteEmitter.fire({index:e,amount:t})}for(n=this._length-1;n>=e;n--)this._array[this._getCyclicIndex(n+r.length)]=this._array[this._getCyclicIndex(n)];for(n=0;n<r.length;n++)this._array[this._getCyclicIndex(e+n)]=r[n];if(r.length&&this.onInsertEmitter.fire({index:e,amount:r.length}),this._length+r.length>this._maxLength){var o=this._length+r.length-this._maxLength;this._startIndex+=o,this._length=this._maxLength,this.onTrimEmitter.fire(o)}else this._length+=r.length},e.prototype.trimStart=function(e){e>this._length&&(e=this._length),this._startIndex+=e,this._length-=e,this.onTrimEmitter.fire(e)},e.prototype.shiftElements=function(e,t,r){if(!(t<=0)){if(e<0||e>=this._length)throw new Error("start argument out of range");if(e+r<0)throw new Error("Cannot shift elements in list beyond index 0");if(r>0){for(var i=t-1;i>=0;i--)this.set(e+i+r,this.get(e+i));var n=e+t+r-this._length;if(n>0)for(this._length+=n;this._length>this._maxLength;)this._length--,this._startIndex++,this.onTrimEmitter.fire(1)}else for(i=0;i<t;i++)this.set(e+i+r,this.get(e+i))}},e.prototype._getCyclicIndex=function(e){return(this._startIndex+e)%this._maxLength},e}();t.CircularList=n},1439:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.clone=void 0,t.clone=function e(t,r){if(void 0===r&&(r=5),"object"!=typeof t)return t;var i=Array.isArray(t)?[]:{};for(var n in t)i[n]=r<=1?t[n]:t[n]?e(t[n],r-1):t[n];return i}},8969:function(e,t,r){var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0}),t.CoreTerminal=void 0;var o=r(844),s=r(2585),a=r(4348),c=r(7866),l=r(744),h=r(7302),u=r(6975),f=r(8460),_=r(1753),d=r(3730),p=r(1480),v=r(7994),g=r(9282),y=r(5435),b=r(5981),S=function(e){function t(t){var r=e.call(this)||this;return r._onBinary=new f.EventEmitter,r._onData=new f.EventEmitter,r._onLineFeed=new f.EventEmitter,r._onResize=new f.EventEmitter,r._onScroll=new f.EventEmitter,r._instantiationService=new a.InstantiationService,r.optionsService=new h.OptionsService(t),r._instantiationService.setService(s.IOptionsService,r.optionsService),r._bufferService=r.register(r._instantiationService.createInstance(l.BufferService)),r._instantiationService.setService(s.IBufferService,r._bufferService),r._logService=r._instantiationService.createInstance(c.LogService),r._instantiationService.setService(s.ILogService,r._logService),r._coreService=r.register(r._instantiationService.createInstance(u.CoreService,(function(){return r.scrollToBottom()}))),r._instantiationService.setService(s.ICoreService,r._coreService),r._coreMouseService=r._instantiationService.createInstance(_.CoreMouseService),r._instantiationService.setService(s.ICoreMouseService,r._coreMouseService),r._dirtyRowService=r._instantiationService.createInstance(d.DirtyRowService),r._instantiationService.setService(s.IDirtyRowService,r._dirtyRowService),r.unicodeService=r._instantiationService.createInstance(p.UnicodeService),r._instantiationService.setService(s.IUnicodeService,r.unicodeService),r._charsetService=r._instantiationService.createInstance(v.CharsetService),r._instantiationService.setService(s.ICharsetService,r._charsetService),r._inputHandler=new y.InputHandler(r._bufferService,r._charsetService,r._coreService,r._dirtyRowService,r._logService,r.optionsService,r._coreMouseService,r.unicodeService),r.register(f.forwardEvent(r._inputHandler.onLineFeed,r._onLineFeed)),r.register(r._inputHandler),r.register(f.forwardEvent(r._bufferService.onResize,r._onResize)),r.register(f.forwardEvent(r._coreService.onData,r._onData)),r.register(f.forwardEvent(r._coreService.onBinary,r._onBinary)),r.register(r.optionsService.onOptionChange((function(e){return r._updateOptions(e)}))),r._writeBuffer=new b.WriteBuffer((function(e){return r._inputHandler.parse(e)})),r}return n(t,e),Object.defineProperty(t.prototype,"onBinary",{get:function(){return this._onBinary.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onData",{get:function(){return this._onData.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onLineFeed",{get:function(){return this._onLineFeed.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onResize",{get:function(){return this._onResize.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onScroll",{get:function(){return this._onScroll.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"cols",{get:function(){return this._bufferService.cols},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"rows",{get:function(){return this._bufferService.rows},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"buffers",{get:function(){return this._bufferService.buffers},enumerable:!1,configurable:!0}),t.prototype.dispose=function(){var t;this._isDisposed||(e.prototype.dispose.call(this),null===(t=this._windowsMode)||void 0===t||t.dispose(),this._windowsMode=void 0)},t.prototype.write=function(e,t){this._writeBuffer.write(e,t)},t.prototype.writeSync=function(e){this._writeBuffer.writeSync(e)},t.prototype.resize=function(e,t){isNaN(e)||isNaN(t)||(e=Math.max(e,l.MINIMUM_COLS),t=Math.max(t,l.MINIMUM_ROWS),this._bufferService.resize(e,t))},t.prototype.scroll=function(e,t){void 0===t&&(t=!1);var r,i=this._bufferService.buffer;(r=this._cachedBlankLine)&&r.length===this.cols&&r.getFg(0)===e.fg&&r.getBg(0)===e.bg||(r=i.getBlankLine(e,t),this._cachedBlankLine=r),r.isWrapped=t;var n=i.ybase+i.scrollTop,o=i.ybase+i.scrollBottom;if(0===i.scrollTop){var s=i.lines.isFull;o===i.lines.length-1?s?i.lines.recycle().copyFrom(r):i.lines.push(r.clone()):i.lines.splice(o+1,0,r.clone()),s?this._bufferService.isUserScrolling&&(i.ydisp=Math.max(i.ydisp-1,0)):(i.ybase++,this._bufferService.isUserScrolling||i.ydisp++)}else{var a=o-n+1;i.lines.shiftElements(n+1,a-1,-1),i.lines.set(o,r.clone())}this._bufferService.isUserScrolling||(i.ydisp=i.ybase),this._dirtyRowService.markRangeDirty(i.scrollTop,i.scrollBottom),this._onScroll.fire(i.ydisp)},t.prototype.scrollLines=function(e,t){var r=this._bufferService.buffer;if(e<0){if(0===r.ydisp)return;this._bufferService.isUserScrolling=!0}else e+r.ydisp>=r.ybase&&(this._bufferService.isUserScrolling=!1);var i=r.ydisp;r.ydisp=Math.max(Math.min(r.ydisp+e,r.ybase),0),i!==r.ydisp&&(t||this._onScroll.fire(r.ydisp))},t.prototype.scrollPages=function(e){this.scrollLines(e*(this.rows-1))},t.prototype.scrollToTop=function(){this.scrollLines(-this._bufferService.buffer.ydisp)},t.prototype.scrollToBottom=function(){this.scrollLines(this._bufferService.buffer.ybase-this._bufferService.buffer.ydisp)},t.prototype.scrollToLine=function(e){var t=e-this._bufferService.buffer.ydisp;0!==t&&this.scrollLines(t)},t.prototype.addEscHandler=function(e,t){return this._inputHandler.addEscHandler(e,t)},t.prototype.addDcsHandler=function(e,t){return this._inputHandler.addDcsHandler(e,t)},t.prototype.addCsiHandler=function(e,t){return this._inputHandler.addCsiHandler(e,t)},t.prototype.addOscHandler=function(e,t){return this._inputHandler.addOscHandler(e,t)},t.prototype._setup=function(){this.optionsService.options.windowsMode&&this._enableWindowsMode()},t.prototype.reset=function(){this._inputHandler.reset(),this._bufferService.reset(),this._charsetService.reset(),this._coreService.reset(),this._coreMouseService.reset()},t.prototype._updateOptions=function(e){var t;switch(e){case"scrollback":this.buffers.resize(this.cols,this.rows);break;case"windowsMode":this.optionsService.options.windowsMode?this._enableWindowsMode():(null===(t=this._windowsMode)||void 0===t||t.dispose(),this._windowsMode=void 0)}},t.prototype._enableWindowsMode=function(){var e=this;if(!this._windowsMode){var t=[];t.push(this.onLineFeed(g.updateWindowsModeWrappedState.bind(null,this._bufferService))),t.push(this.addCsiHandler({final:"H"},(function(){return g.updateWindowsModeWrappedState(e._bufferService),!1}))),this._windowsMode={dispose:function(){for(var e=0,r=t;e<r.length;e++)r[e].dispose()}}}},t}(o.Disposable);t.CoreTerminal=S},8460:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.forwardEvent=t.EventEmitter=void 0;var r=function(){function e(){this._listeners=[],this._disposed=!1}return Object.defineProperty(e.prototype,"event",{get:function(){var e=this;return this._event||(this._event=function(t){return e._listeners.push(t),{dispose:function(){if(!e._disposed)for(var r=0;r<e._listeners.length;r++)if(e._listeners[r]===t)return void e._listeners.splice(r,1)}}}),this._event},enumerable:!1,configurable:!0}),e.prototype.fire=function(e,t){for(var r=[],i=0;i<this._listeners.length;i++)r.push(this._listeners[i]);for(i=0;i<r.length;i++)r[i].call(void 0,e,t)},e.prototype.dispose=function(){this._listeners&&(this._listeners.length=0),this._disposed=!0},e}();t.EventEmitter=r,t.forwardEvent=function(e,t){return e((function(e){return t.fire(e)}))}},5435:function(e,t,r){var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0}),t.InputHandler=t.WindowsOptionsReportType=void 0;var o,s=r(2584),a=r(7116),c=r(2015),l=r(844),h=r(8273),u=r(482),f=r(8437),_=r(8460),d=r(643),p=r(511),v=r(3734),g=r(6242),y=r(6351),b={"(":0,")":1,"*":2,"+":3,"-":1,".":2},S=131072;function m(e,t){if(e>24)return t.setWinLines||!1;switch(e){case 1:return!!t.restoreWin;case 2:return!!t.minimizeWin;case 3:return!!t.setWinPosition;case 4:return!!t.setWinSizePixels;case 5:return!!t.raiseWin;case 6:return!!t.lowerWin;case 7:return!!t.refreshWin;case 8:return!!t.setWinSizeChars;case 9:return!!t.maximizeWin;case 10:return!!t.fullscreenWin;case 11:return!!t.getWinState;case 13:return!!t.getWinPosition;case 14:return!!t.getWinSizePixels;case 15:return!!t.getScreenSizePixels;case 16:return!!t.getCellSizePixels;case 18:return!!t.getWinSizeChars;case 19:return!!t.getScreenSizeChars;case 20:return!!t.getIconTitle;case 21:return!!t.getWinTitle;case 22:return!!t.pushTitle;case 23:return!!t.popTitle;case 24:return!!t.setWinLines}return!1}!function(e){e[e.GET_WIN_SIZE_PIXELS=0]="GET_WIN_SIZE_PIXELS",e[e.GET_CELL_SIZE_PIXELS=1]="GET_CELL_SIZE_PIXELS"}(o=t.WindowsOptionsReportType||(t.WindowsOptionsReportType={}));var C=function(){function e(e,t,r,i){this._bufferService=e,this._coreService=t,this._logService=r,this._optionsService=i,this._data=new Uint32Array(0)}return e.prototype.hook=function(e){this._data=new Uint32Array(0)},e.prototype.put=function(e,t,r){this._data=h.concat(this._data,e.subarray(t,r))},e.prototype.unhook=function(e){if(!e)return this._data=new Uint32Array(0),!0;var t=u.utf32ToString(this._data);switch(this._data=new Uint32Array(0),t){case'"q':this._coreService.triggerDataEvent(s.C0.ESC+'P1$r0"q'+s.C0.ESC+"\\");break;case'"p':this._coreService.triggerDataEvent(s.C0.ESC+'P1$r61;1"p'+s.C0.ESC+"\\");break;case"r":var r=this._bufferService.buffer.scrollTop+1+";"+(this._bufferService.buffer.scrollBottom+1)+"r";this._coreService.triggerDataEvent(s.C0.ESC+"P1$r"+r+s.C0.ESC+"\\");break;case"m":this._coreService.triggerDataEvent(s.C0.ESC+"P1$r0m"+s.C0.ESC+"\\");break;case" q":var i={block:2,underline:4,bar:6}[this._optionsService.options.cursorStyle];i-=this._optionsService.options.cursorBlink?1:0,this._coreService.triggerDataEvent(s.C0.ESC+"P1$r"+i+" q"+s.C0.ESC+"\\");break;default:this._logService.debug("Unknown DCS $q %s",t),this._coreService.triggerDataEvent(s.C0.ESC+"P0$r"+s.C0.ESC+"\\")}return!0},e}(),w=function(e){function t(t,r,i,n,o,l,h,d,v){void 0===v&&(v=new c.EscapeSequenceParser);var y=e.call(this)||this;y._bufferService=t,y._charsetService=r,y._coreService=i,y._dirtyRowService=n,y._logService=o,y._optionsService=l,y._coreMouseService=h,y._unicodeService=d,y._parser=v,y._parseBuffer=new Uint32Array(4096),y._stringDecoder=new u.StringToUtf32,y._utf8Decoder=new u.Utf8ToUtf32,y._workCell=new p.CellData,y._windowTitle="",y._iconName="",y._windowTitleStack=[],y._iconNameStack=[],y._curAttrData=f.DEFAULT_ATTR_DATA.clone(),y._eraseAttrDataInternal=f.DEFAULT_ATTR_DATA.clone(),y._onRequestBell=new _.EventEmitter,y._onRequestRefreshRows=new _.EventEmitter,y._onRequestReset=new _.EventEmitter,y._onRequestScroll=new _.EventEmitter,y._onRequestSyncScrollBar=new _.EventEmitter,y._onRequestWindowsOptionsReport=new _.EventEmitter,y._onA11yChar=new _.EventEmitter,y._onA11yTab=new _.EventEmitter,y._onCursorMove=new _.EventEmitter,y._onLineFeed=new _.EventEmitter,y._onScroll=new _.EventEmitter,y._onTitleChange=new _.EventEmitter,y._onAnsiColorChange=new _.EventEmitter,y.register(y._parser),y._parser.setCsiHandlerFallback((function(e,t){y._logService.debug("Unknown CSI code: ",{identifier:y._parser.identToString(e),params:t.toArray()})})),y._parser.setEscHandlerFallback((function(e){y._logService.debug("Unknown ESC code: ",{identifier:y._parser.identToString(e)})})),y._parser.setExecuteHandlerFallback((function(e){y._logService.debug("Unknown EXECUTE code: ",{code:e})})),y._parser.setOscHandlerFallback((function(e,t,r){y._logService.debug("Unknown OSC code: ",{identifier:e,action:t,data:r})})),y._parser.setDcsHandlerFallback((function(e,t,r){"HOOK"===t&&(r=r.toArray()),y._logService.debug("Unknown DCS code: ",{identifier:y._parser.identToString(e),action:t,payload:r})})),y._parser.setPrintHandler((function(e,t,r){return y.print(e,t,r)})),y._parser.registerCsiHandler({final:"@"},(function(e){return y.insertChars(e)})),y._parser.registerCsiHandler({intermediates:" ",final:"@"},(function(e){return y.scrollLeft(e)})),y._parser.registerCsiHandler({final:"A"},(function(e){return y.cursorUp(e)})),y._parser.registerCsiHandler({intermediates:" ",final:"A"},(function(e){return y.scrollRight(e)})),y._parser.registerCsiHandler({final:"B"},(function(e){return y.cursorDown(e)})),y._parser.registerCsiHandler({final:"C"},(function(e){return y.cursorForward(e)})),y._parser.registerCsiHandler({final:"D"},(function(e){return y.cursorBackward(e)})),y._parser.registerCsiHandler({final:"E"},(function(e){return y.cursorNextLine(e)})),y._parser.registerCsiHandler({final:"F"},(function(e){return y.cursorPrecedingLine(e)})),y._parser.registerCsiHandler({final:"G"},(function(e){return y.cursorCharAbsolute(e)})),y._parser.registerCsiHandler({final:"H"},(function(e){return y.cursorPosition(e)})),y._parser.registerCsiHandler({final:"I"},(function(e){return y.cursorForwardTab(e)})),y._parser.registerCsiHandler({final:"J"},(function(e){return y.eraseInDisplay(e)})),y._parser.registerCsiHandler({prefix:"?",final:"J"},(function(e){return y.eraseInDisplay(e)})),y._parser.registerCsiHandler({final:"K"},(function(e){return y.eraseInLine(e)})),y._parser.registerCsiHandler({prefix:"?",final:"K"},(function(e){return y.eraseInLine(e)})),y._parser.registerCsiHandler({final:"L"},(function(e){return y.insertLines(e)})),y._parser.registerCsiHandler({final:"M"},(function(e){return y.deleteLines(e)})),y._parser.registerCsiHandler({final:"P"},(function(e){return y.deleteChars(e)})),y._parser.registerCsiHandler({final:"S"},(function(e){return y.scrollUp(e)})),y._parser.registerCsiHandler({final:"T"},(function(e){return y.scrollDown(e)})),y._parser.registerCsiHandler({final:"X"},(function(e){return y.eraseChars(e)})),y._parser.registerCsiHandler({final:"Z"},(function(e){return y.cursorBackwardTab(e)})),y._parser.registerCsiHandler({final:"`"},(function(e){return y.charPosAbsolute(e)})),y._parser.registerCsiHandler({final:"a"},(function(e){return y.hPositionRelative(e)})),y._parser.registerCsiHandler({final:"b"},(function(e){return y.repeatPrecedingCharacter(e)})),y._parser.registerCsiHandler({final:"c"},(function(e){return y.sendDeviceAttributesPrimary(e)})),y._parser.registerCsiHandler({prefix:">",final:"c"},(function(e){return y.sendDeviceAttributesSecondary(e)})),y._parser.registerCsiHandler({final:"d"},(function(e){return y.linePosAbsolute(e)})),y._parser.registerCsiHandler({final:"e"},(function(e){return y.vPositionRelative(e)})),y._parser.registerCsiHandler({final:"f"},(function(e){return y.hVPosition(e)})),y._parser.registerCsiHandler({final:"g"},(function(e){return y.tabClear(e)})),y._parser.registerCsiHandler({final:"h"},(function(e){return y.setMode(e)})),y._parser.registerCsiHandler({prefix:"?",final:"h"},(function(e){return y.setModePrivate(e)})),y._parser.registerCsiHandler({final:"l"},(function(e){return y.resetMode(e)})),y._parser.registerCsiHandler({prefix:"?",final:"l"},(function(e){return y.resetModePrivate(e)})),y._parser.registerCsiHandler({final:"m"},(function(e){return y.charAttributes(e)})),y._parser.registerCsiHandler({final:"n"},(function(e){return y.deviceStatus(e)})),y._parser.registerCsiHandler({prefix:"?",final:"n"},(function(e){return y.deviceStatusPrivate(e)})),y._parser.registerCsiHandler({intermediates:"!",final:"p"},(function(e){return y.softReset(e)})),y._parser.registerCsiHandler({intermediates:" ",final:"q"},(function(e){return y.setCursorStyle(e)})),y._parser.registerCsiHandler({final:"r"},(function(e){return y.setScrollRegion(e)})),y._parser.registerCsiHandler({final:"s"},(function(e){return y.saveCursor(e)})),y._parser.registerCsiHandler({final:"t"},(function(e){return y.windowOptions(e)})),y._parser.registerCsiHandler({final:"u"},(function(e){return y.restoreCursor(e)})),y._parser.registerCsiHandler({intermediates:"'",final:"}"},(function(e){return y.insertColumns(e)})),y._parser.registerCsiHandler({intermediates:"'",final:"~"},(function(e){return y.deleteColumns(e)})),y._parser.setExecuteHandler(s.C0.BEL,(function(){return y.bell()})),y._parser.setExecuteHandler(s.C0.LF,(function(){return y.lineFeed()})),y._parser.setExecuteHandler(s.C0.VT,(function(){return y.lineFeed()})),y._parser.setExecuteHandler(s.C0.FF,(function(){return y.lineFeed()})),y._parser.setExecuteHandler(s.C0.CR,(function(){return y.carriageReturn()})),y._parser.setExecuteHandler(s.C0.BS,(function(){return y.backspace()})),y._parser.setExecuteHandler(s.C0.HT,(function(){return y.tab()})),y._parser.setExecuteHandler(s.C0.SO,(function(){return y.shiftOut()})),y._parser.setExecuteHandler(s.C0.SI,(function(){return y.shiftIn()})),y._parser.setExecuteHandler(s.C1.IND,(function(){return y.index()})),y._parser.setExecuteHandler(s.C1.NEL,(function(){return y.nextLine()})),y._parser.setExecuteHandler(s.C1.HTS,(function(){return y.tabSet()})),y._parser.registerOscHandler(0,new g.OscHandler((function(e){return y.setTitle(e),y.setIconName(e),!0}))),y._parser.registerOscHandler(1,new g.OscHandler((function(e){return y.setIconName(e)}))),y._parser.registerOscHandler(2,new g.OscHandler((function(e){return y.setTitle(e)}))),y._parser.registerOscHandler(4,new g.OscHandler((function(e){return y.setAnsiColor(e)}))),y._parser.registerEscHandler({final:"7"},(function(){return y.saveCursor()})),y._parser.registerEscHandler({final:"8"},(function(){return y.restoreCursor()})),y._parser.registerEscHandler({final:"D"},(function(){return y.index()})),y._parser.registerEscHandler({final:"E"},(function(){return y.nextLine()})),y._parser.registerEscHandler({final:"H"},(function(){return y.tabSet()})),y._parser.registerEscHandler({final:"M"},(function(){return y.reverseIndex()})),y._parser.registerEscHandler({final:"="},(function(){return y.keypadApplicationMode()})),y._parser.registerEscHandler({final:">"},(function(){return y.keypadNumericMode()})),y._parser.registerEscHandler({final:"c"},(function(){return y.fullReset()})),y._parser.registerEscHandler({final:"n"},(function(){return y.setgLevel(2)})),y._parser.registerEscHandler({final:"o"},(function(){return y.setgLevel(3)})),y._parser.registerEscHandler({final:"|"},(function(){return y.setgLevel(3)})),y._parser.registerEscHandler({final:"}"},(function(){return y.setgLevel(2)})),y._parser.registerEscHandler({final:"~"},(function(){return y.setgLevel(1)})),y._parser.registerEscHandler({intermediates:"%",final:"@"},(function(){return y.selectDefaultCharset()})),y._parser.registerEscHandler({intermediates:"%",final:"G"},(function(){return y.selectDefaultCharset()}));var b=function(e){S._parser.registerEscHandler({intermediates:"(",final:e},(function(){return y.selectCharset("("+e)})),S._parser.registerEscHandler({intermediates:")",final:e},(function(){return y.selectCharset(")"+e)})),S._parser.registerEscHandler({intermediates:"*",final:e},(function(){return y.selectCharset("*"+e)})),S._parser.registerEscHandler({intermediates:"+",final:e},(function(){return y.selectCharset("+"+e)})),S._parser.registerEscHandler({intermediates:"-",final:e},(function(){return y.selectCharset("-"+e)})),S._parser.registerEscHandler({intermediates:".",final:e},(function(){return y.selectCharset("."+e)})),S._parser.registerEscHandler({intermediates:"/",final:e},(function(){return y.selectCharset("/"+e)}))},S=this;for(var m in a.CHARSETS)b(m);return y._parser.registerEscHandler({intermediates:"#",final:"8"},(function(){return y.screenAlignmentPattern()})),y._parser.setErrorHandler((function(e){return y._logService.error("Parsing error: ",e),e})),y._parser.registerDcsHandler({intermediates:"$",final:"q"},new C(y._bufferService,y._coreService,y._logService,y._optionsService)),y}return n(t,e),Object.defineProperty(t.prototype,"onRequestBell",{get:function(){return this._onRequestBell.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onRequestRefreshRows",{get:function(){return this._onRequestRefreshRows.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onRequestReset",{get:function(){return this._onRequestReset.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onRequestScroll",{get:function(){return this._onRequestScroll.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onRequestSyncScrollBar",{get:function(){return this._onRequestSyncScrollBar.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onRequestWindowsOptionsReport",{get:function(){return this._onRequestWindowsOptionsReport.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onA11yChar",{get:function(){return this._onA11yChar.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onA11yTab",{get:function(){return this._onA11yTab.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onCursorMove",{get:function(){return this._onCursorMove.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onLineFeed",{get:function(){return this._onLineFeed.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onScroll",{get:function(){return this._onScroll.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onTitleChange",{get:function(){return this._onTitleChange.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onAnsiColorChange",{get:function(){return this._onAnsiColorChange.event},enumerable:!1,configurable:!0}),t.prototype.dispose=function(){e.prototype.dispose.call(this)},t.prototype.parse=function(e){var t=this._bufferService.buffer,r=t.x,i=t.y;if(this._logService.debug("parsing data",e),this._parseBuffer.length<e.length&&this._parseBuffer.length<S&&(this._parseBuffer=new Uint32Array(Math.min(e.length,S))),this._dirtyRowService.clearRange(),e.length>S)for(var n=0;n<e.length;n+=S){var o=n+S<e.length?n+S:e.length,s="string"==typeof e?this._stringDecoder.decode(e.substring(n,o),this._parseBuffer):this._utf8Decoder.decode(e.subarray(n,o),this._parseBuffer);this._parser.parse(this._parseBuffer,s)}else s="string"==typeof e?this._stringDecoder.decode(e,this._parseBuffer):this._utf8Decoder.decode(e,this._parseBuffer),this._parser.parse(this._parseBuffer,s);(t=this._bufferService.buffer).x===r&&t.y===i||this._onCursorMove.fire(),this._onRequestRefreshRows.fire(this._dirtyRowService.start,this._dirtyRowService.end)},t.prototype.print=function(e,t,r){var i,n,o=this._bufferService.buffer,s=this._charsetService.charset,a=this._optionsService.options.screenReaderMode,c=this._bufferService.cols,l=this._coreService.decPrivateModes.wraparound,h=this._coreService.modes.insertMode,f=this._curAttrData,_=o.lines.get(o.ybase+o.y);this._dirtyRowService.markDirty(o.y),o.x&&r-t>0&&2===_.getWidth(o.x-1)&&_.setCellFromCodePoint(o.x-1,0,1,f.fg,f.bg,f.extended);for(var p=t;p<r;++p){if(i=e[p],n=this._unicodeService.wcwidth(i),i<127&&s){var v=s[String.fromCharCode(i)];v&&(i=v.charCodeAt(0))}if(a&&this._onA11yChar.fire(u.stringFromCodePoint(i)),n||!o.x){if(o.x+n-1>=c)if(l){for(;o.x<c;)_.setCellFromCodePoint(o.x++,0,1,f.fg,f.bg,f.extended);o.x=0,o.y++,o.y===o.scrollBottom+1?(o.y--,this._onRequestScroll.fire(this._eraseAttrData(),!0)):(o.y>=this._bufferService.rows&&(o.y=this._bufferService.rows-1),o.lines.get(o.ybase+o.y).isWrapped=!0),_=o.lines.get(o.ybase+o.y)}else if(o.x=c-1,2===n)continue;if(h&&(_.insertCells(o.x,n,o.getNullCell(f),f),2===_.getWidth(c-1)&&_.setCellFromCodePoint(c-1,d.NULL_CELL_CODE,d.NULL_CELL_WIDTH,f.fg,f.bg,f.extended)),_.setCellFromCodePoint(o.x++,i,n,f.fg,f.bg,f.extended),n>0)for(;--n;)_.setCellFromCodePoint(o.x++,0,0,f.fg,f.bg,f.extended)}else _.getWidth(o.x-1)?_.addCodepointToCell(o.x-1,i):_.addCodepointToCell(o.x-2,i)}r-t>0&&(_.loadCell(o.x-1,this._workCell),2===this._workCell.getWidth()||this._workCell.getCode()>65535?this._parser.precedingCodepoint=0:this._workCell.isCombined()?this._parser.precedingCodepoint=this._workCell.getChars().charCodeAt(0):this._parser.precedingCodepoint=this._workCell.content),o.x<c&&r-t>0&&0===_.getWidth(o.x)&&!_.hasContent(o.x)&&_.setCellFromCodePoint(o.x,0,1,f.fg,f.bg,f.extended),this._dirtyRowService.markDirty(o.y)},t.prototype.addCsiHandler=function(e,t){var r=this;return"t"!==e.final||e.prefix||e.intermediates?this._parser.registerCsiHandler(e,t):this._parser.registerCsiHandler(e,(function(e){return!m(e.params[0],r._optionsService.options.windowOptions)||t(e)}))},t.prototype.addDcsHandler=function(e,t){return this._parser.registerDcsHandler(e,new y.DcsHandler(t))},t.prototype.addEscHandler=function(e,t){return this._parser.registerEscHandler(e,t)},t.prototype.addOscHandler=function(e,t){return this._parser.registerOscHandler(e,new g.OscHandler(t))},t.prototype.bell=function(){return this._onRequestBell.fire(),!0},t.prototype.lineFeed=function(){var e=this._bufferService.buffer;return this._dirtyRowService.markDirty(e.y),this._optionsService.options.convertEol&&(e.x=0),e.y++,e.y===e.scrollBottom+1?(e.y--,this._onRequestScroll.fire(this._eraseAttrData())):e.y>=this._bufferService.rows&&(e.y=this._bufferService.rows-1),e.x>=this._bufferService.cols&&e.x--,this._dirtyRowService.markDirty(e.y),this._onLineFeed.fire(),!0},t.prototype.carriageReturn=function(){return this._bufferService.buffer.x=0,!0},t.prototype.backspace=function(){var e,t=this._bufferService.buffer;if(!this._coreService.decPrivateModes.reverseWraparound)return this._restrictCursor(),t.x>0&&t.x--,!0;if(this._restrictCursor(this._bufferService.cols),t.x>0)t.x--;else if(0===t.x&&t.y>t.scrollTop&&t.y<=t.scrollBottom&&(null===(e=t.lines.get(t.ybase+t.y))||void 0===e?void 0:e.isWrapped)){t.lines.get(t.ybase+t.y).isWrapped=!1,t.y--,t.x=this._bufferService.cols-1;var r=t.lines.get(t.ybase+t.y);r.hasWidth(t.x)&&!r.hasContent(t.x)&&t.x--}return this._restrictCursor(),!0},t.prototype.tab=function(){if(this._bufferService.buffer.x>=this._bufferService.cols)return!0;var e=this._bufferService.buffer.x;return this._bufferService.buffer.x=this._bufferService.buffer.nextStop(),this._optionsService.options.screenReaderMode&&this._onA11yTab.fire(this._bufferService.buffer.x-e),!0},t.prototype.shiftOut=function(){return this._charsetService.setgLevel(1),!0},t.prototype.shiftIn=function(){return this._charsetService.setgLevel(0),!0},t.prototype._restrictCursor=function(e){void 0===e&&(e=this._bufferService.cols-1),this._bufferService.buffer.x=Math.min(e,Math.max(0,this._bufferService.buffer.x)),this._bufferService.buffer.y=this._coreService.decPrivateModes.origin?Math.min(this._bufferService.buffer.scrollBottom,Math.max(this._bufferService.buffer.scrollTop,this._bufferService.buffer.y)):Math.min(this._bufferService.rows-1,Math.max(0,this._bufferService.buffer.y)),this._dirtyRowService.markDirty(this._bufferService.buffer.y)},t.prototype._setCursor=function(e,t){this._dirtyRowService.markDirty(this._bufferService.buffer.y),this._coreService.decPrivateModes.origin?(this._bufferService.buffer.x=e,this._bufferService.buffer.y=this._bufferService.buffer.scrollTop+t):(this._bufferService.buffer.x=e,this._bufferService.buffer.y=t),this._restrictCursor(),this._dirtyRowService.markDirty(this._bufferService.buffer.y)},t.prototype._moveCursor=function(e,t){this._restrictCursor(),this._setCursor(this._bufferService.buffer.x+e,this._bufferService.buffer.y+t)},t.prototype.cursorUp=function(e){var t=this._bufferService.buffer.y-this._bufferService.buffer.scrollTop;return t>=0?this._moveCursor(0,-Math.min(t,e.params[0]||1)):this._moveCursor(0,-(e.params[0]||1)),!0},t.prototype.cursorDown=function(e){var t=this._bufferService.buffer.scrollBottom-this._bufferService.buffer.y;return t>=0?this._moveCursor(0,Math.min(t,e.params[0]||1)):this._moveCursor(0,e.params[0]||1),!0},t.prototype.cursorForward=function(e){return this._moveCursor(e.params[0]||1,0),!0},t.prototype.cursorBackward=function(e){return this._moveCursor(-(e.params[0]||1),0),!0},t.prototype.cursorNextLine=function(e){return this.cursorDown(e),this._bufferService.buffer.x=0,!0},t.prototype.cursorPrecedingLine=function(e){return this.cursorUp(e),this._bufferService.buffer.x=0,!0},t.prototype.cursorCharAbsolute=function(e){return this._setCursor((e.params[0]||1)-1,this._bufferService.buffer.y),!0},t.prototype.cursorPosition=function(e){return this._setCursor(e.length>=2?(e.params[1]||1)-1:0,(e.params[0]||1)-1),!0},t.prototype.charPosAbsolute=function(e){return this._setCursor((e.params[0]||1)-1,this._bufferService.buffer.y),!0},t.prototype.hPositionRelative=function(e){return this._moveCursor(e.params[0]||1,0),!0},t.prototype.linePosAbsolute=function(e){return this._setCursor(this._bufferService.buffer.x,(e.params[0]||1)-1),!0},t.prototype.vPositionRelative=function(e){return this._moveCursor(0,e.params[0]||1),!0},t.prototype.hVPosition=function(e){return this.cursorPosition(e),!0},t.prototype.tabClear=function(e){var t=e.params[0];return 0===t?delete this._bufferService.buffer.tabs[this._bufferService.buffer.x]:3===t&&(this._bufferService.buffer.tabs={}),!0},t.prototype.cursorForwardTab=function(e){if(this._bufferService.buffer.x>=this._bufferService.cols)return!0;for(var t=e.params[0]||1;t--;)this._bufferService.buffer.x=this._bufferService.buffer.nextStop();return!0},t.prototype.cursorBackwardTab=function(e){if(this._bufferService.buffer.x>=this._bufferService.cols)return!0;for(var t=e.params[0]||1,r=this._bufferService.buffer;t--;)r.x=r.prevStop();return!0},t.prototype._eraseInBufferLine=function(e,t,r,i){void 0===i&&(i=!1);var n=this._bufferService.buffer.lines.get(this._bufferService.buffer.ybase+e);n.replaceCells(t,r,this._bufferService.buffer.getNullCell(this._eraseAttrData()),this._eraseAttrData()),i&&(n.isWrapped=!1)},t.prototype._resetBufferLine=function(e){var t=this._bufferService.buffer.lines.get(this._bufferService.buffer.ybase+e);t.fill(this._bufferService.buffer.getNullCell(this._eraseAttrData())),t.isWrapped=!1},t.prototype.eraseInDisplay=function(e){var t;switch(this._restrictCursor(),e.params[0]){case 0:for(t=this._bufferService.buffer.y,this._dirtyRowService.markDirty(t),this._eraseInBufferLine(t++,this._bufferService.buffer.x,this._bufferService.cols,0===this._bufferService.buffer.x);t<this._bufferService.rows;t++)this._resetBufferLine(t);this._dirtyRowService.markDirty(t);break;case 1:for(t=this._bufferService.buffer.y,this._dirtyRowService.markDirty(t),this._eraseInBufferLine(t,0,this._bufferService.buffer.x+1,!0),this._bufferService.buffer.x+1>=this._bufferService.cols&&(this._bufferService.buffer.lines.get(t+1).isWrapped=!1);t--;)this._resetBufferLine(t);this._dirtyRowService.markDirty(0);break;case 2:for(t=this._bufferService.rows,this._dirtyRowService.markDirty(t-1);t--;)this._resetBufferLine(t);this._dirtyRowService.markDirty(0);break;case 3:var r=this._bufferService.buffer.lines.length-this._bufferService.rows;r>0&&(this._bufferService.buffer.lines.trimStart(r),this._bufferService.buffer.ybase=Math.max(this._bufferService.buffer.ybase-r,0),this._bufferService.buffer.ydisp=Math.max(this._bufferService.buffer.ydisp-r,0),this._onScroll.fire(0))}return!0},t.prototype.eraseInLine=function(e){switch(this._restrictCursor(),e.params[0]){case 0:this._eraseInBufferLine(this._bufferService.buffer.y,this._bufferService.buffer.x,this._bufferService.cols);break;case 1:this._eraseInBufferLine(this._bufferService.buffer.y,0,this._bufferService.buffer.x+1);break;case 2:this._eraseInBufferLine(this._bufferService.buffer.y,0,this._bufferService.cols)}return this._dirtyRowService.markDirty(this._bufferService.buffer.y),!0},t.prototype.insertLines=function(e){this._restrictCursor();var t=e.params[0]||1,r=this._bufferService.buffer;if(r.y>r.scrollBottom||r.y<r.scrollTop)return!0;for(var i=r.ybase+r.y,n=this._bufferService.rows-1-r.scrollBottom,o=this._bufferService.rows-1+r.ybase-n+1;t--;)r.lines.splice(o-1,1),r.lines.splice(i,0,r.getBlankLine(this._eraseAttrData()));return this._dirtyRowService.markRangeDirty(r.y,r.scrollBottom),r.x=0,!0},t.prototype.deleteLines=function(e){this._restrictCursor();var t=e.params[0]||1,r=this._bufferService.buffer;if(r.y>r.scrollBottom||r.y<r.scrollTop)return!0;var i,n=r.ybase+r.y;for(i=this._bufferService.rows-1-r.scrollBottom,i=this._bufferService.rows-1+r.ybase-i;t--;)r.lines.splice(n,1),r.lines.splice(i,0,r.getBlankLine(this._eraseAttrData()));return this._dirtyRowService.markRangeDirty(r.y,r.scrollBottom),r.x=0,!0},t.prototype.insertChars=function(e){this._restrictCursor();var t=this._bufferService.buffer.lines.get(this._bufferService.buffer.ybase+this._bufferService.buffer.y);return t&&(t.insertCells(this._bufferService.buffer.x,e.params[0]||1,this._bufferService.buffer.getNullCell(this._eraseAttrData()),this._eraseAttrData()),this._dirtyRowService.markDirty(this._bufferService.buffer.y)),!0},t.prototype.deleteChars=function(e){this._restrictCursor();var t=this._bufferService.buffer.lines.get(this._bufferService.buffer.ybase+this._bufferService.buffer.y);return t&&(t.deleteCells(this._bufferService.buffer.x,e.params[0]||1,this._bufferService.buffer.getNullCell(this._eraseAttrData()),this._eraseAttrData()),this._dirtyRowService.markDirty(this._bufferService.buffer.y)),!0},t.prototype.scrollUp=function(e){for(var t=e.params[0]||1,r=this._bufferService.buffer;t--;)r.lines.splice(r.ybase+r.scrollTop,1),r.lines.splice(r.ybase+r.scrollBottom,0,r.getBlankLine(this._eraseAttrData()));return this._dirtyRowService.markRangeDirty(r.scrollTop,r.scrollBottom),!0},t.prototype.scrollDown=function(e){for(var t=e.params[0]||1,r=this._bufferService.buffer;t--;)r.lines.splice(r.ybase+r.scrollBottom,1),r.lines.splice(r.ybase+r.scrollTop,0,r.getBlankLine(f.DEFAULT_ATTR_DATA));return this._dirtyRowService.markRangeDirty(r.scrollTop,r.scrollBottom),!0},t.prototype.scrollLeft=function(e){var t=this._bufferService.buffer;if(t.y>t.scrollBottom||t.y<t.scrollTop)return!0;for(var r=e.params[0]||1,i=t.scrollTop;i<=t.scrollBottom;++i){var n=t.lines.get(t.ybase+i);n.deleteCells(0,r,t.getNullCell(this._eraseAttrData()),this._eraseAttrData()),n.isWrapped=!1}return this._dirtyRowService.markRangeDirty(t.scrollTop,t.scrollBottom),!0},t.prototype.scrollRight=function(e){var t=this._bufferService.buffer;if(t.y>t.scrollBottom||t.y<t.scrollTop)return!0;for(var r=e.params[0]||1,i=t.scrollTop;i<=t.scrollBottom;++i){var n=t.lines.get(t.ybase+i);n.insertCells(0,r,t.getNullCell(this._eraseAttrData()),this._eraseAttrData()),n.isWrapped=!1}return this._dirtyRowService.markRangeDirty(t.scrollTop,t.scrollBottom),!0},t.prototype.insertColumns=function(e){var t=this._bufferService.buffer;if(t.y>t.scrollBottom||t.y<t.scrollTop)return!0;for(var r=e.params[0]||1,i=t.scrollTop;i<=t.scrollBottom;++i){var n=this._bufferService.buffer.lines.get(t.ybase+i);n.insertCells(t.x,r,t.getNullCell(this._eraseAttrData()),this._eraseAttrData()),n.isWrapped=!1}return this._dirtyRowService.markRangeDirty(t.scrollTop,t.scrollBottom),!0},t.prototype.deleteColumns=function(e){var t=this._bufferService.buffer;if(t.y>t.scrollBottom||t.y<t.scrollTop)return!0;for(var r=e.params[0]||1,i=t.scrollTop;i<=t.scrollBottom;++i){var n=t.lines.get(t.ybase+i);n.deleteCells(t.x,r,t.getNullCell(this._eraseAttrData()),this._eraseAttrData()),n.isWrapped=!1}return this._dirtyRowService.markRangeDirty(t.scrollTop,t.scrollBottom),!0},t.prototype.eraseChars=function(e){this._restrictCursor();var t=this._bufferService.buffer.lines.get(this._bufferService.buffer.ybase+this._bufferService.buffer.y);return t&&(t.replaceCells(this._bufferService.buffer.x,this._bufferService.buffer.x+(e.params[0]||1),this._bufferService.buffer.getNullCell(this._eraseAttrData()),this._eraseAttrData()),this._dirtyRowService.markDirty(this._bufferService.buffer.y)),!0},t.prototype.repeatPrecedingCharacter=function(e){if(!this._parser.precedingCodepoint)return!0;for(var t=e.params[0]||1,r=new Uint32Array(t),i=0;i<t;++i)r[i]=this._parser.precedingCodepoint;return this.print(r,0,r.length),!0},t.prototype.sendDeviceAttributesPrimary=function(e){return e.params[0]>0||(this._is("xterm")||this._is("rxvt-unicode")||this._is("screen")?this._coreService.triggerDataEvent(s.C0.ESC+"[?1;2c"):this._is("linux")&&this._coreService.triggerDataEvent(s.C0.ESC+"[?6c")),!0},t.prototype.sendDeviceAttributesSecondary=function(e){return e.params[0]>0||(this._is("xterm")?this._coreService.triggerDataEvent(s.C0.ESC+"[>0;276;0c"):this._is("rxvt-unicode")?this._coreService.triggerDataEvent(s.C0.ESC+"[>85;95;0c"):this._is("linux")?this._coreService.triggerDataEvent(e.params[0]+"c"):this._is("screen")&&this._coreService.triggerDataEvent(s.C0.ESC+"[>83;40003;0c")),!0},t.prototype._is=function(e){return 0===(this._optionsService.options.termName+"").indexOf(e)},t.prototype.setMode=function(e){for(var t=0;t<e.length;t++)switch(e.params[t]){case 4:this._coreService.modes.insertMode=!0}return!0},t.prototype.setModePrivate=function(e){for(var t=0;t<e.length;t++)switch(e.params[t]){case 1:this._coreService.decPrivateModes.applicationCursorKeys=!0;break;case 2:this._charsetService.setgCharset(0,a.DEFAULT_CHARSET),this._charsetService.setgCharset(1,a.DEFAULT_CHARSET),this._charsetService.setgCharset(2,a.DEFAULT_CHARSET),this._charsetService.setgCharset(3,a.DEFAULT_CHARSET);break;case 3:this._optionsService.options.windowOptions.setWinLines&&(this._bufferService.resize(132,this._bufferService.rows),this._onRequestReset.fire());break;case 6:this._coreService.decPrivateModes.origin=!0,this._setCursor(0,0);break;case 7:this._coreService.decPrivateModes.wraparound=!0;break;case 12:break;case 45:this._coreService.decPrivateModes.reverseWraparound=!0;break;case 66:this._logService.debug("Serial port requested application keypad."),this._coreService.decPrivateModes.applicationKeypad=!0,this._onRequestSyncScrollBar.fire();break;case 9:this._coreMouseService.activeProtocol="X10";break;case 1e3:this._coreMouseService.activeProtocol="VT200";break;case 1002:this._coreMouseService.activeProtocol="DRAG";break;case 1003:this._coreMouseService.activeProtocol="ANY";break;case 1004:this._coreService.decPrivateModes.sendFocus=!0;break;case 1005:this._logService.debug("DECSET 1005 not supported (see #2507)");break;case 1006:this._coreMouseService.activeEncoding="SGR";break;case 1015:this._logService.debug("DECSET 1015 not supported (see #2507)");break;case 25:this._coreService.isCursorHidden=!1;break;case 1048:this.saveCursor();break;case 1049:this.saveCursor();case 47:case 1047:this._bufferService.buffers.activateAltBuffer(this._eraseAttrData()),this._coreService.isCursorInitialized=!0,this._onRequestRefreshRows.fire(0,this._bufferService.rows-1),this._onRequestSyncScrollBar.fire();break;case 2004:this._coreService.decPrivateModes.bracketedPasteMode=!0}return!0},t.prototype.resetMode=function(e){for(var t=0;t<e.length;t++)switch(e.params[t]){case 4:this._coreService.modes.insertMode=!1}return!0},t.prototype.resetModePrivate=function(e){for(var t=0;t<e.length;t++)switch(e.params[t]){case 1:this._coreService.decPrivateModes.applicationCursorKeys=!1;break;case 3:this._optionsService.options.windowOptions.setWinLines&&(this._bufferService.resize(80,this._bufferService.rows),this._onRequestReset.fire());break;case 6:this._coreService.decPrivateModes.origin=!1,this._setCursor(0,0);break;case 7:this._coreService.decPrivateModes.wraparound=!1;break;case 12:break;case 45:this._coreService.decPrivateModes.reverseWraparound=!1;break;case 66:this._logService.debug("Switching back to normal keypad."),this._coreService.decPrivateModes.applicationKeypad=!1,this._onRequestSyncScrollBar.fire();break;case 9:case 1e3:case 1002:case 1003:this._coreMouseService.activeProtocol="NONE";break;case 1004:this._coreService.decPrivateModes.sendFocus=!1;break;case 1005:this._logService.debug("DECRST 1005 not supported (see #2507)");break;case 1006:this._coreMouseService.activeEncoding="DEFAULT";break;case 1015:this._logService.debug("DECRST 1015 not supported (see #2507)");break;case 25:this._coreService.isCursorHidden=!0;break;case 1048:this.restoreCursor();break;case 1049:case 47:case 1047:this._bufferService.buffers.activateNormalBuffer(),1049===e.params[t]&&this.restoreCursor(),this._coreService.isCursorInitialized=!0,this._onRequestRefreshRows.fire(0,this._bufferService.rows-1),this._onRequestSyncScrollBar.fire();break;case 2004:this._coreService.decPrivateModes.bracketedPasteMode=!1}return!0},t.prototype._updateAttrColor=function(e,t,r,i,n){return 2===t?(e|=50331648,e&=-16777216,e|=v.AttributeData.fromColorRGB([r,i,n])):5===t&&(e&=-50331904,e|=33554432|255&r),e},t.prototype._extractColor=function(e,t,r){var i=[0,0,-1,0,0,0],n=0,o=0;do{if(i[o+n]=e.params[t+o],e.hasSubParams(t+o)){var s=e.getSubParams(t+o),a=0;do{5===i[1]&&(n=1),i[o+a+1+n]=s[a]}while(++a<s.length&&a+o+1+n<i.length);break}if(5===i[1]&&o+n>=2||2===i[1]&&o+n>=5)break;i[1]&&(n=1)}while(++o+t<e.length&&o+n<i.length);for(a=2;a<i.length;++a)-1===i[a]&&(i[a]=0);switch(i[0]){case 38:r.fg=this._updateAttrColor(r.fg,i[1],i[3],i[4],i[5]);break;case 48:r.bg=this._updateAttrColor(r.bg,i[1],i[3],i[4],i[5]);break;case 58:r.extended=r.extended.clone(),r.extended.underlineColor=this._updateAttrColor(r.extended.underlineColor,i[1],i[3],i[4],i[5])}return o},t.prototype._processUnderline=function(e,t){t.extended=t.extended.clone(),(!~e||e>5)&&(e=1),t.extended.underlineStyle=e,t.fg|=268435456,0===e&&(t.fg&=-268435457),t.updateExtended()},t.prototype.charAttributes=function(e){if(1===e.length&&0===e.params[0])return this._curAttrData.fg=f.DEFAULT_ATTR_DATA.fg,this._curAttrData.bg=f.DEFAULT_ATTR_DATA.bg,!0;for(var t,r=e.length,i=this._curAttrData,n=0;n<r;n++)(t=e.params[n])>=30&&t<=37?(i.fg&=-50331904,i.fg|=16777216|t-30):t>=40&&t<=47?(i.bg&=-50331904,i.bg|=16777216|t-40):t>=90&&t<=97?(i.fg&=-50331904,i.fg|=16777224|t-90):t>=100&&t<=107?(i.bg&=-50331904,i.bg|=16777224|t-100):0===t?(i.fg=f.DEFAULT_ATTR_DATA.fg,i.bg=f.DEFAULT_ATTR_DATA.bg):1===t?i.fg|=134217728:3===t?i.bg|=67108864:4===t?(i.fg|=268435456,this._processUnderline(e.hasSubParams(n)?e.getSubParams(n)[0]:1,i)):5===t?i.fg|=536870912:7===t?i.fg|=67108864:8===t?i.fg|=1073741824:2===t?i.bg|=134217728:21===t?this._processUnderline(2,i):22===t?(i.fg&=-134217729,i.bg&=-134217729):23===t?i.bg&=-67108865:24===t?i.fg&=-268435457:25===t?i.fg&=-536870913:27===t?i.fg&=-67108865:28===t?i.fg&=-1073741825:39===t?(i.fg&=-67108864,i.fg|=16777215&f.DEFAULT_ATTR_DATA.fg):49===t?(i.bg&=-67108864,i.bg|=16777215&f.DEFAULT_ATTR_DATA.bg):38===t||48===t||58===t?n+=this._extractColor(e,n,i):59===t?(i.extended=i.extended.clone(),i.extended.underlineColor=-1,i.updateExtended()):100===t?(i.fg&=-67108864,i.fg|=16777215&f.DEFAULT_ATTR_DATA.fg,i.bg&=-67108864,i.bg|=16777215&f.DEFAULT_ATTR_DATA.bg):this._logService.debug("Unknown SGR attribute: %d.",t);return!0},t.prototype.deviceStatus=function(e){switch(e.params[0]){case 5:this._coreService.triggerDataEvent(s.C0.ESC+"[0n");break;case 6:var t=this._bufferService.buffer.y+1,r=this._bufferService.buffer.x+1;this._coreService.triggerDataEvent(s.C0.ESC+"["+t+";"+r+"R")}return!0},t.prototype.deviceStatusPrivate=function(e){switch(e.params[0]){case 6:var t=this._bufferService.buffer.y+1,r=this._bufferService.buffer.x+1;this._coreService.triggerDataEvent(s.C0.ESC+"[?"+t+";"+r+"R")}return!0},t.prototype.softReset=function(e){return this._coreService.isCursorHidden=!1,this._onRequestSyncScrollBar.fire(),this._bufferService.buffer.scrollTop=0,this._bufferService.buffer.scrollBottom=this._bufferService.rows-1,this._curAttrData=f.DEFAULT_ATTR_DATA.clone(),this._coreService.reset(),this._charsetService.reset(),this._bufferService.buffer.savedX=0,this._bufferService.buffer.savedY=this._bufferService.buffer.ybase,this._bufferService.buffer.savedCurAttrData.fg=this._curAttrData.fg,this._bufferService.buffer.savedCurAttrData.bg=this._curAttrData.bg,this._bufferService.buffer.savedCharset=this._charsetService.charset,this._coreService.decPrivateModes.origin=!1,!0},t.prototype.setCursorStyle=function(e){var t=e.params[0]||1;switch(t){case 1:case 2:this._optionsService.options.cursorStyle="block";break;case 3:case 4:this._optionsService.options.cursorStyle="underline";break;case 5:case 6:this._optionsService.options.cursorStyle="bar"}var r=t%2==1;return this._optionsService.options.cursorBlink=r,!0},t.prototype.setScrollRegion=function(e){var t,r=e.params[0]||1;return(e.length<2||(t=e.params[1])>this._bufferService.rows||0===t)&&(t=this._bufferService.rows),t>r&&(this._bufferService.buffer.scrollTop=r-1,this._bufferService.buffer.scrollBottom=t-1,this._setCursor(0,0)),!0},t.prototype.windowOptions=function(e){if(!m(e.params[0],this._optionsService.options.windowOptions))return!0;var t=e.length>1?e.params[1]:0;switch(e.params[0]){case 14:2!==t&&this._onRequestWindowsOptionsReport.fire(o.GET_WIN_SIZE_PIXELS);break;case 16:this._onRequestWindowsOptionsReport.fire(o.GET_CELL_SIZE_PIXELS);break;case 18:this._bufferService&&this._coreService.triggerDataEvent(s.C0.ESC+"[8;"+this._bufferService.rows+";"+this._bufferService.cols+"t");break;case 22:0!==t&&2!==t||(this._windowTitleStack.push(this._windowTitle),this._windowTitleStack.length>10&&this._windowTitleStack.shift()),0!==t&&1!==t||(this._iconNameStack.push(this._iconName),this._iconNameStack.length>10&&this._iconNameStack.shift());break;case 23:0!==t&&2!==t||this._windowTitleStack.length&&this.setTitle(this._windowTitleStack.pop()),0!==t&&1!==t||this._iconNameStack.length&&this.setIconName(this._iconNameStack.pop())}return!0},t.prototype.saveCursor=function(e){return this._bufferService.buffer.savedX=this._bufferService.buffer.x,this._bufferService.buffer.savedY=this._bufferService.buffer.ybase+this._bufferService.buffer.y,this._bufferService.buffer.savedCurAttrData.fg=this._curAttrData.fg,this._bufferService.buffer.savedCurAttrData.bg=this._curAttrData.bg,this._bufferService.buffer.savedCharset=this._charsetService.charset,!0},t.prototype.restoreCursor=function(e){return this._bufferService.buffer.x=this._bufferService.buffer.savedX||0,this._bufferService.buffer.y=Math.max(this._bufferService.buffer.savedY-this._bufferService.buffer.ybase,0),this._curAttrData.fg=this._bufferService.buffer.savedCurAttrData.fg,this._curAttrData.bg=this._bufferService.buffer.savedCurAttrData.bg,this._charsetService.charset=this._savedCharset,this._bufferService.buffer.savedCharset&&(this._charsetService.charset=this._bufferService.buffer.savedCharset),this._restrictCursor(),!0},t.prototype.setTitle=function(e){return this._windowTitle=e,this._onTitleChange.fire(e),!0},t.prototype.setIconName=function(e){return this._iconName=e,!0},t.prototype._parseAnsiColorChange=function(e){for(var t,r={colors:[]},i=/(\d+);rgb:([0-9a-f]{2})\/([0-9a-f]{2})\/([0-9a-f]{2})/gi;null!==(t=i.exec(e));)r.colors.push({colorIndex:parseInt(t[1]),red:parseInt(t[2],16),green:parseInt(t[3],16),blue:parseInt(t[4],16)});return 0===r.colors.length?null:r},t.prototype.setAnsiColor=function(e){var t=this._parseAnsiColorChange(e);return t?this._onAnsiColorChange.fire(t):this._logService.warn("Expected format <num>;rgb:<rr>/<gg>/<bb> but got data: "+e),!0},t.prototype.nextLine=function(){return this._bufferService.buffer.x=0,this.index(),!0},t.prototype.keypadApplicationMode=function(){return this._logService.debug("Serial port requested application keypad."),this._coreService.decPrivateModes.applicationKeypad=!0,this._onRequestSyncScrollBar.fire(),!0},t.prototype.keypadNumericMode=function(){return this._logService.debug("Switching back to normal keypad."),this._coreService.decPrivateModes.applicationKeypad=!1,this._onRequestSyncScrollBar.fire(),!0},t.prototype.selectDefaultCharset=function(){return this._charsetService.setgLevel(0),this._charsetService.setgCharset(0,a.DEFAULT_CHARSET),!0},t.prototype.selectCharset=function(e){return 2!==e.length?(this.selectDefaultCharset(),!0):("/"===e[0]||this._charsetService.setgCharset(b[e[0]],a.CHARSETS[e[1]]||a.DEFAULT_CHARSET),!0)},t.prototype.index=function(){this._restrictCursor();var e=this._bufferService.buffer;return this._bufferService.buffer.y++,e.y===e.scrollBottom+1?(e.y--,this._onRequestScroll.fire(this._eraseAttrData())):e.y>=this._bufferService.rows&&(e.y=this._bufferService.rows-1),this._restrictCursor(),!0},t.prototype.tabSet=function(){return this._bufferService.buffer.tabs[this._bufferService.buffer.x]=!0,!0},t.prototype.reverseIndex=function(){this._restrictCursor();var e=this._bufferService.buffer;if(e.y===e.scrollTop){var t=e.scrollBottom-e.scrollTop;e.lines.shiftElements(e.ybase+e.y,t,1),e.lines.set(e.ybase+e.y,e.getBlankLine(this._eraseAttrData())),this._dirtyRowService.markRangeDirty(e.scrollTop,e.scrollBottom)}else e.y--,this._restrictCursor();return!0},t.prototype.fullReset=function(){return this._parser.reset(),this._onRequestReset.fire(),!0},t.prototype.reset=function(){this._curAttrData=f.DEFAULT_ATTR_DATA.clone(),this._eraseAttrDataInternal=f.DEFAULT_ATTR_DATA.clone()},t.prototype._eraseAttrData=function(){return this._eraseAttrDataInternal.bg&=-67108864,this._eraseAttrDataInternal.bg|=67108863&this._curAttrData.bg,this._eraseAttrDataInternal},t.prototype.setgLevel=function(e){return this._charsetService.setgLevel(e),!0},t.prototype.screenAlignmentPattern=function(){var e=new p.CellData;e.content=1<<22|"E".charCodeAt(0),e.fg=this._curAttrData.fg,e.bg=this._curAttrData.bg;var t=this._bufferService.buffer;this._setCursor(0,0);for(var r=0;r<this._bufferService.rows;++r){var i=t.ybase+t.y+r,n=t.lines.get(i);n&&(n.fill(e),n.isWrapped=!1)}return this._dirtyRowService.markAllDirty(),this._setCursor(0,0),!0},t}(l.Disposable);t.InputHandler=w},844:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.getDisposeArrayDisposable=t.disposeArray=t.Disposable=void 0;var r=function(){function e(){this._disposables=[],this._isDisposed=!1}return e.prototype.dispose=function(){this._isDisposed=!0;for(var e=0,t=this._disposables;e<t.length;e++)t[e].dispose();this._disposables.length=0},e.prototype.register=function(e){return this._disposables.push(e),e},e.prototype.unregister=function(e){var t=this._disposables.indexOf(e);-1!==t&&this._disposables.splice(t,1)},e}();function i(e){for(var t=0,r=e;t<r.length;t++)r[t].dispose();e.length=0}t.Disposable=r,t.disposeArray=i,t.getDisposeArrayDisposable=function(e){return{dispose:function(){return i(e)}}}},6114:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.isLinux=t.isWindows=t.isIphone=t.isIpad=t.isMac=t.isSafari=t.isFirefox=void 0;var r="undefined"==typeof navigator,i=r?"node":navigator.userAgent,n=r?"node":navigator.platform;t.isFirefox=i.includes("Firefox"),t.isSafari=/^((?!chrome|android).)*safari/i.test(i),t.isMac=["Macintosh","MacIntel","MacPPC","Mac68K"].includes(n),t.isIpad="iPad"===n,t.isIphone="iPhone"===n,t.isWindows=["Windows","Win16","Win32","WinCE"].includes(n),t.isLinux=n.indexOf("Linux")>=0},8273:(e,t)=>{function r(e,t,r,i){if(void 0===r&&(r=0),void 0===i&&(i=e.length),r>=e.length)return e;r=(e.length+r)%e.length,i=i>=e.length?e.length:(e.length+i)%e.length;for(var n=r;n<i;++n)e[n]=t;return e}Object.defineProperty(t,"__esModule",{value:!0}),t.concat=t.fillFallback=t.fill=void 0,t.fill=function(e,t,i,n){return e.fill?e.fill(t,i,n):r(e,t,i,n)},t.fillFallback=r,t.concat=function(e,t){var r=new e.constructor(e.length+t.length);return r.set(e),r.set(t,e.length),r}},9282:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.updateWindowsModeWrappedState=void 0;var i=r(643);t.updateWindowsModeWrappedState=function(e){var t=e.buffer.lines.get(e.buffer.ybase+e.buffer.y-1),r=null==t?void 0:t.get(e.cols-1),n=e.buffer.lines.get(e.buffer.ybase+e.buffer.y);n&&r&&(n.isWrapped=r[i.CHAR_DATA_CODE_INDEX]!==i.NULL_CELL_CODE&&r[i.CHAR_DATA_CODE_INDEX]!==i.WHITESPACE_CELL_CODE)}},3734:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.ExtendedAttrs=t.AttributeData=void 0;var r=function(){function e(){this.fg=0,this.bg=0,this.extended=new i}return e.toColorRGB=function(e){return[e>>>16&255,e>>>8&255,255&e]},e.fromColorRGB=function(e){return(255&e[0])<<16|(255&e[1])<<8|255&e[2]},e.prototype.clone=function(){var t=new e;return t.fg=this.fg,t.bg=this.bg,t.extended=this.extended.clone(),t},e.prototype.isInverse=function(){return 67108864&this.fg},e.prototype.isBold=function(){return 134217728&this.fg},e.prototype.isUnderline=function(){return 268435456&this.fg},e.prototype.isBlink=function(){return 536870912&this.fg},e.prototype.isInvisible=function(){return 1073741824&this.fg},e.prototype.isItalic=function(){return 67108864&this.bg},e.prototype.isDim=function(){return 134217728&this.bg},e.prototype.getFgColorMode=function(){return 50331648&this.fg},e.prototype.getBgColorMode=function(){return 50331648&this.bg},e.prototype.isFgRGB=function(){return 50331648==(50331648&this.fg)},e.prototype.isBgRGB=function(){return 50331648==(50331648&this.bg)},e.prototype.isFgPalette=function(){return 16777216==(50331648&this.fg)||33554432==(50331648&this.fg)},e.prototype.isBgPalette=function(){return 16777216==(50331648&this.bg)||33554432==(50331648&this.bg)},e.prototype.isFgDefault=function(){return 0==(50331648&this.fg)},e.prototype.isBgDefault=function(){return 0==(50331648&this.bg)},e.prototype.isAttributeDefault=function(){return 0===this.fg&&0===this.bg},e.prototype.getFgColor=function(){switch(50331648&this.fg){case 16777216:case 33554432:return 255&this.fg;case 50331648:return 16777215&this.fg;default:return-1}},e.prototype.getBgColor=function(){switch(50331648&this.bg){case 16777216:case 33554432:return 255&this.bg;case 50331648:return 16777215&this.bg;default:return-1}},e.prototype.hasExtendedAttrs=function(){return 268435456&this.bg},e.prototype.updateExtended=function(){this.extended.isEmpty()?this.bg&=-268435457:this.bg|=268435456},e.prototype.getUnderlineColor=function(){if(268435456&this.bg&&~this.extended.underlineColor)switch(50331648&this.extended.underlineColor){case 16777216:case 33554432:return 255&this.extended.underlineColor;case 50331648:return 16777215&this.extended.underlineColor;default:return this.getFgColor()}return this.getFgColor()},e.prototype.getUnderlineColorMode=function(){return 268435456&this.bg&&~this.extended.underlineColor?50331648&this.extended.underlineColor:this.getFgColorMode()},e.prototype.isUnderlineColorRGB=function(){return 268435456&this.bg&&~this.extended.underlineColor?50331648==(50331648&this.extended.underlineColor):this.isFgRGB()},e.prototype.isUnderlineColorPalette=function(){return 268435456&this.bg&&~this.extended.underlineColor?16777216==(50331648&this.extended.underlineColor)||33554432==(50331648&this.extended.underlineColor):this.isFgPalette()},e.prototype.isUnderlineColorDefault=function(){return 268435456&this.bg&&~this.extended.underlineColor?0==(50331648&this.extended.underlineColor):this.isFgDefault()},e.prototype.getUnderlineStyle=function(){return 268435456&this.fg?268435456&this.bg?this.extended.underlineStyle:1:0},e}();t.AttributeData=r;var i=function(){function e(e,t){void 0===e&&(e=0),void 0===t&&(t=-1),this.underlineStyle=e,this.underlineColor=t}return e.prototype.clone=function(){return new e(this.underlineStyle,this.underlineColor)},e.prototype.isEmpty=function(){return 0===this.underlineStyle},e}();t.ExtendedAttrs=i},9092:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.BufferStringIterator=t.Buffer=t.MAX_BUFFER_SIZE=void 0;var i=r(6349),n=r(8437),o=r(511),s=r(643),a=r(4634),c=r(4863),l=r(7116),h=r(3734);t.MAX_BUFFER_SIZE=4294967295;var u=function(){function e(e,t,r){this._hasScrollback=e,this._optionsService=t,this._bufferService=r,this.ydisp=0,this.ybase=0,this.y=0,this.x=0,this.savedY=0,this.savedX=0,this.savedCurAttrData=n.DEFAULT_ATTR_DATA.clone(),this.savedCharset=l.DEFAULT_CHARSET,this.markers=[],this._nullCell=o.CellData.fromCharData([0,s.NULL_CELL_CHAR,s.NULL_CELL_WIDTH,s.NULL_CELL_CODE]),this._whitespaceCell=o.CellData.fromCharData([0,s.WHITESPACE_CELL_CHAR,s.WHITESPACE_CELL_WIDTH,s.WHITESPACE_CELL_CODE]),this._cols=this._bufferService.cols,this._rows=this._bufferService.rows,this.lines=new i.CircularList(this._getCorrectBufferLength(this._rows)),this.scrollTop=0,this.scrollBottom=this._rows-1,this.setupTabStops()}return e.prototype.getNullCell=function(e){return e?(this._nullCell.fg=e.fg,this._nullCell.bg=e.bg,this._nullCell.extended=e.extended):(this._nullCell.fg=0,this._nullCell.bg=0,this._nullCell.extended=new h.ExtendedAttrs),this._nullCell},e.prototype.getWhitespaceCell=function(e){return e?(this._whitespaceCell.fg=e.fg,this._whitespaceCell.bg=e.bg,this._whitespaceCell.extended=e.extended):(this._whitespaceCell.fg=0,this._whitespaceCell.bg=0,this._whitespaceCell.extended=new h.ExtendedAttrs),this._whitespaceCell},e.prototype.getBlankLine=function(e,t){return new n.BufferLine(this._bufferService.cols,this.getNullCell(e),t)},Object.defineProperty(e.prototype,"hasScrollback",{get:function(){return this._hasScrollback&&this.lines.maxLength>this._rows},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"isCursorInViewport",{get:function(){var e=this.ybase+this.y-this.ydisp;return e>=0&&e<this._rows},enumerable:!1,configurable:!0}),e.prototype._getCorrectBufferLength=function(e){if(!this._hasScrollback)return e;var r=e+this._optionsService.options.scrollback;return r>t.MAX_BUFFER_SIZE?t.MAX_BUFFER_SIZE:r},e.prototype.fillViewportRows=function(e){if(0===this.lines.length){void 0===e&&(e=n.DEFAULT_ATTR_DATA);for(var t=this._rows;t--;)this.lines.push(this.getBlankLine(e))}},e.prototype.clear=function(){this.ydisp=0,this.ybase=0,this.y=0,this.x=0,this.lines=new i.CircularList(this._getCorrectBufferLength(this._rows)),this.scrollTop=0,this.scrollBottom=this._rows-1,this.setupTabStops()},e.prototype.resize=function(e,t){var r=this.getNullCell(n.DEFAULT_ATTR_DATA),i=this._getCorrectBufferLength(t);if(i>this.lines.maxLength&&(this.lines.maxLength=i),this.lines.length>0){if(this._cols<e)for(var o=0;o<this.lines.length;o++)this.lines.get(o).resize(e,r);var s=0;if(this._rows<t)for(var a=this._rows;a<t;a++)this.lines.length<t+this.ybase&&(this._optionsService.options.windowsMode?this.lines.push(new n.BufferLine(e,r)):this.ybase>0&&this.lines.length<=this.ybase+this.y+s+1?(this.ybase--,s++,this.ydisp>0&&this.ydisp--):this.lines.push(new n.BufferLine(e,r)));else for(a=this._rows;a>t;a--)this.lines.length>t+this.ybase&&(this.lines.length>this.ybase+this.y+1?this.lines.pop():(this.ybase++,this.ydisp++));if(i<this.lines.maxLength){var c=this.lines.length-i;c>0&&(this.lines.trimStart(c),this.ybase=Math.max(this.ybase-c,0),this.ydisp=Math.max(this.ydisp-c,0),this.savedY=Math.max(this.savedY-c,0)),this.lines.maxLength=i}this.x=Math.min(this.x,e-1),this.y=Math.min(this.y,t-1),s&&(this.y+=s),this.savedX=Math.min(this.savedX,e-1),this.scrollTop=0}if(this.scrollBottom=t-1,this._isReflowEnabled&&(this._reflow(e,t),this._cols>e))for(o=0;o<this.lines.length;o++)this.lines.get(o).resize(e,r);this._cols=e,this._rows=t},Object.defineProperty(e.prototype,"_isReflowEnabled",{get:function(){return this._hasScrollback&&!this._optionsService.options.windowsMode},enumerable:!1,configurable:!0}),e.prototype._reflow=function(e,t){this._cols!==e&&(e>this._cols?this._reflowLarger(e,t):this._reflowSmaller(e,t))},e.prototype._reflowLarger=function(e,t){var r=a.reflowLargerGetLinesToRemove(this.lines,this._cols,e,this.ybase+this.y,this.getNullCell(n.DEFAULT_ATTR_DATA));if(r.length>0){var i=a.reflowLargerCreateNewLayout(this.lines,r);a.reflowLargerApplyNewLayout(this.lines,i.layout),this._reflowLargerAdjustViewport(e,t,i.countRemoved)}},e.prototype._reflowLargerAdjustViewport=function(e,t,r){for(var i=this.getNullCell(n.DEFAULT_ATTR_DATA),o=r;o-- >0;)0===this.ybase?(this.y>0&&this.y--,this.lines.length<t&&this.lines.push(new n.BufferLine(e,i))):(this.ydisp===this.ybase&&this.ydisp--,this.ybase--);this.savedY=Math.max(this.savedY-r,0)},e.prototype._reflowSmaller=function(e,t){for(var r=this.getNullCell(n.DEFAULT_ATTR_DATA),i=[],o=0,s=this.lines.length-1;s>=0;s--){var c=this.lines.get(s);if(!(!c||!c.isWrapped&&c.getTrimmedLength()<=e)){for(var l=[c];c.isWrapped&&s>0;)c=this.lines.get(--s),l.unshift(c);var h=this.ybase+this.y;if(!(h>=s&&h<s+l.length)){var u,f=l[l.length-1].getTrimmedLength(),_=a.reflowSmallerGetNewLineLengths(l,this._cols,e),d=_.length-l.length;u=0===this.ybase&&this.y!==this.lines.length-1?Math.max(0,this.y-this.lines.maxLength+d):Math.max(0,this.lines.length-this.lines.maxLength+d);for(var p=[],v=0;v<d;v++){var g=this.getBlankLine(n.DEFAULT_ATTR_DATA,!0);p.push(g)}p.length>0&&(i.push({start:s+l.length+o,newLines:p}),o+=p.length),l.push.apply(l,p);var y=_.length-1,b=_[y];0===b&&(b=_[--y]);for(var S=l.length-d-1,m=f;S>=0;){var C=Math.min(m,b);if(l[y].copyCellsFrom(l[S],m-C,b-C,C,!0),0==(b-=C)&&(b=_[--y]),0==(m-=C)){S--;var w=Math.max(S,0);m=a.getWrappedLineTrimmedLength(l,w,this._cols)}}for(v=0;v<l.length;v++)_[v]<e&&l[v].setCell(_[v],r);for(var E=d-u;E-- >0;)0===this.ybase?this.y<t-1?(this.y++,this.lines.pop()):(this.ybase++,this.ydisp++):this.ybase<Math.min(this.lines.maxLength,this.lines.length+o)-t&&(this.ybase===this.ydisp&&this.ydisp++,this.ybase++);this.savedY=Math.min(this.savedY+d,this.ybase+t-1)}}}if(i.length>0){var L=[],A=[];for(v=0;v<this.lines.length;v++)A.push(this.lines.get(v));var R=this.lines.length,k=R-1,x=0,D=i[x];this.lines.length=Math.min(this.lines.maxLength,this.lines.length+o);var T=0;for(v=Math.min(this.lines.maxLength-1,R+o-1);v>=0;v--)if(D&&D.start>k+T){for(var O=D.newLines.length-1;O>=0;O--)this.lines.set(v--,D.newLines[O]);v++,L.push({index:k+1,amount:D.newLines.length}),T+=D.newLines.length,D=i[++x]}else this.lines.set(v,A[k--]);var M=0;for(v=L.length-1;v>=0;v--)L[v].index+=M,this.lines.onInsertEmitter.fire(L[v]),M+=L[v].amount;var P=Math.max(0,R+o-this.lines.maxLength);P>0&&this.lines.onTrimEmitter.fire(P)}},e.prototype.stringIndexToBufferIndex=function(e,t,r){for(void 0===r&&(r=!1);t;){var i=this.lines.get(e);if(!i)return[-1,-1];for(var n=r?i.getTrimmedLength():i.length,o=0;o<n;++o)if(i.get(o)[s.CHAR_DATA_WIDTH_INDEX]&&(t-=i.get(o)[s.CHAR_DATA_CHAR_INDEX].length||1),t<0)return[e,o];e++}return[e,0]},e.prototype.translateBufferLineToString=function(e,t,r,i){void 0===r&&(r=0);var n=this.lines.get(e);return n?n.translateToString(t,r,i):""},e.prototype.getWrappedRangeForLine=function(e){for(var t=e,r=e;t>0&&this.lines.get(t).isWrapped;)t--;for(;r+1<this.lines.length&&this.lines.get(r+1).isWrapped;)r++;return{first:t,last:r}},e.prototype.setupTabStops=function(e){for(null!=e?this.tabs[e]||(e=this.prevStop(e)):(this.tabs={},e=0);e<this._cols;e+=this._optionsService.options.tabStopWidth)this.tabs[e]=!0},e.prototype.prevStop=function(e){for(null==e&&(e=this.x);!this.tabs[--e]&&e>0;);return e>=this._cols?this._cols-1:e<0?0:e},e.prototype.nextStop=function(e){for(null==e&&(e=this.x);!this.tabs[++e]&&e<this._cols;);return e>=this._cols?this._cols-1:e<0?0:e},e.prototype.addMarker=function(e){var t=this,r=new c.Marker(e);return this.markers.push(r),r.register(this.lines.onTrim((function(e){r.line-=e,r.line<0&&r.dispose()}))),r.register(this.lines.onInsert((function(e){r.line>=e.index&&(r.line+=e.amount)}))),r.register(this.lines.onDelete((function(e){r.line>=e.index&&r.line<e.index+e.amount&&r.dispose(),r.line>e.index&&(r.line-=e.amount)}))),r.register(r.onDispose((function(){return t._removeMarker(r)}))),r},e.prototype._removeMarker=function(e){this.markers.splice(this.markers.indexOf(e),1)},e.prototype.iterator=function(e,t,r,i,n){return new f(this,e,t,r,i,n)},e}();t.Buffer=u;var f=function(){function e(e,t,r,i,n,o){void 0===r&&(r=0),void 0===i&&(i=e.lines.length),void 0===n&&(n=0),void 0===o&&(o=0),this._buffer=e,this._trimRight=t,this._startIndex=r,this._endIndex=i,this._startOverscan=n,this._endOverscan=o,this._startIndex<0&&(this._startIndex=0),this._endIndex>this._buffer.lines.length&&(this._endIndex=this._buffer.lines.length),this._current=this._startIndex}return e.prototype.hasNext=function(){return this._current<this._endIndex},e.prototype.next=function(){var e=this._buffer.getWrappedRangeForLine(this._current);e.first<this._startIndex-this._startOverscan&&(e.first=this._startIndex-this._startOverscan),e.last>this._endIndex+this._endOverscan&&(e.last=this._endIndex+this._endOverscan),e.first=Math.max(e.first,0),e.last=Math.min(e.last,this._buffer.lines.length);for(var t="",r=e.first;r<=e.last;++r)t+=this._buffer.translateBufferLineToString(r,this._trimRight);return this._current=e.last+1,{range:e,content:t}},e}();t.BufferStringIterator=f},8437:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.BufferLine=t.DEFAULT_ATTR_DATA=void 0;var i=r(482),n=r(643),o=r(511),s=r(3734);t.DEFAULT_ATTR_DATA=Object.freeze(new s.AttributeData);var a=function(){function e(e,t,r){void 0===r&&(r=!1),this.isWrapped=r,this._combined={},this._extendedAttrs={},this._data=new Uint32Array(3*e);for(var i=t||o.CellData.fromCharData([0,n.NULL_CELL_CHAR,n.NULL_CELL_WIDTH,n.NULL_CELL_CODE]),s=0;s<e;++s)this.setCell(s,i);this.length=e}return e.prototype.get=function(e){var t=this._data[3*e+0],r=2097151&t;return[this._data[3*e+1],2097152&t?this._combined[e]:r?i.stringFromCodePoint(r):"",t>>22,2097152&t?this._combined[e].charCodeAt(this._combined[e].length-1):r]},e.prototype.set=function(e,t){this._data[3*e+1]=t[n.CHAR_DATA_ATTR_INDEX],t[n.CHAR_DATA_CHAR_INDEX].length>1?(this._combined[e]=t[1],this._data[3*e+0]=2097152|e|t[n.CHAR_DATA_WIDTH_INDEX]<<22):this._data[3*e+0]=t[n.CHAR_DATA_CHAR_INDEX].charCodeAt(0)|t[n.CHAR_DATA_WIDTH_INDEX]<<22},e.prototype.getWidth=function(e){return this._data[3*e+0]>>22},e.prototype.hasWidth=function(e){return 12582912&this._data[3*e+0]},e.prototype.getFg=function(e){return this._data[3*e+1]},e.prototype.getBg=function(e){return this._data[3*e+2]},e.prototype.hasContent=function(e){return 4194303&this._data[3*e+0]},e.prototype.getCodePoint=function(e){var t=this._data[3*e+0];return 2097152&t?this._combined[e].charCodeAt(this._combined[e].length-1):2097151&t},e.prototype.isCombined=function(e){return 2097152&this._data[3*e+0]},e.prototype.getString=function(e){var t=this._data[3*e+0];return 2097152&t?this._combined[e]:2097151&t?i.stringFromCodePoint(2097151&t):""},e.prototype.loadCell=function(e,t){var r=3*e;return t.content=this._data[r+0],t.fg=this._data[r+1],t.bg=this._data[r+2],2097152&t.content&&(t.combinedData=this._combined[e]),268435456&t.bg&&(t.extended=this._extendedAttrs[e]),t},e.prototype.setCell=function(e,t){2097152&t.content&&(this._combined[e]=t.combinedData),268435456&t.bg&&(this._extendedAttrs[e]=t.extended),this._data[3*e+0]=t.content,this._data[3*e+1]=t.fg,this._data[3*e+2]=t.bg},e.prototype.setCellFromCodePoint=function(e,t,r,i,n,o){268435456&n&&(this._extendedAttrs[e]=o),this._data[3*e+0]=t|r<<22,this._data[3*e+1]=i,this._data[3*e+2]=n},e.prototype.addCodepointToCell=function(e,t){var r=this._data[3*e+0];2097152&r?this._combined[e]+=i.stringFromCodePoint(t):(2097151&r?(this._combined[e]=i.stringFromCodePoint(2097151&r)+i.stringFromCodePoint(t),r&=-2097152,r|=2097152):r=t|1<<22,this._data[3*e+0]=r)},e.prototype.insertCells=function(e,t,r,i){if((e%=this.length)&&2===this.getWidth(e-1)&&this.setCellFromCodePoint(e-1,0,1,(null==i?void 0:i.fg)||0,(null==i?void 0:i.bg)||0,(null==i?void 0:i.extended)||new s.ExtendedAttrs),t<this.length-e){for(var n=new o.CellData,a=this.length-e-t-1;a>=0;--a)this.setCell(e+t+a,this.loadCell(e+a,n));for(a=0;a<t;++a)this.setCell(e+a,r)}else for(a=e;a<this.length;++a)this.setCell(a,r);2===this.getWidth(this.length-1)&&this.setCellFromCodePoint(this.length-1,0,1,(null==i?void 0:i.fg)||0,(null==i?void 0:i.bg)||0,(null==i?void 0:i.extended)||new s.ExtendedAttrs)},e.prototype.deleteCells=function(e,t,r,i){if(e%=this.length,t<this.length-e){for(var n=new o.CellData,a=0;a<this.length-e-t;++a)this.setCell(e+a,this.loadCell(e+t+a,n));for(a=this.length-t;a<this.length;++a)this.setCell(a,r)}else for(a=e;a<this.length;++a)this.setCell(a,r);e&&2===this.getWidth(e-1)&&this.setCellFromCodePoint(e-1,0,1,(null==i?void 0:i.fg)||0,(null==i?void 0:i.bg)||0,(null==i?void 0:i.extended)||new s.ExtendedAttrs),0!==this.getWidth(e)||this.hasContent(e)||this.setCellFromCodePoint(e,0,1,(null==i?void 0:i.fg)||0,(null==i?void 0:i.bg)||0,(null==i?void 0:i.extended)||new s.ExtendedAttrs)},e.prototype.replaceCells=function(e,t,r,i){for(e&&2===this.getWidth(e-1)&&this.setCellFromCodePoint(e-1,0,1,(null==i?void 0:i.fg)||0,(null==i?void 0:i.bg)||0,(null==i?void 0:i.extended)||new s.ExtendedAttrs),t<this.length&&2===this.getWidth(t-1)&&this.setCellFromCodePoint(t,0,1,(null==i?void 0:i.fg)||0,(null==i?void 0:i.bg)||0,(null==i?void 0:i.extended)||new s.ExtendedAttrs);e<t&&e<this.length;)this.setCell(e++,r)},e.prototype.resize=function(e,t){if(e!==this.length){if(e>this.length){var r=new Uint32Array(3*e);this.length&&(3*e<this._data.length?r.set(this._data.subarray(0,3*e)):r.set(this._data)),this._data=r;for(var i=this.length;i<e;++i)this.setCell(i,t)}else if(e){(r=new Uint32Array(3*e)).set(this._data.subarray(0,3*e)),this._data=r;var n=Object.keys(this._combined);for(i=0;i<n.length;i++){var o=parseInt(n[i],10);o>=e&&delete this._combined[o]}}else this._data=new Uint32Array(0),this._combined={};this.length=e}},e.prototype.fill=function(e){this._combined={},this._extendedAttrs={};for(var t=0;t<this.length;++t)this.setCell(t,e)},e.prototype.copyFrom=function(e){for(var t in this.length!==e.length?this._data=new Uint32Array(e._data):this._data.set(e._data),this.length=e.length,this._combined={},e._combined)this._combined[t]=e._combined[t];for(var t in this._extendedAttrs={},e._extendedAttrs)this._extendedAttrs[t]=e._extendedAttrs[t];this.isWrapped=e.isWrapped},e.prototype.clone=function(){var t=new e(0);for(var r in t._data=new Uint32Array(this._data),t.length=this.length,this._combined)t._combined[r]=this._combined[r];for(var r in this._extendedAttrs)t._extendedAttrs[r]=this._extendedAttrs[r];return t.isWrapped=this.isWrapped,t},e.prototype.getTrimmedLength=function(){for(var e=this.length-1;e>=0;--e)if(4194303&this._data[3*e+0])return e+(this._data[3*e+0]>>22);return 0},e.prototype.copyCellsFrom=function(e,t,r,i,n){var o=e._data;if(n)for(var s=i-1;s>=0;s--)for(var a=0;a<3;a++)this._data[3*(r+s)+a]=o[3*(t+s)+a];else for(s=0;s<i;s++)for(a=0;a<3;a++)this._data[3*(r+s)+a]=o[3*(t+s)+a];var c=Object.keys(e._combined);for(a=0;a<c.length;a++){var l=parseInt(c[a],10);l>=t&&(this._combined[l-t+r]=e._combined[l])}},e.prototype.translateToString=function(e,t,r){void 0===e&&(e=!1),void 0===t&&(t=0),void 0===r&&(r=this.length),e&&(r=Math.min(r,this.getTrimmedLength()));for(var o="";t<r;){var s=this._data[3*t+0],a=2097151&s;o+=2097152&s?this._combined[t]:a?i.stringFromCodePoint(a):n.WHITESPACE_CELL_CHAR,t+=s>>22||1}return o},e}();t.BufferLine=a},4634:(e,t)=>{function r(e,t,r){if(t===e.length-1)return e[t].getTrimmedLength();var i=!e[t].hasContent(r-1)&&1===e[t].getWidth(r-1),n=2===e[t+1].getWidth(0);return i&&n?r-1:r}Object.defineProperty(t,"__esModule",{value:!0}),t.getWrappedLineTrimmedLength=t.reflowSmallerGetNewLineLengths=t.reflowLargerApplyNewLayout=t.reflowLargerCreateNewLayout=t.reflowLargerGetLinesToRemove=void 0,t.reflowLargerGetLinesToRemove=function(e,t,i,n,o){for(var s=[],a=0;a<e.length-1;a++){var c=a,l=e.get(++c);if(l.isWrapped){for(var h=[e.get(a)];c<e.length&&l.isWrapped;)h.push(l),l=e.get(++c);if(n>=a&&n<c)a+=h.length-1;else{for(var u=0,f=r(h,u,t),_=1,d=0;_<h.length;){var p=r(h,_,t),v=p-d,g=i-f,y=Math.min(v,g);h[u].copyCellsFrom(h[_],d,f,y,!1),(f+=y)===i&&(u++,f=0),(d+=y)===p&&(_++,d=0),0===f&&0!==u&&2===h[u-1].getWidth(i-1)&&(h[u].copyCellsFrom(h[u-1],i-1,f++,1,!1),h[u-1].setCell(i-1,o))}h[u].replaceCells(f,i,o);for(var b=0,S=h.length-1;S>0&&(S>u||0===h[S].getTrimmedLength());S--)b++;b>0&&(s.push(a+h.length-b),s.push(b)),a+=h.length-1}}}return s},t.reflowLargerCreateNewLayout=function(e,t){for(var r=[],i=0,n=t[i],o=0,s=0;s<e.length;s++)if(n===s){var a=t[++i];e.onDeleteEmitter.fire({index:s-o,amount:a}),s+=a-1,o+=a,n=t[++i]}else r.push(s);return{layout:r,countRemoved:o}},t.reflowLargerApplyNewLayout=function(e,t){for(var r=[],i=0;i<t.length;i++)r.push(e.get(t[i]));for(i=0;i<r.length;i++)e.set(i,r[i]);e.length=t.length},t.reflowSmallerGetNewLineLengths=function(e,t,i){for(var n=[],o=e.map((function(i,n){return r(e,n,t)})).reduce((function(e,t){return e+t})),s=0,a=0,c=0;c<o;){if(o-c<i){n.push(o-c);break}s+=i;var l=r(e,a,t);s>l&&(s-=l,a++);var h=2===e[a].getWidth(s-1);h&&s--;var u=h?i-1:i;n.push(u),c+=u}return n},t.getWrappedLineTrimmedLength=r},5295:function(e,t,r){var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0}),t.BufferSet=void 0;var o=r(9092),s=r(8460),a=function(e){function t(t,r){var i=e.call(this)||this;return i._optionsService=t,i._bufferService=r,i._onBufferActivate=i.register(new s.EventEmitter),i.reset(),i}return n(t,e),Object.defineProperty(t.prototype,"onBufferActivate",{get:function(){return this._onBufferActivate.event},enumerable:!1,configurable:!0}),t.prototype.reset=function(){this._normal=new o.Buffer(!0,this._optionsService,this._bufferService),this._normal.fillViewportRows(),this._alt=new o.Buffer(!1,this._optionsService,this._bufferService),this._activeBuffer=this._normal,this.setupTabStops()},Object.defineProperty(t.prototype,"alt",{get:function(){return this._alt},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"active",{get:function(){return this._activeBuffer},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"normal",{get:function(){return this._normal},enumerable:!1,configurable:!0}),t.prototype.activateNormalBuffer=function(){this._activeBuffer!==this._normal&&(this._normal.x=this._alt.x,this._normal.y=this._alt.y,this._alt.clear(),this._activeBuffer=this._normal,this._onBufferActivate.fire({activeBuffer:this._normal,inactiveBuffer:this._alt}))},t.prototype.activateAltBuffer=function(e){this._activeBuffer!==this._alt&&(this._alt.fillViewportRows(e),this._alt.x=this._normal.x,this._alt.y=this._normal.y,this._activeBuffer=this._alt,this._onBufferActivate.fire({activeBuffer:this._alt,inactiveBuffer:this._normal}))},t.prototype.resize=function(e,t){this._normal.resize(e,t),this._alt.resize(e,t)},t.prototype.setupTabStops=function(e){this._normal.setupTabStops(e),this._alt.setupTabStops(e)},t}(r(844).Disposable);t.BufferSet=a},511:function(e,t,r){var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0}),t.CellData=void 0;var o=r(482),s=r(643),a=r(3734),c=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.content=0,t.fg=0,t.bg=0,t.extended=new a.ExtendedAttrs,t.combinedData="",t}return n(t,e),t.fromCharData=function(e){var r=new t;return r.setFromCharData(e),r},t.prototype.isCombined=function(){return 2097152&this.content},t.prototype.getWidth=function(){return this.content>>22},t.prototype.getChars=function(){return 2097152&this.content?this.combinedData:2097151&this.content?o.stringFromCodePoint(2097151&this.content):""},t.prototype.getCode=function(){return this.isCombined()?this.combinedData.charCodeAt(this.combinedData.length-1):2097151&this.content},t.prototype.setFromCharData=function(e){this.fg=e[s.CHAR_DATA_ATTR_INDEX],this.bg=0;var t=!1;if(e[s.CHAR_DATA_CHAR_INDEX].length>2)t=!0;else if(2===e[s.CHAR_DATA_CHAR_INDEX].length){var r=e[s.CHAR_DATA_CHAR_INDEX].charCodeAt(0);if(55296<=r&&r<=56319){var i=e[s.CHAR_DATA_CHAR_INDEX].charCodeAt(1);56320<=i&&i<=57343?this.content=1024*(r-55296)+i-56320+65536|e[s.CHAR_DATA_WIDTH_INDEX]<<22:t=!0}else t=!0}else this.content=e[s.CHAR_DATA_CHAR_INDEX].charCodeAt(0)|e[s.CHAR_DATA_WIDTH_INDEX]<<22;t&&(this.combinedData=e[s.CHAR_DATA_CHAR_INDEX],this.content=2097152|e[s.CHAR_DATA_WIDTH_INDEX]<<22)},t.prototype.getAsCharData=function(){return[this.fg,this.getChars(),this.getWidth(),this.getCode()]},t}(a.AttributeData);t.CellData=c},643:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.WHITESPACE_CELL_CODE=t.WHITESPACE_CELL_WIDTH=t.WHITESPACE_CELL_CHAR=t.NULL_CELL_CODE=t.NULL_CELL_WIDTH=t.NULL_CELL_CHAR=t.CHAR_DATA_CODE_INDEX=t.CHAR_DATA_WIDTH_INDEX=t.CHAR_DATA_CHAR_INDEX=t.CHAR_DATA_ATTR_INDEX=t.DEFAULT_ATTR=t.DEFAULT_COLOR=void 0,t.DEFAULT_COLOR=256,t.DEFAULT_ATTR=256|t.DEFAULT_COLOR<<9,t.CHAR_DATA_ATTR_INDEX=0,t.CHAR_DATA_CHAR_INDEX=1,t.CHAR_DATA_WIDTH_INDEX=2,t.CHAR_DATA_CODE_INDEX=3,t.NULL_CELL_CHAR="",t.NULL_CELL_WIDTH=1,t.NULL_CELL_CODE=0,t.WHITESPACE_CELL_CHAR=" ",t.WHITESPACE_CELL_WIDTH=1,t.WHITESPACE_CELL_CODE=32},4863:function(e,t,r){var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0}),t.Marker=void 0;var o=r(8460),s=function(e){function t(r){var i=e.call(this)||this;return i.line=r,i._id=t._nextId++,i.isDisposed=!1,i._onDispose=new o.EventEmitter,i}return n(t,e),Object.defineProperty(t.prototype,"id",{get:function(){return this._id},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onDispose",{get:function(){return this._onDispose.event},enumerable:!1,configurable:!0}),t.prototype.dispose=function(){this.isDisposed||(this.isDisposed=!0,this.line=-1,this._onDispose.fire(),e.prototype.dispose.call(this))},t._nextId=1,t}(r(844).Disposable);t.Marker=s},7116:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.DEFAULT_CHARSET=t.CHARSETS=void 0,t.CHARSETS={},t.DEFAULT_CHARSET=t.CHARSETS.B,t.CHARSETS[0]={"`":"◆",a:"▒",b:"␉",c:"␌",d:"␍",e:"␊",f:"°",g:"±",h:"␤",i:"␋",j:"┘",k:"┐",l:"┌",m:"└",n:"┼",o:"⎺",p:"⎻",q:"─",r:"⎼",s:"⎽",t:"├",u:"┤",v:"┴",w:"┬",x:"│",y:"≤",z:"≥","{":"π","|":"≠","}":"£","~":"·"},t.CHARSETS.A={"#":"£"},t.CHARSETS.B=void 0,t.CHARSETS[4]={"#":"£","@":"¾","[":"ij","\\":"½","]":"|","{":"¨","|":"f","}":"¼","~":"´"},t.CHARSETS.C=t.CHARSETS[5]={"[":"Ä","\\":"Ö","]":"Å","^":"Ü","`":"é","{":"ä","|":"ö","}":"å","~":"ü"},t.CHARSETS.R={"#":"£","@":"à","[":"°","\\":"ç","]":"§","{":"é","|":"ù","}":"è","~":"¨"},t.CHARSETS.Q={"@":"à","[":"â","\\":"ç","]":"ê","^":"î","`":"ô","{":"é","|":"ù","}":"è","~":"û"},t.CHARSETS.K={"@":"§","[":"Ä","\\":"Ö","]":"Ü","{":"ä","|":"ö","}":"ü","~":"ß"},t.CHARSETS.Y={"#":"£","@":"§","[":"°","\\":"ç","]":"é","`":"ù","{":"à","|":"ò","}":"è","~":"ì"},t.CHARSETS.E=t.CHARSETS[6]={"@":"Ä","[":"Æ","\\":"Ø","]":"Å","^":"Ü","`":"ä","{":"æ","|":"ø","}":"å","~":"ü"},t.CHARSETS.Z={"#":"£","@":"§","[":"¡","\\":"Ñ","]":"¿","{":"°","|":"ñ","}":"ç"},t.CHARSETS.H=t.CHARSETS[7]={"@":"É","[":"Ä","\\":"Ö","]":"Å","^":"Ü","`":"é","{":"ä","|":"ö","}":"å","~":"ü"},t.CHARSETS["="]={"#":"ù","@":"à","[":"é","\\":"ç","]":"ê","^":"î",_:"è","`":"ô","{":"ä","|":"ö","}":"ü","~":"û"}},2584:(e,t)=>{var r,i;Object.defineProperty(t,"__esModule",{value:!0}),t.C1=t.C0=void 0,(i=t.C0||(t.C0={})).NUL="\0",i.SOH="",i.STX="",i.ETX="",i.EOT="",i.ENQ="",i.ACK="",i.BEL="",i.BS="\b",i.HT="\t",i.LF="\n",i.VT="\v",i.FF="\f",i.CR="\r",i.SO="",i.SI="",i.DLE="",i.DC1="",i.DC2="",i.DC3="",i.DC4="",i.NAK="",i.SYN="",i.ETB="",i.CAN="",i.EM="",i.SUB="",i.ESC="",i.FS="",i.GS="",i.RS="",i.US="",i.SP=" ",i.DEL="",(r=t.C1||(t.C1={})).PAD="",r.HOP="",r.BPH="",r.NBH="",r.IND="",r.NEL="",r.SSA="",r.ESA="",r.HTS="",r.HTJ="",r.VTS="",r.PLD="",r.PLU="",r.RI="",r.SS2="",r.SS3="",r.DCS="",r.PU1="",r.PU2="",r.STS="",r.CCH="",r.MW="",r.SPA="",r.EPA="",r.SOS="",r.SGCI="",r.SCI="",r.CSI="",r.ST="",r.OSC="",r.PM="",r.APC=""},7399:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.evaluateKeyboardEvent=void 0;var i=r(2584),n={48:["0",")"],49:["1","!"],50:["2","@"],51:["3","#"],52:["4","$"],53:["5","%"],54:["6","^"],55:["7","&"],56:["8","*"],57:["9","("],186:[";",":"],187:["=","+"],188:[",","<"],189:["-","_"],190:[".",">"],191:["/","?"],192:["`","~"],219:["[","{"],220:["\\","|"],221:["]","}"],222:["'",'"']};t.evaluateKeyboardEvent=function(e,t,r,o){var s={type:0,cancel:!1,key:void 0},a=(e.shiftKey?1:0)|(e.altKey?2:0)|(e.ctrlKey?4:0)|(e.metaKey?8:0);switch(e.keyCode){case 0:"UIKeyInputUpArrow"===e.key?s.key=t?i.C0.ESC+"OA":i.C0.ESC+"[A":"UIKeyInputLeftArrow"===e.key?s.key=t?i.C0.ESC+"OD":i.C0.ESC+"[D":"UIKeyInputRightArrow"===e.key?s.key=t?i.C0.ESC+"OC":i.C0.ESC+"[C":"UIKeyInputDownArrow"===e.key&&(s.key=t?i.C0.ESC+"OB":i.C0.ESC+"[B");break;case 8:if(e.shiftKey){s.key=i.C0.BS;break}if(e.altKey){s.key=i.C0.ESC+i.C0.DEL;break}s.key=i.C0.DEL;break;case 9:if(e.shiftKey){s.key=i.C0.ESC+"[Z";break}s.key=i.C0.HT,s.cancel=!0;break;case 13:s.key=e.altKey?i.C0.ESC+i.C0.CR:i.C0.CR,s.cancel=!0;break;case 27:s.key=i.C0.ESC,e.altKey&&(s.key=i.C0.ESC+i.C0.ESC),s.cancel=!0;break;case 37:if(e.metaKey)break;a?(s.key=i.C0.ESC+"[1;"+(a+1)+"D",s.key===i.C0.ESC+"[1;3D"&&(s.key=i.C0.ESC+(r?"b":"[1;5D"))):s.key=t?i.C0.ESC+"OD":i.C0.ESC+"[D";break;case 39:if(e.metaKey)break;a?(s.key=i.C0.ESC+"[1;"+(a+1)+"C",s.key===i.C0.ESC+"[1;3C"&&(s.key=i.C0.ESC+(r?"f":"[1;5C"))):s.key=t?i.C0.ESC+"OC":i.C0.ESC+"[C";break;case 38:if(e.metaKey)break;a?(s.key=i.C0.ESC+"[1;"+(a+1)+"A",r||s.key!==i.C0.ESC+"[1;3A"||(s.key=i.C0.ESC+"[1;5A")):s.key=t?i.C0.ESC+"OA":i.C0.ESC+"[A";break;case 40:if(e.metaKey)break;a?(s.key=i.C0.ESC+"[1;"+(a+1)+"B",r||s.key!==i.C0.ESC+"[1;3B"||(s.key=i.C0.ESC+"[1;5B")):s.key=t?i.C0.ESC+"OB":i.C0.ESC+"[B";break;case 45:e.shiftKey||e.ctrlKey||(s.key=i.C0.ESC+"[2~");break;case 46:s.key=a?i.C0.ESC+"[3;"+(a+1)+"~":i.C0.ESC+"[3~";break;case 36:s.key=a?i.C0.ESC+"[1;"+(a+1)+"H":t?i.C0.ESC+"OH":i.C0.ESC+"[H";break;case 35:s.key=a?i.C0.ESC+"[1;"+(a+1)+"F":t?i.C0.ESC+"OF":i.C0.ESC+"[F";break;case 33:e.shiftKey?s.type=2:s.key=i.C0.ESC+"[5~";break;case 34:e.shiftKey?s.type=3:s.key=i.C0.ESC+"[6~";break;case 112:s.key=a?i.C0.ESC+"[1;"+(a+1)+"P":i.C0.ESC+"OP";break;case 113:s.key=a?i.C0.ESC+"[1;"+(a+1)+"Q":i.C0.ESC+"OQ";break;case 114:s.key=a?i.C0.ESC+"[1;"+(a+1)+"R":i.C0.ESC+"OR";break;case 115:s.key=a?i.C0.ESC+"[1;"+(a+1)+"S":i.C0.ESC+"OS";break;case 116:s.key=a?i.C0.ESC+"[15;"+(a+1)+"~":i.C0.ESC+"[15~";break;case 117:s.key=a?i.C0.ESC+"[17;"+(a+1)+"~":i.C0.ESC+"[17~";break;case 118:s.key=a?i.C0.ESC+"[18;"+(a+1)+"~":i.C0.ESC+"[18~";break;case 119:s.key=a?i.C0.ESC+"[19;"+(a+1)+"~":i.C0.ESC+"[19~";break;case 120:s.key=a?i.C0.ESC+"[20;"+(a+1)+"~":i.C0.ESC+"[20~";break;case 121:s.key=a?i.C0.ESC+"[21;"+(a+1)+"~":i.C0.ESC+"[21~";break;case 122:s.key=a?i.C0.ESC+"[23;"+(a+1)+"~":i.C0.ESC+"[23~";break;case 123:s.key=a?i.C0.ESC+"[24;"+(a+1)+"~":i.C0.ESC+"[24~";break;default:if(!e.ctrlKey||e.shiftKey||e.altKey||e.metaKey)if(r&&!o||!e.altKey||e.metaKey)!r||e.altKey||e.ctrlKey||e.shiftKey||!e.metaKey?e.key&&!e.ctrlKey&&!e.altKey&&!e.metaKey&&e.keyCode>=48&&1===e.key.length?s.key=e.key:e.key&&e.ctrlKey&&"_"===e.key&&(s.key=i.C0.US):65===e.keyCode&&(s.type=1);else{var c=n[e.keyCode],l=c&&c[e.shiftKey?1:0];if(l)s.key=i.C0.ESC+l;else if(e.keyCode>=65&&e.keyCode<=90){var h=e.ctrlKey?e.keyCode-64:e.keyCode+32;s.key=i.C0.ESC+String.fromCharCode(h)}}else e.keyCode>=65&&e.keyCode<=90?s.key=String.fromCharCode(e.keyCode-64):32===e.keyCode?s.key=i.C0.NUL:e.keyCode>=51&&e.keyCode<=55?s.key=String.fromCharCode(e.keyCode-51+27):56===e.keyCode?s.key=i.C0.DEL:219===e.keyCode?s.key=i.C0.ESC:220===e.keyCode?s.key=i.C0.FS:221===e.keyCode&&(s.key=i.C0.GS)}return s}},482:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Utf8ToUtf32=t.StringToUtf32=t.utf32ToString=t.stringFromCodePoint=void 0,t.stringFromCodePoint=function(e){return e>65535?(e-=65536,String.fromCharCode(55296+(e>>10))+String.fromCharCode(e%1024+56320)):String.fromCharCode(e)},t.utf32ToString=function(e,t,r){void 0===t&&(t=0),void 0===r&&(r=e.length);for(var i="",n=t;n<r;++n){var o=e[n];o>65535?(o-=65536,i+=String.fromCharCode(55296+(o>>10))+String.fromCharCode(o%1024+56320)):i+=String.fromCharCode(o)}return i};var r=function(){function e(){this._interim=0}return e.prototype.clear=function(){this._interim=0},e.prototype.decode=function(e,t){var r=e.length;if(!r)return 0;var i=0,n=0;this._interim&&(56320<=(a=e.charCodeAt(n++))&&a<=57343?t[i++]=1024*(this._interim-55296)+a-56320+65536:(t[i++]=this._interim,t[i++]=a),this._interim=0);for(var o=n;o<r;++o){var s=e.charCodeAt(o);if(55296<=s&&s<=56319){if(++o>=r)return this._interim=s,i;var a;56320<=(a=e.charCodeAt(o))&&a<=57343?t[i++]=1024*(s-55296)+a-56320+65536:(t[i++]=s,t[i++]=a)}else 65279!==s&&(t[i++]=s)}return i},e}();t.StringToUtf32=r;var i=function(){function e(){this.interim=new Uint8Array(3)}return e.prototype.clear=function(){this.interim.fill(0)},e.prototype.decode=function(e,t){var r=e.length;if(!r)return 0;var i,n,o,s,a=0,c=0,l=0;if(this.interim[0]){var h=!1,u=this.interim[0];u&=192==(224&u)?31:224==(240&u)?15:7;for(var f=0,_=void 0;(_=63&this.interim[++f])&&f<4;)u<<=6,u|=_;for(var d=192==(224&this.interim[0])?2:224==(240&this.interim[0])?3:4,p=d-f;l<p;){if(l>=r)return 0;if(128!=(192&(_=e[l++]))){l--,h=!0;break}this.interim[f++]=_,u<<=6,u|=63&_}h||(2===d?u<128?l--:t[a++]=u:3===d?u<2048||u>=55296&&u<=57343||65279===u||(t[a++]=u):u<65536||u>1114111||(t[a++]=u)),this.interim.fill(0)}for(var v=r-4,g=l;g<r;){for(;!(!(g<v)||128&(i=e[g])||128&(n=e[g+1])||128&(o=e[g+2])||128&(s=e[g+3]));)t[a++]=i,t[a++]=n,t[a++]=o,t[a++]=s,g+=4;if((i=e[g++])<128)t[a++]=i;else if(192==(224&i)){if(g>=r)return this.interim[0]=i,a;if(128!=(192&(n=e[g++]))){g--;continue}if((c=(31&i)<<6|63&n)<128){g--;continue}t[a++]=c}else if(224==(240&i)){if(g>=r)return this.interim[0]=i,a;if(128!=(192&(n=e[g++]))){g--;continue}if(g>=r)return this.interim[0]=i,this.interim[1]=n,a;if(128!=(192&(o=e[g++]))){g--;continue}if((c=(15&i)<<12|(63&n)<<6|63&o)<2048||c>=55296&&c<=57343||65279===c)continue;t[a++]=c}else if(240==(248&i)){if(g>=r)return this.interim[0]=i,a;if(128!=(192&(n=e[g++]))){g--;continue}if(g>=r)return this.interim[0]=i,this.interim[1]=n,a;if(128!=(192&(o=e[g++]))){g--;continue}if(g>=r)return this.interim[0]=i,this.interim[1]=n,this.interim[2]=o,a;if(128!=(192&(s=e[g++]))){g--;continue}if((c=(7&i)<<18|(63&n)<<12|(63&o)<<6|63&s)<65536||c>1114111)continue;t[a++]=c}}return a},e}();t.Utf8ToUtf32=i},225:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.UnicodeV6=void 0;var i,n=r(8273),o=[[768,879],[1155,1158],[1160,1161],[1425,1469],[1471,1471],[1473,1474],[1476,1477],[1479,1479],[1536,1539],[1552,1557],[1611,1630],[1648,1648],[1750,1764],[1767,1768],[1770,1773],[1807,1807],[1809,1809],[1840,1866],[1958,1968],[2027,2035],[2305,2306],[2364,2364],[2369,2376],[2381,2381],[2385,2388],[2402,2403],[2433,2433],[2492,2492],[2497,2500],[2509,2509],[2530,2531],[2561,2562],[2620,2620],[2625,2626],[2631,2632],[2635,2637],[2672,2673],[2689,2690],[2748,2748],[2753,2757],[2759,2760],[2765,2765],[2786,2787],[2817,2817],[2876,2876],[2879,2879],[2881,2883],[2893,2893],[2902,2902],[2946,2946],[3008,3008],[3021,3021],[3134,3136],[3142,3144],[3146,3149],[3157,3158],[3260,3260],[3263,3263],[3270,3270],[3276,3277],[3298,3299],[3393,3395],[3405,3405],[3530,3530],[3538,3540],[3542,3542],[3633,3633],[3636,3642],[3655,3662],[3761,3761],[3764,3769],[3771,3772],[3784,3789],[3864,3865],[3893,3893],[3895,3895],[3897,3897],[3953,3966],[3968,3972],[3974,3975],[3984,3991],[3993,4028],[4038,4038],[4141,4144],[4146,4146],[4150,4151],[4153,4153],[4184,4185],[4448,4607],[4959,4959],[5906,5908],[5938,5940],[5970,5971],[6002,6003],[6068,6069],[6071,6077],[6086,6086],[6089,6099],[6109,6109],[6155,6157],[6313,6313],[6432,6434],[6439,6440],[6450,6450],[6457,6459],[6679,6680],[6912,6915],[6964,6964],[6966,6970],[6972,6972],[6978,6978],[7019,7027],[7616,7626],[7678,7679],[8203,8207],[8234,8238],[8288,8291],[8298,8303],[8400,8431],[12330,12335],[12441,12442],[43014,43014],[43019,43019],[43045,43046],[64286,64286],[65024,65039],[65056,65059],[65279,65279],[65529,65531]],s=[[68097,68099],[68101,68102],[68108,68111],[68152,68154],[68159,68159],[119143,119145],[119155,119170],[119173,119179],[119210,119213],[119362,119364],[917505,917505],[917536,917631],[917760,917999]],a=function(){function e(){if(this.version="6",!i){i=new Uint8Array(65536),n.fill(i,1),i[0]=0,n.fill(i,0,1,32),n.fill(i,0,127,160),n.fill(i,2,4352,4448),i[9001]=2,i[9002]=2,n.fill(i,2,11904,42192),i[12351]=1,n.fill(i,2,44032,55204),n.fill(i,2,63744,64256),n.fill(i,2,65040,65050),n.fill(i,2,65072,65136),n.fill(i,2,65280,65377),n.fill(i,2,65504,65511);for(var e=0;e<o.length;++e)n.fill(i,0,o[e][0],o[e][1]+1)}}return e.prototype.wcwidth=function(e){return e<32?0:e<127?1:e<65536?i[e]:function(e,t){var r,i=0,n=t.length-1;if(e<t[0][0]||e>t[n][1])return!1;for(;n>=i;)if(e>t[r=i+n>>1][1])i=r+1;else{if(!(e<t[r][0]))return!0;n=r-1}return!1}(e,s)?0:e>=131072&&e<=196605||e>=196608&&e<=262141?2:1},e}();t.UnicodeV6=a},5981:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.WriteBuffer=void 0;var r=function(){function e(e){this._action=e,this._writeBuffer=[],this._callbacks=[],this._pendingData=0,this._bufferOffset=0}return e.prototype.writeSync=function(e){if(this._writeBuffer.length){for(var t=this._bufferOffset;t<this._writeBuffer.length;++t){var r=this._writeBuffer[t],i=this._callbacks[t];this._action(r),i&&i()}this._writeBuffer=[],this._callbacks=[],this._pendingData=0,this._bufferOffset=2147483647}this._action(e)},e.prototype.write=function(e,t){var r=this;if(this._pendingData>5e7)throw new Error("write data discarded, use flow control to avoid losing data");this._writeBuffer.length||(this._bufferOffset=0,setTimeout((function(){return r._innerWrite()}))),this._pendingData+=e.length,this._writeBuffer.push(e),this._callbacks.push(t)},e.prototype._innerWrite=function(){for(var e=this,t=Date.now();this._writeBuffer.length>this._bufferOffset;){var r=this._writeBuffer[this._bufferOffset],i=this._callbacks[this._bufferOffset];if(this._bufferOffset++,this._action(r),this._pendingData-=r.length,i&&i(),Date.now()-t>=12)break}this._writeBuffer.length>this._bufferOffset?(this._bufferOffset>50&&(this._writeBuffer=this._writeBuffer.slice(this._bufferOffset),this._callbacks=this._callbacks.slice(this._bufferOffset),this._bufferOffset=0),setTimeout((function(){return e._innerWrite()}),0)):(this._writeBuffer=[],this._callbacks=[],this._pendingData=0,this._bufferOffset=0)},e}();t.WriteBuffer=r},5770:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.PAYLOAD_LIMIT=void 0,t.PAYLOAD_LIMIT=1e7},6351:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.DcsHandler=t.DcsParser=void 0;var i=r(482),n=r(8742),o=r(5770),s=[],a=function(){function e(){this._handlers=Object.create(null),this._active=s,this._ident=0,this._handlerFb=function(){}}return e.prototype.dispose=function(){this._handlers=Object.create(null),this._handlerFb=function(){},this._active=s},e.prototype.registerHandler=function(e,t){void 0===this._handlers[e]&&(this._handlers[e]=[]);var r=this._handlers[e];return r.push(t),{dispose:function(){var e=r.indexOf(t);-1!==e&&r.splice(e,1)}}},e.prototype.clearHandler=function(e){this._handlers[e]&&delete this._handlers[e]},e.prototype.setHandlerFallback=function(e){this._handlerFb=e},e.prototype.reset=function(){this._active.length&&this.unhook(!1),this._active=s,this._ident=0},e.prototype.hook=function(e,t){if(this.reset(),this._ident=e,this._active=this._handlers[e]||s,this._active.length)for(var r=this._active.length-1;r>=0;r--)this._active[r].hook(t);else this._handlerFb(this._ident,"HOOK",t)},e.prototype.put=function(e,t,r){if(this._active.length)for(var n=this._active.length-1;n>=0;n--)this._active[n].put(e,t,r);else this._handlerFb(this._ident,"PUT",i.utf32ToString(e,t,r))},e.prototype.unhook=function(e){if(this._active.length){for(var t=this._active.length-1;t>=0&&!this._active[t].unhook(e);t--);for(t--;t>=0;t--)this._active[t].unhook(!1)}else this._handlerFb(this._ident,"UNHOOK",e);this._active=s,this._ident=0},e}();t.DcsParser=a;var c=new n.Params;c.addParam(0);var l=function(){function e(e){this._handler=e,this._data="",this._params=c,this._hitLimit=!1}return e.prototype.hook=function(e){this._params=e.length>1||e.params[0]?e.clone():c,this._data="",this._hitLimit=!1},e.prototype.put=function(e,t,r){this._hitLimit||(this._data+=i.utf32ToString(e,t,r),this._data.length>o.PAYLOAD_LIMIT&&(this._data="",this._hitLimit=!0))},e.prototype.unhook=function(e){var t=!1;return this._hitLimit?t=!1:e&&(t=this._handler(this._data,this._params)),this._params=c,this._data="",this._hitLimit=!1,t},e}();t.DcsHandler=l},2015:function(e,t,r){var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0}),t.EscapeSequenceParser=t.VT500_TRANSITION_TABLE=t.TransitionTable=void 0;var o=r(844),s=r(8273),a=r(8742),c=r(6242),l=r(6351),h=function(){function e(e){this.table=new Uint8Array(e)}return e.prototype.setDefault=function(e,t){s.fill(this.table,e<<4|t)},e.prototype.add=function(e,t,r,i){this.table[t<<8|e]=r<<4|i},e.prototype.addMany=function(e,t,r,i){for(var n=0;n<e.length;n++)this.table[t<<8|e[n]]=r<<4|i},e}();t.TransitionTable=h;var u=160;t.VT500_TRANSITION_TABLE=function(){var e=new h(4095),t=Array.apply(null,Array(256)).map((function(e,t){return t})),r=function(e,r){return t.slice(e,r)},i=r(32,127),n=r(0,24);n.push(25),n.push.apply(n,r(28,32));var o,s=r(0,14);for(o in e.setDefault(1,0),e.addMany(i,0,2,0),s)e.addMany([24,26,153,154],o,3,0),e.addMany(r(128,144),o,3,0),e.addMany(r(144,152),o,3,0),e.add(156,o,0,0),e.add(27,o,11,1),e.add(157,o,4,8),e.addMany([152,158,159],o,0,7),e.add(155,o,11,3),e.add(144,o,11,9);return e.addMany(n,0,3,0),e.addMany(n,1,3,1),e.add(127,1,0,1),e.addMany(n,8,0,8),e.addMany(n,3,3,3),e.add(127,3,0,3),e.addMany(n,4,3,4),e.add(127,4,0,4),e.addMany(n,6,3,6),e.addMany(n,5,3,5),e.add(127,5,0,5),e.addMany(n,2,3,2),e.add(127,2,0,2),e.add(93,1,4,8),e.addMany(i,8,5,8),e.add(127,8,5,8),e.addMany([156,27,24,26,7],8,6,0),e.addMany(r(28,32),8,0,8),e.addMany([88,94,95],1,0,7),e.addMany(i,7,0,7),e.addMany(n,7,0,7),e.add(156,7,0,0),e.add(127,7,0,7),e.add(91,1,11,3),e.addMany(r(64,127),3,7,0),e.addMany(r(48,60),3,8,4),e.addMany([60,61,62,63],3,9,4),e.addMany(r(48,60),4,8,4),e.addMany(r(64,127),4,7,0),e.addMany([60,61,62,63],4,0,6),e.addMany(r(32,64),6,0,6),e.add(127,6,0,6),e.addMany(r(64,127),6,0,0),e.addMany(r(32,48),3,9,5),e.addMany(r(32,48),5,9,5),e.addMany(r(48,64),5,0,6),e.addMany(r(64,127),5,7,0),e.addMany(r(32,48),4,9,5),e.addMany(r(32,48),1,9,2),e.addMany(r(32,48),2,9,2),e.addMany(r(48,127),2,10,0),e.addMany(r(48,80),1,10,0),e.addMany(r(81,88),1,10,0),e.addMany([89,90,92],1,10,0),e.addMany(r(96,127),1,10,0),e.add(80,1,11,9),e.addMany(n,9,0,9),e.add(127,9,0,9),e.addMany(r(28,32),9,0,9),e.addMany(r(32,48),9,9,12),e.addMany(r(48,60),9,8,10),e.addMany([60,61,62,63],9,9,10),e.addMany(n,11,0,11),e.addMany(r(32,128),11,0,11),e.addMany(r(28,32),11,0,11),e.addMany(n,10,0,10),e.add(127,10,0,10),e.addMany(r(28,32),10,0,10),e.addMany(r(48,60),10,8,10),e.addMany([60,61,62,63],10,0,11),e.addMany(r(32,48),10,9,12),e.addMany(n,12,0,12),e.add(127,12,0,12),e.addMany(r(28,32),12,0,12),e.addMany(r(32,48),12,9,12),e.addMany(r(48,64),12,0,11),e.addMany(r(64,127),12,12,13),e.addMany(r(64,127),10,12,13),e.addMany(r(64,127),9,12,13),e.addMany(n,13,13,13),e.addMany(i,13,13,13),e.add(127,13,0,13),e.addMany([27,156,24,26],13,14,0),e.add(u,0,2,0),e.add(u,8,5,8),e.add(u,6,0,6),e.add(u,11,0,11),e.add(u,13,13,13),e}();var f=function(e){function r(r){void 0===r&&(r=t.VT500_TRANSITION_TABLE);var i=e.call(this)||this;return i._transitions=r,i.initialState=0,i.currentState=i.initialState,i._params=new a.Params,i._params.addParam(0),i._collect=0,i.precedingCodepoint=0,i._printHandlerFb=function(e,t,r){},i._executeHandlerFb=function(e){},i._csiHandlerFb=function(e,t){},i._escHandlerFb=function(e){},i._errorHandlerFb=function(e){return e},i._printHandler=i._printHandlerFb,i._executeHandlers=Object.create(null),i._csiHandlers=Object.create(null),i._escHandlers=Object.create(null),i._oscParser=new c.OscParser,i._dcsParser=new l.DcsParser,i._errorHandler=i._errorHandlerFb,i.registerEscHandler({final:"\\"},(function(){return!0})),i}return n(r,e),r.prototype._identifier=function(e,t){void 0===t&&(t=[64,126]);var r=0;if(e.prefix){if(e.prefix.length>1)throw new Error("only one byte as prefix supported");if((r=e.prefix.charCodeAt(0))&&60>r||r>63)throw new Error("prefix must be in range 0x3c .. 0x3f")}if(e.intermediates){if(e.intermediates.length>2)throw new Error("only two bytes as intermediates are supported");for(var i=0;i<e.intermediates.length;++i){var n=e.intermediates.charCodeAt(i);if(32>n||n>47)throw new Error("intermediate must be in range 0x20 .. 0x2f");r<<=8,r|=n}}if(1!==e.final.length)throw new Error("final must be a single byte");var o=e.final.charCodeAt(0);if(t[0]>o||o>t[1])throw new Error("final must be in range "+t[0]+" .. "+t[1]);return(r<<=8)|o},r.prototype.identToString=function(e){for(var t=[];e;)t.push(String.fromCharCode(255&e)),e>>=8;return t.reverse().join("")},r.prototype.dispose=function(){this._csiHandlers=Object.create(null),this._executeHandlers=Object.create(null),this._escHandlers=Object.create(null),this._oscParser.dispose(),this._dcsParser.dispose()},r.prototype.setPrintHandler=function(e){this._printHandler=e},r.prototype.clearPrintHandler=function(){this._printHandler=this._printHandlerFb},r.prototype.registerEscHandler=function(e,t){var r=this._identifier(e,[48,126]);void 0===this._escHandlers[r]&&(this._escHandlers[r]=[]);var i=this._escHandlers[r];return i.push(t),{dispose:function(){var e=i.indexOf(t);-1!==e&&i.splice(e,1)}}},r.prototype.clearEscHandler=function(e){this._escHandlers[this._identifier(e,[48,126])]&&delete this._escHandlers[this._identifier(e,[48,126])]},r.prototype.setEscHandlerFallback=function(e){this._escHandlerFb=e},r.prototype.setExecuteHandler=function(e,t){this._executeHandlers[e.charCodeAt(0)]=t},r.prototype.clearExecuteHandler=function(e){this._executeHandlers[e.charCodeAt(0)]&&delete this._executeHandlers[e.charCodeAt(0)]},r.prototype.setExecuteHandlerFallback=function(e){this._executeHandlerFb=e},r.prototype.registerCsiHandler=function(e,t){var r=this._identifier(e);void 0===this._csiHandlers[r]&&(this._csiHandlers[r]=[]);var i=this._csiHandlers[r];return i.push(t),{dispose:function(){var e=i.indexOf(t);-1!==e&&i.splice(e,1)}}},r.prototype.clearCsiHandler=function(e){this._csiHandlers[this._identifier(e)]&&delete this._csiHandlers[this._identifier(e)]},r.prototype.setCsiHandlerFallback=function(e){this._csiHandlerFb=e},r.prototype.registerDcsHandler=function(e,t){return this._dcsParser.registerHandler(this._identifier(e),t)},r.prototype.clearDcsHandler=function(e){this._dcsParser.clearHandler(this._identifier(e))},r.prototype.setDcsHandlerFallback=function(e){this._dcsParser.setHandlerFallback(e)},r.prototype.registerOscHandler=function(e,t){return this._oscParser.registerHandler(e,t)},r.prototype.clearOscHandler=function(e){this._oscParser.clearHandler(e)},r.prototype.setOscHandlerFallback=function(e){this._oscParser.setHandlerFallback(e)},r.prototype.setErrorHandler=function(e){this._errorHandler=e},r.prototype.clearErrorHandler=function(){this._errorHandler=this._errorHandlerFb},r.prototype.reset=function(){this.currentState=this.initialState,this._oscParser.reset(),this._dcsParser.reset(),this._params.reset(),this._params.addParam(0),this._collect=0,this.precedingCodepoint=0},r.prototype.parse=function(e,t){for(var r=0,i=0,n=this.currentState,o=this._oscParser,s=this._dcsParser,a=this._collect,c=this._params,l=this._transitions.table,h=0;h<t;++h){switch((i=l[n<<8|((r=e[h])<160?r:u)])>>4){case 2:for(var f=h+1;;++f){if(f>=t||(r=e[f])<32||r>126&&r<u){this._printHandler(e,h,f),h=f-1;break}if(++f>=t||(r=e[f])<32||r>126&&r<u){this._printHandler(e,h,f),h=f-1;break}if(++f>=t||(r=e[f])<32||r>126&&r<u){this._printHandler(e,h,f),h=f-1;break}if(++f>=t||(r=e[f])<32||r>126&&r<u){this._printHandler(e,h,f),h=f-1;break}}break;case 3:this._executeHandlers[r]?this._executeHandlers[r]():this._executeHandlerFb(r),this.precedingCodepoint=0;break;case 0:break;case 1:if(this._errorHandler({position:h,code:r,currentState:n,collect:a,params:c,abort:!1}).abort)return;break;case 7:for(var _=this._csiHandlers[a<<8|r],d=_?_.length-1:-1;d>=0&&!_[d](c);d--);d<0&&this._csiHandlerFb(a<<8|r,c),this.precedingCodepoint=0;break;case 8:do{switch(r){case 59:c.addParam(0);break;case 58:c.addSubParam(-1);break;default:c.addDigit(r-48)}}while(++h<t&&(r=e[h])>47&&r<60);h--;break;case 9:a<<=8,a|=r;break;case 10:for(var p=this._escHandlers[a<<8|r],v=p?p.length-1:-1;v>=0&&!p[v]();v--);v<0&&this._escHandlerFb(a<<8|r),this.precedingCodepoint=0;break;case 11:c.reset(),c.addParam(0),a=0;break;case 12:s.hook(a<<8|r,c);break;case 13:for(var g=h+1;;++g)if(g>=t||24===(r=e[g])||26===r||27===r||r>127&&r<u){s.put(e,h,g),h=g-1;break}break;case 14:s.unhook(24!==r&&26!==r),27===r&&(i|=1),c.reset(),c.addParam(0),a=0,this.precedingCodepoint=0;break;case 4:o.start();break;case 5:for(var y=h+1;;y++)if(y>=t||(r=e[y])<32||r>127&&r<u){o.put(e,h,y),h=y-1;break}break;case 6:o.end(24!==r&&26!==r),27===r&&(i|=1),c.reset(),c.addParam(0),a=0,this.precedingCodepoint=0}n=15&i}this._collect=a,this.currentState=n},r}(o.Disposable);t.EscapeSequenceParser=f},6242:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.OscHandler=t.OscParser=void 0;var i=r(5770),n=r(482),o=[],s=function(){function e(){this._state=0,this._active=o,this._id=-1,this._handlers=Object.create(null),this._handlerFb=function(){}}return e.prototype.registerHandler=function(e,t){void 0===this._handlers[e]&&(this._handlers[e]=[]);var r=this._handlers[e];return r.push(t),{dispose:function(){var e=r.indexOf(t);-1!==e&&r.splice(e,1)}}},e.prototype.clearHandler=function(e){this._handlers[e]&&delete this._handlers[e]},e.prototype.setHandlerFallback=function(e){this._handlerFb=e},e.prototype.dispose=function(){this._handlers=Object.create(null),this._handlerFb=function(){},this._active=o},e.prototype.reset=function(){2===this._state&&this.end(!1),this._active=o,this._id=-1,this._state=0},e.prototype._start=function(){if(this._active=this._handlers[this._id]||o,this._active.length)for(var e=this._active.length-1;e>=0;e--)this._active[e].start();else this._handlerFb(this._id,"START")},e.prototype._put=function(e,t,r){if(this._active.length)for(var i=this._active.length-1;i>=0;i--)this._active[i].put(e,t,r);else this._handlerFb(this._id,"PUT",n.utf32ToString(e,t,r))},e.prototype._end=function(e){if(this._active.length){for(var t=this._active.length-1;t>=0&&!this._active[t].end(e);t--);for(t--;t>=0;t--)this._active[t].end(!1)}else this._handlerFb(this._id,"END",e)},e.prototype.start=function(){this.reset(),this._state=1},e.prototype.put=function(e,t,r){if(3!==this._state){if(1===this._state)for(;t<r;){var i=e[t++];if(59===i){this._state=2,this._start();break}if(i<48||57<i)return void(this._state=3);-1===this._id&&(this._id=0),this._id=10*this._id+i-48}2===this._state&&r-t>0&&this._put(e,t,r)}},e.prototype.end=function(e){0!==this._state&&(3!==this._state&&(1===this._state&&this._start(),this._end(e)),this._active=o,this._id=-1,this._state=0)},e}();t.OscParser=s;var a=function(){function e(e){this._handler=e,this._data="",this._hitLimit=!1}return e.prototype.start=function(){this._data="",this._hitLimit=!1},e.prototype.put=function(e,t,r){this._hitLimit||(this._data+=n.utf32ToString(e,t,r),this._data.length>i.PAYLOAD_LIMIT&&(this._data="",this._hitLimit=!0))},e.prototype.end=function(e){var t=!1;return this._hitLimit?t=!1:e&&(t=this._handler(this._data)),this._data="",this._hitLimit=!1,t},e}();t.OscHandler=a},8742:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Params=void 0;var r=2147483647,i=function(){function e(e,t){if(void 0===e&&(e=32),void 0===t&&(t=32),this.maxLength=e,this.maxSubParamsLength=t,t>256)throw new Error("maxSubParamsLength must not be greater than 256");this.params=new Int32Array(e),this.length=0,this._subParams=new Int32Array(t),this._subParamsLength=0,this._subParamsIdx=new Uint16Array(e),this._rejectDigits=!1,this._rejectSubDigits=!1,this._digitIsSub=!1}return e.fromArray=function(t){var r=new e;if(!t.length)return r;for(var i=t[0]instanceof Array?1:0;i<t.length;++i){var n=t[i];if(n instanceof Array)for(var o=0;o<n.length;++o)r.addSubParam(n[o]);else r.addParam(n)}return r},e.prototype.clone=function(){var t=new e(this.maxLength,this.maxSubParamsLength);return t.params.set(this.params),t.length=this.length,t._subParams.set(this._subParams),t._subParamsLength=this._subParamsLength,t._subParamsIdx.set(this._subParamsIdx),t._rejectDigits=this._rejectDigits,t._rejectSubDigits=this._rejectSubDigits,t._digitIsSub=this._digitIsSub,t},e.prototype.toArray=function(){for(var e=[],t=0;t<this.length;++t){e.push(this.params[t]);var r=this._subParamsIdx[t]>>8,i=255&this._subParamsIdx[t];i-r>0&&e.push(Array.prototype.slice.call(this._subParams,r,i))}return e},e.prototype.reset=function(){this.length=0,this._subParamsLength=0,this._rejectDigits=!1,this._rejectSubDigits=!1,this._digitIsSub=!1},e.prototype.addParam=function(e){if(this._digitIsSub=!1,this.length>=this.maxLength)this._rejectDigits=!0;else{if(e<-1)throw new Error("values lesser than -1 are not allowed");this._subParamsIdx[this.length]=this._subParamsLength<<8|this._subParamsLength,this.params[this.length++]=e>r?r:e}},e.prototype.addSubParam=function(e){if(this._digitIsSub=!0,this.length)if(this._rejectDigits||this._subParamsLength>=this.maxSubParamsLength)this._rejectSubDigits=!0;else{if(e<-1)throw new Error("values lesser than -1 are not allowed");this._subParams[this._subParamsLength++]=e>r?r:e,this._subParamsIdx[this.length-1]++}},e.prototype.hasSubParams=function(e){return(255&this._subParamsIdx[e])-(this._subParamsIdx[e]>>8)>0},e.prototype.getSubParams=function(e){var t=this._subParamsIdx[e]>>8,r=255&this._subParamsIdx[e];return r-t>0?this._subParams.subarray(t,r):null},e.prototype.getSubParamsAll=function(){for(var e={},t=0;t<this.length;++t){var r=this._subParamsIdx[t]>>8,i=255&this._subParamsIdx[t];i-r>0&&(e[t]=this._subParams.slice(r,i))}return e},e.prototype.addDigit=function(e){var t;if(!(this._rejectDigits||!(t=this._digitIsSub?this._subParamsLength:this.length)||this._digitIsSub&&this._rejectSubDigits)){var i=this._digitIsSub?this._subParams:this.params,n=i[t-1];i[t-1]=~n?Math.min(10*n+e,r):e}},e}();t.Params=i},744:function(e,t,r){var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}),o=this&&this.__decorate||function(e,t,r,i){var n,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(s=(o<3?n(s):o>3?n(t,r,s):n(t,r))||s);return o>3&&s&&Object.defineProperty(t,r,s),s},s=this&&this.__param||function(e,t){return function(r,i){t(r,i,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.BufferService=t.MINIMUM_ROWS=t.MINIMUM_COLS=void 0;var a=r(2585),c=r(5295),l=r(8460),h=r(844);t.MINIMUM_COLS=2,t.MINIMUM_ROWS=1;var u=function(e){function r(r){var i=e.call(this)||this;return i._optionsService=r,i.isUserScrolling=!1,i._onResize=new l.EventEmitter,i.cols=Math.max(r.options.cols,t.MINIMUM_COLS),i.rows=Math.max(r.options.rows,t.MINIMUM_ROWS),i.buffers=new c.BufferSet(r,i),i}return n(r,e),Object.defineProperty(r.prototype,"onResize",{get:function(){return this._onResize.event},enumerable:!1,configurable:!0}),Object.defineProperty(r.prototype,"buffer",{get:function(){return this.buffers.active},enumerable:!1,configurable:!0}),r.prototype.dispose=function(){e.prototype.dispose.call(this),this.buffers.dispose()},r.prototype.resize=function(e,t){this.cols=e,this.rows=t,this.buffers.resize(e,t),this.buffers.setupTabStops(this.cols),this._onResize.fire({cols:e,rows:t})},r.prototype.reset=function(){this.buffers.reset(),this.isUserScrolling=!1},o([s(0,a.IOptionsService)],r)}(h.Disposable);t.BufferService=u},7994:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.CharsetService=void 0;var r=function(){function e(){this.glevel=0,this._charsets=[]}return e.prototype.reset=function(){this.charset=void 0,this._charsets=[],this.glevel=0},e.prototype.setgLevel=function(e){this.glevel=e,this.charset=this._charsets[e]},e.prototype.setgCharset=function(e,t){this._charsets[e]=t,this.glevel===e&&(this.charset=t)},e}();t.CharsetService=r},1753:function(e,t,r){var i=this&&this.__decorate||function(e,t,r,i){var n,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(s=(o<3?n(s):o>3?n(t,r,s):n(t,r))||s);return o>3&&s&&Object.defineProperty(t,r,s),s},n=this&&this.__param||function(e,t){return function(r,i){t(r,i,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.CoreMouseService=void 0;var o=r(2585),s=r(8460),a={NONE:{events:0,restrict:function(){return!1}},X10:{events:1,restrict:function(e){return 4!==e.button&&1===e.action&&(e.ctrl=!1,e.alt=!1,e.shift=!1,!0)}},VT200:{events:19,restrict:function(e){return 32!==e.action}},DRAG:{events:23,restrict:function(e){return 32!==e.action||3!==e.button}},ANY:{events:31,restrict:function(e){return!0}}};function c(e,t){var r=(e.ctrl?16:0)|(e.shift?4:0)|(e.alt?8:0);return 4===e.button?(r|=64,r|=e.action):(r|=3&e.button,4&e.button&&(r|=64),8&e.button&&(r|=128),32===e.action?r|=32:0!==e.action||t||(r|=3)),r}var l=String.fromCharCode,h={DEFAULT:function(e){var t=[c(e,!1)+32,e.col+32,e.row+32];return t[0]>255||t[1]>255||t[2]>255?"":"[M"+l(t[0])+l(t[1])+l(t[2])},SGR:function(e){var t=0===e.action&&4!==e.button?"m":"M";return"[<"+c(e,!0)+";"+e.col+";"+e.row+t}},u=function(){function e(e,t){this._bufferService=e,this._coreService=t,this._protocols={},this._encodings={},this._activeProtocol="",this._activeEncoding="",this._onProtocolChange=new s.EventEmitter,this._lastEvent=null;for(var r=0,i=Object.keys(a);r<i.length;r++){var n=i[r];this.addProtocol(n,a[n])}for(var o=0,c=Object.keys(h);o<c.length;o++){var l=c[o];this.addEncoding(l,h[l])}this.reset()}return e.prototype.addProtocol=function(e,t){this._protocols[e]=t},e.prototype.addEncoding=function(e,t){this._encodings[e]=t},Object.defineProperty(e.prototype,"activeProtocol",{get:function(){return this._activeProtocol},set:function(e){if(!this._protocols[e])throw new Error('unknown protocol "'+e+'"');this._activeProtocol=e,this._onProtocolChange.fire(this._protocols[e].events)},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"areMouseEventsActive",{get:function(){return 0!==this._protocols[this._activeProtocol].events},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"activeEncoding",{get:function(){return this._activeEncoding},set:function(e){if(!this._encodings[e])throw new Error('unknown encoding "'+e+'"');this._activeEncoding=e},enumerable:!1,configurable:!0}),e.prototype.reset=function(){this.activeProtocol="NONE",this.activeEncoding="DEFAULT",this._lastEvent=null},Object.defineProperty(e.prototype,"onProtocolChange",{get:function(){return this._onProtocolChange.event},enumerable:!1,configurable:!0}),e.prototype.triggerMouseEvent=function(e){if(e.col<0||e.col>=this._bufferService.cols||e.row<0||e.row>=this._bufferService.rows)return!1;if(4===e.button&&32===e.action)return!1;if(3===e.button&&32!==e.action)return!1;if(4!==e.button&&(2===e.action||3===e.action))return!1;if(e.col++,e.row++,32===e.action&&this._lastEvent&&this._compareEvents(this._lastEvent,e))return!1;if(!this._protocols[this._activeProtocol].restrict(e))return!1;var t=this._encodings[this._activeEncoding](e);return t&&("DEFAULT"===this._activeEncoding?this._coreService.triggerBinaryEvent(t):this._coreService.triggerDataEvent(t,!0)),this._lastEvent=e,!0},e.prototype.explainEvents=function(e){return{down:!!(1&e),up:!!(2&e),drag:!!(4&e),move:!!(8&e),wheel:!!(16&e)}},e.prototype._compareEvents=function(e,t){return e.col===t.col&&e.row===t.row&&e.button===t.button&&e.action===t.action&&e.ctrl===t.ctrl&&e.alt===t.alt&&e.shift===t.shift},i([n(0,o.IBufferService),n(1,o.ICoreService)],e)}();t.CoreMouseService=u},6975:function(e,t,r){var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}),o=this&&this.__decorate||function(e,t,r,i){var n,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(s=(o<3?n(s):o>3?n(t,r,s):n(t,r))||s);return o>3&&s&&Object.defineProperty(t,r,s),s},s=this&&this.__param||function(e,t){return function(r,i){t(r,i,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.CoreService=void 0;var a=r(2585),c=r(8460),l=r(1439),h=r(844),u=Object.freeze({insertMode:!1}),f=Object.freeze({applicationCursorKeys:!1,applicationKeypad:!1,bracketedPasteMode:!1,origin:!1,reverseWraparound:!1,sendFocus:!1,wraparound:!0}),_=function(e){function t(t,r,i,n){var o=e.call(this)||this;return o._bufferService=r,o._logService=i,o._optionsService=n,o.isCursorInitialized=!1,o.isCursorHidden=!1,o._onData=o.register(new c.EventEmitter),o._onUserInput=o.register(new c.EventEmitter),o._onBinary=o.register(new c.EventEmitter),o._scrollToBottom=t,o.register({dispose:function(){return o._scrollToBottom=void 0}}),o.modes=l.clone(u),o.decPrivateModes=l.clone(f),o}return n(t,e),Object.defineProperty(t.prototype,"onData",{get:function(){return this._onData.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onUserInput",{get:function(){return this._onUserInput.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onBinary",{get:function(){return this._onBinary.event},enumerable:!1,configurable:!0}),t.prototype.reset=function(){this.modes=l.clone(u),this.decPrivateModes=l.clone(f)},t.prototype.triggerDataEvent=function(e,t){if(void 0===t&&(t=!1),!this._optionsService.options.disableStdin){var r=this._bufferService.buffer;r.ybase!==r.ydisp&&this._scrollToBottom(),t&&this._onUserInput.fire(),this._logService.debug('sending data "'+e+'"',(function(){return e.split("").map((function(e){return e.charCodeAt(0)}))})),this._onData.fire(e)}},t.prototype.triggerBinaryEvent=function(e){this._optionsService.options.disableStdin||(this._logService.debug('sending binary "'+e+'"',(function(){return e.split("").map((function(e){return e.charCodeAt(0)}))})),this._onBinary.fire(e))},o([s(1,a.IBufferService),s(2,a.ILogService),s(3,a.IOptionsService)],t)}(h.Disposable);t.CoreService=_},3730:function(e,t,r){var i=this&&this.__decorate||function(e,t,r,i){var n,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(s=(o<3?n(s):o>3?n(t,r,s):n(t,r))||s);return o>3&&s&&Object.defineProperty(t,r,s),s},n=this&&this.__param||function(e,t){return function(r,i){t(r,i,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.DirtyRowService=void 0;var o=r(2585),s=function(){function e(e){this._bufferService=e,this.clearRange()}return Object.defineProperty(e.prototype,"start",{get:function(){return this._start},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"end",{get:function(){return this._end},enumerable:!1,configurable:!0}),e.prototype.clearRange=function(){this._start=this._bufferService.buffer.y,this._end=this._bufferService.buffer.y},e.prototype.markDirty=function(e){e<this._start?this._start=e:e>this._end&&(this._end=e)},e.prototype.markRangeDirty=function(e,t){if(e>t){var r=e;e=t,t=r}e<this._start&&(this._start=e),t>this._end&&(this._end=t)},e.prototype.markAllDirty=function(){this.markRangeDirty(0,this._bufferService.rows-1)},i([n(0,o.IBufferService)],e)}();t.DirtyRowService=s},4348:function(e,t,r){var i=this&&this.__spreadArrays||function(){for(var e=0,t=0,r=arguments.length;t<r;t++)e+=arguments[t].length;var i=Array(e),n=0;for(t=0;t<r;t++)for(var o=arguments[t],s=0,a=o.length;s<a;s++,n++)i[n]=o[s];return i};Object.defineProperty(t,"__esModule",{value:!0}),t.InstantiationService=t.ServiceCollection=void 0;var n=r(2585),o=r(8343),s=function(){function e(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this._entries=new Map;for(var r=0,i=e;r<i.length;r++){var n=i[r],o=n[0],s=n[1];this.set(o,s)}}return e.prototype.set=function(e,t){var r=this._entries.get(e);return this._entries.set(e,t),r},e.prototype.forEach=function(e){this._entries.forEach((function(t,r){return e(r,t)}))},e.prototype.has=function(e){return this._entries.has(e)},e.prototype.get=function(e){return this._entries.get(e)},e}();t.ServiceCollection=s;var a=function(){function e(){this._services=new s,this._services.set(n.IInstantiationService,this)}return e.prototype.setService=function(e,t){this._services.set(e,t)},e.prototype.getService=function(e){return this._services.get(e)},e.prototype.createInstance=function(e){for(var t=[],r=1;r<arguments.length;r++)t[r-1]=arguments[r];for(var n=o.getServiceDependencies(e).sort((function(e,t){return e.index-t.index})),s=[],a=0,c=n;a<c.length;a++){var l=c[a],h=this._services.get(l.id);if(!h)throw new Error("[createInstance] "+e.name+" depends on UNKNOWN service "+l.id+".");s.push(h)}var u=n.length>0?n[0].index:t.length;if(t.length!==u)throw new Error("[createInstance] First service dependency of "+e.name+" at position "+(u+1)+" conflicts with "+t.length+" static arguments");return new(e.bind.apply(e,i([void 0],i(t,s))))},e}();t.InstantiationService=a},7866:function(e,t,r){var i=this&&this.__decorate||function(e,t,r,i){var n,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(s=(o<3?n(s):o>3?n(t,r,s):n(t,r))||s);return o>3&&s&&Object.defineProperty(t,r,s),s},n=this&&this.__param||function(e,t){return function(r,i){t(r,i,e)}},o=this&&this.__spreadArrays||function(){for(var e=0,t=0,r=arguments.length;t<r;t++)e+=arguments[t].length;var i=Array(e),n=0;for(t=0;t<r;t++)for(var o=arguments[t],s=0,a=o.length;s<a;s++,n++)i[n]=o[s];return i};Object.defineProperty(t,"__esModule",{value:!0}),t.LogService=t.LogLevel=void 0;var s,a=r(2585);!function(e){e[e.DEBUG=0]="DEBUG",e[e.INFO=1]="INFO",e[e.WARN=2]="WARN",e[e.ERROR=3]="ERROR",e[e.OFF=4]="OFF"}(s=t.LogLevel||(t.LogLevel={}));var c={debug:s.DEBUG,info:s.INFO,warn:s.WARN,error:s.ERROR,off:s.OFF},l=function(){function e(e){var t=this;this._optionsService=e,this._updateLogLevel(),this._optionsService.onOptionChange((function(e){"logLevel"===e&&t._updateLogLevel()}))}return e.prototype._updateLogLevel=function(){this._logLevel=c[this._optionsService.options.logLevel]},e.prototype._evalLazyOptionalParams=function(e){for(var t=0;t<e.length;t++)"function"==typeof e[t]&&(e[t]=e[t]())},e.prototype._log=function(e,t,r){this._evalLazyOptionalParams(r),e.call.apply(e,o([console,"xterm.js: "+t],r))},e.prototype.debug=function(e){for(var t=[],r=1;r<arguments.length;r++)t[r-1]=arguments[r];this._logLevel<=s.DEBUG&&this._log(console.log,e,t)},e.prototype.info=function(e){for(var t=[],r=1;r<arguments.length;r++)t[r-1]=arguments[r];this._logLevel<=s.INFO&&this._log(console.info,e,t)},e.prototype.warn=function(e){for(var t=[],r=1;r<arguments.length;r++)t[r-1]=arguments[r];this._logLevel<=s.WARN&&this._log(console.warn,e,t)},e.prototype.error=function(e){for(var t=[],r=1;r<arguments.length;r++)t[r-1]=arguments[r];this._logLevel<=s.ERROR&&this._log(console.error,e,t)},i([n(0,a.IOptionsService)],e)}();t.LogService=l},7302:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.OptionsService=t.DEFAULT_OPTIONS=t.DEFAULT_BELL_SOUND=void 0;var i=r(8460),n=r(6114),o=r(1439);t.DEFAULT_BELL_SOUND="data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjMyLjEwNAAAAAAAAAAAAAAA//tQxAADB8AhSmxhIIEVCSiJrDCQBTcu3UrAIwUdkRgQbFAZC1CQEwTJ9mjRvBA4UOLD8nKVOWfh+UlK3z/177OXrfOdKl7pyn3Xf//WreyTRUoAWgBgkOAGbZHBgG1OF6zM82DWbZaUmMBptgQhGjsyYqc9ae9XFz280948NMBWInljyzsNRFLPWdnZGWrddDsjK1unuSrVN9jJsK8KuQtQCtMBjCEtImISdNKJOopIpBFpNSMbIHCSRpRR5iakjTiyzLhchUUBwCgyKiweBv/7UsQbg8isVNoMPMjAAAA0gAAABEVFGmgqK////9bP/6XCykxBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq",t.DEFAULT_OPTIONS=Object.freeze({cols:80,rows:24,cursorBlink:!1,cursorStyle:"block",cursorWidth:1,bellSound:t.DEFAULT_BELL_SOUND,bellStyle:"none",drawBoldTextInBrightColors:!0,fastScrollModifier:"alt",fastScrollSensitivity:5,fontFamily:"courier-new, courier, monospace",fontSize:15,fontWeight:"normal",fontWeightBold:"bold",lineHeight:1,linkTooltipHoverDuration:500,letterSpacing:0,logLevel:"info",scrollback:1e3,scrollSensitivity:1,screenReaderMode:!1,macOptionIsMeta:!1,macOptionClickForcesSelection:!1,minimumContrastRatio:1,disableStdin:!1,allowProposedApi:!0,allowTransparency:!1,tabStopWidth:8,theme:{},rightClickSelectsWord:n.isMac,rendererType:"canvas",windowOptions:{},windowsMode:!1,wordSeparator:" ()[]{}',\"`",altClickMovesCursor:!0,convertEol:!1,termName:"xterm",cancelEvents:!1});var s=["normal","bold","100","200","300","400","500","600","700","800","900"],a=["cols","rows"],c=function(){function e(e){this._onOptionChange=new i.EventEmitter,this.options=o.clone(t.DEFAULT_OPTIONS);for(var r=0,n=Object.keys(e);r<n.length;r++){var s=n[r];if(s in this.options)try{var a=e[s];this.options[s]=this._sanitizeAndValidateOption(s,a)}catch(e){console.error(e)}}}return Object.defineProperty(e.prototype,"onOptionChange",{get:function(){return this._onOptionChange.event},enumerable:!1,configurable:!0}),e.prototype.setOption=function(e,r){if(!(e in t.DEFAULT_OPTIONS))throw new Error('No option with key "'+e+'"');if(a.includes(e))throw new Error('Option "'+e+'" can only be set in the constructor');this.options[e]!==r&&(r=this._sanitizeAndValidateOption(e,r),this.options[e]!==r&&(this.options[e]=r,this._onOptionChange.fire(e)))},e.prototype._sanitizeAndValidateOption=function(e,r){switch(e){case"bellStyle":case"cursorStyle":case"rendererType":case"wordSeparator":r||(r=t.DEFAULT_OPTIONS[e]);break;case"fontWeight":case"fontWeightBold":if("number"==typeof r&&1<=r&&r<=1e3)break;r=s.includes(r)?r:t.DEFAULT_OPTIONS[e];break;case"cursorWidth":r=Math.floor(r);case"lineHeight":case"tabStopWidth":if(r<1)throw new Error(e+" cannot be less than 1, value: "+r);break;case"minimumContrastRatio":r=Math.max(1,Math.min(21,Math.round(10*r)/10));break;case"scrollback":if((r=Math.min(r,4294967295))<0)throw new Error(e+" cannot be less than 0, value: "+r);break;case"fastScrollSensitivity":case"scrollSensitivity":if(r<=0)throw new Error(e+" cannot be less than or equal to 0, value: "+r)}return r},e.prototype.getOption=function(e){if(!(e in t.DEFAULT_OPTIONS))throw new Error('No option with key "'+e+'"');return this.options[e]},e}();t.OptionsService=c},8343:(e,t)=>{function r(e,t,r){t.di$target===t?t.di$dependencies.push({id:e,index:r}):(t.di$dependencies=[{id:e,index:r}],t.di$target=t)}Object.defineProperty(t,"__esModule",{value:!0}),t.createDecorator=t.getServiceDependencies=t.serviceRegistry=void 0,t.serviceRegistry=new Map,t.getServiceDependencies=function(e){return e.di$dependencies||[]},t.createDecorator=function(e){if(t.serviceRegistry.has(e))return t.serviceRegistry.get(e);var i=function(e,t,n){if(3!==arguments.length)throw new Error("@IServiceName-decorator can only be used to decorate a parameter");r(i,e,n)};return i.toString=function(){return e},t.serviceRegistry.set(e,i),i}},2585:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.IUnicodeService=t.IOptionsService=t.ILogService=t.IInstantiationService=t.IDirtyRowService=t.ICharsetService=t.ICoreService=t.ICoreMouseService=t.IBufferService=void 0;var i=r(8343);t.IBufferService=i.createDecorator("BufferService"),t.ICoreMouseService=i.createDecorator("CoreMouseService"),t.ICoreService=i.createDecorator("CoreService"),t.ICharsetService=i.createDecorator("CharsetService"),t.IDirtyRowService=i.createDecorator("DirtyRowService"),t.IInstantiationService=i.createDecorator("InstantiationService"),t.ILogService=i.createDecorator("LogService"),t.IOptionsService=i.createDecorator("OptionsService"),t.IUnicodeService=i.createDecorator("UnicodeService")},1480:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.UnicodeService=void 0;var i=r(8460),n=r(225),o=function(){function e(){this._providers=Object.create(null),this._active="",this._onChange=new i.EventEmitter;var e=new n.UnicodeV6;this.register(e),this._active=e.version,this._activeProvider=e}return Object.defineProperty(e.prototype,"onChange",{get:function(){return this._onChange.event},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"versions",{get:function(){return Object.keys(this._providers)},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"activeVersion",{get:function(){return this._active},set:function(e){if(!this._providers[e])throw new Error('unknown Unicode version "'+e+'"');this._active=e,this._activeProvider=this._providers[e],this._onChange.fire(e)},enumerable:!1,configurable:!0}),e.prototype.register=function(e){this._providers[e.version]=e},e.prototype.wcwidth=function(e){return this._activeProvider.wcwidth(e)},e.prototype.getStringCellWidth=function(e){for(var t=0,r=e.length,i=0;i<r;++i){var n=e.charCodeAt(i);if(55296<=n&&n<=56319){if(++i>=r)return t+this.wcwidth(n);var o=e.charCodeAt(i);56320<=o&&o<=57343?n=1024*(n-55296)+o-56320+65536:t+=this.wcwidth(o)}t+=this.wcwidth(n)}return t},e}();t.UnicodeService=o}},t={};return function r(i){if(t[i])return t[i].exports;var n=t[i]={exports:{}};return e[i].call(n.exports,n,n.exports,r),n.exports}(4389)})()}));
//# sourceMappingURL=xterm.js.map

SSHyClient.settings = function() {
    // Local echo reduces latency on regular key presses to aruond 0.04s compared to ~0.2s without it
    this.localEcho = 0; // 0 - off; 1 - auto; 2 - on

    /* Default the bindings to bash */
    this.fsHintEnter = "\x1b\x5b\x3f\x31"; // seems to be the same for all shells
    this.fsHintLeave = SSHyClient.bashFsHintLeave;

    this.autoEchoState = false; // false = no echoing ; true = echoing
    this.autoEchoTimeout = 0; // stores the time of last autoecho change

    this.blockedKeys = [':']; // while localecho(force-on) don't echo these keys

    this.keepAliveInterval = undefined; // stores the setInterval() reference

    this.fontSize = 16;

    this.colorTango = true
    this.colorNames = Object.keys(this.colorSchemes);
    this.colorCounter = 0; // Stores the current index of the theme loaded in colorSchemes

    this.shellString = ''; // Used to buffer shell identifications ie ']0;fish' or 'user@host$'

    this.sidenavElementState = 0; // Stores the state of the sidenav (0 - closed, [x] - true)
    // Caches the DOM elements
    this.rxElement = document.getElementById('rxTraffic');
    this.txElement = document.getElementById('txTraffic');
    this.autoEchoElement = document.getElementById('autoEchoState');

    this.rsaCheckEnabled = true;
};
SSHyClient.settings.prototype = {
	// All our supported terminal color themes in [bg, color1, .... , color15, cursor, fg]
	colorSchemes: [
		['Solarized', {background:"#002b36", black:"#002b36", red:"#dc322f", green:"#859900", yellow:"#b58900", blue:"#268bd2", magenta:"#6c71c4", cyan:"#2aa198", white:"#93a1a1", brightBlack:"#657b83", brightRed:"#dc322f", brightGreen:"#859900", brightYellow:"#b58900", brightBlue:"#268bd2", brightMagenta:"#6c71c4", brightCyan:"#2aa198", brightWhite:"#fdf6e3", cursor:"#93a1a1", foreground:"#93a1a1"}],
		['Material', {background:"#263238", black:"#263238", red:"#ff9800", green:"#8bc34a", yellow:"#ffc107", blue:"#03a9f4", magenta:"#e91e63", cyan:"#009688", white:"#cfd8dc", brightBlack:"#37474f", brightRed:"#ffa74d", brightGreen:"#9ccc65", brightYellow:"#ffa000", brightBlue:"#81d4fa", brightMagenta:"#ad1457", brightCyan:"#26a69a", brightWhite:"#eceff1", cursor:"#eceff1", foreground:"#eceff1"}],
		['Monokai', {background:"#272822", black:"#272822", red:"#dc2566", green:"#8fc029", yellow:"#d4c96e", blue:"#55bcce", magenta:"#9358fe", cyan:"#56b7a5", white:"#acada1", brightBlack:"#76715e", brightRed:"#fa2772", brightGreen:"#a7e22e", brightYellow:"#e7db75", brightBlue:"#66d9ee", brightMagenta:"#ae82ff", brightCyan:"#66efd5", brightWhite:"#cfd0c2", cursor:"#f1ebeb", foreground:"#f1ebeb"}],
		['Ashes', {background:"#1c2023", black:"#1c2023", red:"#c7ae95", green:"#95c7ae", yellow:"#aec795", blue:"#ae95c7", magenta:"#c795ae", cyan:"#95aec7", white:"#c7ccd1", brightBlack:"#747c84", brightRed:"#c7ae95", brightGreen:"#95c7ae", brightYellow:"#aec795", brightBlue:"#ae95c7", brightMagenta:"#c795ae", brightCyan:"#95aec7", brightWhite:"#f3f4f5", cursor:"#c7ccd1", foreground:"#c7ccd1"}],
		['Google', {background:"#ffffff", black:"#ffffff", red:"#cc342b", green:"#198844", yellow:"#fba922", blue:"#3971ed", magenta:"#a36ac7", cyan:"#3971ed", white:"#c5c8c6", brightBlack:"#969896", brightRed:"#cc342b", brightGreen:"#198844", brightYellow:"#fba922", brightBlue:"#3971ed", brightMagenta:"#a36ac7", brightCyan:"#3971ed", brightWhite:"#ffffff", cursor:"#373b41", foreground:"#373b41"}],
		['Mono Light', {background:"#f7f7f7", black:"#f7f7f7", red:"#7c7c7c", green:"#8e8e8e", yellow:"#a0a0a0", blue:"#686868", magenta:"#747474", cyan:"#868686", white:"#b9b9b9", brightBlack:"#525252", brightRed:"#7c7c7c", brightGreen:"#8e8e8e", brightYellow:"#a0a0a0", brightBlue:"#686868", brightMagenta:"#747474", brightCyan:"#868686", brightWhite:"#f7f7f7", cursor:"#464646", foreground:"#464646"}],
		['Mono Dark', {background:"#000000", black:"#000000", red:"#6b6b6b", green:"#c4c4c4", yellow:"#b3b3b3", blue:"#999999", magenta:"#717171", cyan:"#8a8a8a", white:"#b5cabb", brightBlack:"#202020", brightRed:"#464646", brightGreen:"#f8f8f8", brightYellow:"#eeeeee", brightBlue:"#7c7c7c", brightMagenta:"#adadad", brightCyan:"#c0c0c0", brightWhite:"#99ac9e", cursor:"#ffffff", foreground:"#ffffff"}],
		['Tango', {}]
	],

    // Takes a single character and identifies shell type
    testShell: function(r) {
        // Check that we're adding the start of a string
        if (r.substring(0, 2).indexOf(']') === -1 && (this.shellString.length === 0 || this.shellString.length > ']0;fish'.length)) {
            this.shellString = '';
            return;
        }

        this.shellString += r;

        // Don't bother checking if we don't have enough characters for a match
        if (this.shellString.length < 7) {
            return;
        }
        // Check for fish
        if (this.shellString.indexOf(']0;fish') !== -1) {
            this.shellString = '';
            this.fsHintLeave = SSHyClient.fishFsHintLeave;
            return;
        }

        // Catch all for bash
        if (this.shellString.indexOf('@') !== -1) {
            this.shellString = '';
            this.fsHintLeave = SSHyClient.bashFsHintLeave;
            return;
        }
    },
    // Toggles Local Echo on and off
    setLocalEcho: function(dir) {
        // Clamp the setting between 0 and 2
        this.localEcho = Math.min(Math.max(this.localEcho += dir, 0), 2);

        // Change the displayed mode to the string at 'this.localEcho' of array
        document.getElementById('currentLEcho').innerHTML = ["Force Off", "Auto", "Force On"][this.localEcho];

        // If we're using auto echo mode, change the auto state tooltiptext
        var element = document.getElementById('autoEchoState');
        if (this.localEcho === 1) {
            element.style.visibility = 'visible';
            element.innerHTML = "State: " + (this.autoEchoState === false ? 'Disabled' : 'Enabled');
        } else {
            element.style.visibility = 'hidden';
        }
    },

    // Parses a given message (r) for signs to enable or disable local echo
    parseLocalEcho: function(r) {
        // if we're using auto mode
        if (this.localEcho === 1) {
            // Caching this since it takes a long time to get at least twice
            var timeout = performance.now();
            // Don't continue if we've changed state in the previous 0.1s
            if (timeout - this.autoEchoTimeout < 100) {
                return;
            }
            // We only need to examine the beginning of most messages so just take the first 64 bytes to improve performance
            r = r.substring(0, 64);
            if (!this.autoEchoState) {
                // Search for '@' aswell so we catch on 'user@hostname' aswell
                if (r.indexOf(this.fsHintLeave) != -1 && r.indexOf('@') != -1) {
                    this.autoEchoState = true;
                    // Change the Settings UI
                    this.autoEchoElement.innerHTML = "State: Enabled";
                    this.autoEchoTimeout = timeout;
                }
            } else {
                // check for 'password' incase we are inputting a password
                if (r.indexOf(this.fsHintEnter) != -1 || r.toLowerCase().indexOf('password') != -1) {
                    this.autoEchoState = false;
                    this.autoEchoElement.innerHTML = "State: Disabled";
                    this.autoEchoTimeout = timeout;
                }
            }
        }
        return;
    },
    // Parses a keydown event to determine if we can safely echo the key.
    parseKey: function(e) {
        // Don't continue to write the key if auto echoing is disabled
        if (this.localEcho === 1 && this.autoEchoState === false) {
            return;
        }
        // Make sure the key isn't a special one eg 'ArrowUp', a blocked key or a control character
        if (e.key.length > 1 || this.blockedKeys.includes(e.key) || (e.altKey || e.ctrlKey || e.metaKey)) {
            return;
        }
        // Incase someone is typing very fast don't echo to perserve servers formatting.
        if (!transport.lastKey) {
            term.write(e.key);
        }
        transport.lastKey += e.key;
    },
    // Sets the keep alive iterval or clears a current interval based on 'time'
    setKeepAlive: function(time) {
        // changes 'time' into seconds & floors time to stop 0.00001s ect
        time = time === undefined ? 0 : Math.floor(time) * 1000;
        // if there is an interval setup then clear it
        if (time === 0 || this.keepAliveInterval !== undefined) {
            clearInterval(this.keepAliveInterval);
            this.keepAliveInterval = undefined;
            if (!time) {
                return;
            }
        }
        // otherwise create a new interval
        this.keepAliveInterval = setInterval(transport.keepAlive, time);
    },
    // Set xtermjs's color scheme to the given color
    setColorScheme: function(colIndex) {
        // Gets a reference to xterm.css
        var term_style = document.styleSheets[0];
        var themeName = this.colorSchemes[colIndex][0]
        var themeColors = this.colorSchemes[colIndex][1]

        // Interact with xtermjs
        if (term) {
        	term.setOption('theme',themeColors)
		}

        // Remove the old CSS rules if its a custom theme
        if(!this.colorTango){
	        for (i = 0; i < 4; i++) {
	            term_style.deleteRule(13);
	        }
	    }

	    if(themeName === 'Tango') {
	    	this.colorTango = true;
	    	document.getElementById('currentColor').innerHTML = 'Tango';
	    	return;
	    }

        // Adds html background colour
        term_style.insertRule('html, body {background-color: ' + themeColors.background + ' !important;}', 13);
        // Changes the sidenav color
        term_style.insertRule('.sidenav {background-color: ' + modColorPercent(themeColors.background, -0.2) + ' !important;}', 13);
        // Changes the rx and tx color to 10 and 11
        term_style.insertRule('.brightgreen {color: ' + themeColors.brightGreen + ' !important;}', 13);
        term_style.insertRule('.brightyellow {color: ' + themeColors.brightYellow + ' !important;}', 13);

        this.colorTango = false;

        document.getElementById('currentColor').innerHTML = themeName === undefined ? 'Custom' : themeName;
    },

    importXresources: function() {
        var reader = new FileReader();
        var element = document.getElementById('Xresources').files[0];
        reader.readAsText(element);
        reader.onload = function() {
            var file = reader.result;
            var lines = file.split("\n");
            // natural sort the Xresources list to bg, 1 - 15, cur, fg colours
            lines = lines.sort(new Intl.Collator(undefined, {
                numeric: true,
                sensitivity: 'base'
            }).compare);

            colScheme = [];

            for (var i = 0; i < lines.length; i++) {
                // Regex the line for a color code #xxx or #xxxxxx
                var result = lines[i].match(/#([0-9a-f]{3}){1,2}/ig);
                if (result) {
                    colScheme.push(result[0]);
                    // If we've added 19 colors then stop and display it?
                    if (colScheme.length >= 19) {
                        break;
                    }
                }
            }

            // Make sure the new color scheme has the required amount of colours
            if (colScheme.length !== 19) {
                return alert('Uploaded file could not be parsed correctly.');
            }

            // lastly we need to sort it into a dict instead of list
            colScheme = {background: colScheme[0],black: colScheme[1],red: colScheme[2],green: colScheme[3],yellow: colScheme[4],blue: colScheme[5],magenta: colScheme[6],cyan: colScheme[7],white: colScheme[8],brightBlack: colScheme[9],brightRed: colScheme[10],brightGreen: colScheme[11],brightYellow: colScheme[12],brightBlue: colScheme[13],brightMagenta: colScheme[14],brightCyan: colScheme[15],brightWhite: colScheme[16],cursor: colScheme[17],foreground: colScheme[18]}
            colName = element.name === '.Xresources' ? 'custom' : element.name.split('.')[0]

            // Add to the colorSchemes list
            transport.settings.colorSchemes.push([colName, colScheme])
            // Get the new key 
            transport.settings.colorNames = Object.keys(transport.settings.colorSchemes);
            transport.settings.setColorScheme(transport.settings.colorSchemes.length-1)
        };
    },
    // Cycle the color counter and set the current colors to new index
    cycleColorSchemes: function(dir) {
        // Cycles through (0 -> colorSchemes.length - 1) where dir = 1 is incrementing and dir = false decrements
        this.colorCounter = dir === 0 ? --this.colorCounter : ++this.colorCounter;
        if (this.colorCounter > this.colorNames.length - 1 || this.colorCounter < 0) {
            this.colorCounter = dir === 1 ? 0 : this.colorNames.length - 1;
        }
        // Set color scheme to (colorList [ colorNames [ counter ]])
        this.setColorScheme(this.colorCounter)
    },
    // Modify the font size of the terminal 
    modFontSize: function(sign) { 
        this.fontSize += sign; 
        term.setOption('fontSize', this.fontSize)
        
        document.getElementById("currentFontSize").innerHTML = transport.settings.fontSize + 'px'; 
        // Recalculate rows/cols
        fitAddon.fit()
        transport.auth.mod_pty('window-change', term.cols, term.rows); 
    }, 
    // Sets the terminal size where id= 0-> cols ; 1-> rows 
    modTerm: function(id, newAmount) { 
        if (!id) { 
            term.resize(newAmount, term.rows); 
        } else { 
            term.resize(term.cols, newAmount); 
        } 
 
        transport.auth.mod_pty('window-change', term.cols, term.rows); 
    }, 
    // Changes the network traffic setting to reflect transmitted or recieved data
    setNetTraffic: function(value, dir) {
        // No point recalculating if the sidenav is closed
        if (!this.sidenavElementState) {
            return;
        }
        // Convert the 'value' into the correct units
        switch (true) {
            case value < 1024:
                value = value + 'Bytes';
                break;
            case (value >= 1024 && value < 1048576):
                value = (value / 1024).toFixed(3) + 'KB';
                break;
            case (value >= 1048576 && value < 1073741824):
                value = (value / 1048576).toFixed(3) + 'MB';
                break;
            default:
                // Just going to stop at Gb since its unlikely to go above that
                value = (value / 1073741824).toFixed(3) + 'GB';
        }
        // Set the target element we we're going to change.
        element = dir === true ? this.rxElement : this.txElement;
        element.innerHTML = value;
    }
};

// Really struggling to encode string as a binary array buffer
// this technique seems to work, but why!
// Adapted from the following
// https://stackoverflow.com/questions/6965107/converting-between-strings-and-arraybuffers
// https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
//
function ab2str(buf) {
	return String.fromCharCode.apply(null, new Uint8Array(buf))
}

function str2ab(str) {
	var buf = new ArrayBuffer(str.length * 1) // 2 bytes for each char
	var bufView = new Uint8Array(buf)
	for (var i = 0, strLen = str.length; i < strLen; i++) {
		bufView[i] = str.charCodeAt(i)
	}
	return buf
}
function setProxyEncoding(en) {
	wsproxyEncoding = en
}

window.onload = function () {
	document.getElementById('login_cred').style.display = 'block'
	// Sets the default colorScheme to material
	settings = new SSHyClient.settings()
	settings.setColorScheme(1)

	// Build the default wsProxy URL for display on sidenav
	buildWSProxyURL()
	//setProxyEncoding('binary');

	// Connect upon hitting Enter from the password field
	document
		.getElementById('password')
		.addEventListener('keyup', function (event) {
			if (event.key !== 'Enter') return
			document.getElementById('connect').click()
			event.preventDefault()
		})
}

// Run every time the webpage is resized
window.onresize = function () {
	clearTimeout(resizeInterval)
	resizeInterval = setTimeout(resize, 400)
}

// Recalculates the terminal Columns / Rows and sends new size to SSH server + xtermjs
function resize() {
	if (term) {
		// Calculate best rows and columns for the div
		fitAddon.fit()
		// Let the SSH session know the new size
		transport.auth.mod_pty('window-change', term.cols, term.rows)
		// Update the side panel
		document.getElementById('termCols').value = term.cols
		document.getElementById('termRows').value = term.rows
	}
}

// Build the entire websocket url eg (wss://localhost:5999/) based on http protocol
function buildWSProxyURL(portPassed) {
	// Decide if we're using secure ws or not
	if (window.location.protocol == 'https:') {
		wsproxyProto = 'wss'
	}

	var port
	if (portPassed) {
		port = ''
	} else {
		port = ':' + wsproxyPorts[wsproxyProto]
	}

	// Build the wsproxyURL up
	wsproxyURL = wsproxyProto + '://' + wsproxyURL + port + '/'

	document.getElementById('websockURL').value = wsproxyURL
}

// Changes the websocket proxy URL ** BEFORE ** connection ONLY
function modProxyURL(newURL) {
	if (!ws) {
		// Strip it down to barebones URL:PORT(optional)
		matches =
			/^w?s{0,2}:?\/{0,2}(([a-z0-9]+\.)*[a-z0-9]+\.?[a-z]+)\:?([0-9]{1,5})?/g.exec(
				newURL
			)
		var port = ''
		if (newURL.match(':')) {
			port = ':' + matches[matches.length - 1]
		}

		wsproxyURL = matches[1] + port
		buildWSProxyURL(port)
	}
}

// Toggles the settings navigator
function toggleNav(size) {
	document.getElementById('settingsNav').style.width = size + 'px'
	settings.sidenavElementState = size
	// We need to update the network traffic whenever the nav is re-opened
	if (size && transport) {
		settings.setNetTraffic(transport.parceler.recieveData, true)
		settings.setNetTraffic(transport.parceler.transmitData, false)
	}
	var element = document.getElementById('gear').style
	element.visibility = element.visibility === 'hidden' ? 'visible' : 'hidden'
}
// Rudimentary checks that an IP address is external and is a valid hostname or IP address
function validate(id, text) {
	if (!text) {
		document.getElementById(id).style.borderBottom = 'solid 2px #ff4d4d'
	} else {
		if (id == 'ipaddress') {
			// incase we have a error for the port
			if (text.includes(':')) {
				if (!validate_port(text.split(':')[1])) {
					document.getElementById(id).style.borderBottom =
						'solid 2px #ff4d4d'
					return
				} else {
					document.getElementById(id).style.borderBottom =
						'solid 2px #c9c9c9'
					document.getElementById('failure').style.display = 'none'
				}
			} else {
				// if we're not doing ports then hide the failure message
				document.getElementById('failure').style.display = 'none'
			}
			// test for valid domain name
			if (
				!/^([a-z0-9]+\.)*[a-z0-9]+\.[a-z]+(\:[0-9]{1,5})?$/.test(text)
			) {
				if (check_internal(text)) {
					display_error(
						'Be aware - IP addresses are resolved at the websocket proxy'
					)
				}
				// test ip aswell.
				if (
					!/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$|(\:[0-9]{1,5}))){4}$/.test(
						text
					)
				) {
					document.getElementById(id).style.borderBottom =
						'solid 2px #ff4d4d'
					return
				} else {
					if (check_internal(text)) {
						display_error(
							'Could no resolve hostname: Please use an external address'
						)
					}
					document.getElementById(id).style.borderBottom =
						'solid 2px #c9c9c9'
					return
				}
				document.getElementById(id).style.borderBottom =
					'solid 2px #ff4d4d'
				return
			}
		}
		document.getElementById(id).style.borderBottom = 'solid 2px #c9c9c9'
	}
}
// Validates the port is 0 > port < 65536
function validate_port(port_num) {
	if (port_num > 0 && port_num < 65536) {
		return port_num
	} else {
		display_error('Invalid port: port must be between 1 - 65535')
		validate('ipaddress', '')
	}
}
// checks for 10.*.*.*, 192.168.*.*, 172.16.*.*, 127.0.0.1 & loocalhost
function check_internal(ip_address) {
	if (
		/10\.\d+\.\d+\.\d+/.test(ip_address) ||
		/192\.168\.\d+\.\d+/.test(ip_address) ||
		/172\.16\.\d+\.\d+/.test(ip_address)
	) {
		return true
	} else if (ip_address == '127.0.0.1' || ip_address == 'localhost') {
		return true
	}

	return false
}
// Displays a given err on the page
function display_error(err) {
	// remove the loading cog and set the 'connecting' to connect
	document.getElementById('load-container').style.display = 'none'
	document.getElementById('connect').value = 'connect'

	document.getElementById('failure').innerText = err
	document.getElementById('failure').style.display = 'block'
}
// Initialises xtermjs
function termInit() {
	// Define the terminal rows/cols
	term = new Terminal({
		//cols: 80,
		//rows: 24
	})

	// start xterm.js
	term.open(document.getElementById('terminal'), true)
	fitAddon = new FitAddon()
	term.loadAddon(fitAddon)

	fitAddon.fit()
	term.focus()

	// set the color scheme to whatever the user's changed it to in the mean time
	var colName = document.getElementById('currentColor').innerHTML
	for (i = 0; i < settings.colorSchemes.length; i++) {
		if (settings.colorSchemes[i][0] == colName) {
			settings.setColorScheme(i)
			break
		}
	}

	// clear the modal elements on screen
	document.getElementById('load-container').style.display = 'none'
	document.getElementById('login_cred').style.display = 'none'
}
// Binds custom listener functions to xtermjs's Terminal object
function startxtermjs() {
	termInit()

	// sets up some listeners for the terminal (keydown, paste)
	term.onData(data => {
		if (!ws || !transport || !transport.auth.authenticated) {
			// If no connection dont send, and unauthenticated connections handled
			// elsewhere
			return
		}
		if (data.length > 5000) {
			// Apparently long strings kill SSHyClient.parceler, although it is
			// probably best to sort that there rather than here...
			var blocks
			blocks = splitSlice(data)
			//console.log("ondata length ",blocks.length);
			for (var i = 0; i < blocks.length; i++) {
				//console.log("ondata block ",i,blocks[i].charCodeAt(0))
				transport.expect_key(blocks[i])
			}
		} else {
			//console.log("ondata ",data.charCodeAt(0), data.substr(1))
			transport.expect_key(data)
		}
	})

	term.attachCustomKeyEventHandler(e => {
		// Sanity Checks
		if (e.type != 'keydown') {
			return
		}

		// If websocket is closed, ran out of attempts to authenticate, or just
		// waiting to confirm the username and password, dont forward keys
		if (
			!ws ||
			!transport ||
			transport.auth.failedAttempts >= 5 ||
			transport.auth.awaitingAuthentication
		) {
			return false
		}
		var pressedKey
		/** IE isn't very good so it displays one character keys as full names in .key
						EG - e.key = " " to e.key = "Spacebar"
						so assuming .char is one character we'll use that instead **/
		if (e.char && e.char.length == 1) {
			pressedKey = e.char
		} else {
			pressedKey = e.key
		}

		if (pressedKey.length == 1 && e.shiftKey && e.ctrlKey) {
			// allows ctrl + shift + v for pasting
			// and dont forward those keys to the terminal
			if (e.key == 'V') {
				return false
			}
		}

		return
	})
}

// Starts the SSH client in scripts/transport.js
function startSSHy() {
	var html_ipaddress = document.getElementById('ipaddress').value
	var termUsername = document.getElementById('username').value
	var termPassword = document.getElementById('password').value

	if (wsproxyEncoding == 'binary') {
	} else {
		wsproxyEncoding = 'base64'
	}

	// find the port number
	if (html_ipaddress.includes(':')) {
		var split = html_ipaddress.split(':')
		html_ipaddress = split[0]
		html_port = validate_port(split[1])
	} else {
		html_port = 22
	}

	if (termUsername.length == 0 || termPassword.length == 0) {
		validate('username', termUsername)
		validate('password', termPassword)
		return
	}

	// Error checking is done so remove any currently displayed errors
	document.getElementById('failure').style.display = 'none'
	document.getElementById('connect').value = 'Connecting...'
	document.getElementById('load-container').style.display = 'block'

	// Disable websocket proxy modifications
	document.getElementById('websockURL').disabled = true

	// Initialise the window title
	document.title = 'SSHy Client'
	// Opens the websocket!
	wsproxyURL += html_ipaddress + ':' + html_port

	if (wsproxyEncoding == 'binary') {
		ws = new WebSocket(wsproxyURL)
		ws.binaryType = 'arraybuffer'
	} else {
		ws = new WebSocket(wsproxyURL, 'base64')
	}

	// Sets up websocket listeners
	ws.onopen = function (e) {
		transport = new SSHyClient.Transport(ws, settings)
		transport.auth.termUsername = termUsername
		transport.auth.termPassword = termPassword
		transport.auth.hostname = html_ipaddress
	}
	// Send all recieved messages to SSHyClient.Transport.handle()
	ws.onmessage = function (e) {
		// Convert the recieved data from base64 to a string
		if (wsproxyEncoding == 'binary') {
			// ArrayBuffer to String
			transport.parceler.handle(ab2str(e.data))
		} else {
			// Convert the recieved data from base64 to a string
			transport.parceler.handle(atob(e.data))
		}
	}
	// Whenever the websocket is closed make sure to display an error if appropriate
	ws.onclose = function (e) {
		// Set the sidenav websocket proxy color to yellow
		document.getElementById('websockURL').classList.remove('brightgreen')
		document.getElementById('websockURL').classList.add('brightyellow')
		if (term) {
			// Don't display an error if SSH transport has already detected a graceful exit
			if (transport.closing) {
				return
			}
			term.write(
				'\n\n\rWebsocket connection to ' +
					transport.auth.hostname +
					' was unexpectedly closed.'
			)
			// If there is no keepAliveInterval then inform users they can use it
			if (!settings.keepAliveInterval) {
				term.write(
					'\n\n\rThis was likely caused by he remote SSH server timing out the session due to inactivity.\r\n- Session Keep Alive interval can be set in the settings to prevent this behaviour.'
				)
			}
		} else {
			// Since no terminal exists we need to initialse one before being able to write the error
			termInit()
			term.write(
				'WebSocket connection failed: Error in connection establishment: code ' +
					e.code
			)
		}
	}
	// Just a little abstraction from ws.send
	ws.sendB64 = function (e) {
		if (wsproxyEncoding == 'binary') {
			this.send(str2ab(e))

			transport.parceler.transmitData += e.length
			transport.settings.setNetTraffic(
				transport.parceler.transmitData,
				false
			)
		} else {
			this.send(btoa(e))
			transport.parceler.transmitData += e.length
			settings.setNetTraffic(transport.parceler.transmitData, false)
		}
	}

	// Set the sidenav websocket proxy color to green
	document.getElementById('websockURL').classList.add('brightgreen')
}

document.title = title
document.querySelector('#ipaddress').value = defaultHost
document.querySelector('#username').value = defaultLogin
