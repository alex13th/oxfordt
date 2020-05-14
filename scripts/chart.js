function isValue(value) {
    return !(value == null || value === undefined || value === '')
}

function applyZoom(zoom, options) {
    options.topPadding *= zoom;
    options.leftPadding *= zoom; // Подумать как расчитать от параметров вертикальной оси
    options.hGrid.step *=  zoom;
    options.hGrid.offset *= zoom;
    options.hGrid.dataLabels.style.fontSize *= zoom;
    options.hGrid.dataLabels.style.offset *= zoom; // Подумать о замене на расчетный от leftPadding
    options.vGrid.step *= zoom;
    options.vGrid.offset *= zoom;
    options.vGrid.dataLabels.parameters.style.fontSize *= zoom;
    options.vGrid.dataLabels.parameters.style.offset *= zoom;
    options.vGrid.dataLabels.parameters.rect.height *= zoom;
    return options;
}

function setAttributeSVG(element, attributeName, value) {
    if(isValue(value)){
        element.setAttributeNS(null, attributeName, value);
    }
}

function setStyle(element, style) {
    if(style.fontSize) setAttributeSVG(element, 'font-size', style.fontSize);
    if(style.className) setAttributeSVG(element, 'class', style.className);
    if(isValue(style.color)) setAttributeSVG(element, 'stroke', style.color);
    if(isValue(style.fill)) setAttributeSVG(element, 'fill', style.fill);
    if(isValue(style.fillOpacity)) setAttributeSVG(element, 'fill-opacity', style.fillOpacity);
    if(isValue(style.opacity)) setAttributeSVG(element, 'opacity', style.opacity);
    if(isValue(style.width)) setAttributeSVG(element, 'stroke-width', style.width);
    if(isValue(style.anchor)) setAttributeSVG(element, 'text-anchor', style.anchor);
    if(isValue(style.strokeDasharray)) setAttributeSVG(element, 'stroke-dasharray', style.strokeDasharray);
}

function createLine(x1, y1, x2, y2, style) {
    var element = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    setAttributeSVG(element, 'x1', x1);
    setAttributeSVG(element, 'y1', y1);
    setAttributeSVG(element, 'x2', x2);
    setAttributeSVG(element, 'y2', y2);
    setStyle(element, style);

    return element;
}

function createRect(x, y, width, height, style) {
    var element = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    setAttributeSVG(element, 'x', x);
    setAttributeSVG(element, 'y', y);
    setAttributeSVG(element, 'width', width);
    setAttributeSVG(element, 'height', height);
    setStyle(element, style);

    return element;
}

function createText(text, x, y, style) {
    var element = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    var transform = 'translate(' + (style.offset) + ')'
    element.textContent = text;
    setAttributeSVG(element, 'x', x);
    setAttributeSVG(element, 'y', y);
    setAttributeSVG(element, 'transform', transform);
    setStyle(element, style);
    return element;
}

function createTSpan(text, x, y, dx, dy, style) {
    var element = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    element.textContent = text;
    setAttributeSVG(element, 'x', x);
    setAttributeSVG(element, 'y', y);
    setAttributeSVG(element, 'dx', dx);
    setAttributeSVG(element, 'dy', dy);
    setStyle(element, style);

    return element;
}

function drawHGrid(options) {
    var gridLength = options.vGrid.step * (options.vGrid.count - 1) 
        + options.hGrid.extend
        + options.vGrid.offset;
    var x = options.topPadding 
        + options.vGrid.dataLabels.parameters.rect.height 
        + options.hGrid.offset;
    var y = options.leftPadding;

    var axisG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    var axisLabelText = createText(
            null, 
            options.leftPadding, 
            x - options.hGrid.step  + (options.hGrid.step * .1),
            options.hGrid.dataLabels.style);
    
    for(var i = 0; i < options.hGrid.count; i++) {
        var gridLine = createLine(
            y, 
            x + options.hGrid.step * i, 
            y + gridLength, 
            x + options.hGrid.step * i,
            options.hGrid.style);
        axisG.appendChild(gridLine);

        var tSpan = createTSpan(
            options.hGrid.dataLabels.labels[i], 
            0, 
            null, 
            null, 
            options.hGrid.step,
            options.hGrid.dataLabels.style);
        axisLabelText.appendChild(tSpan);
    }
    axisG.appendChild(axisLabelText);
    return axisG;
}

