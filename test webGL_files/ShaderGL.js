/**
 * Created with JetBrains WebStorm.
 * User: Tom Le Coz
 */

var ShaderGL = function(gl){
    this.gl = gl;
    this.vertexShader = null;
    this.fragmentShader = null;
    this.program = null;
    this.indexBuffer = null;
    this.indexBufferData = null;
    this.nbIndice = 0;

    this.blendMode = null;
    this.uniforms = new UniformPool(gl,this);
    this.attributes = new AttributePool(gl,this);
    this.matrixs = new MatrixPool(gl,this);
    this.textures = new TexturePool(gl,this);

}

ShaderGL.prototype.__getShaderStringFromDocument = function(shaderId){
    var shaderScript = document.getElementById(shaderId);
    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }
    return str;
}


ShaderGL.prototype.compileShaderFromDocumentElements = function(vertexShaderID,fragmentShaderID){

    var vs = this.__getShaderStringFromDocument(vertexShaderID);
    var fs = this.__getShaderStringFromDocument(fragmentShaderID);

    this.vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
    this.gl.shaderSource(this.vertexShader, vs);
    this.gl.compileShader(this.vertexShader);

    if (!this.gl.getShaderParameter(this.vertexShader, this.gl.COMPILE_STATUS)) {
        alert(this.gl.getShaderInfoLog(this.vertexShader));
        return null;
    }

    this.fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
    this.gl.shaderSource(this.fragmentShader, fs);
    this.gl.compileShader(this.fragmentShader);

    if (!this.gl.getShaderParameter(this.fragmentShader, this.gl.COMPILE_STATUS)) {
        alert(this.gl.getShaderInfoLog(this.fragmentShader));
        return null;
    }

    this.program = this.gl.createProgram();
    this.gl.attachShader(this.program, this.vertexShader);
    this.gl.attachShader(this.program, this.fragmentShader);
    this.gl.linkProgram(this.program);

    this.gl.useProgram(this.program);
}

ShaderGL.prototype.setTriangleIndices = function(indices,indexBuffer,indexDataBuffer){
    if(indexBuffer == null){
        if(indices.length % 3 != 0){
            alert("ShaderObject.setTriangleIndices error -> incorrect number of indices");
            return;
        }

        this.indexBuffer = this.gl.createBuffer();
        this.indexBufferData = new Uint16Array(indices);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBufferData, this.gl.STATIC_DRAW);

    }else{
        this.indexBuffer = indexBuffer;
        this.indexBufferData = indexDataBuffer;
    }

    this.__defineGetter__(name,function(){return this.indexBufferData;}) ;
    this.__defineSetter__(name,function(val){
        this.indexBufferData.set(val);
        gl.bindBuffer(gl.ARRAY_BUFFER,this.indexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,this.indexBufferData,gl.STATIC_DRAW);
    });

    this.nbIndice = indices.length;
}



ShaderGL.prototype.start = function(){
    if(this.program == null || this.attributes.nb == 0 || this.indexBuffer == null || this.matrixs.nb == 0){
        if(this.program == null){
            alert("ShaderObject.start error -> A shader to be compiled as Program based on VertexShader and Fragement. You must use ShaderGL.compileShader")
            return;
        }

        if(this.attributes.nb == 0){
            alert("ShaderObject.start error -> A shader need at least one VertexAttributes. You must create one with ShaderGL.newFloatAttributes or ShaderGl.newIntAttributes")
            return;
        }

        if(this.indexBuffer == null){
            alert("ShaderObject.start error -> A shader need an IndexBuffer to know how to draw triangles. You must create one with ShaderGL.setTriangleIndices")
            return;
        }

        if(this.matrixs.nb == 0){
            alert("ShaderObject.start error -> A shader need a matrix to compute point position. You must set one with ShaderGL.newMatrix4x4 or ShaderGl.newMatrix3x4 .")
            return;
        }
    }

    this.gl.useProgram(this.program);

    this.attributes.enableAttributes();
}


