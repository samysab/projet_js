export function type_check_v1(variable, type) {
  
    if (variable === null && type === "null") return true;
    if (variable === null ) return false;
  
   
    if(Array.isArray(variable) && type === "object") return false;
    if(Array.isArray(variable) && type === "array") return true;
  
    if (typeof variable === type) return true;
    return false
}


export function type_check_v2(variable, conf) {
  
  for (let key in conf){
    if( key == "type"){
      if(!type_check_v1(variable,conf.type)){
        return false;
      }
    }
    if( key == "value"){
      if (JSON.stringify(variable) !== JSON.stringify(conf.value) ){
        return false;
      }
    }
    if(key == "enum"){
      for (let i of conf.enum){
       if ( JSON.stringify(i) === JSON.stringify(variable)){
        return true
       }
      }
      return false
    }
  }
  return true;
}

export function type_check(variable, conf) {
  
  for (let key in conf){

    if( key == "type"){
      if(!type_check_v1(variable,conf.type)){
        return false;
      }
    }
    
    if( key == "value"){
      if (JSON.stringify(variable) !== JSON.stringify(conf.value) ){
        return false;
      }
    }

    if(key == "enum"){
     
      for (let i of conf.enum){
        if ( JSON.stringify(i) === JSON.stringify(variable)){
          return true
        }
      }
       
      return false
       
    }
     
    if(key == "properties"){
 
      let prop = Object.keys(conf.properties);
      let varProp = Object.keys(variable);
       
      if( JSON.stringify(prop) !== JSON.stringify(varProp)){
        return false;
      }
       
       //console.log(type_check(JSON.stringify(Object.values(variable)), ))
       
    }
  }
  return true;
 }

  