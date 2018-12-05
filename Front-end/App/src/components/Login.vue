
<template>

<section class="login-block">


          





    <div class="container">

  <div class="row">
    <div class="col-md-4 login-sec">
        <h2 class="text-center">Uber System - Login</h2>
        <form @submit.prevent="doLogin" class="login-form">
  <div class="form-group">
    <label class="text-uppercase">Username</label>
    <input  v-model="username"  type="text" class="form-control" placeholder="">
    
  </div>
  <div class="form-group">
    <label class="text-uppercase">Password</label>
    <input v-model="password"  type="password" class="form-control" placeholder="">
  </div>
  <div v-if="fail" class="alert alert-danger">
  <strong>Oops!</strong> {{error}}
</div>
  
    <div class="form-check">
   
    <button id="submit-btn" type="submit" class=" btn btn-login col-md-offset-4 col-md-4">Login</button>
  </div>
  
</form>
<div class="copy-text">Uber System App <i class="fa fa-heart"></i> by Uber</div>
    </div>
    <div class="col-md-8 banner-sec">
            <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
                 <ol class="carousel-indicators">
                    <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
                    <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                  </ol>
            <div class="carousel-inner" role="listbox">
    <div class="carousel-item active">
      <img class="d-block img-fluid" src="https://static.pexels.com/photos/33972/pexels-photo.jpg" alt="First slide">
      <div class="carousel-caption d-none d-md-block">
        <div class="banner-text">
            <h2>Midterm Project</h2>
            <p>A real-time web application </p>
        </div>  
  </div>
    </div>
    <div class="carousel-item">
      <img class="d-block img-fluid" src="https://images.pexels.com/photos/7097/people-coffee-tea-meeting.jpg" alt="First slide">
      <div class="carousel-caption d-none d-md-block">
        <div class="banner-text">
            <h2>This is Heaven</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation</p>
        </div>  
    </div>
    </div>
            </div>     
        
    </div>
  </div>
</div>
</div>
</section>
</template>
























