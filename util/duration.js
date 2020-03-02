/* global define */
/**
 * A simple digital time-formatter into months, days, hours, minutes and seconds!
 * This code is horribly made, please do not try to learn anything from it.
 * We can neither provide support, nor aim to claim this as ours. This was taken from some unknown source.
 */
const moment = require("moment");
!(function(e, t) {
  if ("function" == typeof define && define.amd) define(["moment"], t);
  else if ("object" == typeof exports)
    try {
      module.exports = t(require("moment"));
    } catch (e) {
      module.exports = t;
    }
  e && (e.momentDurationFormatSetup = e.moment ? t(e.moment) : t);
})(this, function(ee) {
  var te = !1,
    D = !1,
    ne = "escape years months weeks days hours minutes seconds milliseconds general".split(
      " "
    ),
    ie = [
      {
        type: "seconds",
        targets: [
          { type: "minutes", value: 60 },
          { type: "hours", value: 3600 },
          { type: "days", value: 86400 },
          { type: "weeks", value: 604800 },
          { type: "months", value: 2678400 },
          { type: "years", value: 31536e3 }
        ]
      },
      {
        type: "minutes",
        targets: [
          { type: "hours", value: 60 },
          { type: "days", value: 1440 },
          { type: "weeks", value: 10080 },
          { type: "months", value: 44640 },
          { type: "years", value: 525600 }
        ]
      },
      {
        type: "hours",
        targets: [
          { type: "days", value: 24 },
          { type: "weeks", value: 168 },
          { type: "months", value: 744 },
          { type: "years", value: 8760 }
        ]
      },
      {
        type: "days",
        targets: [
          { type: "weeks", value: 7 },
          { type: "months", value: 31 },
          { type: "years", value: 365 }
        ]
      },
      { type: "months", targets: [{ type: "years", value: 12 }] }
    ];
  function re(e, t) {
    return !(t.length > e.length) && -1 !== e.indexOf(t);
  }
  function L(e) {
    for (var t = ""; e; ) (t += "0"), (e -= 1);
    return t;
  }
  function ae(e, t, n) {
    var i,
      r,
      a,
      u = t.useToLocaleString,
      o = t.useGrouping,
      l = o && t.grouping.slice(),
      s = t.maximumSignificantDigits,
      c = t.minimumIntegerDigits || 1,
      m = t.fractionDigits || 0,
      g = t.groupingSeparator,
      p = t.decimalSeparator;
    if (u && n) {
      var f = { minimumIntegerDigits: c, useGrouping: o };
      if (
        (m && ((f.maximumFractionDigits = m), (f.minimumFractionDigits = m)),
        s && 0 < e && (f.maximumSignificantDigits = s),
        !D)
      ) {
        var h = ve({}, t);
        (h.useGrouping = !1),
          (h.decimalSeparator = "."),
          (e = parseFloat(ae(e, h), 10));
      }
      return e.toLocaleString(n, f);
    }
    var y = (s ? e.toPrecision(s + 1) : e.toFixed(m + 1)).split("e");
    (a = y[1] || ""), (r = (y = y[0].split("."))[1] || "");
    var d = (i = y[0] || "").length,
      v = r.length,
      S = d + v,
      w = i + r;
    ((s && S === s + 1) || (!s && v === m + 1)) &&
      ((w = (function(e) {
        for (var t = e.split("").reverse(), n = 0, i = !0; i && n < t.length; )
          n
            ? "9" === t[n]
              ? (t[n] = "0")
              : ((t[n] = (parseInt(t[n], 10) + 1).toString()), (i = !1))
            : (parseInt(t[n], 10) < 5 && (i = !1), (t[n] = "0")),
            (n += 1);
        return i && t.push("1"), t.reverse().join("");
      })(w)).length ===
        S + 1 && (d += 1),
      v && (w = w.slice(0, -1)),
      (i = w.slice(0, d)),
      (r = w.slice(d))),
      s && (r = r.replace(/0*$/, ""));
    var V = parseInt(a, 10);
    0 < V
      ? (r =
          r.length <= V
            ? ((i += r += L(V - r.length)), "")
            : ((i += r.slice(0, V)), r.slice(V)))
      : V < 0 && ((r = L(Math.abs(V) - i.length) + i + r), (i = "0")),
      s ||
        ((r = r.slice(0, m)).length < m && (r += L(m - r.length)),
        i.length < c && (i = L(c - i.length) + i));
    var _,
      x = "";
    if (o)
      for (y = i; y.length; )
        l.length && (_ = l.shift()),
          x && (x = g + x),
          (x = y.slice(-_) + x),
          (y = y.slice(0, -_));
    else x = i;
    return r && (x = x + p + r), x;
  }
  function ue(e, t) {
    return e.label.length > t.label.length
      ? -1
      : e.label.length < t.label.length
      ? 1
      : 0;
  }
  var e,
    oe = {
      durationLabelsStandard: {
        S: "millisecond",
        SS: "milliseconds",
        s: "second",
        ss: "seconds",
        m: "minute",
        mm: "minutes",
        h: "hour",
        hh: "hours",
        d: "day",
        dd: "days",
        w: "week",
        ww: "weeks",
        M: "month",
        MM: "months",
        y: "year",
        yy: "years"
      },
      durationLabelsShort: {
        S: "msec",
        SS: "msecs",
        s: "sec",
        ss: "secs",
        m: "min",
        mm: "mins",
        h: "hr",
        hh: "hrs",
        d: "dy",
        dd: "dys",
        w: "wk",
        ww: "wks",
        M: "mo",
        MM: "mos",
        y: "yr",
        yy: "yrs"
      },
      durationTimeTemplates: { HMS: "h:mm:ss", HM: "h:mm", MS: "m:ss" },
      durationLabelTypes: [
        { type: "standard", string: "__" },
        { type: "short", string: "_" }
      ],
      durationPluralKey: function(e, t, n) {
        return 1 === t && null === n ? e : e + e;
      }
    };
  function le(e) {
    return "[object Array]" === Object.prototype.toString.call(e);
  }
  function se(e) {
    return "[object Object]" === Object.prototype.toString.call(e);
  }
  function ce(e, t) {
    var n,
      i = 0,
      r = (e && e.length) || 0;
    for (
      "function" != typeof t &&
      ((n = t),
      (t = function(e) {
        return e === n;
      }));
      i < r;

    ) {
      if (t(e[i])) return e[i];
      i += 1;
    }
  }
  function me(e, t) {
    var n = 0,
      i = e.length;
    if (e && i)
      for (; n < i; ) {
        if (!1 === t(e[n], n)) return;
        n += 1;
      }
  }
  function ge(e, t) {
    var n = 0,
      i = e.length,
      r = [];
    if (!e || !i) return r;
    for (; n < i; ) (r[n] = t(e[n], n)), (n += 1);
    return r;
  }
  function pe(e, t) {
    return ge(e, function(e) {
      return e[t];
    });
  }
  function fe(e) {
    var t = [];
    return (
      me(e, function(e) {
        e && t.push(e);
      }),
      t
    );
  }
  function he(e) {
    var t = [];
    return (
      me(e, function(e) {
        ce(t, e) || t.push(e);
      }),
      t
    );
  }
  function ye(e, n) {
    var i = [];
    return (
      me(e, function(t) {
        me(n, function(e) {
          t === e && i.push(t);
        });
      }),
      he(i)
    );
  }
  function de(n, i) {
    var r = [];
    return (
      me(n, function(e, t) {
        if (!i(e)) return (r = n.slice(t)), !1;
      }),
      r
    );
  }
  function ve(e, t) {
    for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
    return e;
  }
  function Se(e) {
    var t = [];
    for (var n in e) e.hasOwnProperty(n) && t.push(n);
    return t;
  }
  function we(e, t) {
    var n = 0,
      i = e.length;
    if (!e || !i) return !1;
    for (; n < i; ) {
      if (!0 === t(e[n], n)) return !0;
      n += 1;
    }
    return !1;
  }
  function t() {
    var n,
      e = [].slice.call(arguments),
      i = {};
    if (
      (me(e, function(e, t) {
        if (!t) {
          if (!le(e))
            throw "Expected array as the first argument to durationsFormat.";
          n = e;
        }
        "string" != typeof e && "function" != typeof e
          ? "number" != typeof e
            ? se(e) && ve(i, e)
            : (i.precision = e)
          : (i.template = e);
      }),
      !n || !n.length)
    )
      return [];
    i.returnMomentTypes = !0;
    var t,
      r = ge(n, function(e) {
        return e.format(i);
      }),
      a = ye(
        ne,
        he(
          pe(
            ((t = []),
            me(r, function(e) {
              t = t.concat(e);
            }),
            t),
            "type"
          )
        )
      ),
      u = i.largest;
    return (
      u && (a = a.slice(0, u)),
      (i.returnMomentTypes = !1),
      (i.outputTypes = a),
      ge(n, function(e) {
        return e.format(i);
      })
    );
  }
  function n() {
    var e = [].slice.call(arguments),
      l = ve({}, this.format.defaults),
      t = this.asMilliseconds(),
      n = this.asMonths();
    "function" == typeof this.isValid && !1 === this.isValid() && (n = t = 0);
    var i = t < 0,
      s = ee.duration(Math.abs(t), "milliseconds"),
      c = ee.duration(Math.abs(n), "months");
    me(e, function(e) {
      "string" != typeof e && "function" != typeof e
        ? "number" != typeof e
          ? se(e) && ve(l, e)
          : (l.precision = e)
        : (l.template = e);
    });
    var m = {
        years: "y",
        months: "M",
        weeks: "w",
        days: "d",
        hours: "h",
        minutes: "m",
        seconds: "s",
        milliseconds: "S"
      },
      r = {
        escape: /\[(.+?)\]/,
        years: /\*?[Yy]+/,
        months: /\*?M+/,
        weeks: /\*?[Ww]+/,
        days: /\*?[Dd]+/,
        hours: /\*?[Hh]+/,
        minutes: /\*?m+/,
        seconds: /\*?s+/,
        milliseconds: /\*?S+/,
        general: /.+?/
      };
    l.types = ne;
    var a = function(t) {
        return ce(ne, function(e) {
          return r[e].test(t);
        });
      },
      u = new RegExp(
        ge(ne, function(e) {
          return r[e].source;
        }).join("|"),
        "g"
      );
    l.duration = this;
    var o = "function" == typeof l.template ? l.template.apply(l) : l.template,
      g = l.outputTypes,
      p = l.returnMomentTypes,
      f = l.largest,
      h = [];
    g ||
      (le(l.stopTrim) && (l.stopTrim = l.stopTrim.join("")),
      l.stopTrim &&
        me(l.stopTrim.match(u), function(e) {
          var t = a(e);
          "escape" !== t && "general" !== t && h.push(t);
        }));
    var y = ee.localeData();
    y || (y = {}),
      me(Se(oe), function(e) {
        "function" != typeof oe[e]
          ? y["_" + e] || (y["_" + e] = oe[e])
          : y[e] || (y[e] = oe[e]);
      }),
      me(Se(y._durationTimeTemplates), function(e) {
        o = o.replace("_" + e + "_", y._durationTimeTemplates[e]);
      });
    var d = l.userLocale || ee.locale(),
      v = l.useLeftUnits,
      S = l.usePlural,
      w = l.precision,
      V = l.forceLength,
      _ = l.useGrouping,
      x = l.trunc,
      D = l.useSignificantDigits && 0 < w,
      L = D ? l.precision : 0,
      b = L,
      M = l.minValue,
      k = !1,
      T = l.maxValue,
      F = !1,
      I = l.useToLocaleString,
      j = l.groupingSeparator,
      G = l.decimalSeparator,
      E = l.grouping;
    I = I && te;
    var P = l.trim;
    le(P) && (P = P.join(" ")),
      null === P && (f || T || D) && (P = "all"),
      (null !== P && !0 !== P && "left" !== P && "right" !== P) ||
        (P = "large"),
      !1 === P && (P = "");
    var O = function(e) {
        return e.test(P);
      },
      H = /both/,
      $ = /^all|[^sm]all/,
      K = 0 < f || we([/large/, H, $], O),
      R = we([/small/, H, $], O),
      U = we([/mid/, $], O),
      q = we([/final/, $], O),
      A = ge(o.match(u), function(e, t) {
        var n = a(e);
        return (
          "*" === e.slice(0, 1) &&
            ((e = e.slice(1)), "escape" !== n && "general" !== n && h.push(n)),
          {
            index: t,
            length: e.length,
            text: "",
            token: "escape" === n ? e.replace(r.escape, "$1") : e,
            type: "escape" === n || "general" === n ? null : n
          }
        );
      }),
      C = { index: 0, length: 0, token: "", text: "", type: null },
      W = [];
    v && A.reverse(),
      me(A, function(e) {
        if (e.type) return (C.type || C.text) && W.push(C), void (C = e);
        v ? (C.text = e.token + C.text) : (C.text += e.token);
      }),
      (C.type || C.text) && W.push(C),
      v && W.reverse();
    var Y = ye(ne, he(fe(pe(W, "type"))));
    if (!Y.length) return pe(W, "text").join("");
    Y = ge(Y, function(t, e) {
      var n,
        i = e + 1 === Y.length,
        r = !e;
      n = "years" === t || "months" === t ? c.as(t) : s.as(t);
      var a = Math.floor(n),
        u = n - a,
        o = ce(W, function(e) {
          return t === e.type;
        });
      return (
        r && T && T < n && (F = !0),
        i && M && Math.abs(l.duration.as(t)) < M && (k = !0),
        r && null === V && 1 < o.length && (V = !0),
        s.subtract(a, t),
        c.subtract(a, t),
        {
          rawValue: n,
          wholeValue: a,
          decimalValue: i ? u : 0,
          isSmallest: i,
          isLargest: r,
          type: t,
          tokenLength: o.length
        }
      );
    });
    var z,
      B = x ? Math.floor : Math.round,
      J = function(e, t) {
        var n = Math.pow(10, t);
        return B(e * n) / n;
      },
      N = !1,
      Q = !1,
      X = function(e, t) {
        var n = {
          useGrouping: _,
          groupingSeparator: j,
          decimalSeparator: G,
          grouping: E,
          useToLocaleString: I
        };
        return (
          D &&
            (L <= 0
              ? ((e.rawValue = 0), (e.wholeValue = 0), (e.decimalValue = 0))
              : ((n.maximumSignificantDigits = L), (e.significantDigits = L))),
          F &&
            !Q &&
            (e.isLargest ? (e.wholeValue = T) : (e.wholeValue = 0),
            (e.decimalValue = 0)),
          k &&
            !Q &&
            (e.isSmallest ? (e.wholeValue = M) : (e.wholeValue = 0),
            (e.decimalValue = 0)),
          e.isSmallest ||
          (e.significantDigits &&
            e.significantDigits - e.wholeValue.toString().length <= 0)
            ? w < 0
              ? (e.value = J(e.wholeValue, w))
              : 0 === w
              ? (e.value = B(e.wholeValue + e.decimalValue))
              : D
              ? ((e.value = x
                  ? J(e.rawValue, L - e.wholeValue.toString().length)
                  : e.rawValue),
                e.wholeValue && (L -= e.wholeValue.toString().length))
              : ((n.fractionDigits = w),
                (e.value = x
                  ? e.wholeValue + J(e.decimalValue, w)
                  : e.wholeValue + e.decimalValue))
            : D && e.wholeValue
            ? ((e.value = Math.round(
                J(
                  e.wholeValue,
                  e.significantDigits - e.wholeValue.toString().length
                )
              )),
              (L -= e.wholeValue.toString().length))
            : (e.value = e.wholeValue),
          1 < e.tokenLength &&
            (V || N) &&
            ((n.minimumIntegerDigits = e.tokenLength),
            Q &&
              n.maximumSignificantDigits < e.tokenLength &&
              delete n.maximumSignificantDigits),
          !N &&
            (0 < e.value || "" === P || ce(h, e.type) || ce(g, e.type)) &&
            (N = !0),
          (e.formattedValue = ae(e.value, n, d)),
          (n.useGrouping = !1),
          (n.decimalSeparator = "."),
          (e.formattedValueEn = ae(e.value, n, "en")),
          2 === e.tokenLength &&
            "milliseconds" === e.type &&
            (e.formattedValueMS = ae(
              e.value,
              { minimumIntegerDigits: 3, useGrouping: !1 },
              "en"
            ).slice(0, 2)),
          e
        );
      };
    if (1 < (Y = fe((Y = ge(Y, X)))).length) {
      var Z = function(t) {
        return ce(Y, function(e) {
          return e.type === t;
        });
      };
      me(ie, function(e) {
        var n = Z(e.type);
        n &&
          me(e.targets, function(e) {
            var t = Z(e.type);
            t &&
              parseInt(n.formattedValueEn, 10) === e.value &&
              ((n.rawValue = 0),
              (n.wholeValue = 0),
              (n.decimalValue = 0),
              (t.rawValue += 1),
              (t.wholeValue += 1),
              (t.decimalValue = 0),
              (t.formattedValueEn = t.wholeValue.toString()),
              (Q = !0));
          });
      });
    }
    return (
      Q && ((N = !1), (L = b), (Y = fe((Y = ge(Y, X))))),
      !g || (F && !l.trim)
        ? (K &&
            (Y = de(Y, function(e) {
              return !e.isSmallest && !e.wholeValue && !ce(h, e.type);
            })),
          f && Y.length && (Y = Y.slice(0, f)),
          R &&
            1 < Y.length &&
            ((z = function(e) {
              return !e.wholeValue && !ce(h, e.type) && !e.isLargest;
            }),
            (Y = de(Y.slice().reverse(), z).reverse())),
          U &&
            (Y = fe(
              (Y = ge(Y, function(e, t) {
                return 0 < t && t < Y.length - 1 && !e.wholeValue ? null : e;
              }))
            )),
          !q ||
            1 !== Y.length ||
            Y[0].wholeValue ||
            (!x && Y[0].isSmallest && Y[0].rawValue < M) ||
            (Y = []))
        : (Y = fe(
            (Y = ge(Y, function(t) {
              return ce(g, function(e) {
                return t.type === e;
              })
                ? t
                : null;
            }))
          )),
      p
        ? Y
        : (me(W, function(n) {
            var e = m[n.type],
              t = ce(Y, function(e) {
                return e.type === n.type;
              });
            if (e && t) {
              var i = t.formattedValueEn.split(".");
              (i[0] = parseInt(i[0], 10)),
                i[1] ? (i[1] = parseFloat("0." + i[1], 10)) : (i[1] = null);
              var r,
                a,
                u,
                o = y.durationPluralKey(e, i[0], i[1]),
                l =
                  ((r = e),
                  (u = []),
                  me(Se((a = y)), function(t) {
                    if ("_durationLabels" === t.slice(0, 15)) {
                      var n = t.slice(15).toLowerCase();
                      me(Se(a[t]), function(e) {
                        e.slice(0, 1) === r &&
                          u.push({ type: n, key: e, label: a[t][e] });
                      });
                    }
                  }),
                  u),
                s = !1,
                c = {};
              me(y._durationLabelTypes, function(t) {
                var e = ce(l, function(e) {
                  return e.type === t.type && e.key === o;
                });
                e &&
                  ((c[e.type] = e.label),
                  re(n.text, t.string) &&
                    ((n.text = n.text.replace(t.string, e.label)), (s = !0)));
              }),
                S &&
                  !s &&
                  (l.sort(ue),
                  me(l, function(e) {
                    return c[e.type] === e.label
                      ? !re(n.text, e.label) && void 0
                      : re(n.text, e.label)
                      ? ((n.text = n.text.replace(e.label, c[e.type])), !1)
                      : void 0;
                  }));
            }
          }),
          (W = ge(W, function(t) {
            if (!t.type) return t.text;
            var e = ce(Y, function(e) {
              return e.type === t.type;
            });
            if (!e) return "";
            var n = "";
            return (
              v && (n += t.text),
              ((i && F) || (!i && k)) && ((n += "< "), (k = F = !1)),
              ((i && k) || (!i && F)) && ((n += "> "), (k = F = !1)),
              i &&
                (0 < e.value || "" === P || ce(h, e.type) || ce(g, e.type)) &&
                ((n += "-"), (i = !1)),
              "milliseconds" === t.type && e.formattedValueMS
                ? (n += e.formattedValueMS)
                : (n += e.formattedValue),
              v || (n += t.text),
              n
            );
          }))
            .join("")
            .replace(/(,| |:|\.)*$/, "")
            .replace(/^(,| |:|\.)*/, ""))
    );
  }
  function i() {
    var t = this.duration,
      e = function(e) {
        return t._data[e];
      },
      n = ce(this.types, e),
      i = (function(e, t) {
        for (var n = e.length; (n -= 1); ) if (t(e[n])) return e[n];
      })(this.types, e);
    switch (n) {
      case "milliseconds":
        return "S __";
      case "seconds":
      case "minutes":
        return "*_MS_";
      case "hours":
        return "_HMS_";
      case "days":
        if (n === i) return "d __";
      case "weeks":
        return n === i
          ? "w __"
          : (null === this.trim && (this.trim = "both"), "w __, d __, h __");
      case "months":
        if (n === i) return "M __";
      case "years":
        return n === i
          ? "y __"
          : (null === this.trim && (this.trim = "both"), "y __, M __, d __");
      default:
        return (
          null === this.trim && (this.trim = "both"),
          "y __, d __, h __, m __, s __"
        );
    }
  }
  function r(e) {
    if (!e) throw "Moment Duration Format init cannot find moment instance.";
    (e.duration.format = t),
      (e.duration.fn.format = n),
      (e.duration.fn.format.defaults = {
        trim: null,
        stopTrim: null,
        largest: null,
        maxValue: null,
        minValue: null,
        precision: 0,
        trunc: !1,
        forceLength: null,
        userLocale: null,
        usePlural: !0,
        useLeftUnits: !1,
        useGrouping: !0,
        useSignificantDigits: !1,
        template: i,
        useToLocaleString: !0,
        groupingSeparator: ",",
        decimalSeparator: ".",
        grouping: [3]
      }),
      e.updateLocale("en", oe);
  }
  return (
    (te = !!(
      (e =
        (e = !0) &&
        (function() {
          try {
            (0).toLocaleString("i");
          } catch (e) {
            return "RangeError" === e.name;
          }
          return !1;
        })()) &&
      (e =
        (e =
          (e =
            e &&
            "1" === (1).toLocaleString("en", { minimumIntegerDigits: 1 })) &&
          "01" === (1).toLocaleString("en", { minimumIntegerDigits: 2 })) &&
        "001" === (1).toLocaleString("en", { minimumIntegerDigits: 3 })) &&
      (e =
        (e =
          (e =
            (e =
              e &&
              "100" ===
                (99.99).toLocaleString("en", {
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0
                })) &&
            "100.0" ===
              (99.99).toLocaleString("en", {
                maximumFractionDigits: 1,
                minimumFractionDigits: 1
              })) &&
          "99.99" ===
            (99.99).toLocaleString("en", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2
            })) &&
        "99.990" ===
          (99.99).toLocaleString("en", {
            maximumFractionDigits: 3,
            minimumFractionDigits: 3
          })) &&
      (e =
        (e =
          (e =
            (e =
              (e =
                e &&
                "100" ===
                  (99.99).toLocaleString("en", {
                    maximumSignificantDigits: 1
                  })) &&
              "100" ===
                (99.99).toLocaleString("en", {
                  maximumSignificantDigits: 2
                })) &&
            "100" ===
              (99.99).toLocaleString("en", { maximumSignificantDigits: 3 })) &&
          "99.99" ===
            (99.99).toLocaleString("en", { maximumSignificantDigits: 4 })) &&
        "99.99" ===
          (99.99).toLocaleString("en", { maximumSignificantDigits: 5 })) &&
      (e =
        (e =
          e && "1,000" === (1e3).toLocaleString("en", { useGrouping: !0 })) &&
        "1000" === (1e3).toLocaleString("en", { useGrouping: !1 }))
    )),
    (D =
      te &&
      "3.6" ===
        (3.55).toLocaleString("en", {
          useGrouping: !1,
          minimumIntegerDigits: 1,
          minimumFractionDigits: 1,
          maximumFractionDigits: 1
        })),
    r(ee),
    r
  );
});

