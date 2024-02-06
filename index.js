var cdy = CindyJS({ 
    ports: [{
        id:"CSCanvas",
        width: 800,
        height: 758
        // background: [1, 1, 1]
    }],
    scripts: "cs*",
    images: {turtle: "./tt.jpg"}
});


// wait for page load
window.addEventListener("load", function () {
    // const wordInput = document.getElementById("start");
    // const sInput = document.getElementById("s");
    // const fInput = document.getElementById("f");
    // const aInput = document.getElementById("a");
    // const lInput = document.getElementById("l");
    // const angleInput = document.getElementById("angle");
    // const lengthInput = document.getElementById("length");
    // const iterationInput = document.getElementById("iteration-count");
    const canvas2d = document.getElementById("Cindy3D");
    canvas2d.style.display = 'none';
    const rules = document.querySelectorAll(".rule");
    function getRules() {
        let key_vals = [];
        rules.forEach(function(rule) {
            let pre  = rule.getElementsByClassName("pre").item(0).value;
            // console.log(pre);
            let post = rule.getElementsByClassName("post").item(0).value;
            // console.log(post);
            if (pre && post) {
                key_vals.push([pre, post]);
            }
        });
        let rules_json = "{";
        let last = key_vals.pop();
        for (const [key, val] in key_vals) {
            rules_json = rules_json.concat(`"${key}": "${val}",`);
        }
        if (last) {
            rules_json = rules_json.concat(`"${last[0]}": "${last[1]}"`);
        }
        rules_json += "}";
        // console.log(rules_json);
        return rules_json;
    }
    cdy.evokeCS(`rules=${getRules()}; s=lsystem(its(), word(), rules);`);

    rules.forEach(function(rule) {
        rule.addEventListener("input", (_) => {
            cdy.evokeCS(`rules=${getRules()}; s = lsystem(its(), word(), rules);`);
        })
    });

    this.document.getElementById("start").addEventListener("input", (_) => {
        cdy.evokeCS("s = lsystem(its(), word(), rules)");
    })
    this.document.getElementById("iteration-count").addEventListener("input", (_) => {
        cdy.evokeCS("s = lsystem(its(), word(), rules)");
    })
    this.document.getElementById("angle").addEventListener("input", (ev) => {
        cdy.evokeCS(`angle = ${ev.target.value}°`);
    })
    this.document.getElementById("segment-length").addEventListener("input", (ev) => {
        cdy.evokeCS(`len = ${ev.target.value / 6}`);
    })
});



CindyJS.registerPlugin(1, "InputPlugin", function(api) {
    const rules = document.getElementsByClassName("rule");
    const word = document.getElementById("start");
    const sliders = document.getElementsByClassName("slider")


    // gets the value of rule passed to it
    api.defineFunction("ruleInput", 1, function(args, modifs) {
        let arg = api.evaluate(args[0]);
        console.assert(arg.ctype === "string");
        return {
            ctype: "string",
            value: rules[arg.value].value,
        };
    });
    api.defineFunction("getRules", 0, function(args, modifs) {
        // console.log(getRules());
        return cdy.evokeCS(`rules={}`);
    });

    // word() -> str
    // gets the value from fInput
    api.defineFunction("word",0, function (args, modifs) {
        return {
            ctype: "string",
            value: word.value,
        };
    });

    api.defineFunction("Flen", 0 , function(args, modifs) {
        return {
            ctype: "number",
            value: { real: sliders["segment-length"].value / 6, imag: 0}
        }
    });

    api.defineFunction("its", 0 , function(args, modifs) {
        return {
            ctype: "number",
            value: { real: sliders["iteration-count"].value, imag: 0}
        }
    });
});

// console.log(getRules());
// });



function switch_mode() {
    function toggle_display(el) {
        if (el.style.display == "none") {
            el.style.display = "flex";
        } else {
            el.style.display = "none";
        }
    }
    const canvas2d = document.getElementById("CSCanvas");
    const canvas3d = document.getElementById("Cindy3D");
    const button = document.getElementById("dimswitcher");


    toggle_display(canvas2d);
    toggle_display(canvas3d);

    if(button.innerText == "3D mode") {
	button.textContent = "2D mode";
	console.log("here")
    } else {
	button.textContent = "3D mode";
    }
    cdy.evokeCS("turtle3D = !turtle3D");
}


