/**
 * Created with JetBrains WebStorm.
 * User: Tom Le Coz
 */

var MatrixPool = function (gl,shaderObj) {

    this.gl = gl;
    this.shader = shaderObj;
    this.names = new Array();
    this.datas = new Array();
    this.funcNames = new Array();
    this.locations = new Array();
    this.nb = 0;
}

MatrixPool.prototype.registerMatrix = function(name, matrix, funcName, location) {

    var id = this.nb;

    this.names[id] = name;
    this.datas[id] = matrix;
    this.funcNames[id] = funcName;
    this.locations[id] = location;

    var th = this;
    this.shader.__defineGetter__(name,function(){return th.datas[id];}) ;
    this.shader.__defineSetter__(name,function(val){th.datas[id] = val;});

    this.nb++;

}


MatrixPool.prototype.addMatrix4x4 = function (name, data, location) {
    this.registerMatrix(name,data,"uniformMatrix4fv",location);
}
MatrixPool.prototype.addMatrix3x4 = function (name, data, location) {
    this.registerMatrix(name,data,"uniformMatrix3fv",location);
}

MatrixPool.prototype.apply = function(){
    var i,len = this.nb;
    for(i=0;i<len;i++) this.gl[this.funcNames[i]](this.locations[i],false,this.datas[i]);
}