var WebSocket = require('ws');
var Config = require('../config');
var Auth = require('../repos/authRepo');
const haversine = require('haversine');
var requestRepo = require('../repos/requestRepo');
var geocoderRepo = require('../repos/geocoderRepo');
var Mws = require('./Mws');
var SOCKET_PORT = 3003;
var socketServer;
var clients = 0;
var maxClient = Config.Driver;

if (!socketServer) {
    socketServer = new WebSocket.Server({
        port: SOCKET_PORT
    });
    function sentError (ws,error) {
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
              sentError(this,"Vui lòng đăng nhập")
              this.close();
          }

          this.emit(event.type, event.payload);
        } catch(err) {
          console.log('not an event' , err);
        }
      }
   



    socketServer.on('connection', ws => {
        ws.ready = 0; // 0-standby, 1-ready, 2-busy, 3-Onrequest 
        ws.currentRequest = null;
        clients++;
        ws.rejectedRequest = new Array();
        ws.authenticate = 0;
        ws.Latitude = 0;
        ws.Longitude = 0;

        // Kiểm tra đã xác thực chưa 
        const checkA = setTimeout(()=>{
            if(ws.readyState === WebSocket.OPEN)
              {
                
                sentError(ws,'Vui lòng đăng nhập');
                ws.close();
              }  
        },1500); 
            console.log(`A Driver is connected (${clients} is online)`);
        //Xử lý khi nhận message
        ws.on('message', toEvent)
        .on('authenticate', function (data) {
           Auth.verifyAccessTokenWS(data.Token, (err, payload) => {
            if (err) {
              console.log(err);
                sentError(ws,'Thông tin không hợp lệ, vui lòng đăng nhập lại!');
                ws.close();
                return;
            }
          else 
          { 
              //Kiểm tra loại tài khoản 
              if(payload.user)
              {
                if(payload.user.AccountType_ID !=3)
                {
                    sentError(ws,'Tài khoản của bạn không phải Driver');
                  ws.close();
                  return;
                }
                else 
                {  //Authenticate thanh cong
                     ws.user = payload.user;
                    ws.authenticate = 1; 
                    clearTimeout(checkA);
                }
              }
          }
        }); })
        .on('standby', function (data) {
            if(ws.ready==1)
            {
                console.log("standby");
            }
            if(ws.ready==2)
            {
                console.log("reject and standby");
                ws.rejectedRequest.push(ws.currentRequest.ID);
                ws.currentRequest.Times++;
                findDriver(ws.currentRequest);
            }
            if(ws.ready==3)
            {
                console.log("done and standby");
                requestRepo.setStatus(ws.currentRequest.ID,'4');
            }
          ws.ready = 0;
        })
        .on('ready', function (data) {
            
          ws.ready = 1;
          ws.Latitude = data.Latitude;
          ws.Longitude = data.Longitude;
          console.log("ready");
          console.log(ws.Latitude);
          console.log(ws.Longitude);
        })
        .on('setAttitude', function (data) {
            console.log("set Attitude");

            ws.Latitude = data.Latitude;
            ws.Longitude = data.Longitude;
           
          })
        .on('reject', function (data) {
            console.log("reject");
            ws.ready = 0;
            ws.rejectedRequest.push(ws.currentRequest.ID);
            ws.currentRequest.Times++;
            findDriver(ws.currentRequest);
          })
          .on('accept', function (data) {

            console.log("accept");
            ws.ready = 3;
            ws.currentRequest.Times++;
               var msg= {
                                type: "updateDriver",
                                payload: { ID: ws.currentRequest.ID,
                                  Driver_lat:ws.Latitude,
                                  Driver_lng:ws.Longitude,
                                  Driver_name: ws.user.Name,
                                  Driver_ID: ws.user.ID
                                }
                            }
                            Mws.broadcastAll(JSON.stringify(msg));

            requestRepo.setDriver(ws.currentRequest.ID,ws.user.ID,ws.Latitude,ws.Longitude).then(
                value => {
                    var Data = {
                        Request : ws.currentRequest
                    }
                    sendSuccess(ws,Data);           
                }); 
                    
          })
          .on('done', function (data) {
            console.log("done");
                var msg= {
                                type: "updateStatus",
                                payload: { ID: ws.currentRequest.ID,
                                 Status: 4
                                }
                            }
                            Mws.broadcastAll(JSON.stringify(msg));
            requestRepo.setStatus(ws.currentRequest.ID,'4').then(
                value => {
                    ws.ready = 0;
                    ws.currentRequest == null;        
                });                        
          });  

        ws.on('close', msg => {
            clients--;
            if(ws.ready==2)
            {
                ws.currentRequest.Times++;
                findDriver(ws.currentRequest);
            }
            if(ws.ready==3)
            {
                console.log("done");
                var msg= {
                                type: "updateStatus",
                                payload: { ID: ws.currentRequest.ID,
                                 Status: 4
                                }
                            }
                            Mws.broadcastAll(JSON.stringify(msg));
            requestRepo.setStatus(ws.currentRequest.ID,'4').then(
                value => {
                    ws.ready = 0;
                    ws.currentRequest == null;        
                }); 
            }
            console.log(`close Driver (${clients} is online)`);
            clearTimeout(checkA);
        });
      
    });

    console.log(`TX running on port ${SOCKET_PORT}`);
}

var broadcastAll = msg => {
    for (var c of socketServer.clients) {
        if (c.readyState === WebSocket.OPEN) {
         console.log(c.ready);
        }
    }
}

//Must set request.Times = 0 1st
var findDriver = request => {
    if(request.Times<Config.TX)
    {
        var min = 12742; //duong kinh trai dat = km
        var nearest = null;
        for (var c of socketServer.clients) {
            if (c.readyState === WebSocket.OPEN&&c.ready==1) {
                var distance = haversine({latitude:request.Latitude,longitude: request.Longitude}, {latitude: c.Latitude,longitude: c.Longitude},{unit: 'km'});
               if( min>distance)
                    {
                        var check =1;
                        for(var reject of c.rejectedRequest)
                        {
                            if(request.ID == reject)
                            check=0;
                        }
                        if(check==1)
                       { min = distance;
                         nearest = c;}
                    }
            }
        }    
        if(nearest!= null)
        {
            console.log("send request to a driver");
            
            nearest.currentRequest = request;
            var msg = {
                type: 'request',
                payload: { Request: request,}};
            nearest.send(JSON.stringify(msg));
            nearest.ready = 2;
        }
        else{
            requestRepo.setStatus(request.ID,'5').then(
                value => {
                    console.log("Cant find any drivers");    
                      var msg= {
                                type: "updateStatus",
                                payload: { ID: request.ID,
                                 Status: 5
                                }
                            }
                            Mws.broadcastAll(JSON.stringify(msg));
 
                });     
        } 
    }
    else
    requestRepo.setStatus(request.ID,'5').then(
        value => {


                          var msg= {
                                type: "updateStatus",
                                payload: { ID: request.ID,
                                 Status: 5
                                }
                            }
                            Mws.broadcastAll(JSON.stringify(msg));


            console.log("All drivers rejected this request");
        });  
}



module.exports = {
    findDriver,
    socketServer,
    broadcastAll
}