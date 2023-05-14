import { reload } from 'firebase/auth';
import React from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import PieChart from 'react-native-pie-chart';
//
const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      margin: 10,
    },
  })

const ManyBars = (props: any) => {
    const true_ratios = props.ratios;
    const arr = Object.entries(true_ratios);
    arr.sort((a, b) => (b[1] as number) - (a[1] as number));
    const sorted_ratios = Object.fromEntries(arr);
    console.log(sorted_ratios)
    const colors_raw = ['#1B9AAA', '#06D6A0', '#F8FFE5', '#FE621D', "#af3800"];
    for(let i = 0; i < Object.keys(sorted_ratios).length - 5; ++i){
        colors_raw.push('#846c5b')
    }
    let idx = 0;
    return (
        <View>
            {Object.entries(sorted_ratios).map(([key, value]) => (
                <View key = {key}>
                    
                    <View style = {[{left: 40, marginTop: 10, backgroundColor: '#846c5b', width: 300, borderRadius: 10, height: 60}]}>
                    <Text style = {[{left: 10, fontSize: 40, zIndex: 900, top: 6}]}>{key}</Text>
                        <View style ={[{left: 0, width: Math.min(value * 2.4 * 300, 300), backgroundColor: colors_raw[idx++], borderRadius:10, height: 60, top: -48}]}>
    
                    </View>
                    </View>
                    </View>
            ))}
        </View>
    )
}

const PieChartRatio = (props: any) => {
    if(Object.entries(props.ratios).length !== 0){
        let series = [];
        
        const widthAndHeight = 250;
        
        const true_ratios = props.ratios;
        const arr = Object.entries(true_ratios);
        arr.sort((a, b) => (b[1] as number) - (a[1] as number));
        const sorted_ratios = Object.fromEntries(arr);
        const objectKeys = Object.keys(sorted_ratios);
        const colors_raw = ['#1B9AAA', '#06D6A0', '#F8FFE5', '#FE621D', "#af3800"];
        let colors = [];
        for(let i = 0; i < Math.min(objectKeys.length, 5); ++i){
            series.push(sorted_ratios[objectKeys[i]]);
            colors.push(colors_raw[i]);
        }
        
    

        console.log("yo where tf my piechart")
        return (
         
            <View style={styles.container}>
                <PieChart
                widthAndHeight={widthAndHeight}
                series={series}
                sliceColor={colors}
                coverRadius={0.45}
                coverFill={'#1D201f'}
                style={[{marginBottom: 42}]}/>
                <View style ={[{width: 388, backgroundColor: 'black', height: 900}]}>
                <Text style={[{marginTop:10, textAlign: 'right', width: 330, fontStyle: 'italic', color: 'white'}]}>you are thankful for...</Text>
                <ManyBars ratios = {props.ratios}> </ManyBars>
                </View>
            </View>
           
        )}
    else{
        return <View></View>
    }
}

export default PieChartRatio;