export const parameters = {'document': null};
  
export function addRadioInputs(element, name, options, value=null, required, className=null) {
    for(let i = 0; i < options.length; i++) {
        const optionLabel = createLabel(options[i].label, options[i].id);
        const optionInput = createInput(name, 'radio', value, required, className);
        optionInput.value = options[i].value;
        optionInput.id = options[i].id;
        optionInput.checked = (options[i].value == value)

        optionLabel.insertBefore(optionInput, optionLabel.firstChild);
        element.appendChild(optionLabel);
    }
}

export function createButton(caption, id=null, value=null, type='submit', className=null) {
    const result = parameters.document.createElement('button');
    result.innerHTML = caption;
    result.setAttribute('type', type);
    if(id) result.id = id;
    if(value) result.value = value;
    if(className) result.className = className;

    return result;
}

export function createCheckboxInput(name, label, value, required, className=null) {
    const inputElement = createInput(name, 'checkbox', value, required, className);
    const labelElement = createLabel(label, name);

    labelElement.insertBefore(inputElement, labelElement.firstChild);

    return labelElement;
}
 

export function createDiv(text=null, id=null, className=null) {
    const result = parameters.document.createElement('div');

    if(text) result.innerHTML = text;
    if(id) result.id = id;
    if(className) result.className = className;

    return result;
}
  
export function createField(item, className=null) {
    const result = parameters.document.createElement('li');
    if(className)
        result.className = className;

    const inpName = 'inp_' + item.name;
    const label = item.label;
    const placeholder = item.placeholder;
    const required = item.required;
    if(item.className) className = item.className;

    if(item.type == 'text') {
        result.appendChild(createLabel(label, inpName));
        result.appendChild(createTextInput(inpName, placeholder, item.value, required, className));
    } 
    else if (item.type == 'number') {
        result.appendChild(createLabel(label, inpName));
        result.appendChild(createNumberInput(inpName, placeholder, required, item.value, item.min, item.max, className));
    }
    else if (item.type == 'radio') {
        result.appendChild(createLabel(label, inpName));
        addRadioInputs(result, inpName, item.options, item.value, required, className)
    }
    else if (item.type == 'checkbox') {
        result.appendChild(createCheckboxInput(inpName, label, item.value, required));
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

export function createHeader(text, type='h2', className=null) {
    const result = parameters.document.createElement(type);
    result.innerHTML = text;
    if(className)
        result.className = className;

    return result;
}
  
export function createInput(name, type, value=null, required=false, className=null) {
    const result = parameters.document.createElement('input');
    result.type = type;

    result.name = name;
    result.id = name;
    result.value = value;
    result.required = required;
    if(className)
        result.className = className;

    return result;
}
  
export function createLabel(caption, forName, className=null) {
    const result = parameters.document.createElement('label');
    result.innerHTML = caption;
    result.setAttribute('for', forName);
    if(className)
        result.className = className;

    return result;
}

export function createList(items, type='ul', className=null) {
    let result = parameters.document.createElement(type);
    if(className)
        result.className = className;

    for(let i = 0; i < items.length; i++) {
        let itemLI = createListItem(items[i]);
        result.appendChild(itemLI);
    }

    return result;
}

export function createListItem(text, className=null) {
    const result = parameters.document.createElement('li');
    result.innerHTML = text;
    if(className)
        result.className = className;

    return result;
}
  
export function createNumberInput(name, placeholder='', value=null, required=false, min, max, className=null) {
    const result = createInput(name, 'number', required, className);

    if(placeholder) result.placeholder = placeholder;
    if(min) result.min = min;
    if(max) result.max = max;

    return result;
}

export function createTextInput(name, placeholder=null, value=null, required=false, className=null) {
    const result = createInput(name, 'text', value, required, className);

    if(placeholder)
        result.placeholder = placeholder;

    return result;
}