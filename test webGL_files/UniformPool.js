/**
 * Created with JetBrains WebStorm.
 * User: Tom Le Coz
 */

var UniformPool = function (gl,shaderObj) {

    this.gl = gl;
    this.shader = shaderObj;
    this.names = new Array();
    this.datas = new Array();
    this.funcNames = new Array();
    this.locations = new Array();
    this.isArrays = new Array();
    this.counts = new Array();


    this.nb = 0;
}

UniformPool.prototype.registerUniform = function(name, data, funcName, location,isArray,count) {

    var id = this.nb;

    this.names[id] = name;
    this.datas[id] = data;
    this.funcNames[id] = funcName;
    this.locations[id] = location;
    this.isArrays[id] = isArray;
    this.counts[id] = count;

    var th = this;
    this.shader.__defineGetter__(name,function(){return th.datas[id];}) ;
    this.shader.__defineSetter__(name,function(val){th.datas[id] = val;});

    this.nb++;

}


UniformPool.prototype.addFloatUniforms = function (nbCompo,name, data, location) {
    var func;
    if(nbCompo > 0 && nbCompo < 5){
        func = "uniform"+nbCompo+"f";
        this.registerUniform(name,data,func,location,false,nbCompo);
    }
    else{
        alert("UniformPool.addFloatUniforms error : nbCompo must contains the value 1,2,3 or 4")
        return;
    }
}
UniformPool.prototype.addIntUniforms = function (nbCompo,name, data, location) {
    var func;
    if(nbCompo > 0 && nbCompo < 5){
        func = "uniform"+nbCompo+"i";
        this.registerUniform(name,data,func,location,false,nbCompo);
    }
    else{
        alert("UniformPool.addIntUniforms error : nbCompo must contains the value 1,2,3 or 4")
        return;
    }
}

UniformPool.prototype.addFloatArrayUniforms = function (nbCompo,name, data, location) {
    var func;

    nbCompo = parseInt(nbCompo);
    if(nbCompo > 0 && nbCompo < 5){
        func = "uniform"+nbCompo+"fv";
        this.registerUniform(name,data,func,location,true,nbCompo);
    }
    else{
        alert("UniformPool.addFloatArrayUniforms error : nbCompo must contains the value 1,2,3 or 4")
        return;
    }

}
UniformPool.prototype.addIntArrayUniforms = function (nbCompo,name, data, location) {
    var func;

    nbCompo = parseInt(nbCompo);
    if(nbCompo > 0 && nbCompo < 5){
        func = "uniform"+nbCompo+"iv";
        this.registerUniform(name,data,func,location,true,nbCompo);
    }
    else{
        alert("UniformPool.addIntArrayUniforms error : nbCompo must contains the value 1,2,3 or 4")
        return;
    }
}

UniformPool.prototype.apply = function(){
    var i,len = this.nb;
    var j,nb;
    var gl = this.gl;

    for(i=0;i<len;i++){
        if(false == this.isArrays[i]){
           nb = this.counts[i];

           if(1 == nb){
              // alert("update "+this.funcNames[i])
               this.gl[this.funcNames[i]](this.locations[i],this.datas[i][0]);
           }
           else if(2 == nb) this.gl[this.funcNames[i]](this.locations[i],this.datas[i][0],this.datas[i][1]);
           else if(3 == nb) this.gl[this.funcNames[i]](this.locations[i],this.datas[i][0],this.datas[i][1],this.datas[i][2]);
           else if(4 == nb) this.gl[this.funcNames[i]](this.locations[i],this.datas[i][0],this.datas[i][1],this.datas[i][2],this.datas[i][3]);

        } else{
            this.gl[this.funcNames[i]](this.locations[i],this.datas[i]);
        }
    }
}


























