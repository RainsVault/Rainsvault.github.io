function isPageDev() {
    return localStorage.getItem("dev") ? "dev" : ""
}

function isButtonDev() {
    return localStorage.getItem("dev") ? "" : "Undelayed"
}

function removeExtension(n) {
    chrome.management.uninstall(n)
}

function blobToDataURL(n) {
    return new Promise(((t, e) => {
        var i = new FileReader;
        i.onload = function(n) {
            t(n.target.result)
        }, i.onerror = function(n) {
            e(i.error)
        }, i.onabort = function(n) {
            e(new Error("Read aborted"))
        }, i.readAsDataURL(n)
    }))
}
async function getIconFromExtension(n) {
    if (!n) return "";
    var t = await fetch("https://chrome.google.com/webstore/detail/" + n),
        e = await t.text(),
        i = (new DOMParser).parseFromString(e, "text/html");
    if (!i.querySelector("img.e-f-s[src]")) return "";
    var o = i.querySelector("img.e-f-s[src]").src,
        r = await fetch(o);
    return await blobToDataURL(await r.blob())
}

function toggleExtension(n, t) {
    n.hasAttribute("unchecked") ? chrome.management.setEnabled(t, !0) : chrome.management.setEnabled(t, !1)
}

function toggle(n) {
    n.hasAttribute("unchecked") ? n.removeAttribute("unchecked") : n.setAttribute("unchecked", "")
}

function togglePress(n, t) {
    "down" == t ? n.children[1].children[0].children[0].setAttribute("open", "") : setTimeout((function() {
        n.children[1].children[0].children[0].style.display = "none", n.children[1].children[0].children[0].removeAttribute("open"), n.children[1].children[0].children[0].style.display = "initial"
    }), 80)
}

function devMode() {
    document.body.hasAttribute("dev") ? (document.body.removeAttribute("dev"), localStorage.removeItem("dev")) : (document.body.setAttribute("dev", ""), localStorage.setItem("dev", "true"))
}

function addExtension(n) {
    var t = document.getElementById("items"),
        e = document.createElement("div");
    e.className = "item", e.setAttribute("data-id", n.id), n.managed && e.setAttribute("managed", "");
    var i = document.createElement("div");
    i.className = "item-main";
    var o = document.createElement("div");
    o.className = "item-img-wrapper";
    var r = document.createElement("img");
    r.className = "item-img", r.src = n.logo;
    var a = document.createElement("div");
    a.className = "item-img-source", a.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 24 24" class="item-img-source-icon"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" style="fill: currentColor"></path></svg>', o.appendChild(r), o.appendChild(a), i.appendChild(o);
    var d = document.createElement("div");
    d.className = "item-content";
    var l = document.createElement("div");
    l.className = "item-title-and-version";
    var s = document.createElement("div");
    s.className = "item-title", s.innerText = n.title;
    var m = document.createElement("div");
    m.className = "item-version", m.innerText = n.version, l.appendChild(s), l.appendChild(m), d.appendChild(l);
    var c = document.createElement("div");
    c.className = "item-description-overflow";
    var p = document.createElement("div");
    p.className = "item-description", p.innerText = n.description, c.appendChild(p), d.appendChild(c);
    var g = document.createElement("div");
    g.className = "item-id", g.innerText = "ID: " + n.id, d.appendChild(g), i.appendChild(d), e.appendChild(i);
    var h = document.createElement("div");
    h.className = "item-buttons";
    var v = document.createElement("div");
    v.className = "item-toggle", v.setAttribute("onclick", "toggleExtension(this, '" + n.id + "');toggle(this)"), v.setAttribute("onmousedown", "togglePress(this, 'down')"), v.setAttribute("onmouseup", "togglePress(this, 'up')"), n.enabled || v.setAttribute("unchecked", "");
    var x = document.createElement("div");
    x.className = "item-bar";
    var u = document.createElement("div");
    u.className = "item-knob";
    var b = document.createElement("div");
    b.className = "item-ripple";
    var f = document.createElement("div");
    f.className = "ripple", b.appendChild(f), u.appendChild(b), v.appendChild(x), v.appendChild(u), h.appendChild(v), e.appendChild(h), t.appendChild(e)
}
async function getExtensions() {
    chrome.management.getAll((async function(n) {
        for (let t in n) n[t].isApp || addExtension({
            title: n[t].name,
            version: n[t].version,
            description: n[t].description,
            id: n[t].id,
            logo: "",
            managed: "admin" == n[t].installType,
            enabled: n[t].enabled
        })
    })), setTimeout((function() {
        setIcons()
    }), 100)
}

async function setIcons() {
    var n = document.querySelectorAll(".items .item");
    for (let t in n) try {
        n[t].querySelector(".item-main .item-img-wrapper .item-img").src = await getIconFromExtension(n[t].dataset.id)
    } catch {}
}

