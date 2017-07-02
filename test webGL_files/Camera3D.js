/**
 * Created with JetBrains WebStorm.
 * User: Tom Le Coz
 * Date: 15/12/13
 * Time: 07:41
 * To change this template use File | Settings | File Templates.
 */

var Camera3D = function(gl){
    this.gl = gl;
    this.mat4 = mat4;
    this.persRatio = gl.viewportWidth / gl.viewportHeight;
    //alert("this.persRatio = "+this.persRatio);
    this.mvMatrix = mat4.create();
    this.pMatrix = mat4.create();



   // alert("MATRIXS = "+this.mvMatrix+" : "+this.pMatrix);

    this.fov = 50;
    this.zMin = 0.1;
    this.zMax = 2500;

    var a = (Math.PI/180 * this.fov)/2;
    this.focal = (gl.viewportWidth) * (Math.cos(a) * Math.sin(a))


    this.x = 0;
    this.y = 0;
    this.z = 0;


    this.rotationX = 0;
    this.rotationY = 0;
    this.rotationZ = 0;
}
Camera3D.prototype.initPerspective = function(fov,zMin,zMax) {
    this.fov = fov;
    this.zMin = zMin;
    this.zMax = zMax;
}
Camera3D.prototype.setPosition = function(px,py,pz){
    this.x = px;
    this.y = py;
    this.z = pz;
}
Camera3D.prototype.setRotation = function(rx,ry,rz){
    this.rotationX = rx;
    this.rotationY = ry;
    this.rotationZ = rz;
}

Camera3D.prototype.update = function(){



    mat4.perspective(this.fov, this.persRatio, this.zMin, this.zMax, this.pMatrix);

    mat4.identity(this.mvMatrix);

    mat4.translate(this.mvMatrix, [parseFloat(this.x),parseFloat(this.y), parseFloat(this.z-this.focal)]);

    var radian = Math.PI/180;
    mat4.rotate(this.mvMatrix, parseFloat((180+this.rotationX) * radian), [1, 0, 0]);
    mat4.rotate(this.mvMatrix, parseFloat((this.rotationY) * radian), [0, 1, 0]);
    mat4.rotate(this.mvMatrix, parseFloat((this.rotationZ) * radian), [0, 0, 1]);

}