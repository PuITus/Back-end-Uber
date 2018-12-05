<template>




<div id="driver" class="container  mt-5" >
<div v-if="ask" id="dim">

</div>








<div v-if="ask" id="rq-modal">
   <div  class="col-md-12 load3">
        <div  style="width:100%;text-align:center;" class=" alert alert-primary load4"><strong>New Request!</strong></div>
      </div>
     
     <div class="col-md-12 load3" style = "background:#1D4569;text-align:center;">
      <p >    <strong>- Name:</strong> {{askingrq.Name}} <br>
      <strong>- Adress:</strong> {{askingrq.Adress}}<br></p>
       <img width="350px" src="https://image.ibb.co/gcvdx0/ezgif-com-crop.gif" alt="aa">
     </div>
 
       <div class="col-md-12 load3">
         <button v-on:click="sendReject"  style="width:50%; border-radius:0px 0px 0px 5px!important;" type="button" class=" float-left btn btn-danger">Reject</button>
          <button v-on:click="sendAccept" style="width:50%;border-radius:0px 0px 5px 0px!important;" type="button" class="float-right btn btn-success">Accept</button>
      </div>

  </div>






<div id ="user-box" >
               <div style="margin-bottom:0;"  class="alert alert-default">Hello 
  <strong>{{this.$root.auth.user.Name}} !!!</strong> 
  <label class="switch">
  <input v-model="ready" v-on:click="changeReady" type="checkbox" checked>
  <span class="slider round"></span>
</label>
    <button  v-on:click="logout" type="button" class="btn btn-danger">Logout</button>
</div>
                     </div>








       
    <div class="row" >
 
      <div class="col-md-6 maps" >

        
        <div style="padding:10px">
            <div id="map"></div>
        </div>

 

      </div>
      <div style="position:relative;" class="col-md-6">
<div v-if="!ready||loader" id="dim-half">

</div>

<div v-if="loader" id="loader">
 <div  class="col-md-12 load">
        <div  style="width:100%;text-align:center;" class=" alert alert-primary load2">Waiting for new request!</div>
      </div>
    <div class="col-md-12 load">

    <img width="300px" src="https://media.giphy.com/media/Z56N0q0tsFC2k/giphy.gif" alt="aa">
</div>
       <div class="col-md-12 load">
         <button  v-on:click="logout"type="button" class=" col-md-12 btn btn-danger">Quit</button>
      </div>
  </div>
<div v-if="!ready" id="standby">
    <div  class="col-md-12 load">
        <div  style="width:100%;text-align:center;" class=" alert alert-primary load2">Standby Mode!</div>
      </div>
    <div class="col-md-12 load">

    <img width="300px" src="https://i.pinimg.com/originals/4e/4d/49/4e4d4900269bf3a9c4e8bb7e2ccdcff9.gif" alt="aa">
</div>
       <div class="col-md-12 load">
         <button  v-on:click="turnOn"type="button" class=" col-md-12 btn btn-success">Turn on</button>
      </div>
  </div>
           

        <h2 class="text-uppercase mt-3 font-weight-bold ">Driver system</h2>
        <form  @submit.prevent="sendAttitude">
          <div class="row">
            <div class="col-lg-6">
              <div class="form-group">
                 <label for="Name">Name :</label>
                <input id="Name" v-model="request.Name" type="text" class="form-control" placeholder="Name" required readonly>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="form-group">
                 <label for="Name">Phone :</label>
                <input v-model="request.Phone" type="text" class="form-control " placeholder="Phone" required readonly>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="form-group">
                 <label for="Name">Latitude :</label>
                <input v-model="request.Latitude" type="text" class="form-control " placeholder="Latitude" required readonly>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="form-group">
                 <label for="Name">Longitude :</label>
                <input v-model="request.Longitude" type="text" class="form-control" placeholder="Longitude" required readonly>
              </div>
            </div>
            <div class="col-12">
              <div class="form-group">
                 <label for="Name">Adress :</label>
                <textarea v-model="request.Adress" class="form-control" placeholder="Adress" rows="2" required readonly></textarea>
              </div>
            </div>

           
            <div class="col-12">
              <button v-on:click ="sendDone" class=" col-12 btn btn-success" >Done</button>
            </div>
            <transition name="fade">
                          <div v-if="success" class="notifications alert alert-success">
                       
                            <strong>A request has been completed!</strong> <br>
                          <strong>Name: </strong> {{askingrq.Name}}                          
                          <strong>Adress: </strong> {{askingrq.Adress}}<br>
                        </div>
                        <div  v-if="reject" class="notifications alert alert-danger">
                       
                            <strong>Rejected a request!</strong> <br>
                          <strong>Name: </strong> {{askingrq.Name}}                          
                          <strong>Adress: </strong> {{askingrq.Adress}}<br>
                        </div>
                         </transition>
          </div>
        </form>
       
      </div>

    </div>
