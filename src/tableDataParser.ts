import powerbiVisualsApi from "powerbi-visuals-api";

import VisualUpdateOptions = powerbiVisualsApi.extensibility.visual.VisualUpdateOptions;
import DataView = powerbiVisualsApi.DataView;

import DataViewTable = powerbiVisualsApi.DataViewTable;
import DataViewTableRow = powerbiVisualsApi.DataViewTableRow;
import DataViewCategorical = powerbiVisualsApi.DataViewCategorical;
import PrimitiveValue = powerbiVisualsApi.PrimitiveValue;
import DataViewValueColumnGroup = powerbiVisualsApi.DataViewValueColumnGroup;



export class TableDataParser{

    public data;
    constructor(options: VisualUpdateOptions) {
        const dataView: DataView = options.dataViews[0];
        const table: DataViewTable = dataView.table;
        var data = new Map();
        table.rows.forEach((row:DataViewTableRow)=>{
            var splited = row[1].toString().split(",");
            if(data.has(splited[0])){
                var val = data.get(splited[0]);
                val.push({
                    x:parseFloat(splited[2].toString()),
                    y:parseFloat(splited[1].toString() + Math.random()),
                })
                data.set(splited[0],val);
            }else{
                data.set(splited[0],[{
                    x:parseFloat(splited[2].toString()),
                    y:parseFloat(splited[1].toString()+ Math.random()),
                }])
            }
        })
        this.data = data;
    }
}