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

function drawHGrid(left, top, length, parameters) {
    const gridLength = length + parameters.extend;
    const x = left;
    const y = top + parameters.offset;

    var axisG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    var axisLabelText = createText(
            null, 
            x, 
            y - parameters.step  + (parameters.step * .1),
            parameters.dataLabels.style);
    
    for(var i = 0; i < parameters.count; i++) {
        var gridLine = createLine(
            x, 
            y + parameters.step * i, 
            x + gridLength, 
            y + parameters.step * i,
            parameters.style);
        axisG.appendChild(gridLine);

        var tSpan = createTSpan(
            parameters.dataLabels.labels[i], 
            0, 
            null, 
            null, 
            parameters.step,
            parameters.dataLabels.style);
        axisLabelText.appendChild(tSpan);
    }
    axisG.appendChild(axisLabelText);
    return axisG;
}

function drawVGrid(left, top, length, parameters) { 
    const x = left + parameters.offset;
    const y = top;
    const step = parameters.step;
    const gridLength = length;

    let axisG = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    for(let i = 0; i < parameters.count; i++) {
        let gridLine = createLine(
            x + step * i, y, x + step * i,
            y + gridLength, 
            parameters.style);
        axisG.appendChild(gridLine);
    }
    return axisG;
}

function createRectLabel(x, y, width, title, parameters) {
    const labelG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const labelRect = createRect(x, y, width, parameters.rect.height, parameters.rect);
    const labelText = createText(title, x + width/2, y + parameters.rect.height/2, parameters.style);
    labelG.appendChild(labelRect);
    labelG.appendChild(labelText);
    return labelG;
}

function drawVAxisLabels(left, top, step, labelSet) {
    const x = left;
    const y = top;

    const vAxisLabelsG = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    for(let i = 0; i < labelSet.labels.length; i++) {
        let rectLabel = createRectLabel(
                x + step * i,
                y, 
                step, 
                labelSet.labels[i], 
                labelSet.parameters);
        vAxisLabelsG.appendChild(rectLabel);
    }
    return vAxisLabelsG;
}

function drawGrid(left, top, options) {
    const x = left;
    const y = top + options.vGrid.dataLabels.parameters.rect.height;
    
    const gridG = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    // Ототброжение горизонтальной сетки
    const hGridLength = options.vGrid.step * (options.vGrid.count - 1) + options.vGrid.offset;
    const hGridG = drawHGrid(x, y, hGridLength, options.hGrid);
    let gridLine = createLine(
        x,
        y + options.hGrid.step * options.hAxis.position, 
        x + options.vGrid.offset + options.hGrid.extend + options.vGrid.step * (options.vGrid.count - 1),
        y + options.hGrid.step * options.hAxis.position,
        options.hAxis.style);
    hGridG.appendChild(gridLine); // Добавление края горизонтальной сетки
    gridG.appendChild(hGridG);

    // Ототброжение вертикальной сетки
    const vGridLength = options.hGrid.step * (options.hGrid.count - 1) + options.hGrid.offset;
    const vGridG = drawVGrid(x, y, vGridLength, options.vGrid);
    gridLine = createLine(
        x + options.vGrid.step * options.vAxis.position,
        y, 
        x + options.vGrid.step * options.vAxis.position,
        y + options.hGrid.step * (options.hGrid.count - 1) + options.hGrid.offset, 
        options.vAxis.style);
    vGridG.appendChild(gridLine); // Добавление края вертикальной сетки
    gridG.appendChild(vGridG);

    const vTopLabelsG = drawVAxisLabels(x, top, options.vGrid.step, options.vGrid.dataLabels)
    gridG.appendChild(vTopLabelsG);
    
    const vBottomLabelsG = drawVAxisLabels(x, y + options.hGrid.step * (options.hGrid.count - 1), options.vGrid.step, options.vGrid.dataLabels);
    gridG.appendChild(vBottomLabelsG);

    return gridG;
}

function drawGraph(left, top, data, options, keyPoints = []) {
    const result = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const graphPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    result.appendChild(graphPath);

    let strPath ='M';
    for(let i = 0; i < data.length; i++) {
        let x = left + (i + options.vAxis.position) * options.vGrid.step;
        let y = top + options.hAxis.position * options.hGrid.step - data[i] * options.hGrid.step/(options.hGrid.count - options.hAxis.position - 1);
        let graphPoint = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

        strPath = strPath + x + ' ' + y + ' ';
        setAttributeSVG(graphPoint, 'cx', x);
        setAttributeSVG(graphPoint, 'cy', y);
        setAttributeSVG(graphPoint, 'r', options.graph.point.radius);
        setAttributeSVG(graphPoint, 'fill', options.graph.point.color);

        result.appendChild(graphPoint);

        if(keyPoints.includes(i)) {
            let graphElipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');

            setAttributeSVG(graphElipse, 'cx', x);
            setAttributeSVG(graphElipse, 'cy', y);
            setAttributeSVG(graphElipse, 'rx', options.graph.point.radius * 2);
            setAttributeSVG(graphElipse, 'ry', options.graph.point.radius * 3);
            setAttributeSVG(graphElipse, 'fill', 'yellow');
            setAttributeSVG(graphElipse, 'opacity', '.5');

            result.appendChild(graphElipse);
        }

        result.appendChild(createText(data[i], x + options.graph.point.radius / 2, y, options.graph.label.style));
    }

    setAttributeSVG(graphPath, 'd', strPath);
    setAttributeSVG(graphPath, 'fill-opacity', 0);
    setAttributeSVG(graphPath, 'stroke', options.graph.line.color);
    setAttributeSVG(graphPath, 'stroke-width', options.graph.line.width);

    return result;
}

