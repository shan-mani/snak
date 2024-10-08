function B2BRetention() {
    this.valid_script = false;
    this.valid_account = false;
    this.valid_domain = false;
    this.valid_geo = false;
    this.valid_cookie_consent = true;
    this.using_proxy = false;
    this.has_valid_id = false;
    this.ver = '';
    this.has_ls = false;
    this.do_debug = false;
    this.has_console = (window.console && console.error);
    this.script_url = document.currentScript.src;

    // Dynamic variables set on script creation.
    this.label = "ZQ6J2RHD9R6D";

    // Feature set enabled or disabled settings
    this.auto_trigger_collection_after_time = null;
    this.auto_trigger_collection_after_pageviews = 1;
    this.domains = ['digitalsurgeons.com'];
    this.disable_events = false;
    this.geo_fence = true;
    this.wait_for_hs = false;

    // URLs for the API Gateway
    this.api_gateway = "9xgnrndqve";
}

B2BRetention.prototype.prep_service = function () {
    try {this.ver = reb2b.SNIPPET_VERSION;} catch {}

    _reb2b.validate_script();
    _reb2b.check_double_load();
    _reb2b.check_local_storage();
    _reb2b.process_url();
    _reb2b.fetch_keys();
    _reb2b.validate_cookie_consent();
    _reb2b.check_geo();
}

B2BRetention.prototype.validate_script = function () {
    this.valid_script = this.script_url.startsWith("https://s3-us-west-2.amazonaws.com/b2bjsstore/b/");

    if (navigator.cookieEnabled) {
    } else {
        // JS is disabled - don't bother sending anything.
        this.valid_script = false;
    }

    let ua = navigator.userAgent || navigator.vendor || window.opera;
    if ((ua.indexOf("Instagram") > -1) || (ua.indexOf("Googlebot") > -1) || (ua.indexOf("Bingbot") > -1) || (ua.indexOf("Msnbot") > -1) || (ua.indexOf("yandex") > -1) || (ua.indexOf("facebookexternalhit") > -1)) {
        this.valid_script = false;
    }

    let account_id_script = this.script_url.match(/b2bjsstore\/b\/(.*?)\/reb2b.js/);
    if (account_id_script[1].toLowerCase() === this.label.toLowerCase()) {
        this.valid_account = true;
    }

    if (this.domains.length > 0) {
        for (let i = 0; i < this.domains.length; i++) {
            let domain = this.domains[i];
            if (location.host.includes(domain)) {
                this.valid_domain = true;
            }
        }
    }

    if (location.href.includes("vge=true")) {
        this.do_debug = true;
    }
}

// Set a 1s cookie in case they try and load the script multiple times?
B2BRetention.prototype.check_double_load = function () {
    // We should never load inside an IFRAME!
    if (window.location !== window.parent.location){
        this.valid_script = false;
        return;
    }

    let script_already_loaded = document.cookie.split("; ").find((row) => row.startsWith("_reb2bloaded="))?.split("=")[1];
    if (script_already_loaded === "true") {
        this.valid_script = false;
        return;
     }
    document.cookie = "_reb2bloaded=true;max-age=1;secure;samesite=strict;path=/";
}

B2BRetention.prototype.check_local_storage = function () {
    try {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('b2b_feature_test', 'yes');
            if (localStorage.getItem('b2b_feature_test') === 'yes') {
                localStorage.removeItem('b2b_feature_test');
                this.has_ls = true;
            }
        }
    } catch (e) {}
}

B2BRetention.prototype.process_url = function () {
    if (document.referrer && document.referrer.hostname !== location.hostname) {
        // Store the referrer for 30 days.
        _reb2b.store_key("_reb2bref", document.referrer, 60 * 60 * 24 * 15, 0, true);
    }
}

B2BRetention.prototype.process_triggers = function() {
    try {
        // Auto trigger collection after time or pageviews
        if (this.auto_trigger_collection_after_time !== null && this.auto_trigger_collection_after_time > 0) {
            setTimeout(function(){ _reb2b.collect(); }, this.auto_trigger_collection_after_time * 1000);
        }

        if (this.auto_trigger_collection_after_pageviews !== null && this.auto_trigger_collection_after_pageviews > 0) {
            if (this.auto_trigger_collection_after_pageviews === 1) {
                _reb2b.collect();
            } else {
                let pv = document.cookie.split("; ").find((row) => row.startsWith("_reb2bpv="))?.split("=")[1];
                if (pv !== undefined) {
                    pv = parseInt(pv) + 1;
                    document.cookie = "_reb2bpv=" + pv + ";max-age=" + (60 * 60) + ";secure;samesite=strict;path=/";
                    if (pv >= this.auto_trigger_collection_after_pageviews) {
                        _reb2b.collect();
                    }
                } else {
                    document.cookie = "_reb2bpv=1;max-age=" + (60 * 60) + ";secure;samesite=strict;path=/";
                }
            }
        }
    } catch {}
}

