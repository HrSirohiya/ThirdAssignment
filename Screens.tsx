import React, {useState,useEffect} from 'react';
import {RouteProp} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import {
    View,
    Text,
    TextInput,
    Button,
    TouchableOpacity,
    StyleSheet,
    Alert,
    SafeAreaView,
    FlatList,
    ActivityIndicator,
    Image

  } from 'react-native';
import {RootStackParamList} from './App';
import axios from 'axios';


type ScreenNavigationProp<
  T extends keyof RootStackParamList
> = StackNavigationProp<RootStackParamList, T>;

type ScreenRouteProp<T extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  T
>;
type Props<T extends keyof RootStackParamList> = {
  route: ScreenRouteProp<T>;
  navigation: ScreenNavigationProp<T>;
};
export const HomeScreen: React.FC<Props<'HomeScreen'>> = ({navigation}) => {
    const [city, setCity] = useState("");
   

    const getcountryList = async () => {

        try {
          const response = await axios.get(
            'https://restcountries.com/v2/name/'+city,
          );
          console.log('response---',JSON.stringify(response.data));

             navigation.navigate('CountryListScreen', {
            data:response.data
         
            
          })


        } catch (error) {
          console.log('respoooooonse',JSON.stringify(error));

          Alert.alert(JSON.stringify(error)) 
        }
      };



     

  return (
    <View style={styles.heading}>
    <Text >Enter City name </Text>
    <View style={styles.form}>
      <TextInput
        style={styles.input}
        placeholder="Enter city name"
        value={city}
        onChangeText={text => setCity(text)}
      />

       <Button
        disabled={!city }
        title="Submit"
        onPress={getcountryList}
      />

     
    </View>
  </View>

  
  );
};


export const CountryListScreen: React.FC<Props<'CountryListScreen'>> = ({route,navigation}) => {

  const {data} = route.params;
  console.log("country list page",data);
  


  const getcurrentWeather = async (capital) => {

    try {
      const response = await axios.get(
        'http://api.weatherstack.com/current?access_key=419af70de782f72154c5f8b8a618c21b&query='+capital,
      );
      console.log('response---',JSON.stringify(response.data));
        navigation.navigate('DetailsScreen', {
          temp:JSON.stringify(response.data.current.temperature),
          weather_icons:JSON.stringify(response.data.current.weather_icons[0]),
          wind_speed:JSON.stringify(response.data.current.wind_speed),
          precip:JSON.stringify(response.data.current.precip)
       
        
      })


    } catch (error) {
      console.log('respoooooonse',JSON.stringify(error));
      Alert.alert(JSON.stringify(error)) 
     
    }
  };
 
  


  const ItemView = ({item}) => {
    
    return (
      <TouchableOpacity
      style={{padding:10}}
      onPress={() => getcurrentWeather(item.capital)
      
      }
      >
       <View style={styles.item}>
        <Text>Capital: {item.capital}
        </Text>
        <Text>Population: {item.population}
        </Text>
        <Text>latlng: {item.latlng}
        </Text>
        <View>
        <Image
        
          style={{
            width: 51,
            height: 51,
            resizeMode: 'contain',
          }}
        source={{
          uri: item.flags.png,
        }}
      />
</View>
        
        </View>


      </TouchableOpacity>
     
    
    );
  };

  const ItemSeparatorView = () => {
    return (
      <View
        style={{
          height: 0.5,
          width: '100%',
          backgroundColor: '#C8C8C8',
        }}
      />
    );
  };

  

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={ItemView}
        keyExtractor={(item) => item.numericCode.toString()}

      
      />
      </View>
    </SafeAreaView>
  );
};










export const DetailsScreen: React.FC<Props<'DetailsScreen'>> = ({route}) => {
  const { temp,weather_icons,wind_speed,precip} = route.params;
  
  console.log('weather icon--------', weather_icons.slice(1,-1));

 
  

return (
    <View style={{flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start',padding:20}}>
      <Text style={styles.buttonText} >current Weather </Text>
      <Text style={styles.titleText}>Temp : <Text style={styles.valueText}>{temp}</Text></Text>
      <Text style={styles.titleText}>Wind Speed : <Text style={styles.valueText}>{wind_speed}</Text></Text>
      <Text style={styles.titleText}>Precip : <Text style={styles.valueText}>{precip}</Text></Text>

      <Image
        
        style={{
          width: 51,
          height: 51,
          resizeMode: 'contain',
        }}
      source={{
        uri: weather_icons.slice(1,-1),
      }}
    />
      

  
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
  },
    heading: {
      marginTop:20,
      margin:20
      
      
    },
    form: {
      marginTop: 5,
    },
    input: {
      padding: 15,
      borderColor: 'rgba(0, 0, 0, 0.2)',
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 20,
    },
    textView: {
      padding: 5,
      borderColor: 'rgba(0, 0, 0, 0.2)',
      marginBottom: 20,
      color: '#000',
      fontWeight: '800'
    },
    addItemButton: {
      backgroundColor: '#eb8634',
      paddingVertical: 20,
      borderRadius: 5,
      alignItems: 'center',
    },
    item: {
      height: 100,
      backgroundColor : '#e3e3e3',
      marginVertical : 6,
      justifyContent : 'center',
      alignItems : 'center',
      margin : 12,
      padding:10,
      borderRadius : 5,
  },
    buttonText: {color: '#000',marginBottom:10,  fontSize: 20,fontWeight: "bold"},
   
    titleText: {color: '#000',marginBottom:10,  fontSize: 14,fontWeight: "bold"},
    valueText: {color: '#000',marginBottom:10,  fontSize: 13,fontWeight: "500"},

  })