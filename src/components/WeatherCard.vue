<template>
    <div class="cardBaseFormat" :class="{'weatherCardDayDiv':dayTime, 'weatherCardNightDiv':!dayTime}">
        <div class="mainViewDiv">
            <MainView :temp=temperature :location="location" :weather-type="weatherObj?.weatherType"/>
        </div>
        <h1>{{ `${temperature}°C` }}</h1>
        <h1>{{ location }}</h1>
        <h1>{{weekday}}</h1>
        <h1>{{date}}</h1>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import WeatherController, { WeatherSnapshot } from "../assets/libs/weatherController";
import MainView from "./MainView.vue";

    let testText = ref("Hello!");
    let location = ref("Stadtlohn");
    let temperature = ref<number>(0);
    let weekday = ref("");
    let date = ref(parseDate());

    let dayTime = ref<boolean>(true);


    let weatherObj = ref<WeatherSnapshot>();




    let weatherC:WeatherController = new WeatherController(51.9920909, 6.9137972, weatherCallback);

    weekday.value = weatherC.day;

    function parseDate():string
    {
        let dt:Date = new Date();
        return(`${dt.getDate()}.${dt.getMonth()}.${dt.getFullYear()}`);
    }

    function weatherCallback()
    {
        weatherObj.value = weatherC.data;
        
        if(weatherObj.value !== undefined)
        {
            temperature.value = Math.round(weatherObj.value.temp);
            console.log(temperature.value);

            if(weatherObj.value.isDay){
                dayTime.value = true;
            }
            else
            {
                dayTime.value = false;
            }
        }
        
    }



</script>

<style scoped>
    .weatherCardDayDiv
    {
        position:absolute;
        background-image: linear-gradient(lightBlue, white);
        color:black;
        width:100%;
        height:100%;
    }

    .weatherCardNightDiv
    {
        position:absolute;
        background-color:#6e6d69;
        color:whitesmoke;
        width:100%;
        height:200%;
    }

    .cardBaseFormat
    {
        position:absolute;
        width:100%;
        height:100%;
    }

    .mainViewDiv
    {
        position:relative;
        left:5px;
        top:20px;
    }
</style>