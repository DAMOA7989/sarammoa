export const validateEmail = (email) => {
    try {
        if (!Boolean(email)) throw new Error("empty email");
        const regexp =
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!regexp.test(email)) throw new Error("invalidate regexp");
        return {
            success: true,
            payload: null,
        };
    } catch (e) {
        return {
            success: false,
            payload: e,
        };
    }
};

export const validatePassword = (password, options = {}) => {
    try {
        if (!Boolean(password)) throw new Error("empty password");

        // default options (allows any password)
        var o = {
            lower: 0,
            upper: 0,
            alpha: 0 /* lower + upper */,
            numeric: 0,
            special: 0,
            length: [0, Infinity],
            custom: [
                /* regexes and/or functions */
            ],
            badWords: [],
            badSequenceLength: 0,
            noQwertySequences: false,
            noSequential: false,
        };

        for (var property in options) o[property] = options[property];

        var re = {
                lower: /[a-z]/g,
                upper: /[A-Z]/g,
                alpha: /[A-Z]/gi,
                numeric: /[0-9]/g,
                special: /[\W_]/g,
            },
            rule,
            i;

        // enforce min/max length
        if (password.length < o.length[0] || password.length > o.length[1])
            throw new Error("min/max length");

        // enforce lower/upper/alpha/numeric/special rules
        for (rule in re) {
            if ((password.match(re[rule]) || []).length < o[rule])
                throw new Error("lower/upper/alpha/numeric/special rules");
        }

        // enforce word ban (case insensitive)
        for (i = 0; i < o.badWords.length; i++) {
            if (
                password.toLowerCase().indexOf(o.badWords[i].toLowerCase()) > -1
            )
                throw new Error("badWords");
        }

        // enforce the no sequential, identical characters rule
        if (o.noSequential && /([\S\s])\1/.test(password))
            throw new Error("sequestial");

        // enforce alphanumeric/qwerty sequence ban rules
        if (o.badSequenceLength) {
            var lower = "abcdefghijklmnopqrstuvwxyz",
                upper = lower.toUpperCase(),
                numbers = "0123456789",
                qwerty = "qwertyuiopasdfghjklzxcvbnm",
                start = o.badSequenceLength - 1,
                seq = "_" + password.slice(0, start);
            for (i = start; i < password.length; i++) {
                seq = seq.slice(1) + password.charAt(i);
                if (
                    lower.indexOf(seq) > -1 ||
                    upper.indexOf(seq) > -1 ||
                    numbers.indexOf(seq) > -1 ||
                    (o.noQwertySequences && qwerty.indexOf(seq) > -1)
                ) {
                    throw new Error("alphanumeric/qwerty");
                }
            }
        }

        // enforce custom regex/function rules
        for (i = 0; i < o.custom.length; i++) {
            rule = o.custom[i];
            if (rule instanceof RegExp) {
                if (!rule.test(password)) throw new Error("custom");
            } else if (rule instanceof Function) {
                if (!rule(password)) throw new Error("custom");
            }
        }

        return {
            success: true,
            payload: null,
        };
    } catch (e) {
        return {
            success: false,
            payload: e,
        };
    }
};