<script>
export default {
  name: 'login-box',
  data () {
    return {  username: '',
      error: '',
      password: '',
      hidePassword: true,
      fail: false,
      msg: 'Welcome to Your Vue.js App'
    }
  },
  computed: {
      passwordType() {
        return this.hidePassword ? 'password' : 'text'
      },
      passwordIcon() {
        return this.hidePassword ? 'fa-eye' : 'fa-eye-slash'
      }
    },
      methods: {
        test()
        {
    console.log($("#submit-btn").html());
     
        },
         doLogin(event)
         {
          var auth;
         if(this.password =="1") alert("ok");
           $.ajax({
                    url : "http://localhost:3000/api/users/login",
                    type : "post",
                    dataType:"json",
                    data : {
                         user : this.username,
                         pwd: this.password
                    },
                    success : function (result){
                      auth = result;
                    }
                }).then(value=>
                {
                  if(auth.auth)
                  {
                    switch(auth.user.AccountType_ID)
                    {
                      case 1:
                                        this.$root.auth = auth;
                                        this.$session.start()
                                        this.$session.set('auth', auth)
                                        this.fail = false;
                                        this.$router.push('Receiver');
                                        break;
                      case 2:
                                        this.$root.auth = auth;
                                        this.$session.start()
                                        this.$session.set('auth', auth)
                                        this.fail = false;
                                        this.$router.push('Identifier');
                                        break;
                       case 3:
                                        this.$root.auth = auth;
                                        this.$session.start()
                                        this.$session.set('auth', auth)
                                        this.fail = false;
                                        this.$router.push('Driver');
                                        break;   
                        case 4:
                                        this.$root.auth = auth;
                                        this.$session.start()
                                        this.$session.set('auth', auth)
                                        this.fail = false;
                                        this.$router.push('Manager');
                                        break;                
                      default:
                      this.error = "Something was wrong, pls login again!"
                    this.fail = true;
                    this.username ="";
                     this.password="";
                      break;
                    }            
                  } else 
                  {
                    this.error = "Your infomation was wrong!!"
                    this.fail = true;
                  this.username ="";
                  this.password="";
                  }
                });
         }   
    },created()
    {
      if(this.$session.has("auth"))
      {
        var vm = this;
           $.ajax({
                    url : "http://localhost:3000/api/users/checkToken",
                    type : "post",
                    dataType:"json",
                    data : {
                         token:vm.$session.get("auth").access_token
                    },
                    success : function (result){
                      console.log(result);
                    if(result.error)
                    {

                        if(result.error.name=="TokenExpiredError")
                        {
                                $.ajax({
                              url : "http://localhost:3000/api/users/refreshToken",
                              type : "post",
                              dataType:"json",
                              data : {
                                   rfToken:vm.$session.get("auth").refresh_token,
                                  ID: vm.$session.get("auth").user.ID
                              },
                              success : function (result2){
                                if(result2.auth)
                                {
                                      vm.$root.auth = result2;
                                     vm.$session.remove("auth");
                                     vm.$session.set("auth",result2);
                                     switch(vm.$root.auth .user.AccountType_ID)
                    {
                      case 1:
                                        vm.$router.push('Receiver');
                                        break;
                      case 2:
                                        vm.$router.push('Identifier');
                                        break;
                      case 3:
                                        vm.$router.push('Driver');
                                        break;
                       case 4:
                                        vm.$router.push('Manager');
                                        break;
                      default:
                      vm.error = "Something was wrong, pls login again!"
                    vm.fail = true;
                    vm.username ="";
                     vm.password="";
                      break;
                    }           
                                }
                                else
                                {
                                  vm.$session.destroy();
                                }
                              }
                            });
                        }
                      }
                      else 
                      {
                        vm.$root.auth = vm.$session.get("auth");
                         switch(vm.$root.auth .user.AccountType_ID)
                    {
                      case 1:
                                        vm.$router.push('Receiver');
                                        break;
                      case 2:
                                        vm.$router.push('Identifier');
                                        break;
                      case 3:
                                        vm.$router.push('Driver');
                                        break;
                       case 4:
                                        vm.$router.push('Manager');                                        
                      default:
                      vm.error = "Something was wrong, pls login again!"
                    vm.fail = true;
                    vm.username ="";
                     vm.password="";
                      break;
                    }            
                      } 
                  }
                })
      }


    },
    mounted()
    {
      // console.log($("#submit-btn").html("test"));
     
    }

}
</script>

<style >
.login-block{
  margin-top:5%;
}
.banner-sec{background:url(https://static.pexels.com/photos/33972/pexels-photo.jpg)  no-repeat left bottom; background-size:cover;  border-radius: 0 10px 10px 0; padding:0;}
.container{background:#fff; border-radius: 10px; box-shadow:15px 20px 0px rgba(0,0,0,0.1);}
.carousel-inner{border-radius:0 10px 10px 0;}
.carousel-caption{text-align:left; left:5%;}
.login-sec{padding: 50px 30px; position:relative;}
.login-sec .copy-text{position:absolute; width:80%; bottom:20px; font-size:13px; text-align:center;}
.login-sec .copy-text i{color:#FEB58A;}
.login-sec .copy-text a{color:#E36262;}
.login-sec h2{margin-bottom:30px; font-weight:800; font-size:30px; color: #DE6262;}
.login-sec h2:after{content:" "; width:100px; height:5px; background:#FEB58A; display:block; margin-top:20px; border-radius:3px; margin-left:auto;margin-right:auto}
.btn-login{background: #DE6262; color:#fff; font-weight:600; }
.banner-text{width:70%; position:absolute; bottom:40px; padding-left:20px;}
.banner-text h2{color:#fff; font-weight:600;}
.banner-text h2:after{content:" "; width:100px; height:5px; background:#FFF; display:block; margin-top:20px; border-radius:3px;}
.banner-text p{color:#fff;}

































</style>