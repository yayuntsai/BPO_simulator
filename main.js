var send = document.querySelector('.btn');
var q_count = 0;
var s_count = 0;
var o_count = 0;
send.addEventListener('click', run, false);
send.addEventListener('click', clear_count, false);


var simulate_id = 0;
function run(btn_type) {
    if(btn_type == 'Simulate'){
      var open_time = document.querySelector('.time').value;
      var open_time_hour = open_time[0] + open_time[1]
      var open_time_min = open_time[3] + open_time[4]
      open_time = parseInt(open_time_hour * 3600 + open_time_min * 60);
      var open_time2 = open_time;
      var arrival_rate = document.querySelector('.AR').value;
          arrival_rate = parseFloat(arrival_rate);
      var service_rate = document.querySelector('.SR').value;
          service_rate = parseFloat(service_rate);
      var speed = document.querySelector('.SS').value;
          speed = parseFloat(speed);
      var const_servicetime = 1 / service_rate * 60;



      var servers_num = document.querySelector('.S').value; servers_num = parseInt(servers_num);
      var servers = { name: [], end_time: [] };
      //用物件紀錄服務生名字和他上一次結束的時間，預設為0
      for (var i = 0; i < servers_num; i++) {
          servers.name.push(i + 1);
          servers.end_time.push(0);
      }
      var run = document.querySelector('.R').value;
      //第一位客人來的時間
      var arrival_time = open_time + (-1 / arrival_rate) * (Math.log(Math.random() / Math.log(2.718)) * 60);
      //初始等待人數
      var queue = 0;
      //第一位客人的開始時間等於他到達的時間
      var start_time = arrival_time;
      var str = "<table border='1'> <tr><td>Customer</td><td>Drink Type</td><td>Waiting</td><td>In system</td><td>Arrival time</td><td>Start time</td><td>Service End</td><td>Server</td></tr>";
      var end_time = 0;
      var min_end_time = 1;
      var who_service_now = 0;



      var customer_data = { id: [], arrival_time: [], start_time: [], end_time: [], inq: [], ins: [], out: [] };
      for (var i = 1; i <= run; i++) {

          //每次的服務時間
          do {
              var servicetime = parseInt(60 * randomExponential(service_rate));

          } while (servicetime >= (const_servicetime + 20) || servicetime <= (const_servicetime - 20));


          //記下起始時間
          var tmp_time = open_time;
          arrival_time += (-1 / arrival_rate) * (Math.log(Math.random() / Math.log(2.718)) * 3600);
          for (j = servers_num; j > 0; j--) {//找出服務生中最早的完成時間
              if (servers.end_time[j - 1] < min_end_time) {
                  who_service_now = j - 1;
                  min_end_time = servers.end_time[j - 1];

              }
          }

          if (servers.end_time[who_service_now] <= arrival_time) {//如果進場時間大於上次服務時間(服務生有空)
              start_time = arrival_time;
              servers.end_time[who_service_now] += servicetime;
              // if (queue > 0) {
              //     queue--;
              // }
          }
          else {//沒有服務生有空
              start_time = servers.end_time[who_service_now];
              //   queue++;
              servers.end_time[who_service_now] += servicetime;
          }


          //將舊時間變數套用上本次修改的時間
          servers.end_time[who_service_now] = start_time + servicetime
          min_end_time = start_time + servicetime;
          open_time += servicetime;

          //轉換時間單位
          var dur = open_time - tmp_time;
          var arrivalhour = parseInt(arrival_time / 3600);
          var arrivalmin = parseInt(arrival_time / 60 % 60);
          if (arrivalmin < 10) {
              arrivalmin = arrivalmin.toString();
              arrivalmin = "0" + arrivalmin;

          }
          var arrivalsec = parseInt(arrival_time % 60);
          if (arrivalsec < 10) {
              arrivalsec = arrivalsec.toString();
              arrivalsec = "0" + arrivalsec;

          }
          var starthour = parseInt(start_time / 3600);
          var startmin = parseInt(start_time / 60 % 60);
          if (startmin < 10) {
              startmin = startmin.toString();
              startmin = "0" + startmin;

          }
          var startsec = parseInt(start_time % 60);
          if (startsec < 10) {
              startsec = startsec.toString();
              startsec = "0" + startsec;

          }
          var endhour = parseInt(servers.end_time[who_service_now] / 3600);
          var endmin = parseInt(servers.end_time[who_service_now] / 60 % 60);
          if (endmin < 10) {
              endmin = endmin.toString();
              endmin = "0" + endmin;

          }
          var endsec = parseInt(servers.end_time[who_service_now] % 60);
          if (endsec < 10) {
              endsec = endsec.toString();
              endsec = "0" + endsec;
          }

          //將本次顧客資料放入物件陣列
          customer_data.id.push(i);
          customer_data.arrival_time.push(arrival_time);
          customer_data.start_time.push(start_time);
          customer_data.end_time.push(servers.end_time[who_service_now]);
          customer_data.inq.push(0);
          customer_data.ins.push(0);
          customer_data.out.push(0);

          var in_queue_str = "";
          var max_id = 0;
          for (var j = 0; j < i; j++) {

              if (customer_data.arrival_time[i - 1] >= customer_data.start_time[j] && customer_data.arrival_time[i - 1] <= customer_data.end_time[j]) {
                  if (customer_data.id[j] > max_id) {
                      max_id = customer_data.id[j];
                  }
                  if (in_queue_str == "") {
                      in_queue_str += customer_data.id[j].toString();
                  }
                  else {
                      in_queue_str += ' , ' + customer_data.id[j].toString();;
                  }
              }
              var drink_type = Math.floor(Math.random() * 3) + 1
              if(drink_type == 1){
                drink_type_img = '<img src="bubble-tea.png" alt="" width="30px">'
              }else if(drink_type == 2){
                drink_type_img = '<img src="drink.png" alt="" width="30px">'
              }else{
                drink_type_img = '<img src="milkshake.png" alt="" width="30px">'
              }
          }

          queue = customer_data.id[i - 1] - max_id;
          str += "<tr><td>" + i + "</td><td>" + drink_type_img + "</td><td>" + queue + "</td><td>" + in_queue_str + "</td><td>" + arrivalhour + ":" + arrivalmin + ":" + arrivalsec + "</td><td>" + starthour + ":" + startmin + ":" + startsec + "</td><td>" + endhour + ":" + endmin + ":" + endsec + "</td><td>" + servers.name[who_service_now] + "</td></tr>";
      }
      str += "</table>";
      document.getElementById("output").innerHTML = str;


      simulate_id++;
      var tmp_simulate_id = simulate_id;
      var count = 0;
      var tID = setInterval(showTime, speed);
      var time_str="";
    }else{
      var tID = setInterval(stopTime, speed);
    }


    function showTime() {
        document.getElementById("clock_time").innerHTML = time_str;
        var now_time = open_time2 + count;
        var now_time_hour = parseInt(now_time/3600);
        var now_time_min = parseInt(now_time/60%60);
        var now_time_sec = parseInt(now_time%60);
        time_str = now_time_hour+":"+now_time_min+':'+now_time_sec;
        count++;
        var temp_count = open_time2 + count;

        for (var i = 0; i < run; i++) {
            if (parseInt(customer_data.arrival_time[i]) < temp_count && customer_data.inq[i] == 0) {
                customer_data.inq[i] = 1;
                run_addq();
            }

            if (parseInt(customer_data.start_time[i]) < temp_count && customer_data.ins[i] == 0) {
                customer_data.ins[i] = 1;
                run_delq();
            }

            if (parseInt(customer_data.end_time[i]) < temp_count && customer_data.out[i] == 0) {
                customer_data.out[i] = 1;
                run_dels();
            }
        }
        if (count >= (customer_data.end_time[run - 1] - open_time2) || tmp_simulate_id != simulate_id) {
            clearInterval(tID);
        }

        const secondHand = document.querySelector('.second-hand');
        const minsHand = document.querySelector('.min-hand');
        const hourHand = document.querySelector('.hour-hand');
        var seconds = now_time_sec;
        var secondsDegrees = ((seconds / 60) * 360) + 90;
        secondHand.style.transform = `rotate(${secondsDegrees}deg)`;

        var mins = now_time_min ;
        var minsDegrees = ((mins / 60) * 360) + ((seconds/60)*6) + 90;
        minsHand.style.transform = `rotate(${minsDegrees}deg)`;

        var hour = now_time_hour;
        var hourDegrees = ((hour / 12) * 360) + ((mins/60)*30) + 90;
        hourHand.style.transform = `rotate(${hourDegrees}deg)`;
    }
}