B2BRetention.prototype.process_key = function (key, remove_btao_key) {
    let value = null;

    if (this.has_ls) {
        value = localStorage.getItem(key);
    }
    if (value === null) {
        value = document.cookie.split("; ").find((row) => row.startsWith(key + '='))?.split("=")[1];
    }
    if (value !== null && value !== undefined && remove_btao_key && value.length >= 32) {
        value = value.replace(this.label, '');
        value = atob(value);
    }
    return value;
}

B2BRetention.prototype.store_key = function (key, value, age, btao_key_idx, load_to_local_storage) {
    if (btao_key_idx > 0) {
        value = btoa(value);
        value = value.slice(0, btao_key_idx) + this.label + value.slice(btao_key_idx);
    }
    document.cookie = key + '=' + value + ";max-age=" + age + ";secure;samesite=strict;path=/";
    if (load_to_local_storage && this.has_ls) localStorage.setItem(key, value);
}

B2BRetention.prototype.fetch_keys = function () {
    if (this.valid_script) {
        _reb2b.uuidv4();
        _reb2b.session_id();

        this.uuid = _reb2b.process_key("_reb2buid", false);
        this.session_id = _reb2b.process_key("_reb2bsessionID", false);
        this.external_id = _reb2b.process_key("_reb2beid", false);
        this.li_md5 = _reb2b.process_key("_reb2bli", true);
        this.li_sha2 = _reb2b.process_key("_reb2bsha", true);
        this.td_md5 = _reb2b.process_key("_reb2btd", true);
        this.fbp = _reb2b.process_key("_fbp", false);
        this.fbc = _reb2b.process_key("_fbc", false);
        this.referrer = _reb2b.process_key("_reb2bref", false);
        this.geo = _reb2b.process_key("_reb2bgeo", false);
        this.re_resolve = _reb2b.process_key("_reb2bresolve", false);

        // Check if we have a valid US geo.
        if (this.geo) {
            let geo_data = JSON.parse(decodeURIComponent(this.geo));
            if (geo_data.proxy == true)
                this.using_proxy = true;
            if (geo_data.countryCode == "US")
                this.valid_geo = true;
            if (!geo_data.hasOwnProperty("proxy")) {
                document.cookie = "_reb2bgeo=;expires=Thu, 01 Jan 1970 00:00:00 GMT;secure;samesite=strict;path=/";
            }
        }

        // If we don't care about geo fencing - we have a valid geo.
        if (!this.geo_fence)
            this.valid_geo = true;

        // If any of the cookies are set - we have a valid ID.
        if ((this.li_md5 && this.li_md5.length == 32) || (this.td_md5 && this.td_md5.length == 32)) {
            this.has_valid_id = true;
        }
    }
}

B2BRetention.prototype.validate_cookie_consent = function () {
    if (this.valid_script) {
        // Grab the cookieyes-consent cookie
        let cookie_consent_value = _reb2b.process_key("cookieyes-consent", false);

        if (cookie_consent_value) {
            let keyValuePairs = cookie_consent_value.split(",");

            // Create an empty object to store key-value pairs
            let keyValueObject = {};

            // Loop through the key-value pairs and add them to the object
            for (const pair of keyValuePairs) {
                const [key, value] = pair.split(":");
                keyValueObject[key.trim()] = value.trim();
            }

            let advertisementValue = keyValueObject.advertisement;

            if (advertisementValue === "no" || advertisementValue === "") {
                this.valid_cookie_consent = false;
                // Check back every X seconds for a yes value
                setTimeout(function() {_reb2b.validate_cookie_consent();}, 600);
            } else {
                if (!this.valid_cookie_consent) {
                    this.valid_cookie_consent = true;
                    _reb2b.check_geo();
                }
            }
        } else {
            // If no cookie - check the code to make sure it isn't there in the JS
            let htmlContent = document.documentElement.innerHTML;
            if (htmlContent.includes("https://cdn-cookieyes.com/")) {
                this.valid_cookie_consent = false;
                // Check back every X seconds for a cookie
                setTimeout(function() {_reb2b.validate_cookie_consent();}, 600);
            }
        }
    }
}

