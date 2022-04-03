String.prototype.interpolate = function(animal) {
    let maChaine = this;
    let result = null;
    
    if(this.includes("{") || this.includes("{ ")){
      let objectSplited = maChaine.split("{");
  
      let myObject = objectSplited[2];
      let temp = myObject.split("}}")
  
      let tempSplit = temp[0].split("}}");
      maChaine = tempSplit[0];
      result = animal.prop_access(maChaine);
    }
    return this.replace("{{"+maChaine+"}}", result);
}

Object.prototype.prop_access = function(path) {
    let obj = this;
      if (path === null || path === '') return obj;
      let chemin = path.split('.')
      for (let i = 0; i < chemin.length; ++i) {
        if (obj === null || obj[chemin[i]] === undefined) return console.log(path + ' not exist.');
        else obj = obj[chemin[i]];
      }
    return obj;
}