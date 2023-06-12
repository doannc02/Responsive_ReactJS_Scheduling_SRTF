import { bindActionCreators, createSlice } from "@reduxjs/toolkit";

const inputSlice = createSlice(
    {
        name: "inputObj",
        initialState:{
               gantt: {
                data: [],
               }
        }, reducers:{
           ganttChartsRender: (state, action) =>{
            state.gantt.data = action.payload
           }
        }
    }
)

export const{ ganttChartsRender} = inputSlice.actions;
export default inputSlice.reducer