</div>



      
</template>

<script>
export default {
  name: 'Driver',
  data() {
    return {
        request: {Name : "",
        Phone: "",
        Note: "",
        Adress: "",
        Latitude: 0,
        Longitude: 0,
        rAdress:""},

        success: false,
        askingrq:
        {Name : "",
        Phone: "",
        Note: "",
        Adress: "",
         rAdress:"",
        Latitude: 0,
        Longitude: 0,
        ID:-1},


        map: null,
        marker:null,
        markerrq:null,
        count: 0,
        loader:false,
        pos: false,
        ask: false,
        ready: false,
        directionsService: null,
        directionsDisplay: null,
        reject: false,
        infowindow: null,
        infowindowrq:null


  }
  } ,
  methods: {
    changeReady: function(event)
    {
      var vm = this;
      if(this.ready)//chuyen sang standby
      {
        this.turnOff();
      }
      else //chuyen sang ready
      {
                  this.turnOn();
    }
  },
  turnOff: function(event)
  {
    var vm=this;
      if(this.ask)
    {
      this.ask = false;
       var msg = {
          type: 'reject',
          payload: {request: this.askingrq}
          };
      this.$root.ws.send(JSON.stringify(msg));
      this.reject=true;
           setTimeout(function (){ vm.reject = false; }, 3000);
                   
    }
    this.ready = false;
    var msg = {
          type: 'standby',
          payload: {request: this.askingrq}
          };
          this.$root.ws.send(JSON.stringify(msg));

  },
       turnOn: function(event)
    {
        var vm = this;
      this.ready = true;
      if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(function(position) {
                        var pos = {
                          lat: position.coords.latitude,
                          lng: position.coords.longitude
                        };
                        var pos2 = {
                         lat: vm.marker.getPosition().lat(),
                          lng: vm.marker.getPosition().lng()
                        };
                        console.log(pos2);
                         var tempMarker = new google.maps.Marker({
                        position: pos2,
                        map: vm.map,
                        title: "Current set"
                      });    
                        vm.marker.setPosition(pos);
                       var a = google.maps.geometry.spherical.computeDistanceBetween(vm.marker.getPosition(), tempMarker.getPosition());
                       if(a>100)
                        {
                          alert("Your current location has been changed! Auto detect current location...")
                        }
                        else
                        {
                          pos = {
                          lat: tempMarker.getPosition().lat(),
                          lng:tempMarker.getPosition().lng()
                        };
                       
                      };

                        tempMarker.setMap(null);
                       vm.marker.setPosition(pos);
                        vm.map.setCenter(pos);
                        vm.loader=true;
                           var ws = vm.$root.ws;
                              var msg = {
                        type: 'ready',
                        payload: { Latitude: pos.lat, Longitude: pos.lng }
                        };
                                  ws.send(JSON.stringify(msg));
                    });
      }
    },

      calculateAndDisplayRoute:  function () {
          var vm =this;
          var origin = vm.marker.getPosition();
        var des = vm.markerrq.getPosition();
        
        vm.directionsService.route({
          origin: origin,
          destination: des,
          travelMode: 'DRIVING'
        }, function(response, status) {
          if (status === 'OK') {
            vm.directionsDisplay.setDirections(response);
            vm.directionsDisplay.setMap(vm.map);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
      },
    logout: function (event) {
      this.$session.destroy();
      this.$root.auth = false;
      this.$root.ws.close();
      this.$root.ws = false;
      this.$router.push('login');
    },
      sendAttitude:  function () 
      {  this.loader=true;
        var ws = this.$root.ws;
        var request = this.request
        var a = setInterval(function(){
        
          if(ws.readyState == 1)
          {
          console.log("Ready for user!");
          var msg = {
          type: 'push',
          payload: { Latitude: request.Latitude,Longitude: request.Longitude }
          };
          ws.send(JSON.stringify(msg));
            clearInterval(a);
          }
          else
          {
              console.log("loading...");
                  console.log(ws.readyState);
          }     
        }, 500);
      },
      sendAccept:  function () 
      {  
        var vm = this;
        this.ask = false;
        this.loader = false;
        this.request.Phone = this.askingrq.Phone;
        this.request.Name = this.askingrq.Name;
        this.request.Adress = this.askingrq.Adress;
        this.request.Latitude = this.askingrq.Latitude;
        this.request.Longitude = this.askingrq.Longitude;
          var msg = {
          type: 'accept',
          payload: {request: this.request}
          };
          this.$root.ws.send(JSON.stringify(msg));
          
          this.markerrq = new google.maps.Marker({
              position: {lat:this.request.Latitude,lng: this.request.Longitude},
              map: this.map,
              //title: 'Hello World'
              
              // setting Latitude & Longitude as title of the marker
              // title is shown when you hover over the marker
              title: this.request.Adress
            });  
          this.infowindowrq =  new google.maps.InfoWindow({
                content: "Pick your customer here!"
                  });
              vm.infowindowrq.open(vm.map, vm.markerrq);  
          this.calculateAndDisplayRoute();
      },
       sendDone:  function () 
      {  var vm = this;
        this.ask = false;
        this.loader = false;

        this.request.Phone =  "";
        this.request.Name =  "";
        this.request.Adress =  "";
        this.request.Latitude = 0;
        this.request.Longitude = 0;
          var msg = {
          type: 'done',
          payload: {request: this.askingrq}
          };
          this.$root.ws.send(JSON.stringify(msg));
           this.turnOff();
        this.success =true;
          setTimeout(function (){ vm.success = false;}, 3000);
        vm.markerrq.setMap(null);
        this.directionsDisplay.setMap(null);
      
      },
      sendReject:  function () 
      {  
        var vm=this;
        this.ask = false;
        this.turnOff();
          var msg = {
          type: 'reject',
          payload: {request: this.askingrq}
          };
          this.$root.ws.send(JSON.stringify(msg));
          this.reject=true;
           setTimeout(function (){ vm.reject = false; }, 3000);
                   
      }

  },
   created()
    {
       if(this.$session.has("auth"))
       {
        this.$root.auth = this.$session.get("auth");
       }
      if(this.$root.auth == false)
      {
        alert("Please login first!!");
         this.$router.push('login');
      }
    },
    mounted()
    {
        var vm=this;



      window.WebSocket = window.WebSocket || window.MozWebSocket;
           var ws = new WebSocket('ws://localhost:3003');
          var Token = this.$root.auth.access_token;
          ws.onopen = function() {
            console.log('connected');
            //Data khi authen
                    var msg = {
                    type: 'authenticate',
                    payload: { Token: Token }
                    };
            this.send(JSON.stringify(msg));
            

            //Data khi push request lên
          
          }

         ws.onclose = function(){};
          ws.onmessage = function(e) {
            var msg = JSON.parse(e.data);
            var data = msg.payload;
            var type=msg.type;
                        switch(type){





                  case "request":
                    if(data.Request)
                    {
                   vm.askingrq.Name = data.Request.Name;
                   vm.askingrq.Phone=data.Request.Phone;
                   vm.askingrq.Adress=data.Request.Adress;
                    vm.askingrq.rAdress=data.Request.Adress;
                   vm.askingrq.Note=data.Request.Note;
                   vm.askingrq.Latitude = data.Request.Latitude;
                   vm.askingrq.Longitude = data.Request.Longitude;
                    vm.askingrq.ID = data.Request.ID;
                  vm.ask = true;
                  vm.loader = false;
                  var id = data.Request.ID;
                  //case no answer
                    setTimeout(function (){ if(vm.ask==true&&vm.askingrq.ID == id)
                    {
                      
                            vm.ask = false;
                              vm.ready = false;
                             var msg = {
                            type: "reject",
                            payload: { Request: vm.askingrq}
                            };
                            ws.send(JSON.stringify(msg));

                        vm.askingrq.Name = "";
                       vm.askingrq.Phone= "";
                       vm.askingrq.Adress= "";
                        vm.askingrq.rAdress= "";
                       vm.askingrq.Note= "";
                       vm.askingrq.Latitude = 0;
                       vm.askingrq.Longitude = 0;
                       vm.askingrq.ID == -1;
                    
                    } }, 10000);



                    }
                   break;
                     case "error":
                        vm.$root.auth = false;
                          vm.$root.ws.close();
                        vm.$root.ws = false;
                        vm.$router.push('login');
                   break;


                default:
                break;
            }
            console.log(e);
          }
          this.$root.ws = ws;




        function initMap() {                            
            var Latitude = vm.request.Latitude; // YOUR LATITUDE VALUE
            var Longitude = vm.request.Longitude; // YOUR LONGITUDE VALUE
          
            var myLatLng = {lat: Latitude, lng: Longitude};
             var geocoder = new google.maps.Geocoder;
        vm.directionsService = new google.maps.DirectionsService;
        vm.directionsDisplay = new google.maps.DirectionsRenderer;
           vm.directionsDisplay.setMap(vm.map);
           vm.directionsDisplay.setOptions( { suppressMarkers: true } );

            vm.map = new google.maps.Map(document.getElementById('map'), {
              center: myLatLng,
              zoom: 19,
              disableDoubleClickZoom: true, // disable the default map zoom on double click
            });




             if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(function(position) {
                        var pos = {
                          lat: position.coords.latitude,
                          lng: position.coords.longitude
                        };
                      
                             var ws = vm.$root.ws;

                        vm.marker = new google.maps.Marker({
                                  position: pos,
                                  map: vm.map,
                                  title: "You are here!"
                                });    
                        vm.map.setCenter(pos);
                      vm.infowindow =  new google.maps.InfoWindow({
                        content: "You are here!"
                      });
                      vm.infowindow.open(vm.map, vm.marker);
                      }, function() {
                        handleLocationError(true, infoWindow, map.getCenter());
                      });
                    } else {
                      // Browser doesn't support Geolocation
                      handleLocationError(false, infoWindow, map.getCenter());
                    }
              

       
           google.maps.event.addListener(vm.map,'click',function(event) {   
                     if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(function(position) {

                        var pos = {
                          lat: position.coords.latitude,
                          lng: position.coords.longitude
                        };
                        vm.marker.setPosition(pos);

                       var a = google.maps.geometry.spherical.computeDistanceBetween(vm.marker.getPosition(), event.latLng);
                    
                        if(a>100)
                        {
             
                          alert("Sorry, your current location is too far from here! Auto detect current location...");
                              vm.map.setCenter(pos);
                        }
                        else
                        {
                          pos = {
                          lat: event.latLng.lat(),
                          lng: event.latLng.lng()
                        };
                        var msg = {
                            type: 'setAttitude',
                            payload: {Latitude: pos.lat,Longitude: pos.lng}
                            };
                        ws.send(JSON.stringify(msg));

                        vm.marker.setPosition(pos);

                        }
                      });
                    }              
                

                   vm.marker.setPosition({lat:vm.request.Latitude,lng:vm.request.Longitude});
            });
            
      

            

        }
            function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        alert("FAIL");
      }

        initMap();





     
     
  








    
    }
}
</script>
<!-- styling for the component -->
<style scoped>

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}





































   #driver{
    background: #fff;
  padding:2%;
  margin-bottom: 3%;
     border-radius:1rem;
}

