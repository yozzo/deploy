/**
 * Created with JetBrains WebStorm.
 * User: Tom Le Coz
 */

var AttributePool = function (gl,shaderObj) {

    this.gl = gl;
    this.shader = shaderObj;
    this.nb = 0;

    this.names = new Array();
    this.datas = new Array();
    this.buffers = new Array();
    this.locations = new Array();
    this.counts = new Array();

}
Float32Array.prototype.o = new Object();

AttributePool.prototype.registerAttributes = function(name, data, location,buffer,count){
    var id = this.nb;

    this.names[id] = name;
    this.datas[id] = data;
    this.locations[id] = location;
    this.counts[id] = count;
    this.buffers[id] = buffer;

    var gl = this.gl;
    var th = this;

    //alert(buffer+" : "+buffer.o)

    data.o.gl = gl;
    data.o.datas = data;
    data.o.buffer = buffer;

    data.o.update = function(){
        with(this){
            gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
            gl.bufferData(gl.ARRAY_BUFFER,datas,gl.STATIC_DRAW);
        }
    }





    this.shader.__defineGetter__(name,function(){return th.datas[id];}) ;
    this.shader.__defineSetter__(name,function(val){
        //alert("update buffer -> "+name+" : "+id+" : "+th.datas[id])
        //th.datas[id].set(val);
        th.datas[id] = val;
        gl.bindBuffer(gl.ARRAY_BUFFER,th.buffers[id]);
        gl.bufferData(gl.ARRAY_BUFFER,th.datas[id],gl.STATIC_DRAW);
    });

    this.nb++;
}

AttributePool.prototype.addFloatAttributes = function (name, data, location,count) {

    var vb = this.gl.createBuffer();
    var vdb = new Float32Array(data);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER,vb);
    this.gl.bufferData(this.gl.ARRAY_BUFFER,vdb,this.gl.STATIC_DRAW);

    this.registerAttributes(name, vdb, location,vb,count);

}

AttributePool.prototype.addUintAttributes = function (byteType,name, data, location,count) {

    var vb = this.gl.createBuffer();

    var vdb;
    if(byteType == 16) vdb = new Uint16Array(data);
    else if(byteType == 32) vdb = new Uint32Array(data);
    else if(byteType == 8) vdb = new Uint8Array(data);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER,vb);
    this.gl.bufferData(this.gl.ARRAY_BUFFER,vdb,this.gl.STATIC_DRAW);

    this.registerAttributes(name, vdb, location,vb,count);

}


AttributePool.prototype.enableAttributes = function(){
    var i,len = this.nb;
    var gl = this.gl;
    for(i=0;i<len;i++) gl.enableVertexAttribArray(this.locations[i]);
}
AttributePool.prototype.disableAttributes = function(){
    var i,len = this.nb;
    var gl = this.gl;
    for(i=0;i<len;i++) gl.disableVertexAttribArray(this.locations[i]);
}


AttributePool.prototype.apply = function(){
    var i,len = this.nb;
    var gl = this.gl;
    for(i=0;i<len;i++){
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[i]);
        gl.vertexAttribPointer(this.locations[i],this.counts[i], gl.FLOAT, false, 0, 0);
    }
}