B2BRetention.prototype.grab_other_cookies = function () {
    this.hs_hubspotutk = _reb2b.process_key("hubspotutk", false);
}

B2BRetention.prototype.check_geo = function () {
    if (this.valid_script && this.valid_cookie_consent) {
        if (!this.geo) {
            _reb2b.trigger_geo();
        } else {
            _reb2b.capture_ids();
        }
    }
}

B2BRetention.prototype.trigger_geo = function () {
    fetch('https://pro.ip-api.com/json?key=zPwv6i0dpmS2yR5&fields=proxy,hosting,isp,lat,long,zip,city,region,status,country,timezone,regionName,countryCode')
        .then(res => res.json())
        .then(resJson => {
            this.geo = encodeURIComponent(JSON.stringify(resJson));
            if (resJson.proxy == true) {
                this.using_proxy = true;
            }
            if (resJson.countryCode == "US") {
                this.valid_geo = true;
                _reb2b.capture_ids();
            }
            _reb2b.store_key("_reb2bgeo", encodeURIComponent(JSON.stringify(resJson)), 60 * 60 * 24 * 20, 0, false);
        });
}

B2BRetention.prototype.capture_ids = function () {
    if (this.valid_script && this.valid_geo) {
        if (!this.has_valid_id) {
            if (!this.re_resolve) {
                this.re_resolve = 1;
            } else {
                this.re_resolve = parseInt(this.re_resolve) + 1;
            }

            if (this.re_resolve <= 5) {
                // Set a 2 day cookie - no reason to rerun this for 48 hours if it ran more then 5x
                document.cookie = '_reb2bresolve=' + this.re_resolve + ";max-age=" + (60 * 60 * 24 * 2) + ";secure;samesite=strict;path=/";

                _reb2b.trigger_td();
                _reb2b.trigger_li();
            }
        } else {
            _reb2b.process_triggers();
        }
    }
}

B2BRetention.prototype.trigger_td = function () {
    fetch('https://alocdn.com/c/vn3d8u2u/a/xtarget/p.json', {credentials: 'include'})
        .then(res => res.json())
        .then(resJson => {
            if (resJson.md5_email) {
                this.has_valid_id = true;
                this.td_md5 = resJson.md5_email;
                setTimeout(function() {_reb2b.process_triggers();}, 50);
                _reb2b.store_key("_reb2btd", resJson.md5_email, 60 * 60 * 24 * 30, 9, false);
            }
        });
}

B2BRetention.prototype.trigger_li = function () {
    window.liQ = window.liQ || [];
    window.liQ.push({config: {sync: false, identityResolutionConfig: {publisherId: 72731}}})
    let scriptTag = document.createElement('script');
    scriptTag.src = 'https://b-code.liadm.com/lc2.js';
    scriptTag['onload'] = function () {_reb2b.fetch_li_id();}
    document.head.appendChild(scriptTag);
}

B2BRetention.prototype.fetch_li_id = function () {
    var qf = 0.3
    if (this.using_proxy)
        qf = 0.7;

    window.liQ.resolve(
        function (rd) {
            if (rd.md5) {
                _reb2b.has_valid_id = true;
                _reb2b.li_md5 = rd.md5;
                setTimeout(function() {_reb2b.process_triggers();}, 50);
                _reb2b.store_key("_reb2bli", rd.md5, 60 * 60 * 24 * 30, 6, false);
            }
            if (rd.sha2) {
                _reb2b.li_sha2 = rd.sha2;
                _reb2b.store_key("_reb2bsha", rd.sha2, 60 * 60 * 24 * 30, 18, false);
            }
        },
        function (err) {},
        {qf: qf, resolve: ["md5", "sha2"]});
}

B2BRetention.prototype.uuidv4 = function () {
    // Check local storage
    let geuid = _reb2b.process_key("_reb2buid", 0);
    if (geuid) {
        return;
    }

    try {
        geuid = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
    } catch {
        geuid = Math.random().toString(36).substr(2, 7) + '-' + Math.random().toString(36).substr(2, 7) + '-' + Math.random().toString(36).substr(2, 7);
    }

    geuid = geuid + '-' + (new Date().getTime());

    _reb2b.store_key("_reb2buid", geuid, 60 * 60 * 24 * 360, 0, true);
}

B2BRetention.prototype.session_id = function () {
    let sessionID = _reb2b.process_key("_reb2bsessionID", 0);
    if (!sessionID) {
        sessionID = "";
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 24; i++) {
            // Choose a random character from the characters string
            const randomIndex = Math.floor(Math.random() * characters.length);
            sessionID += characters.charAt(randomIndex);
        }
    }

    _reb2b.store_key("_reb2bsessionID", sessionID, 60 * 30, 0, false);
}

