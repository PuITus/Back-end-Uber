<template>

<div id="top" style="position:relative;" class="container-fluid">




<div v-show="show"  id="dim">

</div>
           





<div v-show="show" v-bind:style="{ top: posY + 'px' }"  id="rq-modal">
  <div class="row">
   <div  class="col-md-12 ">
        <div  style="width:100%;text-align:center;" class="no-margin-top alert alert-primary"><strong>REQUEST DETAIL</strong>
<br>
         <strong>Customer:</strong> {{curRq.Name}} 
         <strong>Adress:</strong> {{curRq.Adress}} <br>
         <strong>Driver's name:</strong> {{curRq.Driver_name}} 
         <strong>Driver's location:</strong> {{curRq.Driver_lat}},{{curRq.Driver_lng}}

        </div>
      </div>
     <div class="col-md-12 ">
 <div class="no-margin" id="map" >
        
            </div>
</div>
   <div class="col-md-12">
<button v-on:click="closeDetail()" style="width:100%;" type="button" class="no-margin-bot btn btn-danger">Close</button>
</div>
</div>
  </div>





<div id="user-box" >
               <div style="margin-bottom:0;"  class="alert alert-default">Hello 
  <strong>{{this.$root.auth.user.Name}} !!!</strong> 
    <button  v-on:click="logout" type="button" class="btn btn-danger">Logout</button>
</div>
                     </div>



    <div class="panel panel-success">
      <div class="panel-heading">
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-3">
            <h2 class="text-center pull-left" style="padding-left: 30px;"> <span class="glyphicon glyphicon-list-alt"> </span> Request list </h2>
          </div>
        </div>
      </div>

      <div class="panel-body table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th class="text-center"> No. </th>
              <th class="text-center"> Name </th>
              <th class="text-center"> Phone </th>
              <th width ="20%" class="text-center"> Adress </th>
              <th class="text-center"> Attitude </th>
              <th class="text-center"> Note </th>
              <th class="text-center"> Status </th>
            </tr>
          </thead>

          <tbody>
    
            <tr v-on:click="showDetail(request)" v-bind:id="request.ID" v-for="request in orderBy(requests,'ID',-1)" :key="request.ID">
              <td class="text-center">{{request.ID}}</td>
              <td class="text-center">{{request.Name}}</td>
              <td class="text-center">{{request.Phone}}</td>
              <td class="text-center">{{request.Adress}}</td>
              <td class="text-center">{{request.Latitude}}, {{request.Longitude}} </td>
              <td class="text-center">{{request.Note}}</td>
                 <td v-if="request.Status==0" class="text-center">
                  <span class="badge badge-dark">New</span>
                 </td>
                 <td v-if="request.Status==1" class="text-center">
                  <span class="badge badge-primary">identifying</span>
                 </td>
                   <td v-if="request.Status==2" class="text-center">
                  <span class="badge badge-primary">Finding driver</span>
                 </td>
                  <td v-if="request.Status==3" class="text-center">
                  <span class="badge badge-warning">On the road</span>
                 </td>
                 <td v-if="request.Status==4" class="text-center">
                  <span class="badge badge-success">Finished</span>
                 </td>
                 <td v-if="request.Status==5" class="text-center">
                  <span class="badge badge-danger">No driver</span>
                 </td>
            </tr>
          </tbody>
        </table>
      </div>

   
    </div>
  </div>
</template>

