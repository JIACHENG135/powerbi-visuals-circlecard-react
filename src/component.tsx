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
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';




import {
    VictoryChart,VictoryTheme,VictoryLine,VictoryScatter,VictoryLabel,VictoryBar,VictoryTooltip,VictoryAxis
} from "victory";



export interface State {
    textLabel: string,
    textValue: string,
    size: number,
    selected: "basis" | "bundle" | "cardinal"| "catmullRom"| "linear"|"monotoneX"| "monotoneY"| "natural"| "step"|"stepAfter"| "stepBefore",
    length: Map<any,any>,
    splineData:Array<any>,
    background?: string,
    borderWidth?: number,
}

export const initialState: State = {
    textLabel: "",
    textValue: "",
    selected: "natural",
    size: 200,
    splineData:[],
    length: new Map(),
}
const cartesianInterpolations = [
    "basis",
    "bundle",
    "cardinal",
    "catmullRom",
    "linear",
    "monotoneX",
    "monotoneY",
    "natural",
    "step",
    "stepAfter",
    "stepBefore"
  ];
  
  const polarInterpolations = [
    "basis",
    "cardinal",
    "catmullRom",
    "linear"
  ];
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
    public handleSelect(event: React.ChangeEvent<{ value: "basis" | "bundle" | "cardinal"| "catmullRom"| "linear"|"monotoneX"| "monotoneY"| "natural"| "step"|"stepAfter"| "stepBefore" }>) {
        this.setState({
            selected: event.target.value as "basis" | "bundle" | "cardinal"| "catmullRom"| "linear"|"monotoneX"| "monotoneY"| "natural"| "step"|"stepAfter"| "stepBefore",
        })
      }

    render(){
        const { textLabel, textValue, size, background, borderWidth, splineData,length,selected } = this.state;
        
        const style: React.CSSProperties = { width: size, height: size, background, borderWidth };

        const lines = [];
        const scatters = [];
        const colors = new Map([
            ["0","#fface4"],
            ["1","#c43a31"]
        ])
        for (let key of length.keys()) {
            lines.push(  
                        
                <VictoryLine
                    style={{
                    data: { stroke: colors.get(key) },
                    parent: { border: "1px solid #ccc"}
                    }}
                    data={length.get(key)}
                    domain={{x: [1, 12], y: [0.925, 0.95]}}
                    animate={{
                        duration: 1000,
                        onLoad: { duration: 1000 }
                    }}
                    interpolation={selected}
                />)
            scatters.push(
                <VictoryScatter
                style={{ data: { fill: colors.get(key),opacity: ({ datum }) => datum.opacity || 1 } }}
                size={3}
                data={length.get(key)}
                domain={{x: [1, 12], y: [0.925, 0.95]}}
                labels={({ datum }) => datum.y}
                labelComponent={<VictoryTooltip/>}
                animate={{
                    // animationWhitelist: ["style", "data", "size"], // Try removing "size"
                    onExit: {
                      duration: 500,
                      before: () => ({ opacity: 0.3, _y: 0 })
                    },
                    duration: 1000,
                    onLoad: { duration: 1000 },
                    onEnter: {
                      duration: 500,
                      before: () => ({ opacity: 0.3, _y: 0 }),
                      after: (datum) => ({ opacity: 1, _y: datum._y })
                    }
                  }}
                />
            )
        }
        return (
            // <div className="circleCard" style={style}>
            //     <p>
            //         {splineData.length}
            //         <br/>
            //         <em>{textValue}</em>
            //     </p>
            // </div>
            <div id="wrapper">
                <Grid container spacing={4}>
                    <Grid container xs={12}>
                        <Grid item xs={12} id="interpolating-methods">
                        <Select
                            labelId="demo-simple-select-autowidth-label"
                            id="demo-simple-select-autowidth"
                            value={selected}
                            onChange={this.handleSelect.bind(this)}
                            autoWidth
                            >
                                <MenuItem value="basis">basis</MenuItem>
                                <MenuItem value="bundle">bundle</MenuItem>
                                <MenuItem value="cardinal">cardinal</MenuItem>
                                <MenuItem value="catmullRom">catmullRom</MenuItem>
                                <MenuItem value="linear">linear</MenuItem>
                                <MenuItem value="monotoneX">monotoneX</MenuItem>
                                <MenuItem value="monotoneY">monotoneY</MenuItem>
                                <MenuItem value="step">step</MenuItem>
                                <MenuItem value="stepAfter">stepAfter</MenuItem>
                                <MenuItem value="stepBefore">stepBefore</MenuItem>
                                <MenuItem value="natural">natural</MenuItem>

                            </Select>
                        </Grid>
                        <Grid id="chart" item xs={12} >
                            <VictoryChart
                            theme={VictoryTheme.material}
                            height={200} width={400}
                            >
                                <VictoryAxis style={{tickLabels :{fontSize: 5}}}/>
                                <VictoryAxis style={{tickLabels :{fontSize: 5}}} dependentAxis/>
                                {lines}
                                {scatters}
                            </VictoryChart>
                        </Grid>
                    </Grid>
                </Grid>


            </div>

            // <span>{splineData.length}</span>
        )
    }
}

export default ReactCircleCard;