B2BRetention.prototype.assignIdentity = function (info) {
    if (!info) {
        _reb2b.log_error("Retention.com - invalid identity information");
        return;
    }

    this.external_id = info.toString();
    _reb2b.store_key("_reb2beid", info.toString(), 60 * 60 * 24 * 360, 0, true);
}

// For some odd reason we can't call a setTimeout on yourself!
B2BRetention.prototype.recollect = function () {
    _reb2b.collect();
}

let coc_idx = 0;
B2BRetention.prototype.collect = function () {
    if (!this.valid_script || !this.valid_account || !this.valid_domain) {
        return;
    }

    if (this.do_debug) {
        // Do the debugger....
    } else {
        if (!this.has_valid_id) return;
        if (this.collect_triggered) return;

        let ge_event = _reb2b.append_keys('collect');

        if (this.wait_for_hs && !this.hs_hubspotutk) {
            coc_idx++;
            if (coc_idx <= 10) {
                setTimeout(_reb2b.recollect, 50 * coc_idx);
                return;
            }
        }

        // We only need to collect 1x per page load
        this.collect_triggered = true;

        _reb2b.send_to_gateway(ge_event, this.api_gateway, 'b2b');
    }
};

B2BRetention.prototype.send_to_gateway = function (event_obj, url, endpoint) {
    if (this.has_valid_id && this.valid_geo && !this.disable_events) {
        let u = "https://" + url + ".execute-api.us-west-2.amazonaws.com/" + endpoint;

        let d = btoa(_reb2b.clean_string(JSON.stringify(event_obj)));

        fetch(u, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: d})
    }
}

B2BRetention.prototype.append_keys = function (eventName) {
    _reb2b.grab_other_cookies();

    let re_obj = {account_data: {}, extra_data: {}};

    re_obj.label = this.label;
    re_obj.type = eventName;

    if (this.li_md5) re_obj.account_data.li_md5 = this.li_md5;
    if (this.li_sha2) re_obj.account_data.li_sha256 = this.li_sha2;
    if (this.td_md5) re_obj.account_data.td_md5 = this.td_md5;
    if (this.fbp) re_obj.extra_data.fbp = this.fbp;
    if (this.fbc) re_obj.extra_data.fbc = this.fbc;
    if (this.hs_hubspotutk) re_obj.extra_data.hs_hubspotutk = this.hs_hubspotutk;
    if (this.external_id) re_obj.extra_data.external_id = this.external_id;
    if (this.referrer) re_obj.extra_data.referrer = this.referrer;
    if (document.referrer) re_obj.extra_data.last_referrer = document.referrer;
    if (document.title) re_obj.extra_data.title = _reb2b.clean_string(document.title);
    if (document.location && document.location.href)
        re_obj.extra_data.url = document.location.href;
    else if (document.documentURI)
        re_obj.extra_data.url = document.documentURI;
    re_obj.extra_data.session_id = this.session_id;
    re_obj.extra_data.guid = this.uuid;
    re_obj.extra_data.version = this.ver;
    re_obj.extra_data.script_url = this.script_url;
    if (this.extra_ids)
        re_obj.extra_data.extra_ids = this.extra_ids;
    if (this.geo)
        re_obj.extra_data.geo = JSON.parse(decodeURIComponent(this.geo));

    return re_obj
}

B2BRetention.prototype.clean_string = function (input) {
    let output = "";
    for (let i = 0; i < input.length; i++) {
        if (input.charCodeAt(i) <= 127) {
            output += input.charAt(i);
        }
    }
    return output;
}

B2BRetention.prototype.log_error = function (message) {
    if (this.has_console) {
        console.log(message);
    }
};

B2BRetention.prototype.run_pending_jobs = function (queue) {
    if (!this.valid_script || !this.valid_domain) return;

    if (queue === undefined) {
        return;
    }

    if (queue && Array.isArray(queue)) {
        queue.forEach(function (item) {
            let fn = item.shift();
            switch (fn) {
                case "identify":
                    _reb2b.identify(item[0]);
                    break;
            }
        });
    }
};

_reb2b = new B2BRetention();
_reb2b.prep_service();
_reb2b.run_pending_jobs(window.reb2b);
window.reb2b = _reb2b;

// If we are in verify mode, we need to send a message back to the parent window
if (location.href.includes("verifyge=true")) {
    if (window.opener && !window.opener.closed) {
        window.opener.postMessage("verify_script~" + _reb2b.label, "*");
        window.close();
    }
}