function drawVGrid(options) { 
    let x = options.leftPadding + options.vGrid.offset;
    let y = options.topPadding + options.vGrid.dataLabels.parameters.rect.height;
    let step = options.vGrid.step;
    let gridLength = options.hGrid.step * (options.hGrid.count - 1) + options.hGrid.offset;

    let axisG = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    for(let i = 0; i < options.vGrid.count; i++) {
        let gridLine = createLine(
            x + step * i, y, x + step * i,
            y + gridLength, 
            options.vGrid.style);
        axisG.appendChild(gridLine);
    }
    return axisG;
}

function createRectLabel(x, y, width, title, parameters) {
    let labelG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    let labelRect = createRect(x, y, width, parameters.rect.height, parameters.rect);
    let labelText = createText(title, x + width/2, y + parameters.rect.height/2, parameters.style);
    labelG.appendChild(labelRect);
    labelG.appendChild(labelText);
    return labelG;
}

function drawVAxisLabels(x, y, options) {
    let vAxisLabelsG = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    for(let i = 0; i < options.vGrid.dataLabels.labels.length; i++) {
        let rectLabel = createRectLabel(
                x + options.vGrid.step * i, 
                y, 
                options.vGrid.step, 
                options.vGrid.dataLabels.labels[i], 
                options.vGrid.dataLabels.parameters);
        vAxisLabelsG.appendChild(rectLabel);
    }
    return vAxisLabelsG;
}

function drawGrid(options) {
    let x = options.leftPadding;
    let y = options.topPadding + options.vGrid.dataLabels.parameters.rect.height + options.hGrid.offset;
    
    let gridG = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    let hGridG = drawHGrid(options);
    let gridLine = createLine(
        x,
        y + options.hGrid.step * options.hAxis.position, 
        x + options.vGrid.offset + options.hGrid.extend + options.vGrid.step * (options.vGrid.count - 1),
        y + options.hGrid.step * options.hAxis.position,
        options.hAxis.style);
    hGridG.appendChild(gridLine);
    gridG.appendChild(hGridG);

    let vGridG = drawVGrid(options); 
    gridLine = createLine(
        x + options.vGrid.step * options.vAxis.position,
        y, 
        x + options.vGrid.step * options.vAxis.position,
        y + options.hGrid.step * (options.hGrid.count - 1) + options.hGrid.offset, 
        options.vAxis.style);
    vGridG.appendChild(gridLine);
    gridG.appendChild(vGridG);

    let vTopLabelsG = drawVAxisLabels(
        options.leftPadding, 
        y - options.vGrid.dataLabels.parameters.rect.height, 
        options);
    gridG.appendChild(vTopLabelsG);
    
    let vBottomLabelsG = drawVAxisLabels(
        options.leftPadding, 
        y + options.hGrid.step * (options.hGrid.count - 1), 
        options);
    gridG.appendChild(vBottomLabelsG);

    return gridG;
}

function drawGraph(data, options) {
    let graphG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    let graphPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    graphG.appendChild(graphPath);

    let strPath ='M';
    for(let i = 0; i < data.length; i++) {
        let x = ((i + options.vAxis.position) * options.vGrid.step + options.leftPadding + options.vGrid.offset);
        let y = options.hAxis.position * options.hGrid.step 
            - data[i] * options.hGrid.step/(options.hGrid.count - options.hAxis.position - 1) 
            + options.topPadding + options.vGrid.dataLabels.parameters.rect.height + options.hGrid.offset;
        strPath = strPath + x + ' ' + y + ' ';
        var graphPoint = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        setAttributeSVG(graphPoint, 'cx', x);
        setAttributeSVG(graphPoint, 'cy', y);
        setAttributeSVG(graphPoint, 'r', options.graph.point.radius);
        setAttributeSVG(graphPoint, 'fill', options.graph.point.color);
        graphG.appendChild(graphPoint);
        graphG.appendChild(createText(data[i], x + options.graph.point.radius / 2, y, options.graph.label.style));
    }

    setAttributeSVG(graphPath, 'd', strPath);
    setAttributeSVG(graphPath, 'fill-opacity', 0);
    setAttributeSVG(graphPath, 'stroke', options.graph.line.color);
    setAttributeSVG(graphPath, 'stroke-width', options.graph.line.width);

    return graphG;
}

