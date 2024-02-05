<template>
    <div class="mainViewDiv">
        <div class="mainViewTempDiv">
            <p class="tempView">{{ temp }}</p>
        </div>
        <div class="verticalLine"></div>
        <div class="weatherInfoDiv">
            <div className="mainViewWeatherTypeDiv">
                <p class="mainViewWeatherType">{{ type }}</p>
            </div>
            <div class="mainViewLocationDiv">
                <p>{{ loc }}</p>
            </div>
        </div>
        
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { WeatherType } from '@/assets/libs/weatherController';

    const props = defineProps<{
        temp: Number,
        location: String,
        weatherType?: WeatherType,
    }>();


    let temp = computed(() => {return `${props.temp}°`});
    let loc = ref(props.location);
    let type = ref(resolveWeatherType(props.weatherType));


    function resolveWeatherType(type:WeatherType | undefined):string
    {
        window.alert(type);
        switch(type){
            case WeatherType.CLEAR:
                return "Klar";
                break;
            case WeatherType.CLOUDY:
                return "Bewölkt";
                break;
            case WeatherType.RAINING:
                return "Regen";
                break;
            case WeatherType.SNOW:
                return "Schnee";
                break;
            case WeatherType.SUNNY:
                return "Sonnig";
                break;
            default:
                return "No Data";
        }
    }

</script>

<style scoped>
    .mainViewDiv{
        position:relative;
        height:85px;     
        width:95%;
        display:flex;
        justify-content:flex-start;
        align-items:center;
    }

    .mainViewTempDiv
    {
        position:relative;
        width:96px;
        height:100%;
        display:flex;
        flex-direction:column;
        justify-content:center;
    }

    .tempView
    {
        color:rgba(240, 248, 255, 0.8);
        font-size: 60px;
    }

    .verticalLine
    {
        position:relative;
        width:2px;
        height:70px;
        background-color: rgba(240, 248, 255, 0.8);
    }

    .weatherInfoDiv
    {
        position:relative;
        display:flex;
        flex-direction: column;
        justify-content: center;
        height:85px;
        margin-left:10px;
    }

    .mainViewWeatherTypeDiv
    {
        position:relative;
        font-size:36px;
        color: rgba(240, 248, 255, 0.8);
        height:42px;
        width:100%;
        bottom:35px;
        text-align:left;
        padding-left:2px;
    }

    .mainViewLocationDiv
    {
        height:40px;
        width:200px;
        border-style:solid;
        border-radius:10px;
        border-color:rgba(245, 245, 245, 0.3);
        background-color:rgba(245, 245, 245, 0.3);
        padding:-3px;
        font-size:20px;
        display:flex;
        flex-direction: column;
        justify-content:center;
        color:rgba(240, 248, 255, 0.8);
        text-align:left;
        padding-left:2px;
        
    }

    .mainViewWeatherType
    {

    }
</style>