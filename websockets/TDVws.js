var WebSocket = require('ws');
var Config = require('../config');
var Auth = require('../repos/authRepo');
var requestRepo = require('../repos/requestRepo');
var geocoderRepo = require('../repos/geocoderRepo');
var DVVws = require('./DVVws');
var Mws = require('./Mws');
var SOCKET_PORT = 3001;
var socketServer;
var clients = 0;
var maxClient = Config.TDV;


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
        clients++;
        ws.authenticate = 0;
        // Kiểm tra đã xác thực chưa 
        const checkA = setTimeout(()=>{
            if(ws.readyState === WebSocket.OPEN)
              {
                
                sentError(ws,'Vui lòng đăng nhập');
                ws.close();
              }  
        },1500); 
        //Kiểm tra số lượng tổng đài viên đang hoạt động
        if(clients > maxClient )
        {
            console.log(`The TDV system's overload (${maxClient}), refuse connect request`)
            sentError(ws,'Hệ thống đang quá tải, vui lòng quay lại sau');
            ws.close();
        }
        else
        {
            console.log(`A TDV is connected (${clients} is online)`);
        }


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
                if(payload.user.AccountType_ID !=1)
                {
                    sentError(ws,'Tài khoản của bạn không phải TĐV');
                  ws.close();
                  return;
                }
                else 
                {   ws.user = payload.user;
                    ws.authenticate = 1; 
                    clearTimeout(checkA);
                }
              }
          }
        }); })
        .on('push', function (data) {

          try {
            
            geocoderRepo.getAttitude(data.Request.Adress).then( res =>
                {
                    if(res[0])
                    {
                        var requestEntity = {
                         
                            Name: data.Request.Name,
                            Phone: data.Request.Phone,
                            Adress: data.Request.Adress,
                            Note: data.Request.Note,
                            Latitude: res[0].latitude,
                            Longitude: res[0].longitude,

                        }
                    }
                   else
                   {
                    var requestEntity = {
            
                        Name: data.Request.Name,
                        Phone: data.Request.Phone,
                        Adress: data.Request.Adress,
                        Note: data.Request.Note,
                        Latitude: 0,
                        Longitude: 0
                    }
                   }
                    requestRepo.add(requestEntity).then(value=>
                        {
                            DVVws.addUnlocatedRequest(); 
                            console.log(value.insertId);
                            requestEntity.ID = value.insertId;
                            requestEntity.Status = 0;
                            msg = {
                                type: 'push',
                                payload: { Request: requestEntity}}
                            Mws.broadcastAll(JSON.stringify(msg));
                        });
                        var msg = {
                            type: 'success',
                            payload: { Request: requestEntity}};
                       ws.send(JSON.stringify(msg));
                }
            )
         

            
          }
          catch(error) {
            console.error(error);
          }

        });

        ws.on('close', msg => {
            clients--;
            console.log(`close TDV (${clients} is online)`);
            clearTimeout(checkA);
        });
      
    });

    console.log(`TDV running on port ${SOCKET_PORT}`);
}

var broadcastAll = msg => {
    for (var c of socketServer.clients) {
    
        if (c.readyState === WebSocket.OPEN) {
            c.send(msg);
        }
    }
}

module.exports = {
    socketServer,
    broadcastAll
}