ShaderGL.prototype.stop = function(){
    this.attributes.disableAttributes();
}


ShaderGL.prototype.apply = function(){
    if(this.textures.isReady){

        this.textures.apply();
        this.uniforms.apply();
        this.matrixs.apply();
        this.attributes.apply();

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.drawElements(this.gl.TRIANGLES, this.nbIndice, this.gl.UNSIGNED_SHORT, 0);
    }
}





















//##### TEXTURES

ShaderGL.prototype.newTexture = function(name){
    this.textures.defineNewTexture(name,this.gl.getUniformLocation(this.program, name));
}
ShaderGL.prototype.newTextureFromURL = function(name,url){
    this.textures.defineNewTextureFromURL(name,this.gl.getUniformLocation(this.program, name),url);
}
ShaderGL.prototype.newTextureFromCanvas = function(name,canvas){
    this.textures.defineNewTextureFromURL(name,this.gl.getUniformLocation(this.program, name),canvas);
}


//##### UNIFORMS

//-- SINGLE DATA :
ShaderGL.prototype.newBoolean = function(name,value){
    var n;
    if(value == true || value == "true" || value == 1) n = 1;
    else n = 0;
    this.uniforms.addIntUniforms(1,name,n,this.gl.getUniformLocation(this.program, name));
}

ShaderGL.prototype.newSingleInt = function(name,value){

    this.uniforms.addIntUniforms(1,name,[parseInt(value)],this.gl.getUniformLocation(this.program, name));
}

ShaderGL.prototype.newSingleFloat = function(name,value){
    //var t = new Array();
    //t[0] = value;
    //this.newFloatVector(1,name,t);
    this.uniforms.addFloatUniforms(1,name,[parseFloat(value)],this.gl.getUniformLocation(this.program, name));
}


//-- MULTI-COMPONENTS VEC:

ShaderGL.prototype.newIntVector = function(nbCompo,name,values){
    this.uniforms.addIntUniforms(nbCompo,name,values,this.gl.getUniformLocation(this.program, name));
}
ShaderGL.prototype.newFloatVector = function(nbCompo,name,values){
    this.uniforms.addFloatUniforms(nbCompo,name,values,this.gl.getUniformLocation(this.program, name));
}

//-- ARRAY OF MULTI-COMPONENTS VEC:

ShaderGL.prototype.newIntVectorArray = function(nbCompo,name,values){
    this.uniforms.addIntArrayUniforms(nbCompo,name,values,this.gl.getUniformLocation(this.program, name));
}
ShaderGL.prototype.newFloatVectorArray = function(nbCompo,name,values){
    this.uniforms.addFloatArrayUniforms(nbCompo,name,values,this.gl.getUniformLocation(this.program, name));
}

//-- MATRIX :

ShaderGL.prototype.newMatrix4x4 = function(name,matrix){
    this.matrixs.addMatrix4x4(name,matrix,this.gl.getUniformLocation(this.program, name))
}

ShaderGL.prototype.newMatrix3x4 = function(name,matrix){
    this.matrixs.addMatrix3x4(name,matrix,this.gl.getUniformLocation(this.program, name))
}



//##### ATTRIBUTES :

ShaderGL.prototype.newFloatAttributes = function(nbCompo,name,datas){
    this.attributes.addFloatAttributes(name,datas,this.gl.getAttribLocation(this.program, name),nbCompo);
}

ShaderGL.prototype.newIntAttributes = function(byteType,nbCompo,name,datas){
    if(byteType == 8 || byteType == 16 || byteType == 32){
        this.attributes.addUintAttributes(byteType,name,datas,this.gl.getAttribLocation(this.program, name),nbCompo);
    }else{
        alert("ShaderGl.newIntAttributes error : 'byteType' must contains the value 8, 16 or 32.")
        return;
    }
}











































