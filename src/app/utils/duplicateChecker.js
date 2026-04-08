import { updateToast } from "./toast"

// these functions are for object arrays that contain a key 'name'

// Use this if you are adding a new string in an object array with key 'name'
export function doesStringExist(inputString, array){
   let isDuplicate = false
   array.forEach(item => {
      if(inputString.toLowerCase() === item.name.toLowerCase()){
         isDuplicate = true
      } 
   })
   return isDuplicate
}

// Use this if there is an additional constraint to the key 'code'
export function doesStringWithCodeExist(inputCode, inputString, array){
   let isDuplicate = false
   array.forEach(item => {
      if(inputString.toLowerCase() === item.name.toLowerCase() || inputCode.toLowerCase() === item.code.toLowerCase()){
         isDuplicate = true
      } 

   })
   return isDuplicate
}

// Use this if you are updating a string in an object array with key 'name'
export function doesUpdateStringExist(updatedID, inputString, array){
   let isDuplicate = false
   array.forEach(item => {
      if(inputString.toLowerCase() === item.name.toLowerCase() && updatedID !== item.id){
         isDuplicate = true
      } 
   })
   return isDuplicate
}

export function doesUpdateStringWithCodeExist(updatedID, inputCode, inputString, array){
   let isDuplicate = false
   array.forEach(item => {
      if((inputString.toLowerCase() === item.name.toLowerCase() 
      || inputCode.toLowerCase() === item.code.toLowerCase())
      && updatedID !== item.id){
         isDuplicate = true
      } 
   })
   return isDuplicate
}

// for users
export function doesUserExist(inputString, array){
   let isDuplicate = false
   array.forEach(item => {
      if(inputString.toLowerCase() === item.username.toLowerCase()){
         isDuplicate = true
      } 
   })
   return isDuplicate
}


export function doesUpdateUserExist(inputString, array){
   let isDuplicate = false
   array.forEach(item => {
      if(inputString.toLowerCase() === item.username.toLowerCase() && updatedID !== item.id){
         isDuplicate = true
      } 
   })
   return isDuplicate
}
