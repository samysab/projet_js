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

export function type_check_v3(variable, conf) {

  for (const [key, value] of Object.entries(conf)) {
    if(key === 'type' && !type_check_v1(variable, conf.type)) return false;
    
    if(key === 'value' && JSON.stringify(variable) !== JSON.stringify(value)) return false;

    if(key === 'enum' && JSON.stringify(value).indexOf(JSON.stringify(variable)) == "-1") return false;

    if(typeof variable === 'object' && key === 'properties' && JSON.stringify(Object.keys(conf.properties)) !== JSON.stringify(Object.keys(variable))) return false;
    
    if(key === 'properties' && Object.keys(variable).includes(Object.keys(conf[key]).toString())){
    
        let val_variable = variable[Object.keys(conf[key]).toString()];
            for(const [k, v] of Object.entries(conf[key][Object.keys(conf[key]).toString()])){
              if(k === 'type' && !type_check_v1(val_variable, v)) return false;
    
              if(k === 'value' && JSON.stringify(val_variable) !== JSON.stringify(v)) return false;
          
              if(k === 'enum' && JSON.stringify(v).indexOf(JSON.stringify(val_variable)) == "-1") return false;
        }
    }
  }
  return true;
}
