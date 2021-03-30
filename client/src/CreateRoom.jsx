import React,{useEffect,useState} from 'react'

function CreateRoom({socket}) {
    const [roomId, setRoomId] = useState(null);
    useEffect(()=>{
        socket.emit('get-room-id',null);
        socket.on('room-id-arrives',data=>setRoomId(data));
    },[]);
    return (
        <div>
            <h1 className="text-center sp">Create Room</h1>
            <div id="room_id">
                <code>{roomId}</code>
                <hr/>
                {roomId&&<code>
                    Copy above room id and send it to your connections
                </code>}
            </div>
        </div>
    )
}

export default CreateRoom
