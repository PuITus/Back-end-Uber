var WebSocket = require('ws');
var Config = require('../config');
var Auth = require('../repos/authRepo');
var requestRepo = require('../repos/requestRepo');
var geocoderRepo = require('../repos/geocoderRepo');
var SOCKET_PORT = 3002;
var socketServer;
var clients = 0;
var maxClient = Config.DVV;
var TXws = require('../websockets/TXws');
 var Mws = require('../websockets/Mws');


if (!socketServer) {
  
    socketServer = new WebSocket.Server({
        port: SOCKET_PORT
    });
    function sendError (ws,error) {
        if(ws.readyState === WebSocket.OPEN)
              {
                var msg = {
                    type: 'error',
                    payload: { message: error}};
                ws.send(JSON.stringify(msg));
              }  
       
      }
      function sendSuccess (ws,Data) {
        if(ws.readyState === WebSocket.OPEN)
              {
                var msg = {
                    type: 'success',
                    payload: Data};
                ws.send(JSON.stringify(msg));
              }  
      }
    function toEvent (message) {
        try {
          var event = JSON.parse(message);
          if(event.type!="authenticate"&&this.authenticate==0)
          {
              sendError(this,"Vui lòng đăng nhập")
              this.close();
          }

          this.emit(event.type, event.payload);
        } catch(err) {
          console.log('not an event' , err);
        }
      }
   

  

   
    socketServer.on('connection', ws => {
        ws.currentRequest = -1;
        clients++;
        ws.authenticate = 0;
        ws.ready=1; //0 = waiting, 1 = ok dont worry me!.
        const checkA = setTimeout(()=>{
            if(ws.readyState === WebSocket.OPEN)
              {
                
                sendError(ws,'Vui lòng đăng nhập');
                ws.close();
              }  
        },1500); 
        //Kiểm tra số lượng định vị viên đang hoạt động
        if(clients > maxClient )
        {
            console.log(`The DVV system's overload (${maxClient}), refuse connect request`)
            sendError(ws,'Hệ thống đang quá tải, vui lòng quay lại sau');
            ws.close();
        }
        else
        {
            console.log(`A DVV is connected (${clients} is online)`);
        }


        //Xử lý khi nhận message
        ws.on('message', toEvent)
        .on('authenticate', function (data) {
            
           Auth.verifyAccessTokenWS(data.Token, (err, payload) => {
            if (err) {
              console.log(err);
                sendError(ws,'Thông tin không hợp lệ, vui lòng đăng nhập lại!');
                ws.close();
                return;
            }
          else 
          {
              //Kiểm tra loại tài khoản 
              if(payload.user)
              {
                if(payload.user.AccountType_ID !=2)
                {
                    sendError(ws,'Tài khoản của bạn không phải ĐVV');
                  ws.close();
                  return;
                }
                else 
                { //Authenticate thanh cong!
                    ws.user = payload.user;
                    ws.authenticate = 1; 
                    clearTimeout(checkA);

                    requestRepo.getUnlocated().then(rows=>
                        {
                            if(rows.length>0)
                            {
                                console.log("VAN CON!");
                                requestRepo.setStatus(rows[0].ID,'1').then(
                                    result => {
                                           var msg= {
                                type: "updateStatus",
                                payload: {ID: rows[0].ID,
                                  Status: 1
                                }
                            }
                            Mws.broadcastAll(JSON.stringify(msg));

                                        ws.currentRequest = rows[0].ID;
                                        var Data = {
                                            Request : rows[0]
                                        }
                                        sendSuccess(ws,Data);
                                    })
                                    ws.ready=1;
                            }
                            else{
                                console.log("Het roi!");
                                sendSuccess(ws,"");
                                ws.currentRequest = -1;
                                ws.ready =0;
                                
                            }
                           
                       
                        })
                    }
              }
          }
        }); })
        .on('push', function (data) {
      
     
            requestRepo.updateAttitude(data.Latitude,data.Longitude,ws.currentRequest).then(value=>
                {
                    requestRepo.getByID(ws.currentRequest).then( request =>
                        {
                            request[0].Times = 0;
                            TXws.findDriver(request[0]);
                            var msg= {
                                type: "updateIdentify",
                                payload: {ID: request[0].ID,
                                    Latitude: request[0].Latitude,
                                    Longitude: request[0].Longitude
                                }
                            }
                            Mws.broadcastAll(JSON.stringify(msg));



                            requestRepo.getUnlocated().then(rows=>
                                {
                                    if(rows.length>0)
                                    {
                                        requestRepo.setStatus(rows[0].ID,'1').then(
                                            varr => {
                                                   var msg= {
                                type: "updateStatus",
                                payload: {ID: rows[0].ID,
                                  Status: 1
                                }
                            }
                            Mws.broadcastAll(JSON.stringify(msg));

                                                ws.currentRequest = rows[0].ID;
                                                var Data = {
                                                    Request : rows[0]
                                                }
                                                sendSuccess(ws,Data);
                                            })
                                            ws.ready=1;
                                    }
                                    else{
                                        sendSuccess(ws,"");
                                        ws.currentRequest = -1;
                                        ws.ready=0;
                                    }
                                })       
                        } )
                   
                });
                         
         

        });

        ws.on('close', msg => {
        
            if(ws.currentRequest !=-1)
            {
               requestRepo.getByID(ws.currentRequest).then(
rows =>{
    requestRepo.setStatus(ws.currentRequest,0).then(
        value => {
               var msg= {
                    type: "updateStatus",
                    payload: {ID: rows[0].ID,
                      Status: 0
                    }
                }
                Mws.broadcastAll(JSON.stringify(msg));

            addUnlocatedRequest();
            var msg= {
                    type: "updateStatus",
                    payload: {Status: 0,
                        ID: ws.currentRequest
                    }
                }
                Mws.broadcastAll(JSON.stringify(msg));
        }
    );
    ws.currentRequest = -1;
})   
            }
            clients--;
            console.log(`close DVV (${clients} is online)`);
            clearTimeout(checkA);
        });
      
    });

    console.log(`DVV running on port ${SOCKET_PORT}`);
}
var broadcastAll = msg => {
    for (var c of socketServer.clients) {

        if (c.readyState === WebSocket.OPEN) {
            c.send(msg);
        }
    }
}
var addUnlocatedRequest = () =>
{
    requestRepo.getUnlocated().then(rows=>
        {
            if(rows.length>0)
            {
                for (var c of socketServer.clients) {
                    if (c.readyState === WebSocket.OPEN && c.ready==0) {
                        requestRepo.setStatus(rows[0].ID,'1').then(
                            varr => {
                            var msg= {
                                type: "updateStatus",
                                payload: {ID: rows[0].ID,
                                  Status: 1
                                }
                            }
                            Mws.broadcastAll(JSON.stringify(msg));




                                c.currentRequest = rows[0].ID;
                                var Data = {
                                    Request : rows[0]
                                }
                                sendSuccess(c,Data);
                            })
                            c.ready=1;
                        break;
                    }
                }
            }
           
       
        });
}
module.exports = {
    addUnlocatedRequest,
    socketServer,
    broadcastAll
}