function drawHGridEmphasis(left, top, emphasis, options) {
    const dataUp = emphasis.emphasisUp;
    const dataDown = emphasis.emphasisDown;
    const calcTop = top;

    const result = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const graphPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    result.appendChild(graphPath);

    let strPath ='M';

    let x = left + options.vAxis.position * options.vGrid.step;
    let y = calcTop + options.hAxis.position * options.hGrid.step 
        - dataUp[0] * options.hGrid.step/(options.hGrid.count - options.hAxis.position - 1);
    strPath = strPath + x + ' ' + y + ' ';


    for(let i = 0; i < dataUp.length; i++) {
        x = left + (i + options.vAxis.position) * options.vGrid.step + options.vGrid.offset;
         y = calcTop + options.hAxis.position * options.hGrid.step 
            - dataUp[i] * options.hGrid.step/(options.hGrid.count - options.hAxis.position - 1) 
            + options.hGrid.offset;
        strPath = strPath + x + ' ' + y + ' ';
    }

    for(let i = 0; i < dataDown.length; i++) {
        x = left + (options.vAxis.position +  dataDown.length - i) * options.vGrid.step - options.vGrid.offset;
        y = calcTop + options.hAxis.position * options.hGrid.step 
            - dataDown[i] * options.hGrid.step/(options.hGrid.count - options.hAxis.position - 1) 
            + options.hGrid.offset;
        strPath = strPath + x + ' ' + y + ' ';
    }

    x = left + (options.vAxis.position) * options.vGrid.step;
    y = calcTop + options.hAxis.position * options.hGrid.step 
        - dataDown[dataDown.length -1 ] * options.hGrid.step/(options.hGrid.count - options.hAxis.position - 1) 
        + options.hGrid.offset;
    strPath = strPath + x + ' ' + y + ' ';

    setAttributeSVG(graphPath, 'd', strPath);
    setStyle(graphPath, emphasis.style);

    return result;
}

function drawHGridEmphasises(left, top, options) {
    const graphG = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    for(let i = 0; i < options.hGrid.emphasises.length; i++) {
        graphG.appendChild(drawHGridEmphasis(left, top, options.hGrid.emphasises[i], options));
    }

    return graphG;
}

function drawChartArea(left, top, options) {
    const result = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    result.appendChild(drawGrid(left, top, options));
    result.appendChild(drawHGridEmphasises(left, top + options.vGrid.dataLabels.parameters.rect.height, options));

    return result;
}

function drawChartHeader(left, top, parameters) {
    const result = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    const titleText = createText(parameters.title.text, left, top + 200, parameters.title.style);
    const subTitleText = createText(parameters.subTitle.text, left, top + 320, parameters.subTitle.style);

    result.appendChild(titleText);
    result.appendChild(subTitleText);

    return result;
}

export function drawChart(chartDiv, data, options, keyPoints = []) {

    const chartTitleHeight = 500;

    const chartWidth = options.vGrid.step * options.vGrid.count + options.leftPadding;
    const chartHeight = options.hGrid.step * (options.hGrid.count -1) + options.topPadding + options.vGrid.dataLabels.parameters.rect.height * 2 + chartTitleHeight;

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

    const chartAreaLeft = options.leftPadding;
    const chartAreaTop = options.topPadding + options.hGrid.offset + chartTitleHeight;
    mainG.appendChild(drawChartArea(chartAreaLeft, chartAreaTop, options));

    const graphAreaLeft = chartAreaLeft + options.vGrid.offset;
    const graphAreaTop = chartAreaTop + options.vGrid.dataLabels.parameters.rect.height + options.hGrid.offset;
    mainG.appendChild(drawGraph(graphAreaLeft, graphAreaTop, data, options, keyPoints));

    chartSVG.appendChild(mainG);
    chartSVG.appendChild(drawChartHeader(options.leftPadding, options.topPadding, options.header));
    if(chartDiv) chartDiv.appendChild(chartSVG);

    return chartSVG;
}

