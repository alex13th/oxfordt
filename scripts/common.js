export const parameters = {'document': null};

export function createButton(caption) {
    const result = parameters.document.createElement("button");
    result.innerHTML = caption;
    result.setAttribute("type", "submit");

    return result;
}
  
export function createHeader(text) {
    const result = parameters.document.createElement("h2");
    result.innerHTML = text;

    return result;
}
  
export function createList(items, type='ul') {
    let result = parameters.document.createElement(type);
    for(let i = 0; i < items.length; i++) {
        let itemLI = parameters.document.createElement("li");
        itemLI.innerHTML = items[i];
        result.appendChild(itemLI);
    }

    return result;
}
  
export function createLabel(caption, forName) {
    const result = parameters.document.createElement("label");
    result.innerHTML = caption;
    result.setAttribute('for', forName);
    return result;
}
  
export function createInput(name, type, value=null, required=false) {
    const result = parameters.document.createElement("input");
    result.type = type;

    result.name = name;
    result.id = name;
    result.value = value;
    result.required = required;

    return result;
}
  
export function createTextInput(name, placeholder='', value=null, required=false) {
    const result = createInput(name, 'text', value, required);

    if(placeholder)
        result.placeholder = placeholder;

    return result;
}
  
export function createNumberInput(name, placeholder='', value=null, required=false, min, max) {
    const result = createInput(name, 'number', required);

    if(placeholder) result.placeholder = placeholder;
    if(min) result.min = min;
    if(max) result.max = max;

    return result;
}
  
export function addRadioInputs(element, name, value=null, required, options) {
    for(let i = 0; i < options.length; i++) {
        let optionInput = createInput(name, 'radio', required);
        optionInput.value = options[i].value;
        optionInput.id = options[i].id;
        optionInput.checked = (options[i].value == value)
        element.appendChild(optionInput);

        let optionLabel = createLabel(options[i].label, options[i].id);
        element.appendChild(optionLabel);
    }
}
  
export function createField(item) {
    const result = parameters.document.createElement("li");

    let inpName = 'inp_' + item.name;
    let label = item.label;
    let placeholder = item.placeholder;
    let required = item.required;
    if(required) placeholder = placeholder + ' (обязательно)';

    result.appendChild(createLabel(label, inpName));

    if(item.type == 'text') {
        result.appendChild(createTextInput(inpName, placeholder, item.value, required));
    } 
    else if (item.type == 'number') {
        result.appendChild(createNumberInput(inpName, placeholder, required, item.value, item.min, item.max));
    }
    else if (item.type == 'radio') {
        addRadioInputs(result, inpName, item.value, required, item.options)
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