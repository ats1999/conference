import React,{useState,useEffect} from 'react'
import {withRouter} from "react-router-dom";
import VideoApp from './VideoApp';

function Room(props) {
    const [roomId, setRoomId] = useState(null);
    const [socketId, setSocketId] = useState(null);

    useEffect(() => {
        setRoomId(props.match.params.id); 
        if(props.socket){
            let socket = props.socket;
            socket.on('connect',()=>{
                setSocketId(socket.id);
                // create app
                const App = new VideoApp(socket.id,roomId);

                App.peer.on('open', id => {
                    socket.emit('join-room', App.roomId,id);
                })
                
                App.peer.on('error', (err) => {
                    console.log('peer connection error', err);
                    App.peer.reconnect();
                });

                const myVideo = App.getVideo();
                myVideo.muted = true;

                navigator.mediaDevices.getUserMedia({
                    audio:true,
                    video:true
                })
                .then(stream=>{
                    // add video to stream
                    App.addVideoStream(myVideo,stream);

                    // connect new user to the existing room
                    socket.on('user-connected',userId=>{
                        console.log("New user connected...")
                        App.connectToNewUser(userId, stream)
                    });

                    // add another user to this stream
                    App.peer.on('call', call => {
                        console.log('This peer is being called...');
                        call.answer(stream)
                        const video = App.getVideo();
                        call.on('stream', userVideoStream => {
                            console.log('This peer is being called...on-stream...');
                            App.addVideoStream(video, userVideoStream)
                        })
                    });
                })

                socket.on('user-disconnected', userId => {
                    App.removePeer(userId);
                })
            });
        }  
    }, [props]);

    if(!roomId)
        return null;

    return (
        <div>
            <div id="video-grid"></div>
        </div>
    )
}

export default withRouter(Room)
