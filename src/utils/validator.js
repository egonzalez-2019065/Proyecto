'use strict'
import { hash, compare } from 'bcrypt'



export const encrypt = async(password) => {
    try{
        return hash(password, 10) 
    }catch(err){
        console.error(err)
        return err
    }
}

// Validar la contraseña 
export const checkPassword = async (password, hash) => {
    try{
        return await compare(password, hash)
    }catch(err){
        console.error(err);
        return err
    }
}

// Validar que vengan datos y que el CLIENT no pueda cambiarse a admin
export const checkUpdate = (data, token)=>{
    if(token.role === 'CLIENT'){
        if(Object.entries(data).length === 0 ||
            data.role ||
            data.role == '' ||
            data.password ||
            data.password == ''
        ) {
            return false
        }
        return true
    }else{
        if(Object.entries(data).length === 0 ||
            data.password ||
            data.password == ''
        ){
            return false
        }
        return true
    }
}