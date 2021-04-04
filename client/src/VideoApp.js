import Peer from "peerjs";
class VideoApp {
    constructor(socketId,roomId){
        this.userSocketId = socketId;
        this.userRoomId = roomId;
        this.userPeer = new Peer(undefined,{
            host:"/",
            port:"5001"
        });
        this.videoGrid = document.getElementById('video-grid');
        this.peers = {};
    }

    /**
     * Get socket id of current user
     */
    get socketId(){
        return this.userSocketId;
    }
    
    get roomId(){
        return this.userRoomId;
    }

    get peer(){
        return this.userPeer;
    }
    addVideoStream(video, stream) {
        video.srcObject = stream
        video.addEventListener('loadedmetadata', () => {
          video.play()
        })
        this.videoGrid.append(video)
    }

    getVideo(){
        const myVideo = document.createElement('video');
        return myVideo; 
    }
    connectToNewUser(userId, stream) {
        console.log('connectToNewUser',userId)
        const call = this.peer.call(userId, stream);
        const video = this.getVideo();
        call.on('stream', userVideoStream => {
          console.log('connectToNewUser','on','stream')
          this.addVideoStream(video, userVideoStream)
        });
        call.on('close', () => {
          video.remove()
        })
      
        this.peers[userId] = call
    }

    removePeer(userId){
        if(this.peers[userId])
            this.peers[userId].close();
    }
}

export default VideoApp;