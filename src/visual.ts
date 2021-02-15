/*
*  Power BI Visual CLI
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
"use strict";
import "core-js";
import * as React from "react";
import * as ReactDOM from "react-dom";
import powerbiVisualsApi from "powerbi-visuals-api";

import VisualConstructorOptions = powerbiVisualsApi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbiVisualsApi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbiVisualsApi.extensibility.visual.IVisual;
import DataView = powerbiVisualsApi.DataView;
import DataViewTable = powerbiVisualsApi.DataViewTable;
import DataViewTableRow = powerbiVisualsApi.DataViewTableRow;
import IViewport = powerbiVisualsApi.IViewport;

import VisualObjectInstance = powerbiVisualsApi.VisualObjectInstance;
import EnumerateVisualObjectInstancesOptions = powerbiVisualsApi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstanceEnumeration = powerbiVisualsApi.VisualObjectInstanceEnumeration;

import { ReactCircleCard, initialState } from "./component";
import { VisualSettings } from "./settings";


import {createInterpolatorWithFallback} from "commons-math-interpolation";
import  bezier  from '@turf/bezier-spline';
import { lineString } from '@turf/helpers';
import "./../style/visual.less";
import {CateDataParser,ColorSettings,LineDatas} from "./cateDataParser";
export class Visual implements IVisual {
    private target: HTMLElement;
    private reactRoot: React.ComponentElement<any, any>;

    private settings: VisualSettings;
    private viewport: IViewport;

    constructor(options: VisualConstructorOptions) {
        this.reactRoot = React.createElement(ReactCircleCard, {});
        this.target = options.element;

        ReactDOM.render(this.reactRoot, this.target);
    }

    public update(options: VisualUpdateOptions) {
        let splineData = [];
        if(options.dataViews && options.dataViews[0]){
            const dataView: DataView = options.dataViews[0];
            const parser: CateDataParser = new CateDataParser(options);
            this.viewport = options.viewport;
            
            this.settings = VisualSettings.parse<VisualSettings>(dataView);
            ReactCircleCard.update({
                selected: "natural",
                lineValue: this.settings.geoSetting.LineWidth,
                pointValue: this.settings.geoSetting.ScatterSize,
                canvasHeight: this.settings.geoSetting.CanvasHeight,
                canvasWidth: this.settings.geoSetting.CanvasWidth,
                colorSettings: parser.colorSettings,
                lineDatas: parser.lineDatas,
                canvasSettings: parser.canvasSettings,
                countryList: parser.countryList.countries
            });
        } else {
            this.clear();
        }
    }

    private clear() {
        ReactCircleCard.update(initialState);
    }

    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
        const settings: VisualSettings = this.settings || <VisualSettings>VisualSettings.getDefault();
        return VisualSettings.enumerateObjectInstances(settings, options);
    }
}