function drawHGridEmphasis(emphasis, options) {
    const dataUp = emphasis.emphasisUp;
    const dataDown = emphasis.emphasisDown;

    const graphG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const graphPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    graphG.appendChild(graphPath);

    let strPath ='M';

    let x = ((options.vAxis.position) * options.vGrid.step + options.leftPadding);
    let y = options.hAxis.position * options.hGrid.step 
        - dataUp[0] * options.hGrid.step/(options.hGrid.count - options.hAxis.position - 1) 
        + options.topPadding + options.vGrid.dataLabels.parameters.rect.height;
    strPath = strPath + x + ' ' + y + ' ';


    for(let i = 0; i < dataUp.length; i++) {
        x = ((i + options.vAxis.position) * options.vGrid.step + options.leftPadding + options.vGrid.offset);
         y = options.hAxis.position * options.hGrid.step 
            - dataUp[i] * options.hGrid.step/(options.hGrid.count - options.hAxis.position - 1) 
            + options.topPadding + options.vGrid.dataLabels.parameters.rect.height + options.hGrid.offset;
        strPath = strPath + x + ' ' + y + ' ';
    }

    for(let i = 0; i < dataDown.length; i++) {
        x = ((options.vAxis.position +  dataDown.length - i) * options.vGrid.step + options.leftPadding - options.vGrid.offset);
        y = options.hAxis.position * options.hGrid.step 
            - dataDown[i] * options.hGrid.step/(options.hGrid.count - options.hAxis.position - 1) 
            + options.topPadding + options.vGrid.dataLabels.parameters.rect.height + options.hGrid.offset;
        strPath = strPath + x + ' ' + y + ' ';
    }

    x = ((options.vAxis.position) * options.vGrid.step + options.leftPadding);
    y = options.hAxis.position * options.hGrid.step 
        - dataDown[dataDown.length -1 ] * options.hGrid.step/(options.hGrid.count - options.hAxis.position - 1) 
        + options.topPadding + options.vGrid.dataLabels.parameters.rect.height + options.hGrid.offset;
    strPath = strPath + x + ' ' + y + ' ';

    setAttributeSVG(graphPath, 'd', strPath);
    setStyle(graphPath, emphasis.style);

    return graphG;
}

function drawHGridEmphasises(options) {
    const graphG = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    for(let i = 0; i < options.hGrid.emphasises.length; i++) {
        graphG.appendChild(drawHGridEmphasis(options.hGrid.emphasises[i], options));
    }

    return graphG;
}

export function drawChart(chartDiv, data, options) {

    const chartWidth = options.vGrid.step * options.vGrid.count + options.leftPadding;
    const chartHeight = options.hGrid.step * (options.hGrid.count -1) + options.topPadding + options.vGrid.dataLabels.parameters.rect.height * 2;

    const chartSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const mainG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const mainRect = createRect(0, 0, '100%', '100%', options.chartArea.style);

    setAttributeSVG(chartSVG,  'version', '1.1');
    setAttributeSVG(chartSVG,  'width', options.width);
    setAttributeSVG(chartSVG,  'height', options.height);
    setAttributeSVG(chartSVG,  'viewBox', '0 0 ' + chartWidth + ' '  + chartHeight);
    setAttributeSVG(chartSVG,  'stroke', options.chartArea.style.color);
    setAttributeSVG(chartSVG,  'stroke-width', options.chartArea.style.width);
    setAttributeSVG(chartSVG,  'fill', '#FFF');
    chartSVG.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    mainG.appendChild(mainRect);
    mainG.appendChild(drawGrid(options));
    mainG.appendChild(drawGraph(data, options));
    mainG.appendChild(drawHGridEmphasises(options));

    chartSVG.appendChild(mainG);
    if(chartDiv) chartDiv.appendChild(chartSVG);

    return chartSVG;
}

