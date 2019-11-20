function createSlider({ min = 0, max = 100, value = 50, name, wrapper }, cb) {

    const slider = document.createElement("input");
    slider.type = "range";
    slider.name = name;
    slider.min = 0;
    slider.max = 100;
    slider.value = (value - min) / (max - min) * 100;
    slider.addEventListener("input", () => {
        cb(min + parseInt(slider.value) / 100 * (max - min));
    });

    const label = document.createElement("label");
    label.innerHTML = name;
    label.for = name;

    wrapper.append(label);
    wrapper.append(slider);

}

function createCheckbox({ value, wrapper, name }, cb) {
    const checkbox = document.createElement("input");
    checkbox.name = name;
    checkbox.type = "checkbox";
    checkbox.style.float = "right";
    checkbox.checked = value;
    checkbox.addEventListener("change", () => {
        cb(checkbox.checked);
    });

    const label = document.createElement("label");
    label.innerHTML = name;
    label.style.float = "left";
    label.for = name;

    wrapper.append(label);
    wrapper.append(checkbox);
}

class gui {
    constructor() {

        this.callbacks = {};
        this.params = {};

        this.wrapper = document.createElement("div");

        this.wrapper.classList.add("gui-wrapper");
        this.wrapper.classList.add("gui-hidden");

        document.body.appendChild(this.wrapper);

        window.addEventListener("keydown", ({ key }) => {
            switch (key) {
                case "h":
                    this.visibility = !this.visibility;
                    break;
                default:
            }
        });

    }

    set visibility(v) {
        this._visible = v;

        if (v) {
            this.wrapper.classList.remove("gui-hidden");
        } else {
            this.wrapper.classList.add("gui-hidden");
        }

    }
    get visibility() {
        return this._visible;
    }
}

gui.prototype.on = function (type, cb) {
    if (!(type in this.callbacks)) this.callbacks[type] = [];
    this.callbacks[type].push(cb);
}

gui.prototype.emit = function (type, val) {
    if (type in this.callbacks) {
        this.callbacks[type].forEach(cb => val ? cb(val) : cb());
    }
}

gui.prototype.sendToWorker = function () {
    this.sketch.worker.postMessage(Object.assign({
    }, this.params))
}

gui.prototype.createElement = function ({
    type, min = 0, name, max = 100, value = 50
}, cb) {

    const wrapper = document.createElement("div");
    wrapper.classList.add("gui-elem-wrapper");
    wrapper.classList.add("clearfix");

    switch (type) {
        case "number":
            createSlider({
                min, max, name, value, wrapper
            }, cb);
            break;
        case "boolean":
            createCheckbox({
                value, name, wrapper
            }, cb);
            break;
    }

    this.wrapper.append(wrapper);


}

gui.prototype.add = function (object) {

    Object.keys(object).forEach(key => {

        if (key.includes("Max") || key.includes("Min") || key.includes("Int")) return;

        const type = typeof object[key];
        const min = key + "Min" in object ? object[key + "Min"] : 0;
        const max = key + "Max" in object ? object[key + "Max"] : 100;
        const isInt = key + "Int" in object;
        let value = object[key];

        if ("_gui_" + key in localStorage) {
            const _v = localStorage["_gui_" + key];
            if (type === "boolean") {
                value = _v === "true";
            } else {
                if (isInt) {
                    value = parseInt(_v);
                } else {
                    value = parseFloat(_v);
                }
            }
        }

        object[key] = value;

        this.params[key] = value;

        this.createElement({
            type, min, max, value, name: key
        }, val => {
            const _v = isInt ? parseInt(val) : val;
            this.params[key] = _v;
            object[key] = _v;
            localStorage.setItem("_gui_" + key, _v);
            this.emit("change");
            this.emit(key, _v);
        });

    })

}

export default new gui();