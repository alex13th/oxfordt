export const parameters = {'document': null};
  
export function addRadioInputs(element, name, options, value=null, required, style=null) {
    for(let i = 0; i < options.length; i++) {
        const optionLabel = createLabel(options[i].label, options[i].id, style);
        const optionInput = createInput(name, 'radio', value, required, style);
        optionInput.value = options[i].value;
        optionInput.id = options[i].id;
        optionInput.checked = (options[i].value == value)

        optionLabel.insertBefore(optionInput, optionLabel.firstChild);
        element.appendChild(optionLabel);
    }
}

export function createA(href=null, text=null, id=null, download=null, style=null) {
    const result = parameters.document.createElement('a');

    if(href) result.href = href;
    if(text) result.innerHTML = text;
    if(id) result.id = id;
    if(download) result.download = download;
    if(style) setStyle(result, style);

    return result;
}

export function createButton(caption, id=null, value=null, type='submit', style=null) {
    const result = parameters.document.createElement('button');
    result.innerHTML = caption;
    result.setAttribute('type', type);
    if(id) result.id = id;
    if(value) result.value = value;
    if(style) setStyle(result, style);

    return result;
}

export function createCheckboxInput(name, label, value, required, style=null) {
    const inputElement = createInput(name, 'checkbox', value, required, style);
    const labelElement = createLabel(label, name);

    if(style) setStyle(labelElement, style);
    labelElement.insertBefore(inputElement, labelElement.firstChild);

    return labelElement;
}
 
export function createDiv(text=null, id=null, style=null) {
    const result = parameters.document.createElement('div');

    if(text) result.innerHTML = text;
    if(id) result.id = id;
    if(style) setStyle(result, style);

    return result;
}
  
export function createField(item, style=null) {
    const result = parameters.document.createElement('li');
    const inpName = 'inp_' + item.name;
    const label = item.label;
    const placeholder = item.placeholder;
    const required = item.required;

    if(style) setStyle(result, style);

    if(item.type == 'text') {
        result.appendChild(createLabel(label, inpName));
        result.appendChild(createTextInput(inpName, placeholder, item.value, required, item.style));
    } 
    else if (item.type == 'number') {
        result.appendChild(createLabel(label, inpName));
        result.appendChild(createNumberInput(inpName, placeholder, required, item.value, item.min, item.max, item.style));
    }
    else if (item.type == 'radio') {
        result.appendChild(createLabel(label, inpName));
        addRadioInputs(result, inpName, item.options, item.value, required, item.style)
    }
    else if (item.type == 'checkbox') {
        result.appendChild(createCheckboxInput(inpName, label, item.value, required, item.style));
    }

    return result;
}
  
export function createFields(items) {
    const result = createList([]);

    for(let i = 0; i < items.length; i++) {
        result.appendChild(createField(items[i]));
    }

    return result;
}

export function createForm() {
    return document.createElement("form");
}

export function createHeader(text, type='h2', style=null) {
    const result = parameters.document.createElement(type);

    result.innerHTML = text;
    if(style) setStyle(result, style);

    return result;
}
  
export function createInput(name, type, value=null, required=false, style=null) {
    const result = parameters.document.createElement('input');
    result.type = type;

    result.name = name;
    result.id = name;
    result.value = value;
    result.required = required;
    if(style) setStyle(result, style);

    return result;
}
  
export function createLabel(caption, forName, style=null) {
    const result = parameters.document.createElement('label');
    result.innerHTML = caption;
    result.setAttribute('for', forName);
    if(style) setStyle(result, style);

    return result;
}

export function createList(items, type='ul', style=null) {
    const result = parameters.document.createElement(type);

    if(style) setStyle(result, style);

    for(let i = 0; i < items.length; i++) {
        let itemLI = createListItem(items[i]);
        result.appendChild(itemLI);
    }

    return result;
}

export function createListItem(text, style=null) {
    const result = parameters.document.createElement('li');

    result.innerHTML = text;
    if(style) setStyle(result, style);

    return result;
}
  
export function createNumberInput(name, placeholder='', value=null, required=false, min, max, style=null) {
    const result = createInput(name, 'number', required, style);

    if(placeholder) result.placeholder = placeholder;
    if(min) result.min = min;
    if(max) result.max = max;

    return result;
}

export function createTextInput(name, placeholder=null, value=null, required=false, style=null) {
    const result = createInput(name, 'text', value, required, style);

    if(placeholder) result.placeholder = placeholder;

    return result;
}

export function  getElementById(id) {
    return document.getElementById(id);
}

export function getElementsByName(name) {
    return document.getElementsByName(name);
}

function isValue(value) {
    return !(value == null || value === undefined || value === '')
}

function setStyle(element, style) {
    if(isValue(style.className)) element.className = style.className;
}
