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
import Slider from "@material-ui/core/Slider";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import { withStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Tooltip, { TooltipProps } from '@material-ui/core/Tooltip';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';



import {
    VictoryChart,VictoryTheme,VictoryLine,VictoryScatter,VictoryLabel,VictoryBar,VictoryTooltip,VictoryAxis
} from "victory";

import {ColorSettings, LineDatas, CanvasSettings,CountryList} from "./cateDataParser";


const LightTooltip = withStyles((theme: Theme) => ({
    tooltip: {
      backgroundColor: theme.palette.common.white,
      color: 'rgba(0, 0, 0, 0.87)',
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
  }))(Tooltip);
export interface State {
    selected: "basis" | "bundle" | "cardinal"| "catmullRom"| "linear"|"monotoneX"| "monotoneY"| "natural"| "step"|"stepAfter"| "stepBefore",
    colorSettings: ColorSettings,
    lineDatas: LineDatas,
    canvasSettings: CanvasSettings,
    lineValue:number,
    pointValue:number,
    canvasWidth: number,
    canvasHeight: number,
    countryList: Map<string,boolean>
}

export const initialState: State = {
    selected: "natural",
    colorSettings:{
        lineColors: [],
        scatterColors: []
    },
    lineDatas:{
        lineDatas:[],
        countries: []
    },
    canvasSettings:{
        title:  "This is a interpolating tool",
        domains:{
            x: [-10,10],
            y: [-10,10]
        },
        canvas:{
            height: 200,
            width: 400
        },
        sizes:{
            lines:[],
            scatters:[],
            tickLabels: 10
        }
    },
    lineValue:2,
    pointValue:2,
    canvasHeight: 200,
    canvasWidth: 400,
    countryList: new Map<string,boolean>()
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

    public onchange(value) {
        // console.log(value);
    }

    public componentWillUnmount() {
        ReactCircleCard.updateCallback = null;
    }
    public handleSelect(event: React.ChangeEvent<{ value: "basis" | "bundle" | "cardinal"| "catmullRom"| "linear"|"monotoneX"| "monotoneY"| "natural"| "step"|"stepAfter"| "stepBefore" }>) {
        this.setState({
            selected: event.target.value as "basis" | "bundle" | "cardinal"| "catmullRom"| "linear"|"monotoneX"| "monotoneY"| "natural"| "step"|"stepAfter"| "stepBefore",
        })
      }
    
    public handleCheck(event: React.ChangeEvent<HTMLInputElement>){
        // console.log(event.target.checked)
        const nextRows = new Map(this.state.countryList)
        nextRows.set(event.target.name,event.target.checked)
        this.setState({
            countryList:nextRows
        })
    }
    render(){
        // const {  colorSettings,lineDatas,selected } = this.state;
        const {colorSettings,selected,lineDatas,canvasSettings,lineValue,pointValue, canvasHeight, canvasWidth, countryList} = this.state;
        // console.log(lineValue)
        const lines = [];
        const scatters = [];
        // <FormControlLabel
        //     control={<Checkbox checked={state.checkedA} onChange={handleChange} name="checkedA" />}
        //     label="Secondary"
        // />
        // <FormControlLabel
        //     control={
        //     <Checkbox
        //         checked={state.checkedB}
        //         onChange={handleChange}
        //         name="checkedB"
        //         color="primary"
        //     />
        //     }
        //     label="Primary"
        // />
        const checkBoxes = []
        countryList.forEach((value:boolean,key:string) => {
            checkBoxes.push(
                <FormControlLabel
                    control={<Checkbox checked={countryList.get(key)} onChange={this.handleCheck.bind(this)} name={key} />}
                    label={key}
                />
            )
        })
        for (let i=0;i<lineDatas.lineDatas.length;i++) {
            if(countryList.get(lineDatas.countries[i])){
                lines.push(  
                    <VictoryLine
                        style={{
                        data: { stroke: colorSettings.lineColors[i],strokeWidth: lineValue ? lineValue/10 :canvasSettings.sizes.lines[i] },
                        parent: { border: "1px solid #ccc"}
                        }}
                        data={lineDatas.lineDatas[i]}
                        domain={{x: [1, 12], y: [0.925, 0.95]}}
                        animate={{
                            duration: 1000,
                            onLoad: { duration: 1000 }
                        }}
                        interpolation={selected}
                    />)
                scatters.push(
                    <VictoryScatter
                    style={{ data: { fill: colorSettings.scatterColors[i],opacity: ({ datum }) => datum.opacity || 1 } }}
                    size={pointValue ? pointValue/10 :canvasSettings.sizes.scatters[i]}
                    data={lineDatas.lineDatas[i]}
                    domain={{x: canvasSettings.domains.x, y: canvasSettings.domains.y}}
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

        }
        return (
            <div id="wrapper">
                <Grid container>
                    <Grid container xs={2}>
                        <Grid item xs={12}>
                            <Accordion>
                                <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                                >
                                <Typography>Counties</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <FormGroup>
                                        {checkBoxes}
                                    </FormGroup>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                    </Grid>

                    <Grid id="chart" item xs={10} >
                        <Grid item xs={12} className="interpolating-methods">
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
                        <Grid item xs={12}>
                            <VictoryChart
                            theme={VictoryTheme.material}
                            height={canvasHeight} width={canvasWidth}
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
        )
    }
}

export default ReactCircleCard;