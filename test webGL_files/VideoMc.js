/**
 * Created with JetBrains WebStorm.
 * User: Tom Le Coz
 * Date: 20/12/13
 * Time: 07:56
 * To change this template use File | Settings | File Templates.
 */


var VideoMc = function(w,h,webmURL,mp4URL,ogvURL){
    if(VideoMc.index == undefined) VideoMc.index = 0;
    else VideoMc.index++;

    var bd = this.bmpData = new BitmapData(w,h);
    this.contener = document.createElement("contener");

    //this.contener.style.visibility = "hidden";

    //document.body.appendChild(this.contener);

    var video = this.video = document.createElement("video");
    video.style.backgroundColor = "#000000";
    video.id = "video_"+VideoMc.index;
    video.width = this.w = w;
    video.height = this.h = h;

    if(video.canPlayType("video/webm")) video.setAttribute("src",webmURL);
    else if(video.canPlayType("video/mp4")) video.setAttribute("src",mp4URL);
    else if(video.canPlayType("video/ogg")) video.setAttribute("src",ogvURL);
    else {
        alert("Video file format is not supported")
        return;
    }

    video.setAttribute('loop', true);
    video.load();

    video.addEventListener("canplay", function () {
        //alert("canplay")
        video.play();
    })



    //this.contener.style.zIndex = 1000+VideoMc.index;
    //this.contener.appendChild(video);
}

VideoMc.prototype.update = function(){

    this.bmpData.draw(this.video,0,0,this.w,this.h);

}