<script>
export default {
  name: 'Manager',
  data() {
    return {
        requests: null,map:null,marker:null,markerrq:null,directionsDisplay:null,directionsService:null, markerwd:null, markerrqwd:null, show:false,posY:300,
        curRq: {
          ID:"",
          Name:"",
          Adress:"",
          Latitude:"",
          Longitude:"",
          Driver_name:"",
          Driver_lat:"",
          Driver_lng:"",
          },
    success: false,
        successrq:
        {Name : "",
        Phone: "",
        Note: "",
        Adress: "",}
  }
  } ,
  methods: {

    closeDetail: function()
    {
       this.show = false; 
    },
    showDetail: function(request)
    {

    

          if(request.Driver_ID!=-1)
          { 
              var vm=this;
          vm.curRq.ID=request.ID;
          vm.curRq.Latitude = request.Latitude;
          vm.curRq.Name = request.Name;
          vm.curRq.Longitude = request.Longitude;
             vm.curRq.Adress = request.Adress;
       
        vm.marker.setPosition({lat: request.Latitude, lng: request.Longitude});
      vm.curRq.Driver_name = request.Driver_name;
             vm.curRq.Driver_lat = request.Driver_lat;
                vm.curRq.Driver_lng = request.Driver_lng;
            vm.markerrq.setPosition({lat:request.Driver_lat,lng:request.Driver_lng});
             vm.calculateAndDisplayRoute();
       
        vm.show=true;
        vm.posY = 270 + window.pageYOffset;
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
      this.$root.auth = false;
        this.$root.ws.close();
      this.$root.ws = false;
       this.$session.destroy();
      this.$router.push('login');
    }
  },
   created()
    {
      if(this.$root.auth == false)
      {
        alert("Please login first!!");
         this.$router.push('login');
      }
    },
    mounted()
    {

 console.log(document.getElementById("map"));
       


      var vm = this;
    vm.map = new google.maps.Map(document.getElementById('map'), {
              center: {lat:0,lng:0},
              zoom: 14,
              disableDoubleClickZoom: true, // disable the default map zoom on double click
            });
        vm.directionsService = new google.maps.DirectionsService;
        vm.directionsDisplay = new google.maps.DirectionsRenderer;
                               vm.directionsDisplay.setMap(vm.map);
           vm.directionsDisplay.setOptions( { suppressMarkers: true } );
            vm.infowindow =  new google.maps.InfoWindow({
                        content: "You are here!"
                      });
                 
              vm.marker = new google.maps.Marker({
                                  position: {lat:14,lng:0},
                                  map: vm.map,
                                  title: "Driver's location"
                                });   
                  vm.markerrq = new google.maps.Marker({
                                  position: {lat:15,lng:0},
                                  map: vm.map,
                                  title: "Customer's location"
                                });  
                 vm.markerwd=  new google.maps.InfoWindow({
              content: "Customer's location"
            });
                  vm.markerrqwd= new google.maps.InfoWindow({
              content: "Driver's location"
            });
                       vm.markerwd.open(vm.map, vm.marker);
                       vm.markerrqwd.open(vm.map, vm.markerrq);
                vm.calculateAndDisplayRoute();








      window.WebSocket = window.WebSocket || window.MozWebSocket;
          var ws = new WebSocket('ws://localhost:3004');
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

         
          ws.onmessage = function(e) {

            var msg = JSON.parse(e.data);
            var data = msg.payload;
            var type=msg.type;
                        switch(type){
                case "success":
                   vm.successrq = data.Request;
                   vm.request.Name ="";
                   vm.request.Phone="";
                   vm.request.Adress="";
                   vm.request.Note="";
                     vm.success =true;
                     setTimeout(function (){ vm.success =false; }, 3000);
                   break;
                case "init":
                    vm.requests = data.Request;
                    break;
                case "push":
                    vm.requests.push(data.Request);
                  break;
                case "updateIdentify":
                    for(var i = 0;;i++)
                    {
                      if(vm.requests[i].ID == data.ID)
                      {
                        vm.$set(vm.requests[i],"Latitude", data.Latitude);
                        vm.$set(vm.requests[i],"Longitude", data.Longitude);
                        vm.$set(vm.requests[i],"Status", 2);
                        break;
                      }
                    }
                 
                  break;

                  case "updateStatus":
                    for(var i = 0;;i++)
                    {
                      if(vm.requests[i].ID == data.ID)
                      {
                        vm.$set(vm.requests[i],"Status", data.Status);
                        break;
                      }
                    }
                 
                  break;
                   case "updateDriver":
                    for(var i = 0;;i++)
                    {
                      if(vm.requests[i].ID == data.ID)
                      {
                        vm.$set(vm.requests[i],"Status", 3);
                        vm.$set(vm.requests[i],"Driver_lat", data.Driver_lat);
                        vm.$set(vm.requests[i],"Driver_lng", data.Driver_lng);
                         vm.$set(vm.requests[i],"Driver_name", data.Driver_name);
                        vm.$set(vm.requests[i],"Driver_ID", data.Driver_ID);
                        break;
                      }
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






    }

    }


</script>
<!-- styling for the component -->
<style >

.no-margin
{
  margin:0px!important;
  border-radius:0px;
}
.no-margin-top
{
  margin:0px!important;
    border-radius:5px 5px 0px 0px;
}
.no-margin-bot
{
  margin:0px!important;
    border-radius:0px 0px 5px 5px;
}
#rq-modal {
  width:80%;
   border-radius: 10px;
   padding:10px;  
background: white ; 

  left: 50%;
transform: translate(-50%, -50%);
  position: absolute;
 z-index:99!important;
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

 .panel
        {
          cursor:default;
          margin: 5%;
          background: white;
          border-radius:5px;
        }


        tr
        {
          transition: all 0.5s;
        }
        tr:hover
        {
          background-color: #f0ad4e;
          transition: 0.5s;
        }
        .btn-warning
        {
          transition: all 0.8s;
        }

        .btn-warning:hover, .btn-warning:focus
        {
          transition: 0.8s;
          background-color: #428bca;
          border-color: #428bca;
        }

        .panel-footer
        {
          background-color: #5bc0de;
          color: white;
        }


@media (max-width: 575.98px) {


    #map { 
             width: 100%;
    height: 450px;      
          }   
 }


@media (min-width: 576px) {

     #map { 
             width: 100%;
    height: 450px;      
          }   
 }

@media (min-width: 768px) {

 

    #map { 
             width: 100%;
    height: 450px;      
          }   
}

@media (min-width: 992px) {
 
 
     #map { 
             width: 100%;
    height: 450px;      
          }   
}

</style>