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
import * as React from "react";
import powerbiVisualsApi from "powerbi-visuals-api";
import DataViewTable = powerbiVisualsApi.DataViewTable;

import {
    VictoryChart,VictoryTheme,VictoryLine
} from "victory";
export interface State {
    textLabel: string,
    textValue: string,
    size: number,
    length?:string,
    splineData:Array<any>,
    background?: string,
    borderWidth?: number,
}

export const initialState: State = {
    textLabel: "",
    textValue: "",
    size: 200,
    splineData:[]
}

export class ReactCircleCard extends React.Component<{}, State>{

    private static updateCallback: (data: object) => void = null;

    public static update(newState: State) {
        if(typeof ReactCircleCard.updateCallback === 'function'){
            ReactCircleCard.updateCallback(newState);
        }
    }

    public state: State = initialState;

    constructor(props: any){
        super(props);
        this.state = initialState;
    }

    public componentWillMount() {
        ReactCircleCard.updateCallback = (newState: State): void => { this.setState(newState); };
    }

    public componentWillUnmount() {
        ReactCircleCard.updateCallback = null;
    }

    render(){
        const { textLabel, textValue, size, background, borderWidth, splineData,length } = this.state;


        const style: React.CSSProperties = { width: size, height: size, background, borderWidth };

        return (
            // <div className="circleCard" style={style}>
            //     <p>
            //         {splineData.length}
            //         <br/>
            //         <em>{textValue}</em>
            //     </p>
            // </div>
            <VictoryChart
            theme={VictoryTheme.material}
            >
            <VictoryLine
                style={{
                data: { stroke: "#c43a31" },
                parent: { border: "1px solid #ccc"}
                }}
                data={splineData}
                domain={{x: [1, 12], y: [0.925, 0.95]}}
                animate={{
                    duration: 2000,
                    onLoad: { duration: 1000 }
                  }}
            />
            </VictoryChart>
            // <span>{splineData.length}</span>
        )
    }
}

export default ReactCircleCard;