.notifications {
    word-wrap: break-word;
    max-width: 500px;
    min-width: 350px;
    text-align: center;
    position: fixed;
    z-index: 1000;
    right: 10px;
    bottom: 80px;

}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}


@media (max-width: 575.98px) {


    #map { 
             width: 100%;
    height: 500px;      
          }   
 }


@media (min-width: 576px) {

     #map { 
             width: 100%;
    height: 500px;      
          }   
 }

@media (min-width: 768px) {

 

    #map { 
             width: 100%;
    height: 500px;      
          }   
}

@media (min-width: 992px) {
 
 
     #map { 
             width: 100%;
    height: 500px;      
          }   
}








#dim-half{
  padding-top:5%;
            height:100%;
            width:95%;
            position:absolute;
            z-index:16 !important;
            background-color:black;
            filter: alpha(opacity=80); 
-khtml-opacity: 0.80;     
-moz-opacity: 0.80;      
opacity: 0.80;    
    border-radius: 8px;      
}


#dim{
  padding-top:5%;
color:blue;
            height:100%;
            width:100%;
            position:fixed;
            left:0;
            top:0;
            z-index:16 !important;
            background-color:black;
            filter: alpha(opacity=80); 
-khtml-opacity: 0.80;     
-moz-opacity: 0.80;      
opacity: 0.80;          
}


#rq-modal {
  display:block!important;
   border-radius: 10px;
   padding:10px;  
background: white ; 
  color:white;
  left: 50%;
top: 50%;
transform: translate(-50%, -50%);
  position: absolute;
 z-index:99!important;
}

#loader,#standby {
   border-radius: 10px;
   padding:10px;  
background: white ; 
  color:white;
  left: 50%;
top: 50%;
transform: translate(-50%, -50%);
  position: absolute;
 z-index:17!important;

}



.load{

  max-width:300px;
  margin:0px!important;
  padding:0px!important;
}
.load2{
  max-width:300px;
  margin:0px!important;
  padding:10px!important;
}
.load3{
  max-width:350px;
  margin:0px!important;
  padding:0px!important;
}
.load4{
  max-width:350px;
  margin:0px!important;
  padding:10px!important;
}



</style>