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
import VisualObjectInstanceEnumerationObject = powerbiVisualsApi.VisualObjectInstanceEnumerationObject;

import { ReactCircleCard, initialState } from "./component";
import { VisualSettings } from "./settings";
import {createInterpolatorWithFallback} from "commons-math-interpolation";
import  bezier  from '@turf/bezier-spline';
import { lineString } from '@turf/helpers';
import "./../style/visual.less";

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
        let monthMap = new Map([
            ["Jul",1],
            ["Aug",2],
            ["Sep",3],
            ["Oct",4],
            ["Nov",5],
            ["Dec",6],
            ["Jan",7],
            ["Feb",8],
            ["Mar",9],
            ["Apr",10],
            ["May",11],
            ["Jun",12]
        ]);
        if(options.dataViews && options.dataViews[0]){
            const dataView: DataView = options.dataViews[0];
            const tableView: DataViewTable = dataView.table;
            let xVals:Array<number> = [];
            let yVals: Array<number> = [];
            const InterpolationMethod = "cubic";
            let splines = [];
            
            // tableView.rows.forEach((row:DataViewTableRow) => {
            //     splineData.push({
            //         x:monthMap.get(row[0].toString()),
            //         y:row[1]
            //     })
            // })


            tableView.rows.forEach((row:DataViewTableRow) => {
                // xVals.push(monthMap.get(row[0].toString())),
                // yVals.push(Math.floor(Math.random() * 10)),
                splines.push([parseFloat(row[0].toString())*1.5,parseFloat(row[1].toString())])
            })
            var line = lineString(splines);
            const curved = bezier(line);
            // const interpolator = createInterpolatorWithFallback(InterpolationMethod, xVals, yVals);
            var i = 0;
            while(i<curved.geometry.coordinates.length){
                splineData.push({
                    x: curved.geometry.coordinates[i][0],
                    y: curved.geometry.coordinates[i][1]
                    // y: splines[i][1],
                })
                i = i + 1;
            }

            this.viewport = options.viewport;
            const { width, height } = this.viewport;
            const size = tableView.rows.length;
            const length = tableView.rows[1][1].toString();
            this.settings = <VisualSettings>VisualSettings.parse(dataView);
            const object = this.settings.circle;
            
            ReactCircleCard.update({
                size,
                length,
                splineData,
                borderWidth: object && object.circleThickness ? object.circleThickness : undefined,
                background: object && object.circleColor ? object.circleColor : undefined,
                textLabel: tableView.rows.length.toString(),
                // textValue: dataView.single.value.toString()
                textValue: tableView.rows.length.toString(),
            });
        } else {
            this.clear();
        }
    }

    private clear() {
        ReactCircleCard.update(initialState);
    }

    public enumerateObjectInstances(
        options: EnumerateVisualObjectInstancesOptions
    ): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {

        return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
    }
}