module.exports = {
  formatFromTime: (duration, unit, options = {}) =>
    humanizeDuration(moment.duration(duration, unit), options),
  format: (duration, options = {}) => humanizeDuration(duration, options)
};

function humanizeDuration(duration, options) {
  if (!duration) return "";
  options.milliseconds = options.ms || options.millis || options.milliseconds;
  const items = [
    ["Y", "years"],
    ["M", "months"],
    ["W", "weeks"],
    ["D", "days"],
    ["h", "hours"],
    ["m", "minutes"],
    ["s", "seconds"],
    ["S", "milliseconds"]
  ].filter(i => options[i[1]]);
  const list = [
    "years",
    "months",
    "weeks",
    "days",
    "hours",
    "minutes",
    "seconds",
    "milliseconds"
  ];
  const format = items.map(h => `${h[0]} [${h[1]}]`).join(", ");
  const final = duration
    .format(format)
    .replace(new RegExp(`(?:^|, )0 (${list.join("|")})`, "g"), "")
    .replace(
      new RegExp(
        `1 (${list.filter(i => i !== "milliseconds").join("|")})s`,
        "g"
      ),
      ""
    );
  if (!options.millisecondsToMs) return final.replace(/\d+/g, "**$&**");
  else return final.replace("milliseconds", "ms");
}
