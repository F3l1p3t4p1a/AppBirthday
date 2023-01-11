import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native'
import React, {useState} from 'react';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import firebase from '../utils/firebase';
import 'firebase/firestore';

firebase.firestore().settings({experimentalForceLongPolling: true});
const db = firebase.firestore(firebase);

export default function AddBirthday(props) {

const {user,setMostrarLista, setReloadData} = props;

const [isDatePickerVisible, setIsDatePickerVisible] = useState(false)    
const [formData, setFormData] = useState({})
const [formErrors, setFormErrors] = useState({});

const hideDatePicker = () => {
    setIsDatePickerVisible(false);
}

const handlerConfirm = (date) => {
    const dateBirth = date;
    dateBirth.setHours(0);
    dateBirth.setMinutes(0);
    dateBirth.setSeconds(0);
    setFormData({...formData, dateBirth})
    hideDatePicker();
}

const mostrarDatePicker = () => {
    setIsDatePickerVisible(true);
}

const onChange = (e, type) => {
    setFormData({...formData, [type]: e.nativeEvent.text})
}

const onSubmit = () => {
    let errors = {};
    if(!formData.nombre || !formData.apellidos || !formData.dateBirth){
        if(!formData.nombre) errors.nombre = true;
        if(!formData.apellidos) errors.apellidos = true;
        if(!formData.dateBirth) errors.dateBirth = true;
    }else{
        const data = formData;
        data.dateBirth.setYear(0);
        db.collection(user.uid)
        .add(data)
        .then(() => {
            setReloadData(true);
            setMostrarLista(true);
            
        })
        .catch(() => {
            setFormErrors({nombre: true, apellidos: true, dateBirth: true});
        });

    }
    setFormErrors(errors);

}

  return (
    <>
     <View style={styles.container}>
        <Image style={styles.logo} source={require("../assets/logo2.jpg")} />
        <TextInput 
            style={[styles.input, formErrors.nombre && {borderColor: '#940c0c'}]}
            placeholder='Nombre'
            placeholderTextColor='#969696'
            onChange={(e) => onChange(e, 'nombre')}
        />
        <TextInput 
            style={[styles.input, formErrors.apellidos && {borderColor: '#940c0c'}]}
            placeholder='Apellidos'
            placeholderTextColor='#969696'
            onChange={(e) => onChange(e, 'apellidos')}
        />
        <View style={[styles.input, styles.datePicker, formErrors.dateBirth && {borderColor: '#940c0c'}]}>
            <Text style={{color: formData.dateBirth ? '#fff' : '#969696', fontSize: 18}} onPress={mostrarDatePicker}>
                {formData.dateBirth ? moment(formData.dateBirth).format("DD-MM-YYYY") : "Fecha de Nacimiento"}
            </Text>
        </View>
        <TouchableOpacity onPress={onSubmit} style={styles.containerCrear}>
            <Text style={styles.addButton}>Crear Cumpleaños</Text>
        </TouchableOpacity>
     </View>
     <DateTimePickerModal 
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handlerConfirm}
        onCancel={hideDatePicker}
     />

     
    </>
  )
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -80
    },
    input: {
        height: 50,
        color: '#fff',
        width: '80%',
        marginBottom: 25,
        backgroundColor: '#1e3040',
        paddingHorizontal: 20,
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#1e3040',
        borderRadius: 50
    },
    datePicker: {
        justifyContent: 'center'
    },
    addButton: {
        fontSize: 18,
        color: '#fff'
    },
    containerCrear: {
        backgroundColor: '#559204',
        borderRadius: 50,
        paddingVertical: 10,
        paddingHorizontal: 10,
        width: '80%',
        alignItems: 'center'
    },
    logo: {
        width: '80%',
        height: 140,
        marginBottom: 50,
        
    }
});