//指數分布
function randomExponential(rate, randomUniform) {
    rate = rate || 1;
    var U = randomUniform;
    if (typeof randomUniform === 'function') U = randomUniform();
    if (!U) U = Math.random();
    return -Math.log(U) / rate;
}

function clear_count() {
    q_count = 0;
    s_count = 0;
    o_count = 0;
}

var addq = document.querySelector('.addq');
addq.addEventListener('click', run_addq, false);
function run_addq() {
    var q_str = '';
    q_count++;
    for (var i = 0; i < q_count; i++) {
        q_str += '<div class="div" style="width:50px;height:50px;float:left" ><img src="girl.png" alt=""width="50px" height="50px"></div>'
    }
    document.getElementById("inqueue").innerHTML = q_str;
}


var delqadds = document.querySelector('.delqadds');
delqadds.addEventListener('click', run_delq, false);
function run_delq() {
    var q_str = '';
    if (q_count > 0) {
        q_count--;
    }
    for (var i = 0; i < q_count; i++) {
        q_str += '<div class="div" style="width:50px;height:50px;float:left" ><img src="girl.png" alt=""width="50px" height="50px"></div>'
    }
    var s_str = '';
    s_count++;
    for (var i = 0; i < s_count; i++) {
        s_str += '<div class="div" style="width:50px;height:50px;float:left" ><img src="girl.png" alt=""width="50px" height="50px"></div>'
    }
    document.getElementById("inqueue").innerHTML = q_str;
    document.getElementById("inservice").innerHTML = s_str;
}

var dels = document.querySelector('.dels');
dels.addEventListener('click', run_dels, false);
function run_dels() {
    var s_str = '';
    if (s_count > 0) {
        s_count--;
    }
    for (var i = 0; i < s_count; i++) {
        s_str += '<div class="div" style="width:50px;height:50px;float:left" ><img src="girl.png" alt=""width="50px" height="50px"></div>'
    }
    var o_str = '';
    o_count++;
    for (var i = 0; i < o_count; i++) {
        o_str += '<div class="div" style="width:50px;height:50px;float:left" ><img src="girl.png" alt=""width="50px" height="50px"></div>'
    }
    // document.getElementById("out").innerHTML = o_str;
    document.getElementById("inservice").innerHTML = s_str;
}
